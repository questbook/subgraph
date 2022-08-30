import { log } from '@graphprotocol/graph-ts'
import { Grant } from '../../generated/schema'
import { GrantUpdateRequest, validateGrantUpdateRequest } from '../json-schema'
import { validatedJsonFromIpfs } from '../json-schema/json'
import { dateToUnixTimestamp, isPlausibleIPFSHash, mapGrantFieldMap, mapGrantManagers, mapGrantRewardAndListen, removeEntityCollection } from './generics'

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
			entity.reward = mapGrantRewardAndListen(entity.id, entity.workspace, json.reward!).id
		}

		if(json.fields) {
			entity.fields = mapGrantFieldMap(entity.id, json.fields!)
		}

		if(json.grantManagers && json.grantManagers!.length) {
			removeEntityCollection('GrantManager', entity.managers)
			entity.managers = mapGrantManagers(json.grantManagers, entity.id, entity.workspace)
		}
	}

	log.info(`Grant ${grantId} updated`, [])

	entity.save()
}