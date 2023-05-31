import { Bytes, log, store } from '@graphprotocol/graph-ts'
import { ReviewersAssigned, ReviewMigrate, ReviewPaymentMarkedDone, ReviewSubmitted, RubricsSet } from '../generated/QBReviewsContract/QBReviewsContract'
import { FundsTransfer, Grant, GrantApplication, GrantApplicationReviewer, GrantReviewerCounter, Migration, PIIAnswer, Review, Rubric, WorkspaceMember } from '../generated/schema'
import { validatedJsonFromIpfs } from './json-schema/json'
import { migrateApplicationReviewer, migrateGrant, migrateRubric } from './utils/migrations'
import { reviewSubmittedNotification } from './utils/notifications'
import { rubricSetHandler } from './utils/rubricSetHandler'
import { ReviewSetRequest, validateReviewSetRequest } from './json-schema'

export async function handleReviewSubmitted(event: ReviewSubmitted): void {
	const reviewId = event.params._reviewId.toHex()
	const workspace = event.params._workspaceId.toHex()
	const reviewerAddress = event.params._reviewerAddress
	const reviewer = reviewerAddress.toHex()
	const grantId = event.params._grantAddress.toHex()

	const memberId = `${workspace}.${reviewer}`

	const jsonResult = await validatedJsonFromIpfs<ReviewSetRequest>(event.params._metadataHash, validateReviewSetRequest)
	if(jsonResult.error) {
	  log.warning(`[${event.transaction.hash.toHex()}] error in mapping review: "${jsonResult.error!}"`, [])
	  return
	}

	const member = WorkspaceMember.load(memberId)
	if(!member) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping review: "member ${memberId} not found"`, [])
		return
	}

	const json = jsonResult.value!

	let review = Review.load(reviewId)
	if(!review) {
		review = new Review(reviewId)
		review.createdAtS = event.params.time.toI32()
		review.application = event.params._applicationId.toHex()
	}

	review.reviewer = memberId
	review.publicReviewDataHash = json.publicReviewDataHash

	const items: string[] = []

	const encInfoMap = json.encryptedReview.additionalProperties
	for(let i = 0;i < encInfoMap.entries.length;i++) {
		const info = encInfoMap.entries[i]

		const item = new PIIAnswer(`${reviewId}.${info.key}`)
		item.data = info.value
		item.manager = `${grantId}.${info.key}`

		item.save()
		items.push(item.id)
	}

	review.data = items
	review.save()
	// finally update the member
	// update the timestamp of when they submitted the last review
	member.lastReviewSubmittedAt = review.createdAtS
	// add to outstanding review IDs
	const outstandingReviewIds = member.outstandingReviewIds
	if(!outstandingReviewIds.includes(reviewId)) {
		outstandingReviewIds.push(reviewId)
	}

	member.outstandingReviewIds = outstandingReviewIds
	if(!member.publicKey && json.reviewerPublicKey) {
		member.publicKey = json.reviewerPublicKey
	}

	member.save()

	const counterId = `${grantId}.${reviewer}`
	let counter = GrantReviewerCounter.load(counterId)
	if(!counter) {
		counter = new GrantReviewerCounter(counterId)
		counter.grant = grantId
		counter.reviewerAddress = Bytes.fromByteArray(reviewerAddress)
		counter.counter = 1
		counter.pendingCounter = 1
		counter.doneCounter = 0
	}

	counter.pendingCounter -= 1
	counter.doneCounter += 1
	counter.save()

	const application = GrantApplication.load(event.params._applicationId.toHex())
	if(!application) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping review: "application ${event.params._applicationId.toHex()} not found"`, [])
		return
	}

	const pendingReviewerAddresses = application.pendingReviewerAddresses
	const doneReviewerAddresses = application.doneReviewerAddresses

	const doneIdx = doneReviewerAddresses.indexOf(reviewerAddress)
	if(doneIdx < 0) {
		doneReviewerAddresses.push(reviewerAddress)
	}

	const pendingIdx = pendingReviewerAddresses.indexOf(reviewerAddress)
	if(pendingIdx >= 0) {
		pendingReviewerAddresses.splice(pendingIdx, 1)
	}

	application.pendingReviewerAddresses = pendingReviewerAddresses
	application.doneReviewerAddresses = doneReviewerAddresses
	application.save()

	reviewSubmittedNotification(review, event.transaction.hash.toHex(), event.params._reviewerAddress)
}

