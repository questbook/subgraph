
// Auto generated file using graph-json-validator. Do not modify manually.

import { TypedMap, BigInt, BigDecimal, Bytes, JSONValue } from '@graphprotocol/graph-ts'
import { Boolean, Result, toSet, validateObject, validateNumber, validateInteger, validateArray, validateBoolean, validateString, validateTypedMap, validateBytesFromStringResult, validateStringResultInteger, validateStringResultNumber, validateDateTimeFromStringResult } from './json'

const SupportedNetworkEnumSet = toSet(['44787', '42220', '2153', '1666600000', '1666700000', '8217', '1001', '42', '245022926', '69', '10', '137', '80001', '4'])
const GrantField_inputTypeEnumSet = toSet(['short-form', 'long-form', 'numeric', 'array'])
const GrantFieldMapPropertiesSet = toSet(['applicantName', 'applicantEmail', 'projectName', 'projectDetails', 'fundingBreakdown'])

export class Error {
	statusCode: BigInt = new BigInt(0)
	error: string = ''
	message: string = ''
	data: Error_data | null = null
}

export class Error_data {

}

export class Partner {
	name: string = ''
	industry: string = ''
	website: string | null = null
	partnerImageHash: string | null = null
}

export class Token {
	label: string = ''
	address: Bytes = new Bytes(0)
	decimal: BigInt = new BigInt(0)
	iconHash: string = ''
}

export class GrantField {
	title: string = ''
	inputType: string = ''
	enum: string[] | null = null
	pii: Boolean | null = null
}

export class GrantProposedMilestone {
	title: string = ''
	amount: BigInt = new BigInt(0)
}

export class GrantApplicationFieldAnswerItem {
	value: string = ''
}

export class PIIAnswers {
	additionalProperties: TypedMap<string, string> = new TypedMap()
}

export class GrantApplicationFieldAnswers {
	additionalProperties: TypedMap<string, GrantApplicationFieldAnswerItem[]> = new TypedMap()
}

export class GrantApplicationRequest {
	grantId: string = ''
	applicantId: string = ''
	fields: GrantApplicationFieldAnswers = new GrantApplicationFieldAnswers()
	pii: PIIAnswers | null = null
	milestones: GrantProposedMilestone[] = []
}

export class GrantApplicationUpdate {
	fields: GrantApplicationFieldAnswers | null = null
	pii: PIIAnswers | null = null
	milestones: GrantProposedMilestone[] | null = null
	feedback: string | null = null
}

export class SocialItem {
	name: string = ''
	value: string = ''
}

export class WorkspaceCreateRequest {
	title: string = ''
	bio: string | null = null
	about: string = ''
	partners: Partner[] | null = null
	logoIpfsHash: string = ''
	coverImageIpfsHash: string | null = null
	creatorId: string = ''
	creatorPublicKey: string | null = null
	supportedNetworks: string[] = []
	socials: SocialItem[] = []
}

export class WorkspaceUpdateRequest {
	title: string | null = null
	bio: string | null = null
	about: string | null = null
	logoIpfsHash: string | null = null
	partners: Partner[] | null = null
	coverImageIpfsHash: string | null = null
	socials: SocialItem[] | null = null
	publicKey: string | null = null
	tokens: Token[] | null = null
}

export class ApplicationMilestoneUpdate {
	text: string = ''
}

export class GrantFieldMap {
	applicantName: GrantField = new GrantField()
	applicantEmail: GrantField = new GrantField()
	projectName: GrantField = new GrantField()
	projectDetails: GrantField = new GrantField()
	fundingBreakdown: GrantField | null = null
	additionalProperties: TypedMap<string, GrantField> = new TypedMap()
}

export class GrantReward {
	committed: BigInt = new BigInt(0)
	asset: Bytes = new Bytes(0)
	token: Token | null = null
}

export class ReviewItem {
	rating: BigInt = new BigInt(0)
	note: string | null = null
}

export class Review {
	isApproved: Boolean = new Boolean()
	comment: string | null = null
	evaluation: Review_evaluation = new Review_evaluation()
}

export class Review_evaluation {
	additionalProperties: TypedMap<string, ReviewItem> = new TypedMap()
}

export class ReviewSetRequest {
	reviewer: Bytes = new Bytes(0)
	publicReviewDataHash: string | null = null
	encryptedReview: ReviewSetRequest_encryptedReview = new ReviewSetRequest_encryptedReview()
}

export class ReviewSetRequest_encryptedReview {
	additionalProperties: TypedMap<string, string> = new TypedMap()
}

export class RubricItem {
	title: string = ''
	details: string | null = null
	maximumPoints: BigInt = new BigInt(0)
}

export class Rubric {
	isPrivate: Boolean = new Boolean()
	rubric: Rubric_rubric = new Rubric_rubric()
}

export class Rubric_rubric {
	additionalProperties: TypedMap<string, RubricItem> = new TypedMap()
}

export class RubricSetRequest {
	rubric: Rubric = new Rubric()
}

export class GrantCreateRequest {
	title: string = ''
	summary: string = ''
	details: string = ''
	deadline: Date | null = null
	reward: GrantReward = new GrantReward()
	creatorId: string = ''
	workspaceId: string = ''
	fields: GrantFieldMap = new GrantFieldMap()
	grantManagers: Bytes[] | null = null
}

export class GrantUpdateRequest {
	title: string | null = null
	summary: string | null = null
	details: string | null = null
	deadline: Date | null = null
	reward: GrantReward | null = null
	fields: GrantFieldMap | null = null
	grantManagers: Bytes[] | null = null
}

export function validateError(json: JSONValue): Result<Error> {
const value = new Error()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const statusCodeJson = obj.get('statusCode')
if(!statusCodeJson) return { value: null, error: "Expected 'statusCode' to be present in Error" }
if(statusCodeJson) {
	const statusCodeResult = validateInteger(statusCodeJson, null, BigInt.fromString('505'))
	if(statusCodeResult.error) {
		return { value: null, error: ["Error in mapping 'statusCode': ", statusCodeResult.error!].join('') }
	}
	if(statusCodeResult.value) {
		value.statusCode = statusCodeResult.value!
	}
}
const errorJson = obj.get('error')
if(!errorJson) return { value: null, error: "Expected 'error' to be present in Error" }
if(errorJson) {
	const errorResult = validateString(errorJson, -1, -1, null)
	if(errorResult.error) {
		return { value: null, error: ["Error in mapping 'error': ", errorResult.error!].join('') }
	}
	if(errorResult.value) {
		value.error = errorResult.value!
	}
}
const messageJson = obj.get('message')
if(!messageJson) return { value: null, error: "Expected 'message' to be present in Error" }
if(messageJson) {
	const messageResult = validateString(messageJson, -1, -1, null)
	if(messageResult.error) {
		return { value: null, error: ["Error in mapping 'message': ", messageResult.error!].join('') }
	}
	if(messageResult.value) {
		value.message = messageResult.value!
	}
}
const dataJson = obj.get('data')
if(dataJson) {
	const dataResult = validateError_data(dataJson)
	if(dataResult.error) {
		return { value: null, error: ["Error in mapping 'data': ", dataResult.error!].join('') }
	}
	if(dataResult.value) {
		value.data = dataResult.value!
	}
}
return { value, error: null }
}

