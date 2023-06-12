import { Address, ethereum } from '@graphprotocol/graph-ts'
import { assert, newMockEvent, test } from 'matchstick-as'
import { ApplicationMigrate } from '../generated/QBApplicationsContract/QBApplicationsContract'
import { GrantCreated } from '../generated/QBGrantFactoryContract/QBGrantFactoryContract'
import { ReviewersAssigned, ReviewMigrate } from '../generated/QBReviewsContract/QBReviewsContract'
import { WorkspaceMemberMigrate } from '../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract'
import { Grant, GrantApplication, GrantManager, Workspace, WorkspaceMember } from '../generated/schema'
import { handleApplicationMigrate } from '../src/application-mapping'
import { handleGrantCreated } from '../src/grant-mapping'
import { handleReviewersAssigned, handleReviewMigrate } from '../src/review-mapping'
import { handleWorkspaceMemberMigrate } from '../src/workspace-mapping'
import { CREATE_GRANT_JSON, createApplication, createWorkspace, MOCK_APPLICATION_ID, MOCK_GRANT_ID, MOCK_REVIEW_ID, MOCK_WORKSPACE_ID, WORKSPACE_CREATOR_ID } from './utils' 

export function runTests(): void {

	test('should migrate a workspace member', () => {
		const workspace = createWorkspace()

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('from', ethereum.Value.fromAddress(
				Address.fromString(WORKSPACE_CREATOR_ID)
			)),
			new ethereum.EventParam('to', ethereum.Value.fromAddress(MIGRATED_WALLET)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125))
		]

		const event = new WorkspaceMemberMigrate(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters, ev.receipt)
		handleWorkspaceMemberMigrate(event)

		// check the workspace owner has been changed
		const w1 = Workspace.load(workspace!.id)!
		assert.addressEquals(
			Address.fromString(w1.ownerId.toHex()),
			MIGRATED_WALLET
		)
		// check old member got deleted
		const memOld = WorkspaceMember.load(`${workspace!.id}.${workspace!.ownerId.toHex()}`)
		assert.assertNull(memOld)
		// check new member got created
		// and has the correct properties set
		const memNew = WorkspaceMember.load(`${workspace!.id}.${MIGRATED_WALLET.toHex()}`)
		assert.assertNotNull(memNew)
		assert.addressEquals(
			Address.fromString(memNew!.actorId.toHex()),
			MIGRATED_WALLET
		)
	})

	test('should migrate a workspace member and update the grants that are a part of the workspace', () => {
		const workspace = createWorkspace()

		const grantCreateEv = newMockEvent()
		grantCreateEv.parameters = [
			new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(CREATE_GRANT_JSON)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
		]
		grantCreateEv.transaction.from = Address.fromString(WORKSPACE_CREATOR_ID)
		
		const grantCreateEvent = new GrantCreated(grantCreateEv.address, grantCreateEv.logIndex, grantCreateEv.transactionLogIndex, grantCreateEv.logType, grantCreateEv.block, grantCreateEv.transaction, grantCreateEv.parameters, grantCreateEv.receipt)
		handleGrantCreated(grantCreateEvent)

		let grant = Grant.load(MOCK_GRANT_ID.toHex())!
		for(let i = 0; i < grant.managers.length; ++i) {
			const manager = WorkspaceMember.load(`${workspace!.id}.${WORKSPACE_CREATOR_ID}`)!
			assert.addressEquals(Address.fromString(manager.actorId.toHex()), Address.fromString(WORKSPACE_CREATOR_ID))
		}

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('from', ethereum.Value.fromAddress(
				Address.fromString(WORKSPACE_CREATOR_ID)
			)),
			new ethereum.EventParam('to', ethereum.Value.fromAddress(MIGRATED_WALLET)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125))
		]

		const event = new WorkspaceMemberMigrate(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters, ev.receipt)
		handleWorkspaceMemberMigrate(event)

		// check the workspace owner has been changed
		const w1 = Workspace.load(workspace!.id)!
		assert.addressEquals(
			Address.fromString(w1.ownerId.toHex()),
			MIGRATED_WALLET
		)
		// check old member got deleted
		const memOld = WorkspaceMember.load(`${workspace!.id}.${workspace!.ownerId.toHex()}`)
		assert.assertNull(memOld)
		// check new member got created
		// and has the correct properties set
		const memNew = WorkspaceMember.load(`${workspace!.id}.${MIGRATED_WALLET.toHex()}`)
		assert.assertNotNull(memNew)
		assert.addressEquals(
			Address.fromString(memNew!.actorId.toHex()),
			MIGRATED_WALLET
		)
		// check the grant managers have been updated
		grant = Grant.load(MOCK_GRANT_ID.toHex())!
		for(let i = 0; i < grant.managers.length; ++i) {
			const manager = GrantManager.load(grant.managers[i])
			assert.assertNotNull(manager)
			assert.assertNotNull(manager!.member)
			const workspaceMember = WorkspaceMember.load(manager!.member!)
			assert.assertNotNull(workspaceMember)
			assert.addressEquals(Address.fromString(workspaceMember!.actorId.toHex()), MIGRATED_WALLET)
		}

		// check if the old grant managers have been deleted
		for(let i = 0; i < grant.managers.length; ++i) {
			const manager = GrantManager.load(`${grant!.id}.${WORKSPACE_CREATOR_ID}`)
			assert.assertNull(manager)
		}
	})

	test('should migrate an application applicant', () => {
		const app = createApplication()

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('newApplicantAddress', ethereum.Value.fromAddress(MIGRATED_WALLET)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125)),
		]

		const event = new ApplicationMigrate(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters, ev.receipt)
		handleApplicationMigrate(event)

		// check the applicant address has been changed correctly
		const app2 = GrantApplication.load(app!.id)!
		assert.addressEquals(
			Address.fromString(app2.applicantId.toHex()),
			MIGRATED_WALLET
		)
	})

	test('should migrate a grant & application', () => {
		const app = createApplication()

		// assign some reviewers to get more data to test with
		const creatorId = Address.fromString('0xb26081f360e3847006db660bae1c6d1b2e17ecc2')

		const reviewers: Address[] = [creatorId]
		const enabled: boolean[] = [true]

		const ev = newMockEvent()
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

		const assignEvent = new ReviewersAssigned(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters, ev.receipt)
		handleReviewersAssigned(assignEvent)

		ev.parameters = [
			new ethereum.EventParam('_reviewId', ethereum.Value.fromI32(4)),
			new ethereum.EventParam('_applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('_previousReviewerAddress', ethereum.Value.fromAddress(creatorId)),
			new ethereum.EventParam('_newReviewerAddress', ethereum.Value.fromAddress(MIGRATED_WALLET)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125)),
		]

		const migrateEvent = new ReviewMigrate(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters, ev.receipt)
		handleReviewMigrate(migrateEvent)

		const memberId = `${MOCK_WORKSPACE_ID.toBigInt().toHex()}.${MIGRATED_WALLET.toHex()}`

		const app2 = GrantApplication.load(app!.id)!
		assert.stringEquals(
			app2.pendingReviewerAddresses[0].toHex(),
			MIGRATED_WALLET.toHex()
		)
		assert.stringEquals(
			app2.reviewers[0],
			memberId
		)
	})

	// test('should migrate a review, grant & application', () => {
	// 	const r = createReview()

	// 	const ev = newMockEvent()
	// 	ev.parameters = [
	// 		new ethereum.EventParam('_reviewId', MOCK_REVIEW_ID),
	// 		new ethereum.EventParam('_applicationId', MOCK_APPLICATION_ID),
	// 		new ethereum.EventParam('_previousReviewerAddress', ethereum.Value.fromAddress(MOCK_REVIEWER_ID)),
	// 		new ethereum.EventParam('_newReviewerAddress', ethereum.Value.fromAddress(MIGRATED_WALLET)),
	// 		new ethereum.EventParam('time', ethereum.Value.fromI32(125)),
	// 	]

	// 	const event = new ReviewMigrate(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	// 	handleReviewMigrate(event)

	// 	const newWorkspaceMemberId = `${MOCK_WORKSPACE_ID.toBigInt().toHex()}.${MIGRATED_WALLET.toHex()}`

	// 	const r2 = Review.load(r!.id)!
	// 	assert.stringEquals(r2.reviewer, newWorkspaceMemberId)

	// 	const app = GrantApplication.load(r2.application)!
	// 	assert.stringEquals(
	// 		app.doneReviewerAddresses[0].toHex(),
	// 		MIGRATED_WALLET.toHex()
	// 	)

	// 	const grant = Grant.load(app.grant)!

	// 	assert.stringEquals(
	// 		grant.creatorId.toHex(),
	// 		MIGRATED_WALLET.toHex()
	// 	)
	// 	assert.stringEquals(grant.managers[0], `${grant.id}.${MIGRATED_WALLET.toHex()}`)
	// })
}

const MIGRATED_WALLET = Address.fromString('0x0000000000000000000000000000000000000002')

runTests()