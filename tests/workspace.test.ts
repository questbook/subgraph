import { Address, BigInt, ByteArray, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { assert, log, newMockEvent, test } from 'matchstick-as/assembly/index'
import {
	DisburseRewardFromSafe1,
	DisburseRewardFromWallet,
	FundsTransferStatusUpdated,
	GrantsSectionUpdated,
	QBAdminsUpdated,
	WorkspaceMembersUpdated,
	WorkspaceMemberUpdated,
	WorkspaceSafeUpdated,
	WorkspacesVisibleUpdated,
	WorkspaceUpdated
} from '../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract'
import {
	ApplicationMilestone,
	FundsTransfer,
	Grant,
	Partner,
	QBAdmin,
	Section,
	Social,
	Token,
	Workspace,
	WorkspaceMember,
	WorkspaceSafe
} from '../generated/schema'
import { DisburseReward } from '../generated/templates/QBGrantsContract/QBGrantsContract'
import {
	handleDisburseReward, handleDisburseRewardFromSafe1, handleDisburseRewardFromWallet, handleFundsTransferStatusUpdated, handleGrantsSectionUpdate, handleQBAdminsUpdated,
	handleWorkspaceMembersUpdated,
	handleWorkspaceMemberUpdated,
	handleWorkspaceSafeUpdated,
	handleWorkspacesVisibleUpdated,
	handleWorkspaceUpdated
} from '../src/workspace-mapping'
import {
	assertArrayNotEmpty,
	assertStringNotEmpty,
	createApplication,
	createGrant,
	createWorkspace,
	MOCK_APPLICATION_ID_ARRAY,
	MOCK_GRANT_ID,
	MOCK_GRANT_ID_2,
	MOCK_GRANT_ID_3,
	MOCK_GRANT_ID_ARRAY,
	MOCK_QB_ADMIN_ID,
	MOCK_WORKSPACE_ID,
	MOCK_WORKSPACE_ID_ARRAY,
	WORKSPACE_CREATOR_ID
} from './utils'
import { MOCK_APPLICATION_ID } from './utils'

export function runTests(): void {

	test('should create a workspace', () => {
		const w = createWorkspace()

		assert.assertNotNull(w)
		assert.i32Equals(w!.createdAtS, 123)
		assertStringNotEmpty(w!.title, 'w.title')
		assertStringNotEmpty(w!.about, 'w.about')
		assertStringNotEmpty(w!.bio, 'w.bio')
		assertStringNotEmpty(w!.logoIpfsHash, 'w.logoIpfsHash')
		assertStringNotEmpty(w!.coverImageIpfsHash, 'w.coverImageIpfsHash')
		assertArrayNotEmpty(w!.partners)
		assertArrayNotEmpty(w!.supportedNetworks)
		assertArrayNotEmpty(w!.socials)

		const m = WorkspaceMember.load(`${w!.id}.${w!.ownerId.toHex()}`)
		assert.assertNotNull(m)
		assert.stringEquals(m!.workspace, w!.id)

		const s = Social.load(w!.socials[0])
		assert.assertNotNull(s)
		assert.assertTrue(s!.name.length > 0)
		assert.assertTrue(s!.value.length > 0)

		const p = Partner.load(w!.partners[0])
		assert.assertNotNull(p)
		assert.assertTrue(p!.name.length > 0)
		assert.assertTrue(p!.industry.length > 0)
	})

	test('should update a workspace', () => {
		const w = createWorkspace()!
		const s = Social.load(w.socials[0])
		const p = Partner.load(w.partners[0])

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('owner', ethereum.Value.fromBytes(Address.fromByteArray(Address.fromI32(2)))),
			// contains mock data for update event
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(UPDATE_JSON)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(124))
		]

		const event = new WorkspaceUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleWorkspaceUpdated(event)

		const wUpdate = Workspace.load(w.id)
		assert.assertNotNull(wUpdate)
		assert.i32Equals(wUpdate!.updatedAtS, 124)
		assert.assertTrue(wUpdate!.title != w.title)
		assert.assertTrue(wUpdate!.about != w.about)
		assert.assertTrue(wUpdate!.bio != w.bio)
		assert.assertTrue(wUpdate!.logoIpfsHash != w.logoIpfsHash)
		assert.assertTrue(wUpdate!.coverImageIpfsHash != w.coverImageIpfsHash)
		assertArrayNotEmpty(wUpdate!.socials)
		assertArrayNotEmpty(wUpdate!.partners)

		const tokenId = `${wUpdate!.id}.${CUSTOM_TOKEN_ADDRESS.toHex()}`
		const token = Token.load(tokenId)
		assert.assertNotNull(token)
		assertStringNotEmpty(token!.label)
		assert.assertTrue(token!.decimal > 0)

		const sUpdate = Social.load(wUpdate!.socials[0])
		assert.assertTrue(s!.value != sUpdate!.value)

		const pUpdate = Partner.load(wUpdate!.partners[0])
		assert.assertTrue(s!.name != pUpdate!.name)
	})

	test('should update public key', () => {
		const w = createWorkspace()!

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('owner', ethereum.Value.fromBytes(Address.fromByteArray(Address.fromI32(2)))),
			// contains mock data for update event
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString('json:{"publicKey":"-1i2jrc12rc13rc"}')),
			new ethereum.EventParam('time', ethereum.Value.fromI32(124))
		]

		ev.transaction.from = Address.fromString(WORKSPACE_CREATOR_ID)

		const event = new WorkspaceUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleWorkspaceUpdated(event)

		const wUpdate = WorkspaceMember.load(`${w.id}.${ev.transaction.from.toHex()}`)

		assert.assertNotNull(wUpdate)
		assert.stringEquals(wUpdate!.publicKey!, '-1i2jrc12rc13rc')
	})

	test('should add admins to a workspace', () => {
		const addresses = [
			Address.fromString('0xA16081F360e3847006dB660bae1c6d1b2e17eC2C'),
			Address.fromString('0xB16081F360e3847006dB660bae1c6d1b2e17eC2E')
		]

		const emails = [
			'abcd@abcd.com',
			'123@abcd.com'
		]

		const wUpdate = workspaceWithAdditionalMembers(addresses, emails)

		assert.assertNotNull(wUpdate)
		assert.i32Equals(wUpdate!.updatedAtS, 125)

		for(let i = 0; i < addresses.length; i++) {
			const memberAddedId = `${wUpdate!.id}.${addresses[i].toHex()}`
			const member = WorkspaceMember.load(memberAddedId)

			assert.assertNotNull(member)
			assert.stringEquals(member!.accessLevel, 'admin')
			assert.stringEquals(member!.workspace, wUpdate!.id)
			assert.i32Equals(member!.addedAt, 125)
		}
	})

	test('should add admin to a workspace via single invite', () => {
		const w = createWorkspace()!

		const address = Address.fromString('0xB16081F360e3847006dB660bae1c6d1b2e18fD2C')
		const role = 0x0
		const enabled = true
		const metadataHash = 'json:{"fullName":"Admin","profilePictureIpfsHash":"Qmb8Vm1GtuNrwjraN658czDMovibvExcRMT7bpaSGTToR3","publicKey":"0x04951bd483d83aba17353610a320004c60a8ba4878fb3fb484420ca18d203c4a9edd9d785865527d9f8b6a2b3dca20ed7f8b262427d46437fd7af67221c42e668f","pii":{"0xd1bfd92ab161983e007aade98312b83eeca14f9a":"1sPFneE9KZ1BVM3U8Sh9RsRqKqz4UKZNn7prTGsNAWyO2JDubY1jGXWfpEIEa6lG","0xd4939c70ce56c2b0ecef57060b321f0ffb168b08":"QR8A/Uk7cDTtTdaXktOyWDtvIzozTk/eEbArSm8kkMZpqavnpVI8ChTRY4WAsuk9"}}'

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('member', ethereum.Value.fromAddress(address)),
			new ethereum.EventParam('role', ethereum.Value.fromI32(role)),
			new ethereum.EventParam('enabled', ethereum.Value.fromBoolean(enabled)),
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(metadataHash)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125))
		]

		const event = new WorkspaceMemberUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleWorkspaceMemberUpdated(event)

		const memberAddedId = `${w.id}.${address.toHex()}`
		const member = WorkspaceMember.load(memberAddedId)
		
		assert.assertNotNull(member)
		assert.stringEquals(member!.accessLevel, 'admin')
		assertStringNotEmpty(member!.fullName, 'Admin')
		assertStringNotEmpty(member!.profilePictureIpfsHash, 'member.profilePictureIpfsHash')
	})

	test('should update member without pii', () => {
		const w = createWorkspace()!

		const address = Address.fromString('0x4e35fF1872A720695a741B00f2fA4D1883440baC')
		const role = 0x0
		const enabled = true
		const metadataHash = 'json:{"fullName":"Admin","profilePictureIpfsHash":"Qmb8Vm1GtuNrwjraN658czDMovibvExcRMT7bpaSGTToR3","publicKey":"0x04a120072b809dcf68b34ff4b0d514b2dab4bd0e2262944e6ea3863688a5e09ee0e54371570f52e97d8fa6f20a9f8fa69c43af9f0ecc644bc3543c0deab83a8ab6"}'

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('member', ethereum.Value.fromAddress(address)),
			new ethereum.EventParam('role', ethereum.Value.fromI32(role)),
			new ethereum.EventParam('enabled', ethereum.Value.fromBoolean(enabled)),
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(metadataHash)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125))
		]

		const event = new WorkspaceMemberUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleWorkspaceMemberUpdated(event)

		const memberAddedId = `${w.id}.${address.toHex()}`
		const member = WorkspaceMember.load(memberAddedId)
		// log.info(`member: ${member?.pii}`, [])
		
		assert.assertNotNull(member)
		assert.stringEquals(member!.accessLevel, 'admin')
		if(member) {
			assert.i32Equals(member.pii.length, 0)
		}

		assertStringNotEmpty(member!.fullName, 'Admin')
		assertStringNotEmpty(member!.profilePictureIpfsHash, 'member.profilePictureIpfsHash')
	})

	test('should remove admins from a workspace', () => {
		const addresses = [Address.fromString('0xE16081F360e3847006dB660bae1c6d1b2e17eC2D')]
		const emails = ['abcd@abcd.com']
		const roles: i32[] = [0]
		const enabled: boolean[] = [false]

		let wUpdate = workspaceWithAdditionalMembers(addresses, emails)

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('members', ethereum.Value.fromAddressArray(addresses)),
			new ethereum.EventParam('roles', ethereum.Value.fromI32Array(roles)),
			new ethereum.EventParam('enabled', ethereum.Value.fromBooleanArray(enabled)),
			new ethereum.EventParam('emails', ethereum.Value.fromStringArray(emails)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(126))
		]

		const event = new WorkspaceMembersUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleWorkspaceMembersUpdated(event)

		wUpdate = Workspace.load(wUpdate!.id)

		assert.assertNotNull(wUpdate)
		assert.i32Equals(wUpdate!.updatedAtS, 126)

		for(let i = 0; i < addresses.length; i++) {
			const memberAddedId = `${wUpdate!.id}.${addresses[i].toHex()}`
			const member = WorkspaceMember.load(memberAddedId)!
			assert.assertNotNull(member)
			assert.i32Equals(member.removedAt, wUpdate!.updatedAtS)
		}
	})

	test('should update owner\'s name without changing the access level', () => {
		const w = createWorkspace()!

		const adminAddress = Address.fromString('0xB16081F360e3847006dB660bae1c6d1b2e18fD2C')
		const adminRole = 0x0
		const adminEnabled = true
		const adminMetadataHash = 'json:{"fullName":"Admin","profilePictureIpfsHash":"Qmb8Vm1GtuNrwjraN658czDMovibvExcRMT7bpaSGTToR3","publicKey":"0x04a120072b809dcf68b34ff4b0d514b2dab4bd0e2262944e6ea3863688a5e09ee0e54371570f52e97d8fa6f20a9f8fa69c43af9f0ecc644bc3543c0deab83a8ab6","email":"email@gmail.com","pii":{"0x471e82e77bc5d751411863a21cee3d88e49f0699":"gtTp4gUA7jaVdlDZYNE9c/5OzADvQYfxrm0wpA9Qfotp/7mZfjHD7q+5+uNZ8ui6","0xa966d94c61695bd5458aba908f5f85c8c6f0c068":"82ixL3vay5zklc47w49Y60udq0oW1+vwagHQBApjNIXccAZrI+fHDFCWJaSQ+SP/","0xcc9ee1b3a10675f60282abc71fc745f30830e2a4":"jnjSUTLQZ8KfCG8zm4nRb83Q7MBDy1FrdnHZRdX5ipUR0u4ygbI8DRJWR17uuesF","0xd1bfd92ab161983e007aade98312b83eeca14f9a":"q9QThK5z/7OG6QJg+ufE+t57a31pQo2uX26wdmtoMPYw4c5FLUFcXVCzu6EFESny"}}'

		const adminEv = newMockEvent()
		adminEv.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('member', ethereum.Value.fromAddress(adminAddress)),
			new ethereum.EventParam('role', ethereum.Value.fromI32(adminRole)),
			new ethereum.EventParam('enabled', ethereum.Value.fromBoolean(adminEnabled)),
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(adminMetadataHash)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(130))
		]

		const adminAddEvent = new WorkspaceMemberUpdated(adminEv.address, adminEv.logIndex, adminEv.transactionLogIndex, adminEv.logType, adminEv.block, adminEv.transaction, adminEv.parameters)
		handleWorkspaceMemberUpdated(adminAddEvent)

		const adminAddedId = `${w.id}.${adminAddress.toHex()}`
		const admin = WorkspaceMember.load(adminAddedId)

		assert.assertNotNull(admin)
		assert.stringEquals(admin!.accessLevel, 'admin')
		assertStringNotEmpty(admin!.fullName, 'Admin')
		assertStringNotEmpty(admin!.profilePictureIpfsHash, 'member.profilePictureIpfsHash')

		const ownerAddress = Address.fromString(WORKSPACE_CREATOR_ID)
		const ownerRole = 0x0
		const ownerEnabled = true
		const ownerMetadataHash = 'json:{"fullName":"Owner","profilePictureIpfsHash":"Qmb8Vm1GtuNrwjraN658czDMovibvExcRMT7bpaSGTToR3","publicKey":"0x04a120072b809dcf68b34ff4b0d514b2dab4bd0e2262944e6ea3863688a5e09ee0e54371570f52e97d8fa6f20a9f8fa69c43af9f0ecc644bc3543c0deab83a8ab6","email":"email@gmail.com","pii":{"0x471e82e77bc5d751411863a21cee3d88e49f0699":"gtTp4gUA7jaVdlDZYNE9c/5OzADvQYfxrm0wpA9Qfotp/7mZfjHD7q+5+uNZ8ui6","0xa966d94c61695bd5458aba908f5f85c8c6f0c068":"82ixL3vay5zklc47w49Y60udq0oW1+vwagHQBApjNIXccAZrI+fHDFCWJaSQ+SP/","0xcc9ee1b3a10675f60282abc71fc745f30830e2a4":"jnjSUTLQZ8KfCG8zm4nRb83Q7MBDy1FrdnHZRdX5ipUR0u4ygbI8DRJWR17uuesF","0xd1bfd92ab161983e007aade98312b83eeca14f9a":"q9QThK5z/7OG6QJg+ufE+t57a31pQo2uX26wdmtoMPYw4c5FLUFcXVCzu6EFESny"}}'

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('member', ethereum.Value.fromAddress(ownerAddress)),
			new ethereum.EventParam('role', ethereum.Value.fromI32(ownerRole)),
			new ethereum.EventParam('enabled', ethereum.Value.fromBoolean(ownerEnabled)),
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(ownerMetadataHash)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125))
		]

		const event = new WorkspaceMemberUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleWorkspaceMemberUpdated(event)

		const ownerAddedId = `${w.id}.${ownerAddress.toHex()}`
		const owner = WorkspaceMember.load(ownerAddedId)

		// const newAccessLevel = member?.accessLevel ?? ''
		// log.info(`member: ${newAccessLevel}`, [])
		assert.assertNotNull(owner)
		assert.stringEquals(owner!.accessLevel, 'owner')
		assertStringNotEmpty(owner!.fullName, 'Owner')
		assertStringNotEmpty(owner!.profilePictureIpfsHash, 'member.profilePictureIpfsHash')
	})

	test('update a safe', () => {
		const w = createWorkspace()!

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('safeAddress', ethereum.Value.fromBytes(Bytes.fromByteArray(Bytes.fromHexString('0x0000000000000000000000000000000000000001')))),
			new ethereum.EventParam('longSafeAddress', ethereum.Value.fromString('HWuCwhwayTaNcRtt72edn2uEMuKCuWMwmDFcJLbah3KC')),
			new ethereum.EventParam('safeChainId', ethereum.Value.fromUnsignedBigInt(BigInt.fromString('123'))),
			new ethereum.EventParam('time', ethereum.Value.fromI32(126))
		]

		const event = new WorkspaceSafeUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleWorkspaceSafeUpdated(event)

		const safe = WorkspaceSafe.load(w.id)!
		assert.assertNotNull(safe)
		assert.assertNotNull(safe.workspace)

		// delete ev params
		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('safeAddress', ethereum.Value.fromBytes(Bytes.fromByteArray(Bytes.fromHexString('0x0000000000000000000000000000000000000001')))),
			new ethereum.EventParam('longSafeAddress', ethereum.Value.fromString('HWuCwhwayTaNcRtt72edn2uEMuKCuWMwmDFcJLbah3KC')),
			new ethereum.EventParam('safeChainId', ethereum.Value.fromUnsignedBigInt(BigInt.fromString('0'))),
			new ethereum.EventParam('time', ethereum.Value.fromI32(126))
		]

		const eventDel = new WorkspaceSafeUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleWorkspaceSafeUpdated(eventDel)

		const safe2 = WorkspaceSafe.load(w.id)
		assert.assertNull(safe2)
	})

	test('should disburse reward', () => {
		const w = createWorkspace()
		const a = createApplication()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('milestoneId', ethereum.Value.fromI32(0)),
			new ethereum.EventParam('asset', ethereum.Value.fromAddress(Address.fromString('0xE3D997D569b5b03B577C6a2Edd1d2613FE776cb0'))),
			new ethereum.EventParam('sender', ethereum.Value.fromAddress(Address.fromString('0x230fb4c4d462eEF9e6790337Cf57271E519bB697'))),
			new ethereum.EventParam('amount', ethereum.Value.fromI32(10)),
			new ethereum.EventParam('isP2P', ethereum.Value.fromBoolean(true)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125))
		]

		const event = new DisburseReward(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleDisburseReward(event)

		const fundTransfer = FundsTransfer.load(`${ev.transaction.hash.toHex()}.${a!.id}`)
		assert.assertNotNull(fundTransfer)
	})

	test('should disburse reward from safe', () => {
		const w = createWorkspace()
		const a = createApplication()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID_ARRAY),
			new ethereum.EventParam('milestoneId', ethereum.Value.fromI32Array([0, 1, 2])),
			new ethereum.EventParam('asset', ethereum.Value.fromAddress(Address.fromString('0xE3D997D569b5b03B577C6a2Edd1d2613FE776cb0'))),
			new ethereum.EventParam('tokenName', ethereum.Value.fromString('MATIC')),
			new ethereum.EventParam('nonEvmAssetAddress', ethereum.Value.fromString('bfnjr9489njrhHDFHg230fb4c4d462eEF9e6790337Cf57271E519bB697')),
			new ethereum.EventParam('transactionHash', ethereum.Value.fromString('0xB17081F360e3847006dB660bae1c6d1b2e17eC2A')),
			new ethereum.EventParam('sender', ethereum.Value.fromAddress(Address.fromString('0x230fb4c4d462eEF9e6790337Cf57271E519bB697'))),
			new ethereum.EventParam('amount', ethereum.Value.fromI32Array([10, 20, 30])),
			new ethereum.EventParam('isP2P', ethereum.Value.fromBoolean(true)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125))
		]

		assert.stringEquals(ev.parameters[5].value.toString(), '0xB17081F360e3847006dB660bae1c6d1b2e17eC2A')
		const event = new DisburseRewardFromSafe1(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleDisburseRewardFromSafe1(event)

		const fundTransfer = FundsTransfer.load(`${0xB17081F360e3847006dB660bae1c6d1b2e17eC2A}.${0x123}`)
		if(fundTransfer) {
			assert.assertNotNull(fundTransfer)
			assert.stringEquals(fundTransfer!.type, 'funds_disbursed_from_safe')
			assert.stringEquals(fundTransfer!.tokenName!, 'MATIC')
			assert.assertNotNull(fundTransfer!.milestone)
			const applicationMilestone = ApplicationMilestone.load(fundTransfer!.milestone!)
			assert.assertNotNull(applicationMilestone)
		}
		
		// console.log(`Application milestone --> ${applicationMilestone!.amount.toString()}`)
	})

	test('should disburse reward from wallet', () => {
		const w = createWorkspace()
		const a = createApplication()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID_ARRAY),
			new ethereum.EventParam('milestoneId', ethereum.Value.fromI32Array([0, 1, 2])),
			new ethereum.EventParam('asset', ethereum.Value.fromAddress(Address.fromString('0xE3D997D569b5b03B577C6a2Edd1d2613FE776cb0'))),
			new ethereum.EventParam('tokenName', ethereum.Value.fromString('MATIC')),
			new ethereum.EventParam('nonEvmAssetAddress', ethereum.Value.fromString('bfnjr9489njrhHDFHg230fb4c4d462eEF9e6790337Cf57271E519bB697')),
			new ethereum.EventParam('transactionHash', ethereum.Value.fromString('0xB17081F360e3847006dB660bae1c6d1b2e17eC2A')),
			new ethereum.EventParam('sender', ethereum.Value.fromAddress(Address.fromString('0x230fb4c4d462eEF9e6790337Cf57271E519bB697'))),
			new ethereum.EventParam('amount', ethereum.Value.fromI32Array([10, 20, 30])),
			new ethereum.EventParam('isP2P', ethereum.Value.fromBoolean(true)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125))
		]

		assert.stringEquals(ev.parameters[5].value.toString(), '0xB17081F360e3847006dB660bae1c6d1b2e17eC2A')
		const event = new DisburseRewardFromWallet(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleDisburseRewardFromWallet(event)

		const fundTransfer = FundsTransfer.load(`${0xB17081F360e3847006dB660bae1c6d1b2e17eC2A}.${0x123}`)
		if(fundTransfer) {
			assert.assertNotNull(fundTransfer)
			assert.stringEquals(fundTransfer!.type, 'funds_disbursed_from_wallet')
			assert.stringEquals(fundTransfer!.status, 'executed')
			assert.stringEquals(fundTransfer!.tokenName!, 'MATIC')
			assert.assertNotNull(fundTransfer!.milestone)
			const applicationMilestone = ApplicationMilestone.load(fundTransfer!.milestone!)
			assert.assertNotNull(applicationMilestone)
		}
		
		// console.log(`Application milestone --> ${applicationMilestone!.amount.toString()}`)
	})

	test('should update transaction status', () => {
		const w = createWorkspace()
		const a = createApplication()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('applicationId', ethereum.Value.fromI32Array([0x0123])),
			new ethereum.EventParam('transactionHash', ethereum.Value.fromStringArray(['0xB17081F360e3847006dB660bae1c6d1b2e17eC2A'])),
			new ethereum.EventParam('status', ethereum.Value.fromStringArray(['executed'])),
			new ethereum.EventParam('tokenUSDValue', ethereum.Value.fromI32Array([10])),
			new ethereum.EventParam('executionTimestamp', ethereum.Value.fromI32Array([1665726957]))
		]

		const event = new FundsTransferStatusUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleFundsTransferStatusUpdated(event)
		const fundsTransferStatusEntity = FundsTransfer.load(`${0xB17081F360e3847006dB660bae1c6d1b2e17eC2A}.${0x0123}`)
		if(fundsTransferStatusEntity != null) {
			assert.assertNotNull(fundsTransferStatusEntity)
			assert.stringEquals(fundsTransferStatusEntity!.status, 'executed')
			assert.i32Equals(fundsTransferStatusEntity!.tokenUSDValue!.toI32(), 10)
			assert.i32Equals(fundsTransferStatusEntity!.executionTimestamp, 1665726957)
			
			const grantEntity = Grant.load(a!.grant)
			assert.bigIntEquals(grantEntity!.totalGrantFundingDisbursedUSD!, BigInt.fromI32(10))
		}

	})

	test('should add the executed fund value to existing total grant funding disbursed', () => {
		const w = createWorkspace()
		const a = createApplication()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('applicationId', ethereum.Value.fromI32Array([0x0123])),
			new ethereum.EventParam('milestoneId', ethereum.Value.fromI32Array([0])),
			new ethereum.EventParam('asset', ethereum.Value.fromAddress(Address.fromString('0xE3D997D569b5b03B577C6a2Edd1d2613FE776cb0'))),
			new ethereum.EventParam('tokenName', ethereum.Value.fromString('MATIC')),
			new ethereum.EventParam('nonEvmAssetAddress', ethereum.Value.fromString('bfnjr9489njrhHDFHg230fb4c4d462eEF9e6790337Cf57271E519bB697')),
			new ethereum.EventParam('transactionHash', ethereum.Value.fromString('0x5a0218acbc835d99aea9a6c4dd2868952463a3d4f0a204653cc68ba97eb90563')),
			new ethereum.EventParam('sender', ethereum.Value.fromAddress(Address.fromString('0x230fb4c4d462eEF9e6790337Cf57271E519bB697'))),
			new ethereum.EventParam('amount', ethereum.Value.fromI32Array([10])),
			new ethereum.EventParam('isP2P', ethereum.Value.fromBoolean(true)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(125))
		]

		assert.stringEquals(ev.parameters[5].value.toString(), '0x5a0218acbc835d99aea9a6c4dd2868952463a3d4f0a204653cc68ba97eb90563')
		const event = new DisburseRewardFromSafe1(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleDisburseRewardFromSafe1(event)

		const fundTransfer = FundsTransfer.load(`0x5a0218acbc835d99aea9a6c4dd2868952463a3d4f0a204653cc68ba97eb90563.${0x123}`)
		if(fundTransfer) {
			assert.assertNotNull(fundTransfer)
			assert.stringEquals(fundTransfer!.type, 'funds_disbursed_from_safe')
			assert.stringEquals(fundTransfer!.tokenName!, 'MATIC')
			assert.assertNotNull(fundTransfer!.milestone)
			const applicationMilestone = ApplicationMilestone.load(fundTransfer!.milestone!)
			assert.assertNotNull(applicationMilestone)
		}

		const ev2 = newMockEvent()

		ev2.parameters = [
			new ethereum.EventParam('applicationId', ethereum.Value.fromI32Array([0x0123])),
			new ethereum.EventParam('transactionHash', ethereum.Value.fromStringArray(['0x5a0218acbc835d99aea9a6c4dd2868952463a3d4f0a204653cc68ba97eb90563'])),
			new ethereum.EventParam('status', ethereum.Value.fromStringArray(['executed'])),
			new ethereum.EventParam('tokenUSDValue', ethereum.Value.fromI32Array([20])),
			new ethereum.EventParam('executionTimestamp', ethereum.Value.fromI32Array([1665726957]))
		]

		const event2 = new FundsTransferStatusUpdated(ev2.address, ev2.logIndex, ev2.transactionLogIndex, ev2.logType, ev2.block, ev2.transaction, ev2.parameters)
		handleFundsTransferStatusUpdated(event2)

		const fundsTransferStatusEntity = FundsTransfer.load(`0x5a0218acbc835d99aea9a6c4dd2868952463a3d4f0a204653cc68ba97eb90563.${0x0123}`)
		if(fundsTransferStatusEntity != null) {
			assert.assertNotNull(fundsTransferStatusEntity)
			assert.stringEquals(fundsTransferStatusEntity!.status, 'executed')
			assert.i32Equals(fundsTransferStatusEntity!.tokenUSDValue!.toI32(), 20)
			assert.i32Equals(fundsTransferStatusEntity!.executionTimestamp, 1665726957)
			
			const grantEntity = Grant.load(a!.grant)
			log.info(`grantEntity.totalGrantFundingDisbursedUSD: , ${grantEntity!.totalGrantFundingDisbursedUSD!.toString()}`, [])
			assert.bigIntEquals(grantEntity!.totalGrantFundingDisbursedUSD!, BigInt.fromI32(20))
		}	
	})

	test('should not update transaction status', () => {
		const w = createWorkspace()
		const a = createApplication()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('applicationId', ethereum.Value.fromI32Array([0x0123])),
			new ethereum.EventParam('transactionHash', ethereum.Value.fromStringArray(['0xB17081F360e3847006dB660bae1c6d1b2e17eC2A'])),
			new ethereum.EventParam('status', ethereum.Value.fromStringArray(['completed'])),
			new ethereum.EventParam('tokenUSDValue', ethereum.Value.fromI32Array([10])),
			new ethereum.EventParam('executionTimestamp', ethereum.Value.fromI32Array([1665726957]))
		]

		const event = new FundsTransferStatusUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleFundsTransferStatusUpdated(event)
		const fundsTransferStatusEntity = FundsTransfer.load(`${0xB17081F360e3847006dB660bae1c6d1b2e17eC2A}.${0x0123}`)
		if(fundsTransferStatusEntity != null) {
			assert.assertNotNull(fundsTransferStatusEntity)
			assert.stringEquals(fundsTransferStatusEntity.status, 'queued')
			assert.i32Equals(fundsTransferStatusEntity!.tokenUSDValue!.toI32(), 10)
			assert.i32Equals(fundsTransferStatusEntity.executionTimestamp, 1665726957)
			
			const grantEntity = Grant.load(a!.grant)
			assert.bigIntEquals(grantEntity!.totalGrantFundingDisbursedUSD!, BigInt.fromI32(10))
		}

	})

	test('should update dao\'s visibility state', () => {
		const w = createWorkspace()!

		assert.assertTrue(w.isVisible)

		const workspaceIds = [w.id]
		const isVisibleArr = [false]

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID_ARRAY),
			new ethereum.EventParam('isVisible', ethereum.Value.fromBooleanArray(isVisibleArr)),
		]

		const event = new WorkspacesVisibleUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleWorkspacesVisibleUpdated(event)

		for(let idx = 0; idx < workspaceIds.length; idx++) {
			const workspaceId = workspaceIds[idx].toString()

			const workspace = Workspace.load(workspaceId)

			if(!workspace) {
				continue
			}

			assert.booleanEquals(workspace.isVisible, isVisibleArr[idx])
		}
	})

	test('should add/remove a QB admin', () => {
		const walletAddresses = ethereum.Value.fromAddressArray([MOCK_QB_ADMIN_ID])

		const addEventMock = newMockEvent()

		addEventMock.parameters = [
			new ethereum.EventParam('walletAddresses', walletAddresses),
			new ethereum.EventParam('isAdded', ethereum.Value.fromBoolean(true)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(123))
		]

		const addEvent = new QBAdminsUpdated(addEventMock.address, addEventMock.logIndex, addEventMock.transactionLogIndex, addEventMock.logType, addEventMock.block, addEventMock.transaction, addEventMock.parameters)
		handleQBAdminsUpdated(addEvent)

		const addedAdmin = QBAdmin.load(MOCK_QB_ADMIN_ID.toHex())
		assert.assertNotNull(addedAdmin)

		const removeEventMock = newMockEvent()

		removeEventMock.parameters = [
			new ethereum.EventParam('walletAddresses', walletAddresses),
			new ethereum.EventParam('isAdded', ethereum.Value.fromBoolean(false)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(123))
		]

		const removeEvent = new QBAdminsUpdated(removeEventMock.address, removeEventMock.logIndex, removeEventMock.transactionLogIndex, removeEventMock.logType, removeEventMock.block, removeEventMock.transaction, removeEventMock.parameters)
		handleQBAdminsUpdated(removeEvent)

		const removedAdmin = QBAdmin.load(MOCK_QB_ADMIN_ID.toHex())
		assert.assertNull(removedAdmin)
	})

	test('should create new section', () => {
		
		const grant2 = createGrant(MOCK_GRANT_ID_2)!
		const grant3 = createGrant(MOCK_GRANT_ID_3)!
		// const grant1 = createGrant(MOCK_GRANT_ID)!

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('grantIds', ethereum.Value.fromAddressArray([MOCK_GRANT_ID_2, MOCK_GRANT_ID_3])),
			new ethereum.EventParam('sectionName', ethereum.Value.fromString('Section 1')),
			new ethereum.EventParam('sectionLogoIpfsHash', ethereum.Value.fromString('Qmb8Vm1GtuNrwjraN658czDMovibvExcRMT7bpaSGTToR3')),
		]
		const event = new GrantsSectionUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleGrantsSectionUpdate(event)

		const sectionEntity = Section.load('Section 1')
		assert.assertNotNull(sectionEntity)
		assert.stringEquals(sectionEntity!.sectionName, 'Section 1')
		assert.stringEquals(sectionEntity!.sectionLogoIpfsHash, 'Qmb8Vm1GtuNrwjraN658czDMovibvExcRMT7bpaSGTToR3')
		assert.assertNotNull(sectionEntity!.grants)
		assert.i32Equals(sectionEntity!.grants.length, 2)
	})

	test('should update existing section with new grant', () => {
		
		const grant2 = createGrant(MOCK_GRANT_ID_2)!
		const grant3 = createGrant(MOCK_GRANT_ID_3)!
		const grant1 = createGrant(MOCK_GRANT_ID)!

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('grantIds', MOCK_GRANT_ID_ARRAY),
			new ethereum.EventParam('sectionName', ethereum.Value.fromString('Section 1')),
			new ethereum.EventParam('sectionLogoIpfsHash', ethereum.Value.fromString('Qmb8Vm1GtuNrwjraN658czDMovibvExcRMT7bpaSGTToR3')),
		]
		const event = new GrantsSectionUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleGrantsSectionUpdate(event)

		const sectionEntity = Section.load('Section 1')
		assert.assertNotNull(sectionEntity)
		assert.stringEquals(sectionEntity!.sectionName, 'Section 1')
		assert.stringEquals(sectionEntity!.sectionLogoIpfsHash, 'Qmb8Vm1GtuNrwjraN658czDMovibvExcRMT7bpaSGTToR3')
		assert.assertNotNull(sectionEntity!.grants)
		assert.i32Equals(sectionEntity!.grants.length, 3)
	})

	test('delete section if no grants passed', () => {

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('grantIds', ethereum.Value.fromAddressArray([])),
			new ethereum.EventParam('sectionName', ethereum.Value.fromString('Section 1')),
			new ethereum.EventParam('sectionLogoIpfsHash', ethereum.Value.fromString('Qmb8Vm1GtuNrwjraN658czDMovibvExcRMT7bpaSGTToR3')),
		]
		const event = new GrantsSectionUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleGrantsSectionUpdate(event)

		const sectionEntity = Section.load('Section 1')
		assert.assertNull(sectionEntity)
	})

	
}

