import { Address, ethereum } from "@graphprotocol/graph-ts"
import { assert, newMockEvent, test } from "matchstick-as"
import { ReviewersAssigned, ReviewSubmitted, RubricsSet } from '../generated/QBReviewsContract/QBReviewsContract'
import { assertArrayNotEmpty, assertStringNotEmpty, createApplication, createGrant, MOCK_APPLICATION_ID, MOCK_GRANT_ID, MOCK_WORKSPACE_ID, WORKSPACE_CREATOR_ID } from './utils' 
import { handleReviewersAssigned, handleReviewSubmitted, handleRubricsSet } from '../src/review-mapping'
import { Grant, GrantApplication, PIIAnswer, Review, Rubric, RubricItem, WorkspaceMember } from "../generated/schema"

export function runTests(): void {

	test('should add a review', () => {
		createApplication()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('_reviewId', MOCK_REVIEW_ID),
			new ethereum.EventParam('_workspaceId', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('_applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('_grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('_metadataHash', ethereum.Value.fromString(REVIEW_JSON)),
			new ethereum.EventParam('time', ethereum.Value.fromI32( 123 )),
		]

		const event = new ReviewSubmitted(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleReviewSubmitted(event)

		const review = Review.load(MOCK_REVIEW_ID.toBigInt().toHex())
		assert.assertNotNull(review)
		assertArrayNotEmpty(review!.data)

		for(let i = 0;i < review!.data.length;i++) {
			const pii = PIIAnswer.load(review!.data[i])
			assert.assertNotNull(pii)
			assertStringNotEmpty(pii!.data, 'pii.data')
		}
	})
	
	test('should add/remove reviewers to an application', () => {
		const a = createApplication()

		const ev = newMockEvent()

		const creatorId = Address.fromString(WORKSPACE_CREATOR_ID)

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
			new ethereum.EventParam('time', ethereum.Value.fromI32( 123 )),
		]

		const event = new ReviewersAssigned(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleReviewersAssigned(event)

		const app = GrantApplication.load(a!.id)
		assertArrayNotEmpty(app!.reviewers)

		const member = WorkspaceMember.load(app!.reviewers[0])
		assert.assertNotNull(member)
	})

	test('should add a rubric to a grant', () => {
		createGrant()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('_workspaceId', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('_grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('_metadataHash', ethereum.Value.fromString(RUBRIC_JSON)),
			new ethereum.EventParam('time', ethereum.Value.fromI32( 123 )),
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
			const item = new RubricItem(rubr!.items[i])
			assert.assertNotNull(item)
		}
	})
}

runTests()

const MOCK_REVIEW_ID = ethereum.Value.fromI32( 0x01 )
const REVIEW_JSON = `json:{"reviewer":"${WORKSPACE_CREATOR_ID}","encryptedReview":{"${WORKSPACE_CREATOR_ID}":"12323123132313"}}`
const RUBRIC_JSON = `json:{"rubric":{"quality":{"title":"Quality of the app","details":"Judge, like, the quality of the application"},"name":{"title":"Name of the application","details":"Judge how cool the application name is"}}}`