import { BigInt, log } from '@graphprotocol/graph-ts'
import { GrantCreated, GrantUpdatedFromFactory } from '../generated/QBGrantFactoryContract/QBGrantFactoryContract'
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication, Workspace } from '../generated/schema'
import { QBGrantsContract } from '../generated/templates'
import { DisburseReward, DisburseRewardFailed, FundsDepositFailed, FundsWithdrawn, GrantUpdated, TransactionRecord } from '../generated/templates/QBGrantsContract/QBGrantsContract'
import { validatedJsonFromIpfs } from './json-schema/json'
import { applyGrantFundUpdate } from './utils/apply-grant-deposit'
import { dateToUnixTimestamp, getUSDReward, mapGrantFieldMap, mapGrantManagers, mapGrantRewardAndListen } from './utils/generics'
import { grantUpdateHandler } from './utils/grantUpdateHandler'
import { disburseReward } from './utils/handle-disburse-reward'
import { addFundsTransferNotification } from './utils/notifications'
import { GrantCreateRequest, validateGrantCreateRequest } from './json-schema'

export function handleGrantCreated(event: GrantCreated): void {
	const workspaceId = event.params.workspaceId.toHex()
	const grantAddress = event.params.grantAddress
	const time = event.params.time.toI32()

	const workspace = Workspace.load(workspaceId)
	if(!workspace) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping grant: "workspace (${workspaceId}) not found"`, [])
		return
	}

	const entityResult = validatedJsonFromIpfs<GrantCreateRequest>(event.params.metadataHash, validateGrantCreateRequest)
	if(entityResult.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping grant with metadata hash "${entityResult.error!}"`, [])
		return
	}

	const json = entityResult.value!
	const entity = new Grant(grantAddress.toHex())
	entity.creatorId = event.transaction.from
	entity.title = json.title
	entity.summary = json.summary
	entity.details = json.details

	const reward = mapGrantRewardAndListen(entity.id, workspaceId, json.reward)

	entity.reward = reward.id
	entity.workspace = workspaceId
	if(json.deadline) {
		entity.deadline = json.deadline!.toISOString()
		entity.deadlineS = dateToUnixTimestamp(json.deadline!)
	} else {
		entity.deadlineS = 0
	}

	entity.fields = mapGrantFieldMap(entity.id, json.fields)

	entity.metadataHash = event.params.metadataHash
	entity.acceptingApplications = true
	entity.createdAtS = time
	entity.funding = new BigInt(0)
	entity.numberOfApplications = 0
	entity.managers = mapGrantManagers(json.grantManagers, entity.id, entity.workspace)

	entity.save()

	const grants: string[] = workspace.grants
	grants.push(entity.id)
	workspace.grants = grants

	workspace.mostRecentGrantPostedAtS = time

	const usdReward = getUSDReward(reward.asset, reward.committed)
	if(usdReward > 0) {
		workspace.totalGrantFundingCommittedUSD += usdReward
	}

	workspace.save()

	QBGrantsContract.create(grantAddress)
}

export function handleDisburseReward(event: DisburseReward): void {
	disburseReward({
		event,
		depositType: 'funds_disbursed',
		_applicationId: event.params.applicationId.toHex(),
		_milestoneId: event.params.milestoneId.toI32(),
		_sender: event.params.sender,
		_amount: event.params.amount,
		_isP2P: event.params.isP2P,
		_asset: event.params.asset,
		_nonEvmAsset: '',
		_txnHash: '',
		_tokenName: ''
	})
}

// We should deprecate this handler. The event is not in use
export function handleTransactionRecord(event: TransactionRecord): void {
	const applicationId = event.params.applicationId.toHex()
	const milestoneIndex = event.params.milestoneId.toI32()
	const milestoneId = `${applicationId}.${milestoneIndex}`
	const transactionHash = event.params.transactionHash
	const amountPaid = event.params.amount

	const application = GrantApplication.load(applicationId)
	if(!application) {
		log.warning(`[${event.transaction.hash.toHex()}] recv disburse reward for unknown application: ID="${applicationId}"`, [])
		return
	}

	const disburseEntity = new FundsTransfer(event.transaction.hash.toHex())
	disburseEntity.createdAtS = event.params.time.toI32()
	disburseEntity.amount = amountPaid
	disburseEntity.sender = event.params.sender
	disburseEntity.to = application.applicantId
	disburseEntity.application = applicationId
	disburseEntity.milestone = milestoneId
	disburseEntity.type = 'funds_disbursed'
	disburseEntity.grant = application.grant
	disburseEntity.transactionHash = event.params.transactionHash.toHexString()

	disburseEntity.save()

	const entity = ApplicationMilestone.load(milestoneId)
	if(!entity) {
		log.warning(`[${event.transaction.hash.toHex()}] recv milestone updated for unknown application: ID="${milestoneId}"`, [])
		return
	}

	entity.amountPaid = entity.amountPaid.plus(amountPaid)
	entity.updatedAtS = event.params.time.toI32()

	entity.save()

	addFundsTransferNotification(disburseEntity)
}

export function handleDisburseRewardFailed(event: DisburseRewardFailed): void {

}

export function handleFundsDepositFailed(event: FundsDepositFailed): void {

}

export function handleFundsWithdrawn(event: FundsWithdrawn): void {
	const grantId = event.transaction.to!.toHex()
	const success = applyGrantFundUpdate(event, false, grantId, event.params.amount, event.params.recipient, event.params.time.toI32())
	if(!success) {
		log.error(`funds withdraw for grant, but grant not found, ID=${grantId}`, [])
	}
}

export function handleGrantUpdated(event: GrantUpdated): void {
	const grantId = event.transaction.to!.toHex()
	const time = event.params.time.toI32()
	const workspace = event.params.workspaceId.toHex()
	const acceptingApplications = event.params.active
	const hash = event.params.metadataHash
	const transactionHash = event.transaction.hash.toHex()
	grantUpdateHandler({ transactionHash, grantId, time, workspace, acceptingApplications, hash })
}

export function handleGrantUpdatedFromFactory(event: GrantUpdatedFromFactory): void {
	const grantId = event.params.grantAddress.toHex()
	const time = event.params.time.toI32()
	const workspace = event.params.workspaceId.toHex()
	const acceptingApplications = event.params.active
	const hash = event.params.metadataHash
	const transactionHash = event.transaction.hash.toHex()
	grantUpdateHandler({ transactionHash, grantId, time, workspace, acceptingApplications, hash })
}
