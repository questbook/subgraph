import { Address, BigInt, Bytes, log, store, Value } from '@graphprotocol/graph-ts'
import { ApplicationMilestone, GrantField, GrantFieldAnswer, GrantFieldAnswerItem, GrantManager, Partner, PIIAnswer, Reward, Social, Token, Workspace, WorkspaceMember } from '../../generated/schema'
import { GrantApplicationFieldAnswerItem, GrantApplicationFieldAnswers, GrantField as GrantFieldJSON, GrantFieldMap, GrantProposedMilestone, GrantReward, Partner as PartnerItem, PIIAnswers, SocialItem, Token as TokenItem, validateWorkspaceMemberUpdate, WorkspaceMemberUpdate } from '../json-schema'
import { Result, validatedJsonFromIpfs } from '../json-schema/json'

export const USD_ASSET_ADDRESS_HEX = '0x0000000000000000000000000000000000000001'

const USDC_ADDRESSES = [
	'0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
	'0x7f5c764cbc14f9669b88837ca1490cca17c31607',
	'0x2f3A40A3db8a7e3D09B0adfEfbCe4f6F81927557'
]

// 10^6
const USDC_DECIMALS = BigInt.fromI32(10).pow(6)

export const CUSD_DAI_ADDRESSES = [
	'0x765de816845861e75a25fca122bb6898b8b1282a',
	'0xda10009cbd5d07dd0cecc66161fc93d7c9000da1'
]

// 10^18
const CUSD_DAI_DECIMALS = BigInt.fromI32(10).pow(18)

const I32_MAX_BIGINT = BigInt.fromI32(i32.MAX_VALUE)
const I32_MIN_BIGINT = BigInt.fromI32(i32.MIN_VALUE)

export function isPlausibleIPFSHash(str: string): boolean {
	return str.length > 2
}

export function mapGrantFieldMap(grantId: string, map: GrantFieldMap): string[] {
	const fields: string[] = []
	fields.push(mapGrantField(grantId, 'applicantName', map.applicantName))
	fields.push(mapGrantField(grantId, 'applicantEmail', map.applicantEmail))
	fields.push(mapGrantField(grantId, 'projectName', map.projectName))
	fields.push(mapGrantField(grantId, 'projectDetails', map.projectDetails))
	if(map.fundingBreakdown) {
		fields.push(mapGrantField(grantId, 'fundingBreakdown', map.fundingBreakdown!))
	}
	

	const additionalEntries = map.additionalProperties.entries
	for(let i = 0; i < additionalEntries.length; i++) {
		fields.push(mapGrantField(grantId, additionalEntries[i].key, additionalEntries[i].value))
	}

	return fields
}

export function mapGrantFieldAnswers(applicationId: string, grantId: string, map: GrantApplicationFieldAnswers): string[] {
	const fields: string[] = []
	const additionalEntries = map.additionalProperties.entries
	for(let i = 0; i < additionalEntries.length; i++) {
		fields.push(mapGrantFieldAnswer(applicationId, grantId, additionalEntries[i].key, additionalEntries[i].value))
	}

	return fields
}

export function mapGrantPII(applicationId: string, grantId: string, map: PIIAnswers): string[] {
	const items: string[] = []

	const entryList = map.additionalProperties.entries
	for(let i = 0; i < entryList.length; i++) {
		const entry = entryList[i]
		const item = new PIIAnswer(`${applicationId}.${entry.key}`)
		item.manager = `${grantId}.${entry.key}`
		item.data = entry.value
		item.save()

		items.push(item.id)
	}

	return items
}

export function mapMilestones(applicationId: string, milestoneList: GrantProposedMilestone[]): string[] {
	const milestones: string[] = []
	for(let i = 0; i < milestoneList.length; i++) {
		const milestone = new ApplicationMilestone(`${applicationId}.${i}`)
		milestone.application = applicationId
		milestone.state = 'submitted'
		milestone.title = milestoneList[i].title
		milestone.amount = milestoneList[i].amount
		milestone.amountPaid = new BigInt(0)

		milestone.save()
		milestones.push(milestone.id)
	}

	return milestones
}

