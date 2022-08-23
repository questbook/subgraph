import { Address, BigInt, ByteArray, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { assert, newMockEvent, test } from 'matchstick-as/assembly/index'
import { DisburseRewardFromSafe, WorkspaceMembersUpdated, WorkspaceMemberUpdated, WorkspaceSafeUpdated, WorkspaceUpdated } from '../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract'
import { FundsTransfer, Partner, Social, Token, Workspace, WorkspaceMember, WorkspaceSafe } from '../generated/schema'
import { DisburseReward } from '../generated/templates/QBGrantsContract/QBGrantsContract'
import { handleDisburseReward, handleDisburseRewardFromSafe, handleWorkspaceMembersUpdated, handleWorkspaceMemberUpdated, handleWorkspaceSafeUpdated, handleWorkspaceUpdated } from '../src/workspace-mapping'
import { assertArrayNotEmpty, assertStringNotEmpty, createApplication, createWorkspace, MOCK_WORKSPACE_ID, WORKSPACE_CREATOR_ID } from './utils'
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
		const metadataHash = 'json:{"fullName":"Abcd1","profilePictureIpfsHash":"1234543222"}'

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
		assertStringNotEmpty(member!.fullName, 'member.fullName')
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

	test('update a safe', () => {
		const w = createWorkspace()!

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('safeAddress', ethereum.Value.fromBytes(Bytes.fromByteArray(Bytes.fromHexString('0x0000000000000000000000000000000000000001')))),
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

		const fundTransfer = FundsTransfer.load(ev.transaction.hash.toHex())
		assert.assertNotNull(fundTransfer)
	})

	test('should disburse reward from safe', () => {
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

		const event = new DisburseRewardFromSafe(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleDisburseRewardFromSafe(event)

		const fundTransfer = FundsTransfer.load(ev.transaction.hash.toHex())
		assert.assertNotNull(fundTransfer)
		assert.stringEquals(fundTransfer!.type, 'funds_disbursed_from_safe')
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