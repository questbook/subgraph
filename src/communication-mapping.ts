import { DataSourceContext, log } from '@graphprotocol/graph-ts'
import { CommentAdded, EmailAdded } from '../generated/QBCommunicationContract/QBCommunicationContract'
import { Comment, GrantApplication, PIIData } from '../generated/schema'
import { PIICollection as PIICollectionTemplate } from '../generated/templates'
import { validatedJsonFromIpfs } from './json-schema/json'
import { addCommentAddedNotification } from './utils/notifications'
import { PrivateCommentAddRequest, validatePrivateCommentAddRequest } from './json-schema'

export function handleCommentAdded(event: CommentAdded): void {
	const workspaceId = event.params.workspaceId.toHex()
	const grantAddress = event.params.grantAddress.toHex()
	const applicationId = event.params.applicationId.toHex()
	const isPrivate = event.params.isPrivate
	const commentMetadataHash = event.params.commentMetadataHash
	const sender = event.params.sender.toHex()
	const timestamp = event.params.timestamp.toI32()

	const application = GrantApplication.load(applicationId)
	if(!application) {
		log.warning(`[${event.transaction.hash}] Application with ID "${applicationId}" not found`, [])
		return
	}

	const commentEntity = new Comment(`${event.transaction.hash.toHex()}.${sender}.${applicationId}`)
	
	commentEntity.workspace = workspaceId
	commentEntity.grant = grantAddress
	commentEntity.application = applicationId
	commentEntity.createdBy = event.params.sender
	commentEntity.isPrivate = isPrivate
	commentEntity.createdAt = timestamp

	if(isPrivate) {
		// this mechanism exists to prevent IPFS calls while testing
		// since IPFS is not supported on matchstick as of now
		if(commentMetadataHash.slice(0, 5) == 'json:') {

			const result = validatedJsonFromIpfs<PrivateCommentAddRequest>(commentMetadataHash, validatePrivateCommentAddRequest)
	
			if(result) {
				if(result.value == null) {
					log.warning(`[${event.transaction.hash.toHex()}] No PII data found in private comment`, [])
					return
				}
	
				const encryptedCommentPiiDataList = result.value!.pii.additionalProperties.entries
				const items: string[] = []
				if(encryptedCommentPiiDataList) {
					log.info(`[${event.transaction.hash.toHex()}] Found {} encrypted comment PII data`, [encryptedCommentPiiDataList.length.toString()])
					for(let i=0; i<encryptedCommentPiiDataList.length; i++) {
						const encryptedCommentEntity = new PIIData(`${event.transaction.hash.toHex()}.${encryptedCommentPiiDataList[i].key}.${applicationId}`)
	
						encryptedCommentEntity.data = encryptedCommentPiiDataList[i].value
						encryptedCommentEntity.save()
						items.push(encryptedCommentEntity.id)
					}
	
					commentEntity.commentsEncryptedData = items
				}
			}
		} else {
			const context = new DataSourceContext()
			context.setString('transactionHashHex', event.transaction.hash.toHex())
			context.setString('applicationId', applicationId)
			PIICollectionTemplate.createWithContext(commentMetadataHash, context)
		}
	} else {
		commentEntity.commentsPublicHash = commentMetadataHash
	}

	commentEntity.save()
	log.info(`[${event.transaction.hash.toHex()}] [${isPrivate? 'PRIVATE': 'PUBLIC'}] Comment added to application ${applicationId} by ${sender}`, [])

	addCommentAddedNotification(commentEntity, event.params.sender)
}

export function handleEmailAdded(event: EmailAdded): void {
	
}