export function validateError_data(json: JSONValue): Result<Error_data> {
const value = new Error_data()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
return { value, error: null }
}

export function validateAddress(json: JSONValue): Result<Bytes> {
return validateBytesFromStringResult(validateString(json, 16, 256, null))
}

export function validateAmount(json: JSONValue): Result<BigInt> {
return validateStringResultInteger(validateString(json, -1, 64, null))
}

export function validatePartner(json: JSONValue): Result<Partner> {
const value = new Partner()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const nameJson = obj.get('name')
if(!nameJson) return { value: null, error: "Expected 'name' to be present in Partner" }
if(nameJson) {
	const nameResult = validateString(nameJson, -1, 64, null)
	if(nameResult.error) {
		return { value: null, error: ["Error in mapping 'name': ", nameResult.error!].join('') }
	}
	if(nameResult.value) {
		value.name = nameResult.value!
	}
}
const industryJson = obj.get('industry')
if(!industryJson) return { value: null, error: "Expected 'industry' to be present in Partner" }
if(industryJson) {
	const industryResult = validateString(industryJson, -1, 64, null)
	if(industryResult.error) {
		return { value: null, error: ["Error in mapping 'industry': ", industryResult.error!].join('') }
	}
	if(industryResult.value) {
		value.industry = industryResult.value!
	}
}
const websiteJson = obj.get('website')
if(websiteJson) {
	const websiteResult = validateString(websiteJson, -1, 256, null)
	if(websiteResult.error) {
		return { value: null, error: ["Error in mapping 'website': ", websiteResult.error!].join('') }
	}
	if(websiteResult.value) {
		value.website = websiteResult.value!
	}
}
const partnerImageHashJson = obj.get('partnerImageHash')
if(partnerImageHashJson) {
	const partnerImageHashResult = validateString(partnerImageHashJson, -1, 128, null)
	if(partnerImageHashResult.error) {
		return { value: null, error: ["Error in mapping 'partnerImageHash': ", partnerImageHashResult.error!].join('') }
	}
	if(partnerImageHashResult.value) {
		value.partnerImageHash = partnerImageHashResult.value!
	}
}
return { value, error: null }
}

export function validateToken(json: JSONValue): Result<Token> {
const value = new Token()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const labelJson = obj.get('label')
if(!labelJson) return { value: null, error: "Expected 'label' to be present in Token" }
if(labelJson) {
	const labelResult = validateString(labelJson, -1, 64, null)
	if(labelResult.error) {
		return { value: null, error: ["Error in mapping 'label': ", labelResult.error!].join('') }
	}
	if(labelResult.value) {
		value.label = labelResult.value!
	}
}
const addressJson = obj.get('address')
if(!addressJson) return { value: null, error: "Expected 'address' to be present in Token" }
if(addressJson) {
	const addressResult = validateAddress(addressJson)
	if(addressResult.error) {
		return { value: null, error: ["Error in mapping 'address': ", addressResult.error!].join('') }
	}
	if(addressResult.value) {
		value.address = addressResult.value!
	}
}
const decimalJson = obj.get('decimal')
if(!decimalJson) return { value: null, error: "Expected 'decimal' to be present in Token" }
if(decimalJson) {
	const decimalResult = validateStringResultInteger(validateString(decimalJson, -1, 4, null))
	if(decimalResult.error) {
		return { value: null, error: ["Error in mapping 'decimal': ", decimalResult.error!].join('') }
	}
	if(decimalResult.value) {
		value.decimal = decimalResult.value!
	}
}
const iconHashJson = obj.get('iconHash')
if(!iconHashJson) return { value: null, error: "Expected 'iconHash' to be present in Token" }
if(iconHashJson) {
	const iconHashResult = validateString(iconHashJson, -1, 128, null)
	if(iconHashResult.error) {
		return { value: null, error: ["Error in mapping 'iconHash': ", iconHashResult.error!].join('') }
	}
	if(iconHashResult.value) {
		value.iconHash = iconHashResult.value!
	}
}
return { value, error: null }
}

export function validateSupportedNetwork(json: JSONValue): Result<string> {
return validateString(json, -1, -1, SupportedNetworkEnumSet)
}

