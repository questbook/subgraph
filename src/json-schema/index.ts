
// Auto generated file using graph-json-validator. Do not modify manually.

import { BigInt, Bytes, JSONValue, TypedMap } from '@graphprotocol/graph-ts'
import { Result, toSet, validateArray, validateBytesFromStringResult, validateInteger, validateObject, validateString, validateTypedMap, validateStringResultInteger, validateStringResultNumber } from './json'

const SupportedNetworkEnumSet = toSet(['1', '4', '137', '80001', '1666700000', '1666600000'])
const GrantField_inputTypeEnumSet = toSet(['short-form', 'long-form', 'numeric', 'array'])
const GrantApplicationFieldAnswersPropertiesSet = toSet(['applicantName', 'applicantEmail', 'projectName', 'projectDetails', 'fundingBreakdown'])
const GrantFieldMapPropertiesSet = toSet(['applicantName', 'applicantEmail', 'projectName', 'projectDetails', 'fundingBreakdown'])

export class Error {
	statusCode: BigInt = new BigInt(0)
	error: string = ''
	message: string = ''
	data: Error_data | null = null
}

export class Error_data {

}

export class GrantField {
	title: string = ''
	inputType: string = ''
	enum: string[] | null = null
}

export class GrantProposedMilestone {
	title: string = ''
	amount: BigInt = new BigInt(0)
}

export class GrantApplicationFieldAnswers {
	applicantName: string[] = []
	applicantEmail: string[] = []
	projectName: string[] = []
	projectDetails: string[] = []
	fundingBreakdown: string[] = []
	additionalProperties: TypedMap<string, string[]> = new TypedMap()
}

export class GrantApplicationRequest {
	grantId: string = ''
	applicantId: string = ''
	fields: GrantApplicationFieldAnswers = new GrantApplicationFieldAnswers()
	milestones: GrantProposedMilestone[] = []
}

export class GrantApplicationUpdate {
	fields: GrantApplicationFieldAnswers | null = null
	milestones: GrantProposedMilestone[] | null = null
	feedback: string | null = null
}

export class SocialItem {
	name: string = ''
	value: string = ''
}

export class WorkspaceCreateRequest {
	title: string = ''
	about: string = ''
	logoIpfsHash: string = ''
	coverImageIpfsHash: string | null = null
	creatorId: string = ''
	supportedNetworks: string[] = []
	socials: SocialItem[] = []
}

export class WorkspaceUpdateRequest {
	title: string | null = null
	about: string | null = null
	logoIpfsHash: string | null = null
	coverImageIpfsHash: string | null = null
	socials: SocialItem[] | null = null
}

export class ApplicationMilestoneUpdate {
	text: string = ''
}

export class GrantFieldMap {
	applicantName: GrantField = new GrantField()
	applicantEmail: GrantField = new GrantField()
	projectName: GrantField = new GrantField()
	projectDetails: GrantField = new GrantField()
	fundingBreakdown: GrantField = new GrantField()
	additionalProperties: TypedMap<string, GrantField> = new TypedMap()
}

export class GrantReward {
	committed: BigInt = new BigInt(0)
	asset: Bytes = new Bytes(0)
}

export class GrantCreateRequest {
	title: string = ''
	summary: string = ''
	details: string = ''
	deadline: string | null = null
	reward: GrantReward = new GrantReward()
	creatorId: string = ''
	workspaceId: string = ''
	fields: GrantFieldMap = new GrantFieldMap()
}

export class GrantUpdateRequest {
	title: string | null = null
	summary: string | null = null
	details: string | null = null
	deadline: string | null = null
	reward: GrantReward | null = null
	fields: GrantFieldMap | null = null
}

