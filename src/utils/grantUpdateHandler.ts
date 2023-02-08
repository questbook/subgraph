import { BigInt, log } from '@graphprotocol/graph-ts'
import { Grant, Reward } from '../../generated/schema'
import { GrantUpdateRequest, validateGrantUpdateRequest } from '../json-schema'
import { validatedJsonFromIpfs } from '../json-schema/json'
import { dateToUnixTimestamp, getUSDReward, isPlausibleIPFSHash, mapGrantFieldMap, mapGrantManagers, mapGrantRewardAndListen, removeEntityCollection } from './generics'

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

		if(json.details) {
			entity.details = json.details!
		}

		if(json.startDate) {
			entity.startDate = json.startDate!.toISOString()
		}

		if(json.reviewType) {
			entity.reviewType = json.reviewType!
		}


		if(json.endDate) {
			entity.deadline = json.endDate!.toISOString()
			entity.deadlineS = dateToUnixTimestamp(json.endDate!)
		}

		if(json.link) {
			entity.link = json.link!
		}

		if(json.docIpfsHash) {
			entity.docIpfsHash = json.docIpfsHash!
		}

		if(json.payoutType) {
			entity.payoutType = json.payoutType!
		}
		
		if(json.milestones) {
			entity.milestones = json.milestones!
		}

		if(json.reward) {
			const newReward = mapGrantRewardAndListen(entity.id, entity.workspace, json.reward!)
			const oldReward = Reward.load(entity.reward)!

			const oldUSDReward = getUSDReward(oldReward.asset, oldReward.committed)
			const newUSDReward = getUSDReward(newReward.asset, newReward.committed)

			if(oldUSDReward > 0 || newUSDReward > 0) {
				// if it was USD, remove the old amount
				if(oldUSDReward > 0) {
					entity.totalGrantFundingCommittedUSD = entity.totalGrantFundingCommittedUSD.minus(BigInt.fromI32(oldUSDReward))
				}

				// if it is USD, add the new amount
				if(newUSDReward > 0) {
					entity.totalGrantFundingCommittedUSD = entity.totalGrantFundingCommittedUSD.plus(BigInt.fromI32(newUSDReward))
				}

				log.debug(`updated reward disbursed ${entity.id}`, [])
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