export function contractApplicationStateToString(state: i32): Result<string> {
	let strState: string
	switch (state) {
	case 0:
		strState = 'submitted'
		break
	case 1:
		strState = 'resubmit'
		break
	case 2:
		strState = 'approved'
		break
	case 3:
		strState = 'rejected'
		break
	case 4:
		strState = 'completed'
		break
	default:
		return { value: null, error: `Unknown app state "${state}"` }
	}

	return { value: strState, error: null }
}

export function contractMilestoneStateToString(state: i32): Result<string> {
	let stateStr: string
	switch (state) {
	case 0:
		stateStr = 'submitted'
		break
	case 1:
		stateStr = 'requested'
		break
	case 2:
		stateStr = 'approved'
		break
	default:
		return { value: null, error: `Unknown milestone state "${state}"` }
	}

	return { value: stateStr, error: null }
}

export function mapWorkspaceSupportedNetworks(networksList: string[]): string[] {
	const items: string[] = []
	for(let i = 0; i < networksList.length; i++) {
		items.push(`chain_${networksList[i]}`)
	}

	return items
}

export function mapWorkspacePartners(workspaceId: string, partnerList: PartnerItem[]): string[] {
	const items: string[] = []
	for(let i = 0; i < partnerList.length; i++) {
		const partner = new Partner(`${workspaceId}`)
		partner.name = partnerList[i].name
		partner.industry = partnerList[i].industry
		partner.website = partnerList[i].website
		partner.partnerImageHash = partnerList[i].partnerImageHash
		partner.save()

		items.push(partner.id)
	}

	return items
}

export function mapWorkspaceSocials(workspaceId: string, socialsList: SocialItem[]): string[] {
	const items: string[] = []
	for(let i = 0; i < socialsList.length; i++) {
		const social = new Social(`${workspaceId}.${socialsList[i].name}`)
		social.name = socialsList[i].name
		social.value = socialsList[i].value
		social.save()

		items.push(social.id)
	}

	return items
}

export function mapWorkspaceTokens(workspaceId: string, tokensList: TokenItem[]): string[] {
	const items: string[] = []
	for(let i = 0; i < tokensList.length; i++) {
		const token = new Token(`${workspaceId}.${tokensList[i].address.toHex()}`)
		token.label = tokensList[i].label
		token.address = tokensList[i].address
		token.decimal = tokensList[i].decimal.toI32()
		token.iconHash = tokensList[i].iconHash
		token.chainId = tokensList[i].chainId
		token.workspace = workspaceId
		token.save()

		items.push(token.id)
	}

	return items
}

export function mapGrantManagers(managerWalletIds: Bytes[] | null, grantId: string, workspaceId: string): string[] {
	const items: string[] = []
	if(managerWalletIds) {
		for(let i = 0; i < managerWalletIds.length; i++) {
			const walletId = managerWalletIds[i].toHex()
			const manager = new GrantManager(`${grantId}.${walletId}`)
			manager.grant = grantId
			manager.member = `${workspaceId}.${walletId}`

			manager.save()
			items.push(manager.id)
		}
	}

	return items
}

export function removeEntityCollection(entityName: string, ids: string[]): void {
	for(let i = 0; i < ids.length; i++) {
		store.remove(entityName, ids[i])
	}
}

function mapGrantFieldAnswer(applicationId: string, grantId: string, title: string, answers: GrantApplicationFieldAnswerItem[]): string {
	const answer = new GrantFieldAnswer(`${applicationId}.${title}`)
	for(let i = 0; i < answers.length; i++) {
		const ansValue = new GrantFieldAnswerItem(`${answer.id}.${i}`)
		ansValue.answer = answer.id
		ansValue.value = answers[i].value

		ansValue.save()
	}

	answer.field = `${grantId}.${title}`

	answer.save()

	return answer.id
}

