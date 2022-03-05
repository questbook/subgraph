import { BigInt } from "@graphprotocol/graph-ts";
import { ApplicationMilestone, GrantField, GrantFieldAnswer, GrantFieldAnswerItem, Social } from "../../generated/schema";
import { Result } from "../json-schema/json";
import { GrantApplicationFieldAnswerItem, GrantApplicationFieldAnswers, GrantField as GrantFieldJSON, GrantFieldMap, GrantProposedMilestone, SocialItem } from "../json-schema";

export function isPlausibleIPFSHash(str: string): boolean {
	return str.length > 2
}

export function mapGrantFieldMap(grantId: string, map: GrantFieldMap): string[] {
	const fields: string[] = []
	fields.push(mapGrantField(grantId, 'applicantName', map.applicantName))
	fields.push(mapGrantField(grantId, 'applicantEmail', map.applicantEmail))
	fields.push(mapGrantField(grantId, 'projectName', map.projectName))
	fields.push(mapGrantField(grantId, 'projectDetails', map.projectDetails))
	fields.push(mapGrantField(grantId, 'fundingBreakdown', map.fundingBreakdown))

	const additionalEntries = map.additionalProperties.entries
	for(let i = 0;i < additionalEntries.length;i++) {
		fields.push(mapGrantField(grantId, additionalEntries[i].key, additionalEntries[i].value))
	}

	return fields
}

export function mapGrantFieldAnswers(applicationId: string, grantId: string, map: GrantApplicationFieldAnswers): string[] {
	const fields: string[] = []
	fields.push(mapGrantFieldAnswer(applicationId, grantId, 'applicantName', map.applicantName))
	fields.push(mapGrantFieldAnswer(applicationId, grantId, 'applicantEmail', map.applicantEmail))
	fields.push(mapGrantFieldAnswer(applicationId, grantId, 'projectName', map.projectName))
	fields.push(mapGrantFieldAnswer(applicationId, grantId, 'projectDetails', map.projectDetails))
	fields.push(mapGrantFieldAnswer(applicationId, grantId, 'fundingBreakdown', map.fundingBreakdown))

	const additionalEntries = map.additionalProperties.entries
	for(let i = 0;i < additionalEntries.length;i++) {
		fields.push(mapGrantFieldAnswer(applicationId, grantId, additionalEntries[i].key, additionalEntries[i].value))
	}

	return fields
}

export function mapMilestones(applicationId: string, milestoneList: GrantProposedMilestone[]): string[] {
	const milestones: string[] = []
	for(let i = 0;i < milestoneList.length;i++) {
		const milestone = new ApplicationMilestone(`${applicationId}.${i}`)
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
	switch(state) {
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
	switch(state) {
		case 0:
			stateStr = "submitted"
		break
		case 1:
			stateStr = "requested"
		break
		case 2:
			stateStr = "approved"
		break
		default:
			return { value: null, error: `Unknown milestone state "${state}"` }
	}

	return { value: stateStr, error: null }
}

export function mapWorkspaceSupportedNetworks(networksList: string[]): string[] {
	const items: string[] = []
	for(let i = 0;i < networksList.length;i++) {
		items.push(`chain_${networksList[i]}`)
	}
	return items
}

export function mapWorkspaceSocials(workspaceId: string, socialsList: SocialItem[]): string[] {
	const items: string[] = []
	for(let i = 0;i < socialsList.length;i++) {
		const social = new Social(`${workspaceId}.${socialsList[i].name}`)
		social.name = socialsList[i].name
		social.value = socialsList[i].value
		social.save()
		
		items.push(social.id)
	}
	return items
}

function mapGrantFieldAnswer(applicationId: string, grantId: string, title: string, answers: GrantApplicationFieldAnswerItem[]): string {
	const answer = new GrantFieldAnswer(`${applicationId}.${title}`)
	for(let i = 0;i < answers.length;i++) {
		const ansValue = new GrantFieldAnswerItem(`${answer.id}.${i}`)
		ansValue.answer = answer.id
		ansValue.value = answers[i].value
		ansValue.walletId = answers[i].address

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