export function validateError(json: JSONValue): Result<Error> {
	const value = new Error()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const statusCodeJson = obj.get('statusCode')
	if (!statusCodeJson) {
		return { value: null, error: "Expected 'statusCode' to be present in Error" }
	}

	if (statusCodeJson) {
		const statusCodeResult = validateInteger(statusCodeJson, BigInt.fromString('200'), BigInt.fromString('505'))
		if (statusCodeResult.error) {
			return { value: null, error: ["Error in mapping 'statusCode': ", statusCodeResult.error!].join('') }
		}

		value.statusCode = statusCodeResult.value!
	}

	const errorJson = obj.get('error')
	if (!errorJson) {
		return { value: null, error: "Expected 'error' to be present in Error" }
	}

	if (errorJson) {
		const errorResult = validateString(errorJson, -1, -1, null)
		if (errorResult.error) {
			return { value: null, error: ["Error in mapping 'error': ", errorResult.error!].join('') }
		}

		value.error = errorResult.value!
	}

	const messageJson = obj.get('message')
	if (!messageJson) {
		return { value: null, error: "Expected 'message' to be present in Error" }
	}

	if (messageJson) {
		const messageResult = validateString(messageJson, -1, -1, null)
		if (messageResult.error) {
			return { value: null, error: ["Error in mapping 'message': ", messageResult.error!].join('') }
		}

		value.message = messageResult.value!
	}

	const dataJson = obj.get('data')
	if (dataJson) {
		const dataResult = validateError_data(dataJson)
		if (dataResult.error) {
			return { value: null, error: ["Error in mapping 'data': ", dataResult.error!].join('') }
		}

		value.data = dataResult.value!
	}

	return { value, error: null }
}

export function validateError_data(json: JSONValue): Result<Error_data> {
	const value = new Error_data()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	return { value, error: null }
}

export function validateAsset(json: JSONValue): Result<Bytes> {
	return validateBytesFromStringResult(validateString(json, 16, 256, null))
}

export function validateAmount(json: JSONValue): Result<BigInt> {
	return validateStringResultInteger(validateString(json, -1, 64, null))
}

export function validateSupportedNetwork(json: JSONValue): Result<string> {
	return validateString(json, -1, -1, SupportedNetworkEnumSet)
}

export function validateGrantField(json: JSONValue): Result<GrantField> {
	const value = new GrantField()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const titleJson = obj.get('title')
	if (!titleJson) {
		return { value: null, error: "Expected 'title' to be present in GrantField" }
	}

	if (titleJson) {
		const titleResult = validateString(titleJson, -1, 512, null)
		if (titleResult.error) {
			return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
		}

		value.title = titleResult.value!
	}

	const inputTypeJson = obj.get('inputType')
	if (!inputTypeJson) {
		return { value: null, error: "Expected 'inputType' to be present in GrantField" }
	}

	if (inputTypeJson) {
		const inputTypeResult = validateString(inputTypeJson, -1, -1, GrantField_inputTypeEnumSet)
		if (inputTypeResult.error) {
			return { value: null, error: ["Error in mapping 'inputType': ", inputTypeResult.error!].join('') }
		}

		value.inputType = inputTypeResult.value!
	}

	const enumJson = obj.get('enum')
	if (enumJson) {
		const enumResult = validateGrantField_enum(enumJson)
		if (enumResult.error) {
			return { value: null, error: ["Error in mapping 'enum': ", enumResult.error!].join('') }
		}

		value.enum = enumResult.value!
	}

	return { value, error: null }
}

export function validateGrantField_enum(json: JSONValue): Result<string[]> {
	return validateArray(json, -1, 20, validateGrantField_enumItem)
}

export function validateGrantField_enumItem(json: JSONValue): Result<string> {
	return validateString(json, -1, 256, null)
}

export function validateGrantProposedMilestone(json: JSONValue): Result<GrantProposedMilestone> {
	const value = new GrantProposedMilestone()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const titleJson = obj.get('title')
	if (!titleJson) {
		return { value: null, error: "Expected 'title' to be present in GrantProposedMilestone" }
	}

	if (titleJson) {
		const titleResult = validateString(titleJson, -1, 255, null)
		if (titleResult.error) {
			return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
		}

		value.title = titleResult.value!
	}

	const amountJson = obj.get('amount')
	if (!amountJson) {
		return { value: null, error: "Expected 'amount' to be present in GrantProposedMilestone" }
	}

	if (amountJson) {
		const amountResult = validateAmount(amountJson)
		if (amountResult.error) {
			return { value: null, error: ["Error in mapping 'amount': ", amountResult.error!].join('') }
		}

		value.amount = amountResult.value!
	}

	return { value, error: null }
}

