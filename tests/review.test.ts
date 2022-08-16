import { Address, ethereum } from '@graphprotocol/graph-ts'
import { assert, newMockEvent, test } from 'matchstick-as'
import { ReviewersAssigned, ReviewPaymentMarkedDone, ReviewSubmitted, RubricsSet } from '../generated/QBReviewsContract/QBReviewsContract'
import { FundsTransfer, Grant, GrantApplication, GrantApplicationReviewer, GrantReviewerCounter, PIIAnswer, Review, Rubric, RubricItem, WorkspaceMember } from '../generated/schema'
import { handleReviewersAssigned, handleReviewPaymentMarkedDone, handleReviewSubmitted, handleRubricsSet } from '../src/review-mapping'
import { assertArrayNotEmpty, assertStringNotEmpty, createApplication, createGrant, MOCK_APPLICATION_ID, MOCK_GRANT_ID, MOCK_WORKSPACE_ID, WORKSPACE_CREATOR_ID } from './utils' 

export function runTests(): void {

	test('should add a review', () => {
		const review = createReview()

		assert.assertNotNull(review)
		assertArrayNotEmpty(review!.data)
		assertStringNotEmpty(review!.publicReviewDataHash)

		for(let i = 0;i < review!.data.length;i++) {
			const pii = PIIAnswer.load(review!.data[i])
			assert.assertNotNull(pii)
			assertStringNotEmpty(pii!.data, 'pii.data')
		}

		const member = WorkspaceMember.load(review!.reviewerId)
		assert.assertNotNull(member)
		assert.i32Equals(member!.lastReviewSubmittedAt, review!.createdAtS)
		assert.assertTrue(!!member!.outstandingReviewIds.includes(review!.id))

		const app = GrantApplication.load(review!.application)
		assertArrayNotEmpty(app!.doneReviewerAddresses)
		assert.i32Equals(app!.pendingReviewerAddresses.length, 0)

		const counterId = `${app!.grant}.${app!.doneReviewerAddresses[0].toHex()}`
		const counter = GrantReviewerCounter.load(counterId)
		assert.assertNotNull(counter)
		assert.i32Equals(counter!.doneCounter, 1)
		assert.i32Equals(counter!.pendingCounter, 0)
	})
	
	test('should add/remove reviewers to an application', () => {
		const a = createApplication()

		const ev = newMockEvent()

		const creatorId = Address.fromString('0xb26081f360e3847006db660bae1c6d1b2e17ecc2')

		const reviewers: Address[] = [creatorId]
		const enabled: boolean[] = [true]

		ev.parameters = [
			new ethereum.EventParam('_reviewIds', ethereum.Value.fromArray([ MOCK_REVIEW_ID ])),
			new ethereum.EventParam('_workspaceId', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('_applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('_grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('_reviewers', ethereum.Value.fromAddressArray(reviewers)),
			new ethereum.EventParam('_active', ethereum.Value.fromBooleanArray(enabled)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
		]

		const event = new ReviewersAssigned(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleReviewersAssigned(event)

		const app = GrantApplication.load(a!.id)
		assertArrayNotEmpty(app!.applicationReviewers)
		assertArrayNotEmpty(app!.pendingReviewerAddresses)

		const counterId = `${app!.grant}.${creatorId.toHex()}`
		const counter = GrantReviewerCounter.load(counterId)
		assert.assertNotNull(counter)
		assert.i32Equals(counter!.counter, 1)

		const reviewer = GrantApplicationReviewer.load(app!.applicationReviewers[0])
		assert.assertNotNull(reviewer)
		assert.i32Equals(reviewer!.assignedAtS, 123)

		// now we remove the reviewer
		enabled[0] = false
		ev.parameters = [
			new ethereum.EventParam('_reviewIds', ethereum.Value.fromArray([ MOCK_REVIEW_ID ])),
			new ethereum.EventParam('_workspaceId', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('_applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('_grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('_reviewers', ethereum.Value.fromAddressArray(reviewers)),
			new ethereum.EventParam('_active', ethereum.Value.fromBooleanArray(enabled)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
		]

		const eventRemove = new ReviewersAssigned(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleReviewersAssigned(eventRemove)
		
		const app2 = GrantApplication.load(a!.id)
		// the reviewer list should be empty now
		assert.i32Equals(app2!.applicationReviewers.length, 0)
		assert.i32Equals(app2!.pendingReviewerAddresses.length, 0)
		// the member entity should also be removed now
		const member2 = GrantApplicationReviewer.load(reviewer!.id)
		assert.assertNull(member2)

		// should have been deleted, as counter = 0
		const counter2 = GrantReviewerCounter.load(counterId)
		assert.assertNull(counter2)
	})

	test('should add a rubric to a grant', () => {
		createGrant()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('_workspaceId', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('_grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('_metadataHash', ethereum.Value.fromString(RUBRIC_JSON)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
		]
		ev.transaction.from = Address.fromString(WORKSPACE_CREATOR_ID)

		const event = new RubricsSet(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleRubricsSet(event)

		const g2 = Grant.load(MOCK_GRANT_ID.toHex())
		assert.assertNotNull(g2!.rubric)

		const rubr = Rubric.load(MOCK_GRANT_ID.toHex())
		assert.assertNotNull(rubr)
		assert.i32Equals(rubr!.createdAtS, 123)

		assertArrayNotEmpty(rubr!.items)

		for(let i = 0;i < rubr!.items.length;i++) {
			const item = RubricItem.load(rubr!.items[i])
			assert.assertNotNull(item)
			assert.assertTrue(item!.maximumPoints > 0)
		}
	})

	test('should mark a review payment done', () => {
		const review = createReview()

		const idArr: ethereum.Value[] = [ MOCK_REVIEW_ID ]

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('_reviewIds', ethereum.Value.fromArray(idArr)),
			new ethereum.EventParam('_asset', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			new ethereum.EventParam('_reviewer', ethereum.Value.fromAddress(Address.fromString(WORKSPACE_CREATOR_ID))),
			new ethereum.EventParam('_amount', ethereum.Value.fromI32(100)),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('_transactionHash', ethereum.Value.fromString('12345')),
			new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
		]

		const event = new ReviewPaymentMarkedDone(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleReviewPaymentMarkedDone(event)

		const member = WorkspaceMember.load(review!.reviewerId)
		assert.assertNotNull(member)
		assert.assertTrue(!member!.outstandingReviewIds.includes(review!.id))

		const transferId = `${event.transaction.hash.toHex()}.${review!.id}`
		const transfer = FundsTransfer.load(transferId)
		assert.assertNotNull(transfer!)
		assert.stringEquals(transfer!.type, 'review_payment_done')
	})
}

runTests()

const MOCK_REVIEW_ID = ethereum.Value.fromI32(0x01)
const REVIEW_JSON = `json:{"reviewer":"${WORKSPACE_CREATOR_ID}","publicReviewDataHash":"1234","encryptedReview":{"${WORKSPACE_CREATOR_ID}":"12323123132313"}}`
const RUBRIC_JSON = 'json:{"rubric":{"isPrivate":true,"rubric":{"quality":{"title":"Quality of the app","details":"Judge, like, the quality of the application","maximumPoints":10},"name":{"title":"Name of the application","details":"Judge how cool the application name is","maximumPoints":5}}}}'

function createReview(): Review | null {
	createApplication()

	const ev = newMockEvent()

	ev.parameters = [
		new ethereum.EventParam('_reviewId', MOCK_REVIEW_ID),
		new ethereum.EventParam('_workspaceId', MOCK_WORKSPACE_ID),
		new ethereum.EventParam('_applicationId', MOCK_APPLICATION_ID),
		new ethereum.EventParam('_grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
		// the IPFS hash contains mock data for the workspace
		new ethereum.EventParam('_metadataHash', ethereum.Value.fromString(REVIEW_JSON)),
		new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
	]
	ev.transaction.from = Address.fromString(WORKSPACE_CREATOR_ID)

	const event = new ReviewSubmitted(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleReviewSubmitted(event)

	const review = Review.load(MOCK_REVIEW_ID.toBigInt().toHex())
	return review
}