export function handleReviewersAssigned(event: ReviewersAssigned): void {
	const applicationId = event.params._applicationId.toHex()
	const workspace = event.params._workspaceId.toHex()
	const reviewerAddresses = event.params._reviewers
	const active = event.params._active
	const eventTimestampS = event.params.time.toI32()

	const application = GrantApplication.load(applicationId)
	if(!application) {
		log.warning(`[${event.transaction.hash.toHex()}] error in setting reviewers: "application not found"`, [])
		return
	}

	const appReviewers = application.applicationReviewers
	// apply to deprecated property
	const memberReviewers: string[] = []
	const pendingReviewerAddresses: Bytes[] = []
	for(let i = 0;i < reviewerAddresses.length;i++) {
		const reviewerAddressHex = reviewerAddresses[i].toHex()
		const reviewerAddressBytes = Bytes.fromByteArray(reviewerAddresses[i])
		const memberId = `${workspace}.${reviewerAddressHex}`
		const reviewerId = `${applicationId}.${memberId}`
		const counterId = `${application.grant}.${reviewerAddressHex}`
		let counter = GrantReviewerCounter.load(counterId)
		if(!counter) {
			counter = new GrantReviewerCounter(counterId)
			counter.counter = 0
			counter.doneCounter = 0
			counter.pendingCounter = 0
			counter.grant = application.grant
			counter.reviewerAddress = reviewerAddressBytes
		}

		const idx = appReviewers.indexOf(reviewerId)
		const pendingIdx = pendingReviewerAddresses.indexOf(reviewerAddressBytes)
		if(active[i]) { // add reviewer if not already added
			if(idx < 0) {
				const reviewer = new GrantApplicationReviewer(reviewerId)
				reviewer.member = memberId
				reviewer.assignedAtS = eventTimestampS
				reviewer.save()

				appReviewers.push(reviewerId)
				memberReviewers.push(memberId)

				counter.counter += 1
			}

			if(pendingIdx < 0) {
				pendingReviewerAddresses.push(reviewerAddressBytes)
				counter.pendingCounter += 1
			}
		} else { // remove from reviewer list if present
			if(idx >= 0) {
				store.remove('GrantApplicationReviewer', reviewerId)
				appReviewers.splice(idx, 1)
				memberReviewers.splice(idx, 1)

				counter.counter -= 1
			}
			
			if(pendingIdx >= 0) {
				pendingReviewerAddresses.splice(pendingIdx, 1)
				counter.pendingCounter -= 1
			}
		}

		if(counter.counter <= 0) {
			store.remove('GrantReviewerCounter', counterId)
		} else {
			counter.save()
		}
	}

	application.applicationReviewers = appReviewers
	application.reviewers = memberReviewers
	application.pendingReviewerAddresses = pendingReviewerAddresses

	application.updatedAtS = eventTimestampS
	application.save()
}

export function handleRubricsSet(event: RubricsSet): void {
	const grantId = event.params._grantAddress.toHex()
	const workspaceId = event.params._workspaceId.toHex()

	const metadataHash = event.params._metadataHash
	const time = event.params.time

	rubricSetHandler(event, grantId, workspaceId, metadataHash, time)
}

export function handleReviewPaymentMarkedDone(event: ReviewPaymentMarkedDone): void {
	const transactionId = event.transaction.hash.toHex()
	const reviewIds = event.params._reviewIds

	const reviewer = event.params._reviewer

	for(let i = 0;i < reviewIds.length;i++) {
		const reviewId = reviewIds[i].toHex()
		const review = Review.load(reviewId)
		if(!review) {
			log.warning(`[${event.transaction.hash.toHex()}] error in marking review payment done: "review (${reviewId}) not found"`, [])
			continue
		}

		const memberId = review.reviewer
		const member = WorkspaceMember.load(memberId)
		if(!member) {
			log.warning(`[${event.transaction.hash.toHex()}] error in marking review payment done: "member (${memberId}) not found"`, [])
			continue
		}

		const app = GrantApplication.load(review.application)
		if(!app) {
			log.warning(`[${event.transaction.hash.toHex()}] error in marking review payment done: "application (${review.application}) not found"`, [])
			continue
		}

		// remove from outstanding review ID
		const outstandingReviewIds = member.outstandingReviewIds
		const revIdx = outstandingReviewIds.indexOf(reviewId)
		if(revIdx >= 0) {
			outstandingReviewIds.splice(revIdx, 1)
		}

		member.outstandingReviewIds = outstandingReviewIds

		member.save()

		const fundEntity = new FundsTransfer(`${transactionId}.${reviewId}`)
		fundEntity.review = reviewId
		fundEntity.grant = app.grant
		fundEntity.amount = event.params._amount
		fundEntity.sender = event.transaction.from
		fundEntity.to = reviewer
		fundEntity.createdAtS = event.params.time.toI32()
		fundEntity.type = 'review_payment_done'
		fundEntity.status = 'executed'
		fundEntity.asset = event.params._asset
		fundEntity.transactionHash = transactionId

		fundEntity.save()
	}
}

export function handleReviewMigrate(event: ReviewMigrate): void {
	const reviewId = event.params._reviewId.toHex()
	const fromWallet = event.params._previousReviewerAddress
	const toWallet = event.params._newReviewerAddress
	const appId = event.params._applicationId.toHex()

	const application = GrantApplication.load(appId)
	if(!application) {
		log.warning(`[${event.transaction.hash.toHex()}] error in migrating review: "application (${appId}) not found"`, [])
		return
	}

	const grant = Grant.load(application.grant)
	if(!grant) {
		log.warning(`[${event.transaction.hash.toHex()}] error in migrating review: "grant (${application.grant}) not found"`, [])
		return
	}
	
	migrateGrant(grant, fromWallet, toWallet)
	migrateApplicationReviewer(application, fromWallet, toWallet)
	
	const rubric = Rubric.load(grant.id)
	if(rubric) {
		migrateRubric(rubric, fromWallet, toWallet)
	} else {
		log.warning(`[${event.transaction.hash.toHex()}] error in migrating review: "rubric (${grant.id}) not found"`, [])
	}

	const review = Review.load(reviewId)
	if(review) {
		const reviewerId = `${grant.workspace}.${toWallet.toHex()}`
		review.reviewer = reviewerId

		review.save()
	} else {
		log.warning(`[${event.transaction.hash.toHex()}] error in migrating review: "review (${reviewId}) not found"`, [])
	}

	const migration = new Migration(`${appId}.${reviewId}.${fromWallet.toHexString()}.${toWallet.toHexString()}`)
	migration.fromWallet = fromWallet
	migration.toWallet = toWallet
	migration.application = appId
	migration.review = reviewId
	migration.type = 'Review'
	migration.transactionHash = event.transaction.hash.toHex()
	migration.timestamp = event.params.time.toI32()
	migration.save()
}