export function validateGrantApplicationFieldAnswer(json: JSONValue): Result<string[]> {
	return validateArray(json, -1, 100, validateGrantApplicationFieldAnswerItem)
}

export function validateGrantApplicationFieldAnswerItem(json: JSONValue): Result<string> {
	return validateString(json, -1, 7000, null)
}

export function validateRequiredGrantApplicationFieldAnswer(json: JSONValue): Result<string[]> {
	return validateArray(json, 1, 100, validateRequiredGrantApplicationFieldAnswerItem)
}

export function validateRequiredGrantApplicationFieldAnswerItem(json: JSONValue): Result<string> {
	return validateString(json, -1, 7000, null)
}

export function validateGrantApplicationFieldAnswers(json: JSONValue): Result<GrantApplicationFieldAnswers> {
	const value = new GrantApplicationFieldAnswers()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const addPropertiesResult = validateTypedMap(json, GrantApplicationFieldAnswersPropertiesSet, validateGrantApplicationFieldAnswer)
	if (addPropertiesResult.error) {
		return { value: null, error: ['Error in mapping additionalProperties: ', addPropertiesResult.error].join('') }
	}

	value.additionalProperties = addPropertiesResult.value!

	const applicantNameJson = obj.get('applicantName')
	if (!applicantNameJson) {
		return { value: null, error: "Expected 'applicantName' to be present in GrantApplicationFieldAnswers" }
	}

	if (applicantNameJson) {
		const applicantNameResult = validateRequiredGrantApplicationFieldAnswer(applicantNameJson)
		if (applicantNameResult.error) {
			return { value: null, error: ["Error in mapping 'applicantName': ", applicantNameResult.error!].join('') }
		}

		value.applicantName = applicantNameResult.value!
	}

	const applicantEmailJson = obj.get('applicantEmail')
	if (!applicantEmailJson) {
		return { value: null, error: "Expected 'applicantEmail' to be present in GrantApplicationFieldAnswers" }
	}

	if (applicantEmailJson) {
		const applicantEmailResult = validateRequiredGrantApplicationFieldAnswer(applicantEmailJson)
		if (applicantEmailResult.error) {
			return { value: null, error: ["Error in mapping 'applicantEmail': ", applicantEmailResult.error!].join('') }
		}

		value.applicantEmail = applicantEmailResult.value!
	}

	const projectNameJson = obj.get('projectName')
	if (!projectNameJson) {
		return { value: null, error: "Expected 'projectName' to be present in GrantApplicationFieldAnswers" }
	}

	if (projectNameJson) {
		const projectNameResult = validateRequiredGrantApplicationFieldAnswer(projectNameJson)
		if (projectNameResult.error) {
			return { value: null, error: ["Error in mapping 'projectName': ", projectNameResult.error!].join('') }
		}

		value.projectName = projectNameResult.value!
	}

	const projectDetailsJson = obj.get('projectDetails')
	if (!projectDetailsJson) {
		return { value: null, error: "Expected 'projectDetails' to be present in GrantApplicationFieldAnswers" }
	}

	if (projectDetailsJson) {
		const projectDetailsResult = validateRequiredGrantApplicationFieldAnswer(projectDetailsJson)
		if (projectDetailsResult.error) {
			return { value: null, error: ["Error in mapping 'projectDetails': ", projectDetailsResult.error!].join('') }
		}

		value.projectDetails = projectDetailsResult.value!
	}

	const fundingBreakdownJson = obj.get('fundingBreakdown')
	if (!fundingBreakdownJson) {
		return { value: null, error: "Expected 'fundingBreakdown' to be present in GrantApplicationFieldAnswers" }
	}

	if (fundingBreakdownJson) {
		const fundingBreakdownResult = validateRequiredGrantApplicationFieldAnswer(fundingBreakdownJson)
		if (fundingBreakdownResult.error) {
			return { value: null, error: ["Error in mapping 'fundingBreakdown': ", fundingBreakdownResult.error!].join('') }
		}

		value.fundingBreakdown = fundingBreakdownResult.value!
	}

	return { value, error: null }
}