export function validateGrantField(json: JSONValue): Result<GrantField> {
const value = new GrantField()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const titleJson = obj.get('title')
if(!titleJson) return { value: null, error: "Expected 'title' to be present in GrantField" }
if(titleJson) {
	const titleResult = validateString(titleJson, -1, 512, null)
	if(titleResult.error) {
		return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
	}
	if(titleResult.value) {
		value.title = titleResult.value!
	}
}
const inputTypeJson = obj.get('inputType')
if(!inputTypeJson) return { value: null, error: "Expected 'inputType' to be present in GrantField" }
if(inputTypeJson) {
	const inputTypeResult = validateString(inputTypeJson, -1, -1, GrantField_inputTypeEnumSet)
	if(inputTypeResult.error) {
		return { value: null, error: ["Error in mapping 'inputType': ", inputTypeResult.error!].join('') }
	}
	if(inputTypeResult.value) {
		value.inputType = inputTypeResult.value!
	}
}
const enumJson = obj.get('enum')
if(enumJson) {
	const enumResult = validateGrantField_enum(enumJson)
	if(enumResult.error) {
		return { value: null, error: ["Error in mapping 'enum': ", enumResult.error!].join('') }
	}
	if(enumResult.value) {
		value.enum = enumResult.value!
	}
}
const piiJson = obj.get('pii')
if(piiJson) {
	const piiResult = validateBoolean(piiJson)
	if(piiResult.error) {
		return { value: null, error: ["Error in mapping 'pii': ", piiResult.error!].join('') }
	}
	if(piiResult.value) {
		value.pii = piiResult.value!
	}
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
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const titleJson = obj.get('title')
if(!titleJson) return { value: null, error: "Expected 'title' to be present in GrantProposedMilestone" }
if(titleJson) {
	const titleResult = validateString(titleJson, -1, 255, null)
	if(titleResult.error) {
		return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
	}
	if(titleResult.value) {
		value.title = titleResult.value!
	}
}
const amountJson = obj.get('amount')
if(!amountJson) return { value: null, error: "Expected 'amount' to be present in GrantProposedMilestone" }
if(amountJson) {
	const amountResult = validateAmount(amountJson)
	if(amountResult.error) {
		return { value: null, error: ["Error in mapping 'amount': ", amountResult.error!].join('') }
	}
	if(amountResult.value) {
		value.amount = amountResult.value!
	}
}
return { value, error: null }
}

export function validateGrantApplicationFieldAnswer(json: JSONValue): Result<GrantApplicationFieldAnswerItem[]> {
return validateArray(json, -1, 100, validateGrantApplicationFieldAnswerItem)
}

export function validateRequiredGrantApplicationFieldAnswer(json: JSONValue): Result<GrantApplicationFieldAnswerItem[]> {
return validateArray(json, 1, 100, validateGrantApplicationFieldAnswerItem)
}

export function validateGrantApplicationFieldAnswerItem(json: JSONValue): Result<GrantApplicationFieldAnswerItem> {
const value = new GrantApplicationFieldAnswerItem()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const valueJson = obj.get('value')
if(!valueJson) return { value: null, error: "Expected 'value' to be present in GrantApplicationFieldAnswerItem" }
if(valueJson) {
	const valueResult = validateString(valueJson, -1, 7000, null)
	if(valueResult.error) {
		return { value: null, error: ["Error in mapping 'value': ", valueResult.error!].join('') }
	}
	if(valueResult.value) {
		value.value = valueResult.value!
	}
}
return { value, error: null }
}

export function validatePIIAnswer(json: JSONValue): Result<string> {
return validateString(json, -1, -1, null)
}

export function validatePIIAnswers(json: JSONValue): Result<PIIAnswers> {
const value = new PIIAnswers()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const addPropertiesResult = validateTypedMap(json, null, validatePIIAnswer)
if(addPropertiesResult.error) {
	return { value: null, error: ['Error in mapping additionalProperties: ', addPropertiesResult.error].join('') }
}
value.additionalProperties = addPropertiesResult.value!

return { value, error: null }
}

export function validateGrantApplicationFieldAnswers(json: JSONValue): Result<GrantApplicationFieldAnswers> {
const value = new GrantApplicationFieldAnswers()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const addPropertiesResult = validateTypedMap(json, null, validateGrantApplicationFieldAnswer)
if(addPropertiesResult.error) {
	return { value: null, error: ['Error in mapping additionalProperties: ', addPropertiesResult.error].join('') }
}
value.additionalProperties = addPropertiesResult.value!

return { value, error: null }
}

export function validateGrantApplicationRequest(json: JSONValue): Result<GrantApplicationRequest> {
const value = new GrantApplicationRequest()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const grantIdJson = obj.get('grantId')
if(!grantIdJson) return { value: null, error: "Expected 'grantId' to be present in GrantApplicationRequest" }
if(grantIdJson) {
	const grantIdResult = validateString(grantIdJson, -1, -1, null)
	if(grantIdResult.error) {
		return { value: null, error: ["Error in mapping 'grantId': ", grantIdResult.error!].join('') }
	}
	if(grantIdResult.value) {
		value.grantId = grantIdResult.value!
	}
}
const applicantIdJson = obj.get('applicantId')
if(!applicantIdJson) return { value: null, error: "Expected 'applicantId' to be present in GrantApplicationRequest" }
if(applicantIdJson) {
	const applicantIdResult = validateOwnerID(applicantIdJson)
	if(applicantIdResult.error) {
		return { value: null, error: ["Error in mapping 'applicantId': ", applicantIdResult.error!].join('') }
	}
	if(applicantIdResult.value) {
		value.applicantId = applicantIdResult.value!
	}
}
const fieldsJson = obj.get('fields')
if(!fieldsJson) return { value: null, error: "Expected 'fields' to be present in GrantApplicationRequest" }
if(fieldsJson) {
	const fieldsResult = validateGrantApplicationFieldAnswers(fieldsJson)
	if(fieldsResult.error) {
		return { value: null, error: ["Error in mapping 'fields': ", fieldsResult.error!].join('') }
	}
	if(fieldsResult.value) {
		value.fields = fieldsResult.value!
	}
}
const piiJson = obj.get('pii')
if(piiJson) {
	const piiResult = validatePIIAnswers(piiJson)
	if(piiResult.error) {
		return { value: null, error: ["Error in mapping 'pii': ", piiResult.error!].join('') }
	}
	if(piiResult.value) {
		value.pii = piiResult.value!
	}
}
const milestonesJson = obj.get('milestones')
if(!milestonesJson) return { value: null, error: "Expected 'milestones' to be present in GrantApplicationRequest" }
if(milestonesJson) {
	const milestonesResult = validateGrantApplicationRequest_milestones(milestonesJson)
	if(milestonesResult.error) {
		return { value: null, error: ["Error in mapping 'milestones': ", milestonesResult.error!].join('') }
	}
	if(milestonesResult.value) {
		value.milestones = milestonesResult.value!
	}
}
return { value, error: null }
}

export function validateGrantApplicationRequest_milestones(json: JSONValue): Result<GrantProposedMilestone[]> {
return validateArray(json, -1, 100, validateGrantProposedMilestone)
}

export function validateGrantApplicationUpdate(json: JSONValue): Result<GrantApplicationUpdate> {
const value = new GrantApplicationUpdate()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const fieldsJson = obj.get('fields')
if(fieldsJson) {
	const fieldsResult = validateGrantApplicationFieldAnswers(fieldsJson)
	if(fieldsResult.error) {
		return { value: null, error: ["Error in mapping 'fields': ", fieldsResult.error!].join('') }
	}
	if(fieldsResult.value) {
		value.fields = fieldsResult.value!
	}
}
const piiJson = obj.get('pii')
if(piiJson) {
	const piiResult = validatePIIAnswers(piiJson)
	if(piiResult.error) {
		return { value: null, error: ["Error in mapping 'pii': ", piiResult.error!].join('') }
	}
	if(piiResult.value) {
		value.pii = piiResult.value!
	}
}
const milestonesJson = obj.get('milestones')
if(milestonesJson) {
	const milestonesResult = validateGrantApplicationUpdate_milestones(milestonesJson)
	if(milestonesResult.error) {
		return { value: null, error: ["Error in mapping 'milestones': ", milestonesResult.error!].join('') }
	}
	if(milestonesResult.value) {
		value.milestones = milestonesResult.value!
	}
}
const feedbackJson = obj.get('feedback')
if(feedbackJson) {
	const feedbackResult = validateString(feedbackJson, 1, 4096, null)
	if(feedbackResult.error) {
		return { value: null, error: ["Error in mapping 'feedback': ", feedbackResult.error!].join('') }
	}
	if(feedbackResult.value) {
		value.feedback = feedbackResult.value!
	}
}
return { value, error: null }
}

export function validateGrantApplicationUpdate_milestones(json: JSONValue): Result<GrantProposedMilestone[]> {
return validateArray(json, -1, 100, validateGrantProposedMilestone)
}

export function validateSocialItem(json: JSONValue): Result<SocialItem> {
const value = new SocialItem()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const nameJson = obj.get('name')
if(!nameJson) return { value: null, error: "Expected 'name' to be present in SocialItem" }
if(nameJson) {
	const nameResult = validateString(nameJson, -1, 64, null)
	if(nameResult.error) {
		return { value: null, error: ["Error in mapping 'name': ", nameResult.error!].join('') }
	}
	if(nameResult.value) {
		value.name = nameResult.value!
	}
}
const valueJson = obj.get('value')
if(!valueJson) return { value: null, error: "Expected 'value' to be present in SocialItem" }
if(valueJson) {
	const valueResult = validateString(valueJson, -1, 255, null)
	if(valueResult.error) {
		return { value: null, error: ["Error in mapping 'value': ", valueResult.error!].join('') }
	}
	if(valueResult.value) {
		value.value = valueResult.value!
	}
}
return { value, error: null }
}

export function validateWorkspaceCreateRequest(json: JSONValue): Result<WorkspaceCreateRequest> {
const value = new WorkspaceCreateRequest()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const titleJson = obj.get('title')
if(!titleJson) return { value: null, error: "Expected 'title' to be present in WorkspaceCreateRequest" }
if(titleJson) {
	const titleResult = validateString(titleJson, -1, 128, null)
	if(titleResult.error) {
		return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
	}
	if(titleResult.value) {
		value.title = titleResult.value!
	}
}
const bioJson = obj.get('bio')
if(bioJson) {
	const bioResult = validateString(bioJson, -1, 200, null)
	if(bioResult.error) {
		return { value: null, error: ["Error in mapping 'bio': ", bioResult.error!].join('') }
	}
	if(bioResult.value) {
		value.bio = bioResult.value!
	}
}
const aboutJson = obj.get('about')
if(!aboutJson) return { value: null, error: "Expected 'about' to be present in WorkspaceCreateRequest" }
if(aboutJson) {
	const aboutResult = validateString(aboutJson, -1, 5000, null)
	if(aboutResult.error) {
		return { value: null, error: ["Error in mapping 'about': ", aboutResult.error!].join('') }
	}
	if(aboutResult.value) {
		value.about = aboutResult.value!
	}
}
const partnersJson = obj.get('partners')
if(partnersJson) {
	const partnersResult = validateWorkspaceCreateRequest_partners(partnersJson)
	if(partnersResult.error) {
		return { value: null, error: ["Error in mapping 'partners': ", partnersResult.error!].join('') }
	}
	if(partnersResult.value) {
		value.partners = partnersResult.value!
	}
}
const logoIpfsHashJson = obj.get('logoIpfsHash')
if(!logoIpfsHashJson) return { value: null, error: "Expected 'logoIpfsHash' to be present in WorkspaceCreateRequest" }
if(logoIpfsHashJson) {
	const logoIpfsHashResult = validateString(logoIpfsHashJson, -1, 128, null)
	if(logoIpfsHashResult.error) {
		return { value: null, error: ["Error in mapping 'logoIpfsHash': ", logoIpfsHashResult.error!].join('') }
	}
	if(logoIpfsHashResult.value) {
		value.logoIpfsHash = logoIpfsHashResult.value!
	}
}
const coverImageIpfsHashJson = obj.get('coverImageIpfsHash')
if(coverImageIpfsHashJson) {
	const coverImageIpfsHashResult = validateString(coverImageIpfsHashJson, -1, 128, null)
	if(coverImageIpfsHashResult.error) {
		return { value: null, error: ["Error in mapping 'coverImageIpfsHash': ", coverImageIpfsHashResult.error!].join('') }
	}
	if(coverImageIpfsHashResult.value) {
		value.coverImageIpfsHash = coverImageIpfsHashResult.value!
	}
}
const creatorIdJson = obj.get('creatorId')
if(!creatorIdJson) return { value: null, error: "Expected 'creatorId' to be present in WorkspaceCreateRequest" }
if(creatorIdJson) {
	const creatorIdResult = validateOwnerID(creatorIdJson)
	if(creatorIdResult.error) {
		return { value: null, error: ["Error in mapping 'creatorId': ", creatorIdResult.error!].join('') }
	}
	if(creatorIdResult.value) {
		value.creatorId = creatorIdResult.value!
	}
}
const creatorPublicKeyJson = obj.get('creatorPublicKey')
if(creatorPublicKeyJson) {
	const creatorPublicKeyResult = validatePublicKey(creatorPublicKeyJson)
	if(creatorPublicKeyResult.error) {
		return { value: null, error: ["Error in mapping 'creatorPublicKey': ", creatorPublicKeyResult.error!].join('') }
	}
	if(creatorPublicKeyResult.value) {
		value.creatorPublicKey = creatorPublicKeyResult.value!
	}
}
const supportedNetworksJson = obj.get('supportedNetworks')
if(!supportedNetworksJson) return { value: null, error: "Expected 'supportedNetworks' to be present in WorkspaceCreateRequest" }
if(supportedNetworksJson) {
	const supportedNetworksResult = validateWorkspaceCreateRequest_supportedNetworks(supportedNetworksJson)
	if(supportedNetworksResult.error) {
		return { value: null, error: ["Error in mapping 'supportedNetworks': ", supportedNetworksResult.error!].join('') }
	}
	if(supportedNetworksResult.value) {
		value.supportedNetworks = supportedNetworksResult.value!
	}
}
const socialsJson = obj.get('socials')
if(!socialsJson) return { value: null, error: "Expected 'socials' to be present in WorkspaceCreateRequest" }
if(socialsJson) {
	const socialsResult = validateWorkspaceCreateRequest_socials(socialsJson)
	if(socialsResult.error) {
		return { value: null, error: ["Error in mapping 'socials': ", socialsResult.error!].join('') }
	}
	if(socialsResult.value) {
		value.socials = socialsResult.value!
	}
}
return { value, error: null }
}

export function validateWorkspaceCreateRequest_partners(json: JSONValue): Result<Partner[]> {
return validateArray(json, -1, -1, validatePartner)
}

export function validateWorkspaceCreateRequest_supportedNetworks(json: JSONValue): Result<string[]> {
return validateArray(json, -1, 25, validateSupportedNetwork)
}

export function validateWorkspaceCreateRequest_socials(json: JSONValue): Result<SocialItem[]> {
return validateArray(json, -1, 10, validateSocialItem)
}

export function validatePublicKey(json: JSONValue): Result<string> {
return validateString(json, -1, 255, null)
}

export function validateWorkspaceUpdateRequest(json: JSONValue): Result<WorkspaceUpdateRequest> {
const value = new WorkspaceUpdateRequest()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const titleJson = obj.get('title')
if(titleJson) {
	const titleResult = validateString(titleJson, -1, 128, null)
	if(titleResult.error) {
		return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
	}
	if(titleResult.value) {
		value.title = titleResult.value!
	}
}
const bioJson = obj.get('bio')
if(bioJson) {
	const bioResult = validateString(bioJson, -1, 200, null)
	if(bioResult.error) {
		return { value: null, error: ["Error in mapping 'bio': ", bioResult.error!].join('') }
	}
	if(bioResult.value) {
		value.bio = bioResult.value!
	}
}
const aboutJson = obj.get('about')
if(aboutJson) {
	const aboutResult = validateString(aboutJson, -1, 5000, null)
	if(aboutResult.error) {
		return { value: null, error: ["Error in mapping 'about': ", aboutResult.error!].join('') }
	}
	if(aboutResult.value) {
		value.about = aboutResult.value!
	}
}
const logoIpfsHashJson = obj.get('logoIpfsHash')
if(logoIpfsHashJson) {
	const logoIpfsHashResult = validateString(logoIpfsHashJson, -1, 128, null)
	if(logoIpfsHashResult.error) {
		return { value: null, error: ["Error in mapping 'logoIpfsHash': ", logoIpfsHashResult.error!].join('') }
	}
	if(logoIpfsHashResult.value) {
		value.logoIpfsHash = logoIpfsHashResult.value!
	}
}
const partnersJson = obj.get('partners')
if(partnersJson) {
	const partnersResult = validateWorkspaceUpdateRequest_partners(partnersJson)
	if(partnersResult.error) {
		return { value: null, error: ["Error in mapping 'partners': ", partnersResult.error!].join('') }
	}
	if(partnersResult.value) {
		value.partners = partnersResult.value!
	}
}
const coverImageIpfsHashJson = obj.get('coverImageIpfsHash')
if(coverImageIpfsHashJson) {
	const coverImageIpfsHashResult = validateString(coverImageIpfsHashJson, -1, 128, null)
	if(coverImageIpfsHashResult.error) {
		return { value: null, error: ["Error in mapping 'coverImageIpfsHash': ", coverImageIpfsHashResult.error!].join('') }
	}
	if(coverImageIpfsHashResult.value) {
		value.coverImageIpfsHash = coverImageIpfsHashResult.value!
	}
}
const socialsJson = obj.get('socials')
if(socialsJson) {
	const socialsResult = validateWorkspaceUpdateRequest_socials(socialsJson)
	if(socialsResult.error) {
		return { value: null, error: ["Error in mapping 'socials': ", socialsResult.error!].join('') }
	}
	if(socialsResult.value) {
		value.socials = socialsResult.value!
	}
}
const publicKeyJson = obj.get('publicKey')
if(publicKeyJson) {
	const publicKeyResult = validatePublicKey(publicKeyJson)
	if(publicKeyResult.error) {
		return { value: null, error: ["Error in mapping 'publicKey': ", publicKeyResult.error!].join('') }
	}
	if(publicKeyResult.value) {
		value.publicKey = publicKeyResult.value!
	}
}
const tokensJson = obj.get('tokens')
if(tokensJson) {
	const tokensResult = validateWorkspaceUpdateRequest_tokens(tokensJson)
	if(tokensResult.error) {
		return { value: null, error: ["Error in mapping 'tokens': ", tokensResult.error!].join('') }
	}
	if(tokensResult.value) {
		value.tokens = tokensResult.value!
	}
}
return { value, error: null }
}

export function validateWorkspaceUpdateRequest_partners(json: JSONValue): Result<Partner[]> {
return validateArray(json, -1, -1, validatePartner)
}

export function validateWorkspaceUpdateRequest_socials(json: JSONValue): Result<SocialItem[]> {
return validateArray(json, -1, 10, validateSocialItem)
}

export function validateWorkspaceUpdateRequest_tokens(json: JSONValue): Result<Token[]> {
return validateArray(json, -1, -1, validateToken)
}

export function validateApplicationMilestoneUpdate(json: JSONValue): Result<ApplicationMilestoneUpdate> {
const value = new ApplicationMilestoneUpdate()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const textJson = obj.get('text')
if(!textJson) return { value: null, error: "Expected 'text' to be present in ApplicationMilestoneUpdate" }
if(textJson) {
	const textResult = validateString(textJson, -1, 4096, null)
	if(textResult.error) {
		return { value: null, error: ["Error in mapping 'text': ", textResult.error!].join('') }
	}
	if(textResult.value) {
		value.text = textResult.value!
	}
}
return { value, error: null }
}

export function validateGrantFieldMap(json: JSONValue): Result<GrantFieldMap> {
const value = new GrantFieldMap()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const addPropertiesResult = validateTypedMap(json, GrantFieldMapPropertiesSet, validateGrantField)
if(addPropertiesResult.error) {
	return { value: null, error: ['Error in mapping additionalProperties: ', addPropertiesResult.error].join('') }
}
value.additionalProperties = addPropertiesResult.value!

const applicantNameJson = obj.get('applicantName')
if(!applicantNameJson) return { value: null, error: "Expected 'applicantName' to be present in GrantFieldMap" }
if(applicantNameJson) {
	const applicantNameResult = validateGrantField(applicantNameJson)
	if(applicantNameResult.error) {
		return { value: null, error: ["Error in mapping 'applicantName': ", applicantNameResult.error!].join('') }
	}
	if(applicantNameResult.value) {
		value.applicantName = applicantNameResult.value!
	}
}
const applicantEmailJson = obj.get('applicantEmail')
if(!applicantEmailJson) return { value: null, error: "Expected 'applicantEmail' to be present in GrantFieldMap" }
if(applicantEmailJson) {
	const applicantEmailResult = validateGrantField(applicantEmailJson)
	if(applicantEmailResult.error) {
		return { value: null, error: ["Error in mapping 'applicantEmail': ", applicantEmailResult.error!].join('') }
	}
	if(applicantEmailResult.value) {
		value.applicantEmail = applicantEmailResult.value!
	}
}
const projectNameJson = obj.get('projectName')
if(!projectNameJson) return { value: null, error: "Expected 'projectName' to be present in GrantFieldMap" }
if(projectNameJson) {
	const projectNameResult = validateGrantField(projectNameJson)
	if(projectNameResult.error) {
		return { value: null, error: ["Error in mapping 'projectName': ", projectNameResult.error!].join('') }
	}
	if(projectNameResult.value) {
		value.projectName = projectNameResult.value!
	}
}
const projectDetailsJson = obj.get('projectDetails')
if(!projectDetailsJson) return { value: null, error: "Expected 'projectDetails' to be present in GrantFieldMap" }
if(projectDetailsJson) {
	const projectDetailsResult = validateGrantField(projectDetailsJson)
	if(projectDetailsResult.error) {
		return { value: null, error: ["Error in mapping 'projectDetails': ", projectDetailsResult.error!].join('') }
	}
	if(projectDetailsResult.value) {
		value.projectDetails = projectDetailsResult.value!
	}
}
const fundingBreakdownJson = obj.get('fundingBreakdown')
if(fundingBreakdownJson) {
	const fundingBreakdownResult = validateGrantField(fundingBreakdownJson)
	if(fundingBreakdownResult.error) {
		return { value: null, error: ["Error in mapping 'fundingBreakdown': ", fundingBreakdownResult.error!].join('') }
	}
	if(fundingBreakdownResult.value) {
		value.fundingBreakdown = fundingBreakdownResult.value!
	}
}
return { value, error: null }
}

export function validateGrantReward(json: JSONValue): Result<GrantReward> {
const value = new GrantReward()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const committedJson = obj.get('committed')
if(!committedJson) return { value: null, error: "Expected 'committed' to be present in GrantReward" }
if(committedJson) {
	const committedResult = validateAmount(committedJson)
	if(committedResult.error) {
		return { value: null, error: ["Error in mapping 'committed': ", committedResult.error!].join('') }
	}
	if(committedResult.value) {
		value.committed = committedResult.value!
	}
}
const assetJson = obj.get('asset')
if(!assetJson) return { value: null, error: "Expected 'asset' to be present in GrantReward" }
if(assetJson) {
	const assetResult = validateAddress(assetJson)
	if(assetResult.error) {
		return { value: null, error: ["Error in mapping 'asset': ", assetResult.error!].join('') }
	}
	if(assetResult.value) {
		value.asset = assetResult.value!
	}
}
const tokenJson = obj.get('token')
if(tokenJson) {
	const tokenResult = validateToken(tokenJson)
	if(tokenResult.error) {
		return { value: null, error: ["Error in mapping 'token': ", tokenResult.error!].join('') }
	}
	if(tokenResult.value) {
		value.token = tokenResult.value!
	}
}
return { value, error: null }
}

export function validateReviewItem(json: JSONValue): Result<ReviewItem> {
const value = new ReviewItem()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const ratingJson = obj.get('rating')
if(!ratingJson) return { value: null, error: "Expected 'rating' to be present in ReviewItem" }
if(ratingJson) {
	const ratingResult = validateInteger(ratingJson, null, null)
	if(ratingResult.error) {
		return { value: null, error: ["Error in mapping 'rating': ", ratingResult.error!].join('') }
	}
	if(ratingResult.value) {
		value.rating = ratingResult.value!
	}
}
const noteJson = obj.get('note')
if(noteJson) {
	const noteResult = validateString(noteJson, -1, 7000, null)
	if(noteResult.error) {
		return { value: null, error: ["Error in mapping 'note': ", noteResult.error!].join('') }
	}
	if(noteResult.value) {
		value.note = noteResult.value!
	}
}
return { value, error: null }
}

export function validateReview(json: JSONValue): Result<Review> {
const value = new Review()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const isApprovedJson = obj.get('isApproved')
if(!isApprovedJson) return { value: null, error: "Expected 'isApproved' to be present in Review" }
if(isApprovedJson) {
	const isApprovedResult = validateBoolean(isApprovedJson)
	if(isApprovedResult.error) {
		return { value: null, error: ["Error in mapping 'isApproved': ", isApprovedResult.error!].join('') }
	}
	if(isApprovedResult.value) {
		value.isApproved = isApprovedResult.value!
	}
}
const commentJson = obj.get('comment')
if(commentJson) {
	const commentResult = validateString(commentJson, 1, -1, null)
	if(commentResult.error) {
		return { value: null, error: ["Error in mapping 'comment': ", commentResult.error!].join('') }
	}
	if(commentResult.value) {
		value.comment = commentResult.value!
	}
}
const evaluationJson = obj.get('evaluation')
if(!evaluationJson) return { value: null, error: "Expected 'evaluation' to be present in Review" }
if(evaluationJson) {
	const evaluationResult = validateReview_evaluation(evaluationJson)
	if(evaluationResult.error) {
		return { value: null, error: ["Error in mapping 'evaluation': ", evaluationResult.error!].join('') }
	}
	if(evaluationResult.value) {
		value.evaluation = evaluationResult.value!
	}
}
return { value, error: null }
}

export function validateReview_evaluation(json: JSONValue): Result<Review_evaluation> {
const value = new Review_evaluation()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const addPropertiesResult = validateTypedMap(json, null, validateReviewItem)
if(addPropertiesResult.error) {
	return { value: null, error: ['Error in mapping additionalProperties: ', addPropertiesResult.error].join('') }
}
value.additionalProperties = addPropertiesResult.value!

return { value, error: null }
}

export function validateReviewSetRequest(json: JSONValue): Result<ReviewSetRequest> {
const value = new ReviewSetRequest()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const reviewerJson = obj.get('reviewer')
if(!reviewerJson) return { value: null, error: "Expected 'reviewer' to be present in ReviewSetRequest" }
if(reviewerJson) {
	const reviewerResult = validateAddress(reviewerJson)
	if(reviewerResult.error) {
		return { value: null, error: ["Error in mapping 'reviewer': ", reviewerResult.error!].join('') }
	}
	if(reviewerResult.value) {
		value.reviewer = reviewerResult.value!
	}
}
const publicReviewDataHashJson = obj.get('publicReviewDataHash')
if(publicReviewDataHashJson) {
	const publicReviewDataHashResult = validateString(publicReviewDataHashJson, -1, 255, null)
	if(publicReviewDataHashResult.error) {
		return { value: null, error: ["Error in mapping 'publicReviewDataHash': ", publicReviewDataHashResult.error!].join('') }
	}
	if(publicReviewDataHashResult.value) {
		value.publicReviewDataHash = publicReviewDataHashResult.value!
	}
}
const encryptedReviewJson = obj.get('encryptedReview')
if(!encryptedReviewJson) return { value: null, error: "Expected 'encryptedReview' to be present in ReviewSetRequest" }
if(encryptedReviewJson) {
	const encryptedReviewResult = validateReviewSetRequest_encryptedReview(encryptedReviewJson)
	if(encryptedReviewResult.error) {
		return { value: null, error: ["Error in mapping 'encryptedReview': ", encryptedReviewResult.error!].join('') }
	}
	if(encryptedReviewResult.value) {
		value.encryptedReview = encryptedReviewResult.value!
	}
}
return { value, error: null }
}

export function validateReviewSetRequest_encryptedReview(json: JSONValue): Result<ReviewSetRequest_encryptedReview> {
const value = new ReviewSetRequest_encryptedReview()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const addPropertiesResult = validateTypedMap(json, null, validateReviewSetRequest_encryptedReviewAdditionalProperties)
if(addPropertiesResult.error) {
	return { value: null, error: ['Error in mapping additionalProperties: ', addPropertiesResult.error].join('') }
}
value.additionalProperties = addPropertiesResult.value!

return { value, error: null }
}

export function validateReviewSetRequest_encryptedReviewAdditionalProperties(json: JSONValue): Result<string> {
return validateString(json, -1, 255, null)
}

export function validateRubricItem(json: JSONValue): Result<RubricItem> {
const value = new RubricItem()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const titleJson = obj.get('title')
if(!titleJson) return { value: null, error: "Expected 'title' to be present in RubricItem" }
if(titleJson) {
	const titleResult = validateString(titleJson, -1, 1024, null)
	if(titleResult.error) {
		return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
	}
	if(titleResult.value) {
		value.title = titleResult.value!
	}
}
const detailsJson = obj.get('details')
if(detailsJson) {
	const detailsResult = validateString(detailsJson, -1, 6000, null)
	if(detailsResult.error) {
		return { value: null, error: ["Error in mapping 'details': ", detailsResult.error!].join('') }
	}
	if(detailsResult.value) {
		value.details = detailsResult.value!
	}
}
const maximumPointsJson = obj.get('maximumPoints')
if(!maximumPointsJson) return { value: null, error: "Expected 'maximumPoints' to be present in RubricItem" }
if(maximumPointsJson) {
	const maximumPointsResult = validateInteger(maximumPointsJson, BigInt.fromString('1'), BigInt.fromString('10'))
	if(maximumPointsResult.error) {
		return { value: null, error: ["Error in mapping 'maximumPoints': ", maximumPointsResult.error!].join('') }
	}
	if(maximumPointsResult.value) {
		value.maximumPoints = maximumPointsResult.value!
	}
}
return { value, error: null }
}

export function validateRubric(json: JSONValue): Result<Rubric> {
const value = new Rubric()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const isPrivateJson = obj.get('isPrivate')
if(!isPrivateJson) return { value: null, error: "Expected 'isPrivate' to be present in Rubric" }
if(isPrivateJson) {
	const isPrivateResult = validateBoolean(isPrivateJson)
	if(isPrivateResult.error) {
		return { value: null, error: ["Error in mapping 'isPrivate': ", isPrivateResult.error!].join('') }
	}
	if(isPrivateResult.value) {
		value.isPrivate = isPrivateResult.value!
	}
}
const rubricJson = obj.get('rubric')
if(!rubricJson) return { value: null, error: "Expected 'rubric' to be present in Rubric" }
if(rubricJson) {
	const rubricResult = validateRubric_rubric(rubricJson)
	if(rubricResult.error) {
		return { value: null, error: ["Error in mapping 'rubric': ", rubricResult.error!].join('') }
	}
	if(rubricResult.value) {
		value.rubric = rubricResult.value!
	}
}
return { value, error: null }
}

export function validateRubric_rubric(json: JSONValue): Result<Rubric_rubric> {
const value = new Rubric_rubric()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const addPropertiesResult = validateTypedMap(json, null, validateRubricItem)
if(addPropertiesResult.error) {
	return { value: null, error: ['Error in mapping additionalProperties: ', addPropertiesResult.error].join('') }
}
value.additionalProperties = addPropertiesResult.value!

return { value, error: null }
}

export function validateRubricSetRequest(json: JSONValue): Result<RubricSetRequest> {
const value = new RubricSetRequest()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const rubricJson = obj.get('rubric')
if(!rubricJson) return { value: null, error: "Expected 'rubric' to be present in RubricSetRequest" }
if(rubricJson) {
	const rubricResult = validateRubric(rubricJson)
	if(rubricResult.error) {
		return { value: null, error: ["Error in mapping 'rubric': ", rubricResult.error!].join('') }
	}
	if(rubricResult.value) {
		value.rubric = rubricResult.value!
	}
}
return { value, error: null }
}

export function validateGrantCreateRequest(json: JSONValue): Result<GrantCreateRequest> {
const value = new GrantCreateRequest()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const titleJson = obj.get('title')
if(!titleJson) return { value: null, error: "Expected 'title' to be present in GrantCreateRequest" }
if(titleJson) {
	const titleResult = validateString(titleJson, -1, 255, null)
	if(titleResult.error) {
		return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
	}
	if(titleResult.value) {
		value.title = titleResult.value!
	}
}
const summaryJson = obj.get('summary')
if(!summaryJson) return { value: null, error: "Expected 'summary' to be present in GrantCreateRequest" }
if(summaryJson) {
	const summaryResult = validateString(summaryJson, -1, 1024, null)
	if(summaryResult.error) {
		return { value: null, error: ["Error in mapping 'summary': ", summaryResult.error!].join('') }
	}
	if(summaryResult.value) {
		value.summary = summaryResult.value!
	}
}
const detailsJson = obj.get('details')
if(!detailsJson) return { value: null, error: "Expected 'details' to be present in GrantCreateRequest" }
if(detailsJson) {
	const detailsResult = validateString(detailsJson, -1, 4096, null)
	if(detailsResult.error) {
		return { value: null, error: ["Error in mapping 'details': ", detailsResult.error!].join('') }
	}
	if(detailsResult.value) {
		value.details = detailsResult.value!
	}
}
const deadlineJson = obj.get('deadline')
if(deadlineJson) {
	const deadlineResult = validateDateTimeFromStringResult(validateString(deadlineJson, -1, 128, null))
	if(deadlineResult.error) {
		return { value: null, error: ["Error in mapping 'deadline': ", deadlineResult.error!].join('') }
	}
	if(deadlineResult.value) {
		value.deadline = deadlineResult.value!
	}
}
const rewardJson = obj.get('reward')
if(!rewardJson) return { value: null, error: "Expected 'reward' to be present in GrantCreateRequest" }
if(rewardJson) {
	const rewardResult = validateGrantReward(rewardJson)
	if(rewardResult.error) {
		return { value: null, error: ["Error in mapping 'reward': ", rewardResult.error!].join('') }
	}
	if(rewardResult.value) {
		value.reward = rewardResult.value!
	}
}
const creatorIdJson = obj.get('creatorId')
if(!creatorIdJson) return { value: null, error: "Expected 'creatorId' to be present in GrantCreateRequest" }
if(creatorIdJson) {
	const creatorIdResult = validateOwnerID(creatorIdJson)
	if(creatorIdResult.error) {
		return { value: null, error: ["Error in mapping 'creatorId': ", creatorIdResult.error!].join('') }
	}
	if(creatorIdResult.value) {
		value.creatorId = creatorIdResult.value!
	}
}
const workspaceIdJson = obj.get('workspaceId')
if(!workspaceIdJson) return { value: null, error: "Expected 'workspaceId' to be present in GrantCreateRequest" }
if(workspaceIdJson) {
	const workspaceIdResult = validateString(workspaceIdJson, -1, 128, null)
	if(workspaceIdResult.error) {
		return { value: null, error: ["Error in mapping 'workspaceId': ", workspaceIdResult.error!].join('') }
	}
	if(workspaceIdResult.value) {
		value.workspaceId = workspaceIdResult.value!
	}
}
const fieldsJson = obj.get('fields')
if(!fieldsJson) return { value: null, error: "Expected 'fields' to be present in GrantCreateRequest" }
if(fieldsJson) {
	const fieldsResult = validateGrantFieldMap(fieldsJson)
	if(fieldsResult.error) {
		return { value: null, error: ["Error in mapping 'fields': ", fieldsResult.error!].join('') }
	}
	if(fieldsResult.value) {
		value.fields = fieldsResult.value!
	}
}
const grantManagersJson = obj.get('grantManagers')
if(grantManagersJson) {
	const grantManagersResult = validateGrantCreateRequest_grantManagers(grantManagersJson)
	if(grantManagersResult.error) {
		return { value: null, error: ["Error in mapping 'grantManagers': ", grantManagersResult.error!].join('') }
	}
	if(grantManagersResult.value) {
		value.grantManagers = grantManagersResult.value!
	}
}
return { value, error: null }
}

export function validateGrantCreateRequest_grantManagers(json: JSONValue): Result<Bytes[]> {
return validateArray(json, 1, -1, validateAddress)
}

export function validateGrantUpdateRequest(json: JSONValue): Result<GrantUpdateRequest> {
const value = new GrantUpdateRequest()
const objResult = validateObject(json)
if(objResult.error) {
	return { value: null, error: objResult.error }
}
const obj = objResult.value!
const titleJson = obj.get('title')
if(titleJson) {
	const titleResult = validateString(titleJson, -1, 255, null)
	if(titleResult.error) {
		return { value: null, error: ["Error in mapping 'title': ", titleResult.error!].join('') }
	}
	if(titleResult.value) {
		value.title = titleResult.value!
	}
}
const summaryJson = obj.get('summary')
if(summaryJson) {
	const summaryResult = validateString(summaryJson, -1, 1024, null)
	if(summaryResult.error) {
		return { value: null, error: ["Error in mapping 'summary': ", summaryResult.error!].join('') }
	}
	if(summaryResult.value) {
		value.summary = summaryResult.value!
	}
}
const detailsJson = obj.get('details')
if(detailsJson) {
	const detailsResult = validateString(detailsJson, -1, 4096, null)
	if(detailsResult.error) {
		return { value: null, error: ["Error in mapping 'details': ", detailsResult.error!].join('') }
	}
	if(detailsResult.value) {
		value.details = detailsResult.value!
	}
}
const deadlineJson = obj.get('deadline')
if(deadlineJson) {
	const deadlineResult = validateDateTimeFromStringResult(validateString(deadlineJson, -1, 128, null))
	if(deadlineResult.error) {
		return { value: null, error: ["Error in mapping 'deadline': ", deadlineResult.error!].join('') }
	}
	if(deadlineResult.value) {
		value.deadline = deadlineResult.value!
	}
}
const rewardJson = obj.get('reward')
if(rewardJson) {
	const rewardResult = validateGrantReward(rewardJson)
	if(rewardResult.error) {
		return { value: null, error: ["Error in mapping 'reward': ", rewardResult.error!].join('') }
	}
	if(rewardResult.value) {
		value.reward = rewardResult.value!
	}
}
const fieldsJson = obj.get('fields')
if(fieldsJson) {
	const fieldsResult = validateGrantFieldMap(fieldsJson)
	if(fieldsResult.error) {
		return { value: null, error: ["Error in mapping 'fields': ", fieldsResult.error!].join('') }
	}
	if(fieldsResult.value) {
		value.fields = fieldsResult.value!
	}
}
const grantManagersJson = obj.get('grantManagers')
if(grantManagersJson) {
	const grantManagersResult = validateGrantUpdateRequest_grantManagers(grantManagersJson)
	if(grantManagersResult.error) {
		return { value: null, error: ["Error in mapping 'grantManagers': ", grantManagersResult.error!].join('') }
	}
	if(grantManagersResult.value) {
		value.grantManagers = grantManagersResult.value!
	}
}
return { value, error: null }
}

export function validateGrantUpdateRequest_grantManagers(json: JSONValue): Result<Bytes[]> {
return validateArray(json, 1, -1, validateAddress)
}

export function validateOwnerID(json: JSONValue): Result<string> {
return validateString(json, 16, 255, null)
}
