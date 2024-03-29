import { BigInt, ethereum, log } from '@graphprotocol/graph-ts'
import { Grant, Rubric, RubricItem } from '../../generated/schema'
import { RubricSetRequest, validateRubricSetRequest } from '../json-schema'
import { validatedJsonFromIpfs } from '../json-schema/json'

export function rubricSetHandler(
	event: ethereum.Event,
	_grantId: string,
	_workspaceId: string,
	_metadataHash: string,
	_time: BigInt
): void {

	const grantId = _grantId
	const workspaceId = _workspaceId

	const jsonResult = validatedJsonFromIpfs<RubricSetRequest>(_metadataHash, validateRubricSetRequest)
	if(jsonResult.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping application: "${jsonResult.error!}"`, [])
		return
	}

	const json = jsonResult.value!

	const grant = Grant.load(grantId)
	if(!grant) {
		log.warning(`[${event.transaction.hash.toHex()}] error in setting rubric: "grant '${grantId}' not found"`, [])
		return
	}

	let rubric = Rubric.load(grantId)
	if(!rubric) {
		rubric = new Rubric(grantId)
		rubric.createdAtS = _time.toI32()
	}

	rubric.updatedAtS = _time.toI32()
	rubric.addedBy = `${workspaceId}.${event.transaction.from.toHex()}`
	rubric.isPrivate = json.rubric.isPrivate.isTrue

	if(json.reviewType) {
		grant.reviewType = json.reviewType
	}

	const items: string[] = []

	const rubricItems = json.rubric.rubric.additionalProperties

	for(let i = 0; i < rubricItems.entries.length; i++) {
		const entry = rubricItems.entries[i]

		const item = new RubricItem(`${grantId}.${entry.key}`)
		let details = entry.value.details
		if(!details) {
			details = ''
		}

		item.title = entry.value.title
		item.details = details!
		item.maximumPoints = entry.value.maximumPoints.toI32()

		if(item.maximumPoints > 1 && grant.reviewType == 'voting') {
			log.warning(`[${event.transaction.hash.toHex()}] warning in setting rubric: "maximumPoints must be 1 for voting grants"`, [])
		}

		item.save()

		items.push(item.id)
	}

	rubric.items = items
	rubric.save()

	grant.updatedAtS = _time.toI32()
	grant.rubric = rubric.id

	grant.save()
}