export function validateGrantApplicationRequest(json: JSONValue): Result<GrantApplicationRequest> {
	const value = new GrantApplicationRequest()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const grantIdJson = obj.get('grantId')
	if (!grantIdJson) {
		return { value: null, error: "Expected 'grantId' to be present in GrantApplicationRequest" }
	}

	if (grantIdJson) {
		const grantIdResult = validateString(grantIdJson, -1, -1, null)
		if (grantIdResult.error) {
			return { value: null, error: ["Error in mapping 'grantId': ", grantIdResult.error!].join('') }
		}

		value.grantId = grantIdResult.value!
	}

	const applicantIdJson = obj.get('applicantId')
	if (!applicantIdJson) {
		return { value: null, error: "Expected 'applicantId' to be present in GrantApplicationRequest" }
	}

	if (applicantIdJson) {
		const applicantIdResult = validateOwnerID(applicantIdJson)
		if (applicantIdResult.error) {
			return { value: null, error: ["Error in mapping 'applicantId': ", applicantIdResult.error!].join('') }
		}

		value.applicantId = applicantIdResult.value!
	}

	const fieldsJson = obj.get('fields')
	if (!fieldsJson) {
		return { value: null, error: "Expected 'fields' to be present in GrantApplicationRequest" }
	}

	if (fieldsJson) {
		const fieldsResult = validateGrantApplicationFieldAnswers(fieldsJson)
		if (fieldsResult.error) {
			return { value: null, error: ["Error in mapping 'fields': ", fieldsResult.error!].join('') }
		}

		value.fields = fieldsResult.value!
	}

	const milestonesJson = obj.get('milestones')
	if (!milestonesJson) {
		return { value: null, error: "Expected 'milestones' to be present in GrantApplicationRequest" }
	}

	if (milestonesJson) {
		const milestonesResult = validateGrantApplicationRequest_milestones(milestonesJson)
		if (milestonesResult.error) {
			return { value: null, error: ["Error in mapping 'milestones': ", milestonesResult.error!].join('') }
		}

		value.milestones = milestonesResult.value!
	}

	return { value, error: null }
}

export function validateGrantApplicationRequest_milestones(json: JSONValue): Result<GrantProposedMilestone[]> {
	return validateArray(json, -1, 100, validateGrantProposedMilestone)
}

export function validateGrantApplicationUpdate(json: JSONValue): Result<GrantApplicationUpdate> {
	const value = new GrantApplicationUpdate()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const fieldsJson = obj.get('fields')
	if (fieldsJson) {
		const fieldsResult = validateGrantApplicationFieldAnswers(fieldsJson)
		if (fieldsResult.error) {
			return { value: null, error: ["Error in mapping 'fields': ", fieldsResult.error!].join('') }
		}

		value.fields = fieldsResult.value!
	}

	const milestonesJson = obj.get('milestones')
	if (milestonesJson) {
		const milestonesResult = validateGrantApplicationUpdate_milestones(milestonesJson)
		if (milestonesResult.error) {
			return { value: null, error: ["Error in mapping 'milestones': ", milestonesResult.error!].join('') }
		}

		value.milestones = milestonesResult.value!
	}

	const feedbackJson = obj.get('feedback')
	if (feedbackJson) {
		const feedbackResult = validateString(feedbackJson, 1, 2048, null)
		if (feedbackResult.error) {
			return { value: null, error: ["Error in mapping 'feedback': ", feedbackResult.error!].join('') }
		}

		value.feedback = feedbackResult.value!
	}

	return { value, error: null }
}

export function validateGrantApplicationUpdate_milestones(json: JSONValue): Result<GrantProposedMilestone[]> {
	return validateArray(json, -1, 100, validateGrantProposedMilestone)
}

export function validateSocialItem(json: JSONValue): Result<SocialItem> {
	const value = new SocialItem()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const nameJson = obj.get('name')
	if (!nameJson) {
		return { value: null, error: "Expected 'name' to be present in SocialItem" }
	}

	if (nameJson) {
		const nameResult = validateString(nameJson, -1, 64, null)
		if (nameResult.error) {
			return { value: null, error: ["Error in mapping 'name': ", nameResult.error!].join('') }
		}

		value.name = nameResult.value!
	}

	const valueJson = obj.get('value')
	if (!valueJson) {
		return { value: null, error: "Expected 'value' to be present in SocialItem" }
	}

	if (valueJson) {
		const valueResult = validateString(valueJson, -1, 255, null)
		if (valueResult.error) {
			return { value: null, error: ["Error in mapping 'value': ", valueResult.error!].join('') }
		}

		value.value = valueResult.value!
	}

	return { value, error: null }
}

