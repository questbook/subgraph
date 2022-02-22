import { BigDecimal, BigInt, JSONValue, JSONValueKind } from "@graphprotocol/graph-ts"
import { ApplicationMilestone } from "../../generated/schema"
import { setEntityValueSafe, Result, setEntityStringSafe } from "./json"

export function milestoneFromJSONValue(json: JSONValue, applicationId: string, index: i32): Result<ApplicationMilestone> {
	const objResult = json.toObject()
	
	const milestone = new ApplicationMilestone(`${applicationId}.${index}.milestone`)
	milestone.state = 'submitted'

	let result = setEntityStringSafe(milestone, 'title', objResult, { maxLength: 255 })
	if(result.error) return result

	result = setEntityValueSafe(milestone, 'amount', objResult, JSONValueKind.NUMBER)
	if(result.error) return result

	milestone.amountPaid = BigInt.fromI32(0)

	return { value: milestone, error: null }
}