function workspaceWithAdditionalMembers(addresses: Address[], emails: string[]): Workspace | null {
	const w = createWorkspace()!

	const roles: i32[] = []
	for(let i = 0; i < addresses.length; i++) {
		roles.push(0)
	}

	const enabled: boolean[] = []
	for(let i = 0; i < addresses.length; i++) {
		enabled.push(true)
	}

	const ev = newMockEvent()
	ev.parameters = [
		new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
		new ethereum.EventParam('members', ethereum.Value.fromAddressArray(addresses)),
		new ethereum.EventParam('roles', ethereum.Value.fromI32Array(roles)),
		new ethereum.EventParam('enabled', ethereum.Value.fromBooleanArray(enabled)),
		new ethereum.EventParam('emails', ethereum.Value.fromStringArray(emails)),
		new ethereum.EventParam('time', ethereum.Value.fromI32(125))
	]

	const event = new WorkspaceMembersUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleWorkspaceMembersUpdated(event)

	return Workspace.load(w.id)
}


const CUSTOM_TOKEN_ADDRESS = ByteArray.fromHexString('0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658')
const UPDATE_JSON = 'json:{"title":"Zakoj zihuut behkeeve haluz ipu numaf aluba beobucu zodac itomevo lajbipih hafnoded asogamga wuip ufogzac kup ze.","bio": "lorem ipsum", "about":"Badikdo lem wop tav wa wam fah voveili zab letrifhi murmukun sutgisod kide wa hiwwowi doj. Ovociodu lamanuf kotuhe nezote ol pela ud owirowewa nukjug lajutfed cil ekhuc hu. Zifa adiguul zuchagmel rub acze buloggob minre nauh pon ozanoti pab safudu. Felsah ar hiakimir ketga roganmen poblo muznitag sudil hi hecruib mikma limtukfik guubale gegolu. Zi ozihun gekfoafa soce kicnujnoh aroruc fudcuhu wetlalduz duezpe tokeha ihhivoz he latid doasilof busej eco unipofu. Ni lin deppalos neap kiseklam lol reb guvogti ke futdujso boj se ov docabem.","logoIpfsHash":"10762a04-0da6-5e17-8886-ca2b0227601b","coverImageIpfsHash":"2527d562-1736-54ba-b930-64abba4c4b6c", "partners": [{"name": "lorem1", "industry": "ipsum2", "website": "https://www.lipsum.com/", "partnerImageHash": "815983c5-3ce7-50a5-b1bf-6c591af3be49"}], "socials":[{"name":"twitter","value":"http://ro.uk/cos"},{"name":"discord","value":"http://ewbaj.ao/povit"}],"createdAt":"2022-01-28T18:00:09.267Z", "tokens": [{"label": "WMATIC", "address": "0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658", "decimal": "18", "iconHash": "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"}]}'

runTests()