export function validateWorkspaceCreateRequest(json: JSONValue): Result<WorkspaceCreateRequest> {
	const value = new WorkspaceCreateRequest()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const titleJson = obj.get('title')
	if (!titleJson) {
		return { value: null, error: "Expected 'title' to be present in WorkspaceCreateRequest" }
	}

	if (titleJson) {
		const titleResult = validateString(titleJson, 5, 128, null)
		if (titleResult.error) {
			return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
		}

		value.title = titleResult.value!
	}

	const aboutJson = obj.get('about')
	if (!aboutJson) {
		return { value: null, error: "Expected 'about' to be present in WorkspaceCreateRequest" }
	}

	if (aboutJson) {
		const aboutResult = validateString(aboutJson, 5, 5000, null)
		if (aboutResult.error) {
			return { value: null, error: ["Error in mapping 'about': ", aboutResult.error!].join('') }
		}

		value.about = aboutResult.value!
	}

	const logoIpfsHashJson = obj.get('logoIpfsHash')
	if (!logoIpfsHashJson) {
		return { value: null, error: "Expected 'logoIpfsHash' to be present in WorkspaceCreateRequest" }
	}

	if (logoIpfsHashJson) {
		const logoIpfsHashResult = validateString(logoIpfsHashJson, -1, 128, null)
		if (logoIpfsHashResult.error) {
			return { value: null, error: ["Error in mapping 'logoIpfsHash': ", logoIpfsHashResult.error!].join('') }
		}

		value.logoIpfsHash = logoIpfsHashResult.value!
	}

	const coverImageIpfsHashJson = obj.get('coverImageIpfsHash')
	if (coverImageIpfsHashJson) {
		const coverImageIpfsHashResult = validateString(coverImageIpfsHashJson, -1, 128, null)
		if (coverImageIpfsHashResult.error) {
			return { value: null, error: ["Error in mapping 'coverImageIpfsHash': ", coverImageIpfsHashResult.error!].join('') }
		}

		value.coverImageIpfsHash = coverImageIpfsHashResult.value!
	}

	const creatorIdJson = obj.get('creatorId')
	if (!creatorIdJson) {
		return { value: null, error: "Expected 'creatorId' to be present in WorkspaceCreateRequest" }
	}

	if (creatorIdJson) {
		const creatorIdResult = validateOwnerID(creatorIdJson)
		if (creatorIdResult.error) {
			return { value: null, error: ["Error in mapping 'creatorId': ", creatorIdResult.error!].join('') }
		}

		value.creatorId = creatorIdResult.value!
	}

	const supportedNetworksJson = obj.get('supportedNetworks')
	if (!supportedNetworksJson) {
		return { value: null, error: "Expected 'supportedNetworks' to be present in WorkspaceCreateRequest" }
	}

	if (supportedNetworksJson) {
		const supportedNetworksResult = validateWorkspaceCreateRequest_supportedNetworks(supportedNetworksJson)
		if (supportedNetworksResult.error) {
			return { value: null, error: ["Error in mapping 'supportedNetworks': ", supportedNetworksResult.error!].join('') }
		}

		value.supportedNetworks = supportedNetworksResult.value!
	}

	const socialsJson = obj.get('socials')
	if (!socialsJson) {
		return { value: null, error: "Expected 'socials' to be present in WorkspaceCreateRequest" }
	}

	if (socialsJson) {
		const socialsResult = validateWorkspaceCreateRequest_socials(socialsJson)
		if (socialsResult.error) {
			return { value: null, error: ["Error in mapping 'socials': ", socialsResult.error!].join('') }
		}

		value.socials = socialsResult.value!
	}

	return { value, error: null }
}

export function validateWorkspaceCreateRequest_supportedNetworks(json: JSONValue): Result<string[]> {
	return validateArray(json, -1, 100, validateSupportedNetwork)
}

export function validateWorkspaceCreateRequest_socials(json: JSONValue): Result<SocialItem[]> {
	return validateArray(json, -1, 10, validateSocialItem)
}

