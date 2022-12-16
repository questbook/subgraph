import { Address, ethereum } from '@graphprotocol/graph-ts'
import { assert, newMockEvent, test } from 'matchstick-as'
import { CommentAdded } from '../generated/QBCommunicationContract/QBCommunicationContract'
import { Comment, PIIData } from '../generated/schema'
import { handleCommentAdded } from '../src/communication-mapping'
import { createApplication, MOCK_APPLICATION_ID, MOCK_GRANT_ID, MOCK_WORKSPACE_ID } from './utils' 


function runTests(): void {

	test('add public comment', () => {
		const a = createApplication()
        
		const ev = newMockEvent()
		const metadataHash = 'json:{"pii":{"0x471e82e77bc5d751411863a21cee3d88e49f0699":"gtTp4gUA7jaVdlDZYNE9c/5OzADvQYfxrm0wpA9Qfotp/7mZfjHD7q+5+uNZ8ui6","0xa966d94c61695bd5458aba908f5f85c8c6f0c068":"82ixL3vay5zklc47w49Y60udq0oW1+vwagHQBApjNIXccAZrI+fHDFCWJaSQ+SP/","0xcc9ee1b3a10675f60282abc71fc745f30830e2a4":"jnjSUTLQZ8KfCG8zm4nRb83Q7MBDy1FrdnHZRdX5ipUR0u4ygbI8DRJWR17uuesF","0xd1bfd92ab161983e007aade98312b83eeca14f9a":"q9QThK5z/7OG6QJg+ufE+t57a31pQo2uX26wdmtoMPYw4c5FLUFcXVCzu6EFESny"}}'
		ev.parameters = [
			new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('isPrivate', ethereum.Value.fromBoolean(false)),
			new ethereum.EventParam('commentMetadataHash', ethereum.Value.fromString(metadataHash)),
			new ethereum.EventParam('sender', ethereum.Value.fromAddress(Address.fromString('0x471e82e77bc5d751411863a21cee3d88e49f0699'))),
			new ethereum.EventParam('timestamp', ethereum.Value.fromI32(1665726957)),

		]
		const event = new CommentAdded(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleCommentAdded(event)

		const commentEntity = Comment.load(`${ev.transaction.hash.toHex()}-${Address.fromString('0x471e82e77bc5d751411863a21cee3d88e49f0699').toHex()}`)
		if(!commentEntity) {
			throw new Error('Comment entity not found')
		} else {
			assert.assertNotNull(commentEntity.commentsPublicHash)
			assert.assertNotNull(commentEntity.workspace)
		}
	})

	test('add private comment', () => {
		const a = createApplication()
        
		const ev = newMockEvent()
		const metadataHash = 'json:{"pii":{"0x471e82e77bc5d751411863a21cee3d88e49f0699":"gtTp4gUA7jaVdlDZYNE9c/5OzADvQYfxrm0wpA9Qfotp/7mZfjHD7q+5+uNZ8ui6","0xa966d94c61695bd5458aba908f5f85c8c6f0c068":"82ixL3vay5zklc47w49Y60udq0oW1+vwagHQBApjNIXccAZrI+fHDFCWJaSQ+SP/","0xcc9ee1b3a10675f60282abc71fc745f30830e2a4":"jnjSUTLQZ8KfCG8zm4nRb83Q7MBDy1FrdnHZRdX5ipUR0u4ygbI8DRJWR17uuesF","0xd1bfd92ab161983e007aade98312b83eeca14f9a":"q9QThK5z/7OG6QJg+ufE+t57a31pQo2uX26wdmtoMPYw4c5FLUFcXVCzu6EFESny"}}'
		ev.parameters = [
			new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('isPrivate', ethereum.Value.fromBoolean(true)),
			new ethereum.EventParam('commentMetadataHash', ethereum.Value.fromString(metadataHash)),
			new ethereum.EventParam('sender', ethereum.Value.fromAddress(Address.fromString('0x471e82e77bc5d751411863a21cee3d88e49f0699'))),
			new ethereum.EventParam('timestamp', ethereum.Value.fromI32(1665726957)),

		]
		const event = new CommentAdded(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleCommentAdded(event)

		const commentEntity = Comment.load(`${ev.transaction.hash.toHex()}-${Address.fromString('0x471e82e77bc5d751411863a21cee3d88e49f0699').toHex()}`)
		if(!commentEntity) {
			throw new Error('Comment entity not found')
		} else {
			assert.assertNull(commentEntity.commentsPublicHash)
			assert.assertNotNull(commentEntity.workspace)

			const PIIEntity = PIIData.load(`${ev.transaction.hash.toHex()}-0x471e82e77bc5d751411863a21cee3d88e49f0699`)

			if(!PIIEntity) {
				throw new Error('PII entity not found')
			} else {
				assert.assertNotNull(PIIEntity.data)
				assert.assertNull(commentEntity.commentsPublicHash)
			}
		}
	})
}

runTests()