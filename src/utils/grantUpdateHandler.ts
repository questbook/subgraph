import { log } from '@graphprotocol/graph-ts'
import { Grant, Reward, Workspace } from '../../generated/schema'
import { GrantUpdateRequest, validateGrantUpdateRequest } from '../json-schema'
import { validatedJsonFromIpfs } from '../json-schema/json'
import { dateToUnixTimestamp, isPlausibleIPFSHash, isUSDReward, mapGrantFieldMap, mapGrantManagers, mapGrantRewardAndListen, removeEntityCollection } from './generics'

class GrantUpdateParams {
    transactionHash: string
    grantId: string
    time: i32
    workspace: string
    acceptingApplications: boolean
    hash: string
}

export function grantUpdateHandler(params: GrantUpdateParams): void {
	const grantId = params.grantId
	const entity = Grant.load(grantId)
	if(!entity) {
		log.warning(`[${params.transactionHash}] recv grant update for unknown grant, ID="${grantId}"`, [])
		return
	}

	entity.updatedAtS = params.time
	entity.workspace = params.workspace

	entity.acceptingApplications = params.acceptingApplications

	if(isPlausibleIPFSHash(params.hash)) {
		const jsonResult = validatedJsonFromIpfs<GrantUpdateRequest>(params.hash, validateGrantUpdateRequest)
		if(jsonResult.error) {
			log.warning(`[${params.transactionHash}] error in updating grant metadata, error: ${jsonResult.error!}`, [])
			return
		}

		const json = jsonResult.value!
		if(json.title) {
			entity.title = json.title!
		}

		if(json.summary) {
			entity.summary = json.summary!
		}

		if(json.details) {
			entity.details = json.details!
		}

		if(json.deadline) {
			entity.deadline = json.deadline!.toISOString()
			entity.deadlineS = dateToUnixTimestamp(json.deadline!)
		}

		if(json.reward) {
			const newReward = mapGrantRewardAndListen(entity.id, entity.workspace, json.reward!)
			const oldReward = Reward.load(entity.reward)!

			if(isUSDReward(oldReward) || isUSDReward(newReward)) {
				const workspace = Workspace.load(entity.workspace)!
				if(!workspace) {
					log.warning(`[${params.transactionHash}] error in updating grant reward: "workspace (${entity.workspace}) not found"`, [])
					return
				}

				// if it was USD, remove the old amount
				if(isUSDReward(oldReward)) {
					workspace.totalGrantFundingCommittedUSD -= oldReward.committed.toI32()
				}

				// if it is USD, add the new amount
				if(isUSDReward(newReward)) {
					workspace.totalGrantFundingCommittedUSD += newReward.committed.toI32()
				}

				workspace.save()
				log.debug(`updated workspace ${workspace.id}`, [])
			}

		}

		if(json.fields) {
			entity.fields = mapGrantFieldMap(entity.id, json.fields!)
		}

		if(json.grantManagers && json.grantManagers!.length) {
			removeEntityCollection('GrantManager', entity.managers)
			entity.managers = mapGrantManagers(json.grantManagers, entity.id, entity.workspace)
		}
	}

	entity.save()
}