export function validateWorkspaceUpdateRequest(json: JSONValue): Result<WorkspaceUpdateRequest> {
	const value = new WorkspaceUpdateRequest()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const titleJson = obj.get('title')
	if (titleJson) {
		const titleResult = validateString(titleJson, 5, 128, null)
		if (titleResult.error) {
			return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
		}

		value.title = titleResult.value!
	}

	const aboutJson = obj.get('about')
	if (aboutJson) {
		const aboutResult = validateString(aboutJson, 5, 5000, null)
		if (aboutResult.error) {
			return { value: null, error: ["Error in mapping 'about': ", aboutResult.error!].join('') }
		}

		value.about = aboutResult.value!
	}

	const logoIpfsHashJson = obj.get('logoIpfsHash')
	if (logoIpfsHashJson) {
		const logoIpfsHashResult = validateString(logoIpfsHashJson, -1, 128, null)
		if (logoIpfsHashResult.error) {
			return { value: null, error: ["Error in mapping 'logoIpfsHash': ", logoIpfsHashResult.error!].join('') }
		}

		value.logoIpfsHash = logoIpfsHashResult.value!
	}

	const coverImageIpfsHashJson = obj.get('coverImageIpfsHash')
	if (coverImageIpfsHashJson) {
		const coverImageIpfsHashResult = validateString(coverImageIpfsHashJson, -1, 128, null)
		if (coverImageIpfsHashResult.error) {
			return { value: null, error: ["Error in mapping 'coverImageIpfsHash': ", coverImageIpfsHashResult.error!].join('') }
		}

		value.coverImageIpfsHash = coverImageIpfsHashResult.value!
	}

	const socialsJson = obj.get('socials')
	if (socialsJson) {
		const socialsResult = validateWorkspaceUpdateRequest_socials(socialsJson)
		if (socialsResult.error) {
			return { value: null, error: ["Error in mapping 'socials': ", socialsResult.error!].join('') }
		}

		value.socials = socialsResult.value!
	}

	return { value, error: null }
}

export function validateWorkspaceUpdateRequest_socials(json: JSONValue): Result<SocialItem[]> {
	return validateArray(json, -1, 10, validateSocialItem)
}

export function validateApplicationMilestoneUpdate(json: JSONValue): Result<ApplicationMilestoneUpdate> {
	const value = new ApplicationMilestoneUpdate()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const textJson = obj.get('text')
	if (!textJson) {
		return { value: null, error: "Expected 'text' to be present in ApplicationMilestoneUpdate" }
	}

	if (textJson) {
		const textResult = validateString(textJson, -1, 4096, null)
		if (textResult.error) {
			return { value: null, error: ["Error in mapping 'text': ", textResult.error!].join('') }
		}

		value.text = textResult.value!
	}

	return { value, error: null }
}