function mapGrantField(grantId: string, title: string, json: GrantFieldJSON): string {
	const field = new GrantField(`${grantId}.${title}`)
	field.title = title
	field.possibleValues = json.enum
	field.inputType = json.inputType.replace('-', '_')
	field.isPii = !!json.pii && json.pii!.isTrue
	field.save()

	return field.id
}

export function mapGrantRewardAndListen(id: string, workspaceId: string, rewardJson: GrantReward): Reward {
	const reward = new Reward(id)
	reward.asset = rewardJson.asset
	reward.committed = rewardJson.committed
	if(rewardJson.token) {
		const token = mapWorkspaceTokens(workspaceId, [rewardJson.token!])
		reward.token = token[0]
	} else {
		reward.token = null
	}

	reward.save()
	return reward
}

export function getUSDReward(asset: Bytes, value: BigInt): i32 {
	let result: BigInt

	const hexAssetAddr = asset.toHex()
	if(hexAssetAddr == USD_ASSET_ADDRESS_HEX) {
		result = value
	} else if(USDC_ADDRESSES.includes(hexAssetAddr)) {
		result = value.div(USDC_DECIMALS)
	} else if(CUSD_DAI_ADDRESSES.includes(hexAssetAddr)) {
		result = value.div(CUSD_DAI_DECIMALS)
	} else {
		result = BigInt.fromI32(-1)
	}

	if(result.ge(I32_MAX_BIGINT) || result.le(I32_MIN_BIGINT)) {
		return -1
	}

	return result.toI32()
}

export function mapWorkspaceMembersUpdate(
	workspaceId: string,
	time: BigInt,
	members: Address[],
	roles: i32[],
	enabled: boolean[],
	emails: string[] | null,
	metadataHash: string[] | null,
	addedBy: Address,
	txHash: Bytes
): Result<string> {
	const entity = Workspace.load(workspaceId)
	if(!entity) {
		return {
			error: `recv workspace members update without workspace existing, ID = ${workspaceId}`,
			value: null
		}
	}

	entity.updatedAtS = time.toI32()
	// add the admins
	for(let i = 0; i < members.length; i++) {
		const memberId = members[i]
		const role = roles[i]

		const id = `${workspaceId}.${memberId.toHex()}`
		let member = WorkspaceMember.load(id)

		if(enabled[i]) {
			if(!member) {
				member = new WorkspaceMember(id)
				member.addedAt = entity.updatedAtS
				member.lastReviewSubmittedAt = 0
				member.outstandingReviewIds = []
			}

			member.actorId = memberId
			member.lastKnownTxHash = txHash
			if(emails) {
				member.email = emails[i]
			}

			if(metadataHash) {
				const updateResult = validatedJsonFromIpfs<WorkspaceMemberUpdate>(metadataHash[i], validateWorkspaceMemberUpdate)
				if(updateResult.error) {
					return { error: updateResult.error, value: null }
				}

				const update = updateResult.value!
				if(update.fullName) {
					member.fullName = update.fullName
				}
				
				if(update.profilePictureIpfsHash) {
					member.profilePictureIpfsHash = update.profilePictureIpfsHash
				}
				
				if(update.publicKey) {
					member.publicKey = update.publicKey
				}
			}
			
			member.updatedAt = entity.updatedAtS
			if(role === 0) { // become an admin
				if(member.accessLevel === 'owner') { // if already an owner
					member.accessLevel = 'owner'
				} else {
					member.accessLevel = 'admin'
				}
			} else if(role === 1) { // become a reviewer
				member.accessLevel = 'reviewer'
			}

			member.workspace = workspaceId
			member.addedBy = `${workspaceId}.${addedBy.toHex()}`
			member.set('removedAt', Value.fromNull())
			member.save()
		} else if(member) {
			member.removedAt = entity.updatedAtS
			member.save()
		} else {
			log.warning(`[${txHash.toHex()}] recv member remove but member not found`, [])
		}
	}

	entity.save()
	return { error: null, value: null }
}

export function dateToUnixTimestamp(date: Date): i32 {
	return date.getTime() / 1000 as i32
}
