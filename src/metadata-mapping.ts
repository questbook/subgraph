import { Bytes, dataSource, log } from '@graphprotocol/graph-ts'
import { PIICollection, PIIData, WorkspaceMetadata } from '../generated/schema'
import { validatedContent } from './json-schema/content-validator'
import { mapWorkspacePartners, mapWorkspaceSocials, mapWorkspaceSupportedNetworks } from './utils/generics'
import { PrivateCommentAddRequest, validatePrivateCommentAddRequest, validateWorkspaceCreateRequest, WorkspaceCreateRequest } from './json-schema'

export function handlePIICollection(content: Bytes): void {
	log.info(`File data source for PII data collection found at ${dataSource.stringParam()}`, [])
	const piiCollection = new PIICollection(dataSource.stringParam())

	const result = validatedContent<PrivateCommentAddRequest>(content, validatePrivateCommentAddRequest)
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
		
		piiCollection.save()
	}	
}

export function handleWorkspaceMetadata(content: Bytes): void {
	log.info(`File data source for workspace metadata found at ${dataSource.stringParam()}`, [])
	const hash = dataSource.stringParam()
	const workspaceMetadataEntity = new WorkspaceMetadata(hash)

	const result = validatedContent<WorkspaceCreateRequest>(content, validateWorkspaceCreateRequest)
	const json = result.value
	if(json) {
		const context = dataSource.context()

		workspaceMetadataEntity.title = json.title
		workspaceMetadataEntity.about = json.about
		if(json.bio) {
			workspaceMetadataEntity.bio = json.bio!
		} 

		workspaceMetadataEntity.logoIpfsHash = json.logoIpfsHash
		workspaceMetadataEntity.coverImageIpfsHash = json.coverImageIpfsHash
		if(json.partners) {
			workspaceMetadataEntity.partners = mapWorkspacePartners(context.getString('workspaceId'), json.partners!)
		} else {
			workspaceMetadataEntity.partners = []
		}

		workspaceMetadataEntity.supportedNetworks = mapWorkspaceSupportedNetworks(json.supportedNetworks)
		workspaceMetadataEntity.socials = mapWorkspaceSocials(context.getString('workspaceId'), json.socials)

		workspaceMetadataEntity.save()
	}
}