export function validateGrantFieldMap(json: JSONValue): Result<GrantFieldMap> {
	const value = new GrantFieldMap()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const addPropertiesResult = validateTypedMap(json, GrantFieldMapPropertiesSet, validateGrantField)
	if (addPropertiesResult.error) {
		return { value: null, error: ['Error in mapping additionalProperties: ', addPropertiesResult.error].join('') }
	}

	value.additionalProperties = addPropertiesResult.value!

	const applicantNameJson = obj.get('applicantName')
	if (!applicantNameJson) {
		return { value: null, error: "Expected 'applicantName' to be present in GrantFieldMap" }
	}

	if (applicantNameJson) {
		const applicantNameResult = validateGrantField(applicantNameJson)
		if (applicantNameResult.error) {
			return { value: null, error: ["Error in mapping 'applicantName': ", applicantNameResult.error!].join('') }
		}

		value.applicantName = applicantNameResult.value!
	}

	const applicantEmailJson = obj.get('applicantEmail')
	if (!applicantEmailJson) {
		return { value: null, error: "Expected 'applicantEmail' to be present in GrantFieldMap" }
	}

	if (applicantEmailJson) {
		const applicantEmailResult = validateGrantField(applicantEmailJson)
		if (applicantEmailResult.error) {
			return { value: null, error: ["Error in mapping 'applicantEmail': ", applicantEmailResult.error!].join('') }
		}

		value.applicantEmail = applicantEmailResult.value!
	}

	const projectNameJson = obj.get('projectName')
	if (!projectNameJson) {
		return { value: null, error: "Expected 'projectName' to be present in GrantFieldMap" }
	}

	if (projectNameJson) {
		const projectNameResult = validateGrantField(projectNameJson)
		if (projectNameResult.error) {
			return { value: null, error: ["Error in mapping 'projectName': ", projectNameResult.error!].join('') }
		}

		value.projectName = projectNameResult.value!
	}

	const projectDetailsJson = obj.get('projectDetails')
	if (!projectDetailsJson) {
		return { value: null, error: "Expected 'projectDetails' to be present in GrantFieldMap" }
	}

	if (projectDetailsJson) {
		const projectDetailsResult = validateGrantField(projectDetailsJson)
		if (projectDetailsResult.error) {
			return { value: null, error: ["Error in mapping 'projectDetails': ", projectDetailsResult.error!].join('') }
		}

		value.projectDetails = projectDetailsResult.value!
	}

	const fundingBreakdownJson = obj.get('fundingBreakdown')
	if (!fundingBreakdownJson) {
		return { value: null, error: "Expected 'fundingBreakdown' to be present in GrantFieldMap" }
	}

	if (fundingBreakdownJson) {
		const fundingBreakdownResult = validateGrantField(fundingBreakdownJson)
		if (fundingBreakdownResult.error) {
			return { value: null, error: ["Error in mapping 'fundingBreakdown': ", fundingBreakdownResult.error!].join('') }
		}

		value.fundingBreakdown = fundingBreakdownResult.value!
	}

	return { value, error: null }
}

export function validateGrantReward(json: JSONValue): Result<GrantReward> {
	const value = new GrantReward()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const committedJson = obj.get('committed')
	if (!committedJson) {
		return { value: null, error: "Expected 'committed' to be present in GrantReward" }
	}

	if (committedJson) {
		const committedResult = validateAmount(committedJson)
		if (committedResult.error) {
			return { value: null, error: ["Error in mapping 'committed': ", committedResult.error!].join('') }
		}

		value.committed = committedResult.value!
	}

	const assetJson = obj.get('asset')
	if (!assetJson) {
		return { value: null, error: "Expected 'asset' to be present in GrantReward" }
	}

	if (assetJson) {
		const assetResult = validateAsset(assetJson)
		if (assetResult.error) {
			return { value: null, error: ["Error in mapping 'asset': ", assetResult.error!].join('') }
		}

		value.asset = assetResult.value!
	}

	return { value, error: null }
}

