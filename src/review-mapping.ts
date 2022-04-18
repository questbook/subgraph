import { log } from '@graphprotocol/graph-ts'
import { ReviewersAssigned, ReviewSubmitted, RubricsSet } from '../generated/QBReviewsContract/QBReviewsContract'
import { Grant, GrantApplication, PIIAnswer, Review, Rubric, RubricItem } from '../generated/schema'
import { ReviewSetRequest, RubricSetRequest, validateReviewSetRequest, validateRubricSetRequest } from './json-schema'
import { validatedJsonFromIpfs } from './json-schema/json'

export function handleReviewSubmitted(event: ReviewSubmitted): void {
	const reviewId = event.params._reviewId.toHex()
	const workspace = event.params._workspaceId.toHex()
	const reviewer = event.transaction.from.toHex()
	const grant = event.params._grantAddress.toHex()

	const memberId = `${workspace}.${reviewer}`

	const jsonResult = validatedJsonFromIpfs<ReviewSetRequest>(event.params._metadataHash, validateReviewSetRequest)
	if(jsonResult.error) {
	  log.warning(`[${event.transaction.hash.toHex()}] error in mapping application: "${jsonResult.error!}"`, [])
	  return
	}

	const json = jsonResult.value!

	const review = new Review(reviewId)
	review.reviewerId = memberId
	review.reviewer = memberId
	review.application = event.params._applicationId.toHex()
	review.createdAtS = event.params.time.toI32()
	review.publicReviewDataHash = json.publicReviewDataHash

	const items: string[] = []

	const encInfoMap = json.encryptedReview.additionalProperties
	for(let i = 0;i < encInfoMap.entries.length;i++) {
		const info = encInfoMap.entries[i]

		const item = new PIIAnswer(`${reviewId}.${info.key}`)
		item.data = info.value
		item.manager = `${grant}.${info.key}`

		item.save()
		items.push(item.id)
	}

	review.data = items
	review.save()
}

export function handleReviewersAssigned(event: ReviewersAssigned): void {
	const applicationId = event.params._applicationId.toHex()
	const workspace = event.params._workspaceId.toHex()
	const reviewerAddresses = event.params._reviewers
	const active = event.params._active

	const application = GrantApplication.load(applicationId)
	if(!application) {
		log.warning(`[${event.transaction.hash.toHex()}] error in setting reviewers: "application not found"`, [])
		return
	}

	const items = application.reviewers
	for(let i = 0;i < reviewerAddresses.length;i++) {
		const memberId = `${workspace}.${reviewerAddresses[i].toHex()}`
		const idx = items.indexOf(memberId)
		if(active) {
			if(idx < 0) {
				items.push(memberId)
			}
		} else {
			if(idx >= 0) {
				items.splice(idx, 1)
			}
		}
	}

	application.reviewers = items
	application.updatedAtS = event.params.time.toI32()
	application.save()
}

export function handleRubricsSet(event: RubricsSet): void {
	const grantId = event.params._grantAddress.toHex()
	const workspaceId = event.params._workspaceId.toHex()

	const jsonResult = validatedJsonFromIpfs<RubricSetRequest>(event.params._metadataHash, validateRubricSetRequest)
	if(jsonResult.error) {
	  log.warning(`[${event.transaction.hash.toHex()}] error in mapping application: "${jsonResult.error!}"`, [])
	  return
	}

	const json = jsonResult.value!

	const grant = Grant.load(grantId)
	if(!grant) {
		log.warning(`[${event.transaction.hash.toHex()}] error in setting rubric: "grant not found"`, [])
		return
	}
	
	let rubric = Rubric.load(grantId)
	if(!rubric) {
		rubric = new Rubric(grantId)
		rubric.createdAtS = event.params.time.toI32()
	}
	rubric.updatedAtS = event.params.time.toI32()
	rubric.addedBy = `${workspaceId}.${event.transaction.from.toHex()}`
	rubric.isPrivate = json.rubric.isPrivate.isTrue
	
	const items: string[] = []

	const rubricItems = json.rubric.rubric.additionalProperties

	for(let i = 0;i < rubricItems.entries.length;i++) {
		const entry = rubricItems.entries[i]

		const item = new RubricItem(`${grantId}.${entry.key}`)
		let details = entry.value.details
		if(!details) {
			details = ''
		}

		item.title = entry.value.title
		item.details = details!
		item.maximumPoints = entry.value.maximumPoints.toI32()
		item.save()

		items.push(item.id)
	}

	rubric.items = items
	rubric.save()

	grant.updatedAtS = event.params.time.toI32()
	grant.rubric = rubric.id

	grant.save()
}