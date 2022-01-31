import { BigDecimal, JSONValue, JSONValueKind } from "@graphprotocol/graph-ts"
import { ApplicationMilestone } from "../../generated/schema"
import { setEntityValueSafe, Result } from "./json"

export function milestoneFromJSONValue(json: JSONValue, applicationId: string, index: i32): Result<ApplicationMilestone> {
	const objResult = json.toObject()
	
	const milestone = new ApplicationMilestone(`${applicationId}.${index}.milestone`)
	milestone.state = 'submitted'

	let result = setEntityValueSafe(milestone, 'title', objResult, JSONValueKind.STRING)
	if(result.error) return result

	result = setEntityValueSafe(milestone, 'amount', objResult, JSONValueKind.NUMBER)
	if(result.error) return result

	milestone.amountPaid = BigDecimal.fromString('0')

	return { value: milestone, error: null }
}