export function validateGrantCreateRequest(json: JSONValue): Result<GrantCreateRequest> {
	const value = new GrantCreateRequest()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const titleJson = obj.get('title')
	if (!titleJson) {
		return { value: null, error: "Expected 'title' to be present in GrantCreateRequest" }
	}

	if (titleJson) {
		const titleResult = validateString(titleJson, 5, 255, null)
		if (titleResult.error) {
			return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
		}

		value.title = titleResult.value!
	}

	const summaryJson = obj.get('summary')
	if (!summaryJson) {
		return { value: null, error: "Expected 'summary' to be present in GrantCreateRequest" }
	}

	if (summaryJson) {
		const summaryResult = validateString(summaryJson, 5, 1024, null)
		if (summaryResult.error) {
			return { value: null, error: ["Error in mapping 'summary': ", summaryResult.error!].join('') }
		}

		value.summary = summaryResult.value!
	}

	const detailsJson = obj.get('details')
	if (!detailsJson) {
		return { value: null, error: "Expected 'details' to be present in GrantCreateRequest" }
	}

	if (detailsJson) {
		const detailsResult = validateString(detailsJson, 50, 4096, null)
		if (detailsResult.error) {
			return { value: null, error: ["Error in mapping 'details': ", detailsResult.error!].join('') }
		}

		value.details = detailsResult.value!
	}

	const deadlineJson = obj.get('deadline')
	if (deadlineJson) {
		const deadlineResult = validateString(deadlineJson, -1, 128, null)
		if (deadlineResult.error) {
			return { value: null, error: ["Error in mapping 'deadline': ", deadlineResult.error!].join('') }
		}

		value.deadline = deadlineResult.value!
	}

	const rewardJson = obj.get('reward')
	if (!rewardJson) {
		return { value: null, error: "Expected 'reward' to be present in GrantCreateRequest" }
	}

	if (rewardJson) {
		const rewardResult = validateGrantReward(rewardJson)
		if (rewardResult.error) {
			return { value: null, error: ["Error in mapping 'reward': ", rewardResult.error!].join('') }
		}

		value.reward = rewardResult.value!
	}

	const creatorIdJson = obj.get('creatorId')
	if (!creatorIdJson) {
		return { value: null, error: "Expected 'creatorId' to be present in GrantCreateRequest" }
	}

	if (creatorIdJson) {
		const creatorIdResult = validateOwnerID(creatorIdJson)
		if (creatorIdResult.error) {
			return { value: null, error: ["Error in mapping 'creatorId': ", creatorIdResult.error!].join('') }
		}

		value.creatorId = creatorIdResult.value!
	}

	const workspaceIdJson = obj.get('workspaceId')
	if (!workspaceIdJson) {
		return { value: null, error: "Expected 'workspaceId' to be present in GrantCreateRequest" }
	}

	if (workspaceIdJson) {
		const workspaceIdResult = validateString(workspaceIdJson, -1, 128, null)
		if (workspaceIdResult.error) {
			return { value: null, error: ["Error in mapping 'workspaceId': ", workspaceIdResult.error!].join('') }
		}

		value.workspaceId = workspaceIdResult.value!
	}

	const fieldsJson = obj.get('fields')
	if (!fieldsJson) {
		return { value: null, error: "Expected 'fields' to be present in GrantCreateRequest" }
	}

	if (fieldsJson) {
		const fieldsResult = validateGrantFieldMap(fieldsJson)
		if (fieldsResult.error) {
			return { value: null, error: ["Error in mapping 'fields': ", fieldsResult.error!].join('') }
		}

		value.fields = fieldsResult.value!
	}

	return { value, error: null }
}

export function validateGrantUpdateRequest(json: JSONValue): Result<GrantUpdateRequest> {
	const value = new GrantUpdateRequest()
	const objResult = validateObject(json)
	if (objResult.error) {
		return { value: null, error: objResult.error }
	}

	const obj = objResult.value!
	const titleJson = obj.get('title')
	if (titleJson) {
		const titleResult = validateString(titleJson, 5, 255, null)
		if (titleResult.error) {
			return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
		}

		value.title = titleResult.value!
	}

	const summaryJson = obj.get('summary')
	if (summaryJson) {
		const summaryResult = validateString(summaryJson, 5, 1024, null)
		if (summaryResult.error) {
			return { value: null, error: ["Error in mapping 'summary': ", summaryResult.error!].join('') }
		}

		value.summary = summaryResult.value!
	}

	const detailsJson = obj.get('details')
	if (detailsJson) {
		const detailsResult = validateString(detailsJson, 50, -1, null)
		if (detailsResult.error) {
			return { value: null, error: ["Error in mapping 'details': ", detailsResult.error!].join('') }
		}

		value.details = detailsResult.value!
	}

	const deadlineJson = obj.get('deadline')
	if (deadlineJson) {
		const deadlineResult = validateString(deadlineJson, -1, 128, null)
		if (deadlineResult.error) {
			return { value: null, error: ["Error in mapping 'deadline': ", deadlineResult.error!].join('') }
		}

		value.deadline = deadlineResult.value!
	}

	const rewardJson = obj.get('reward')
	if (rewardJson) {
		const rewardResult = validateGrantReward(rewardJson)
		if (rewardResult.error) {
			return { value: null, error: ["Error in mapping 'reward': ", rewardResult.error!].join('') }
		}

		value.reward = rewardResult.value!
	}

	const fieldsJson = obj.get('fields')
	if (fieldsJson) {
		const fieldsResult = validateGrantFieldMap(fieldsJson)
		if (fieldsResult.error) {
			return { value: null, error: ["Error in mapping 'fields': ", fieldsResult.error!].join('') }
		}

		value.fields = fieldsResult.value!
	}

	return { value, error: null }
}

export function validateOwnerID(json: JSONValue): Result<string> {
	return validateString(json, 16, 255, null)
}
