import { Bytes, dataSource, json, log } from '@graphprotocol/graph-ts'
import { PIICollection, PIIData } from '../generated/schema'
import { validatePrivateCommentAddRequest } from './json-schema'

export function handlePIICollection(content: Bytes): void {
	log.info(
		`File data source for PII data collection found at ${dataSource.stringParam()}`,
		[]
	)
	const piiCollection = new PIICollection(dataSource.stringParam())

	const jsonDataResult = json.try_fromBytes(content)
	if(!jsonDataResult.isOk) {
		log.warning(
			`Invalid JSON: File data source for PII data collection found invalid JSON at ${dataSource.stringParam()}`,
			[]
		)
	}

	if(!jsonDataResult.value) {
		log.warning(
			`Null JSON: File data source for PII data collection didn't find value at ${dataSource.stringParam()}`,
			[]
		)
	} else {
		const result = validatePrivateCommentAddRequest(jsonDataResult.value)
		if(result) {
			const context = dataSource.context()
			if(result.value == null) {
				log.warning(
					`[${dataSource.stringParam()}] No PII data found in private comment`,
					[]
				)
			}

			const encryptedCommentPiiDataList = result.value!.pii
				.additionalProperties.entries
			const items: string[] = []
			if(encryptedCommentPiiDataList) {
				log.info(
					`[${dataSource.stringParam()}] Found {} encrypted comment PII data`,
					[encryptedCommentPiiDataList.length.toString()]
				)
				for(let i = 0; i < encryptedCommentPiiDataList.length; i++) {
					const encryptedCommentEntity = new PIIData(
						`${context.getString('transactionHashHex')}.${
							encryptedCommentPiiDataList[i].key
						}.${context.getString('transactionHashHex')}`
					)

					encryptedCommentEntity.data =
						encryptedCommentPiiDataList[i].value
					encryptedCommentEntity.save()
					items.push(encryptedCommentEntity.id)
				}

				piiCollection.collection = items
			}
		}

		piiCollection.save()
	}
}
