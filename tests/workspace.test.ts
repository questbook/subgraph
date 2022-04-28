import { Address, ethereum } from '@graphprotocol/graph-ts'
import { test, newMockEvent, assert } from 'matchstick-as/assembly/index'
import { WorkspaceMembersUpdated, WorkspaceUpdated } from '../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract'
import { Social, Token, Workspace, WorkspaceMember } from '../generated/schema'
import { handleWorkspaceMembersUpdated, handleWorkspaceUpdated } from '../src/workspace-mapping'
import { assertArrayNotEmpty, assertStringNotEmpty, createWorkspace, MOCK_WORKSPACE_ID, WORKSPACE_CREATOR_ID } from './utils'

export function runTests(): void {

	test('should create a workspace', () => {
		const w = createWorkspace()
		
		assert.assertNotNull(w)
		assert.i32Equals(w!.createdAtS, 123)
		assertStringNotEmpty(w!.title, 'w.title')
		assertStringNotEmpty(w!.about, 'w.about')
		assertStringNotEmpty(w!.logoIpfsHash, 'w.logoIpfsHash')
		assertStringNotEmpty(w!.coverImageIpfsHash, 'w.coverImageIpfsHash')
		assertArrayNotEmpty(w!.supportedNetworks)
		assertArrayNotEmpty(w!.socials)

		const m = WorkspaceMember.load(`${w!.id}.${w!.ownerId.toHex()}`)
		assert.assertNotNull(m)
		assert.stringEquals(m!.workspace, w!.id)
		
		const s = Social.load(w!.socials[0])
		assert.assertNotNull(s)
		assert.assertTrue(s!.name.length > 0)
		assert.assertTrue(s!.value.length > 0)
	})

	test('should update a workspace', () => {
		const w = createWorkspace()!
		const s = Social.load(w.socials[0])

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('owner', ethereum.Value.fromBytes( Address.fromByteArray(Address.fromI32(2)) )),
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
		assert.assertTrue(wUpdate!.logoIpfsHash != w.logoIpfsHash)
		assert.assertTrue(wUpdate!.coverImageIpfsHash != w.coverImageIpfsHash)
		assertArrayNotEmpty(wUpdate!.socials)
		assertArrayNotEmpty(wUpdate!.tokens)

		const token = Token.load(wUpdate!.tokens[0])
		assert.assertNotNull(token)
		assertStringNotEmpty(token!.label)
		assert.assertTrue(token!.decimal > 0)
		
		const sUpdate = Social.load(wUpdate!.socials[0])
		assert.assertTrue(s!.value != sUpdate!.value)
	})

	test('should update public key', () => {
		const w = createWorkspace()!

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('owner', ethereum.Value.fromBytes( Address.fromByteArray(Address.fromI32(2)) )),
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
			Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2C"),
			Address.fromString("0xB16081F360e3847006dB660bae1c6d1b2e17eC2E")
		]

		const emails = [
			'abcd@abcd.com',
			'123@abcd.com'
		]

		const wUpdate = workspaceWithAdditionalMembers(addresses, emails)

		assert.assertNotNull(wUpdate)
		assert.i32Equals(wUpdate!.updatedAtS, 125)

		for(let i = 0;i < addresses.length;i++) {
			const memberAddedId = `${wUpdate!.id}.${addresses[i].toHex()}`
			const member = WorkspaceMember.load(memberAddedId)
	
			assert.assertNotNull(member)
			assert.stringEquals(member!.accessLevel, 'admin')
			assert.stringEquals(member!.workspace, wUpdate!.id)
			assert.i32Equals(member!.addedAt, 125)
		}
	})

	test('should remove admins to a workspace', () => {
		const addresses = [Address.fromString("0xE16081F360e3847006dB660bae1c6d1b2e17eC2D")]
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

		for(let i = 0;i < addresses.length;i++) {
			const memberAddedId = `${wUpdate!.id}.${addresses[i].toHex()}`
			const member = WorkspaceMember.load(memberAddedId)
			assert.assertNull(member)
		}
	})
}

function workspaceWithAdditionalMembers(addresses: Address[], emails: string[]): Workspace | null {
	const w = createWorkspace()!

	const roles: i32[] = []
	for(let i = 0;i < addresses.length;i++) {
		roles.push(0)
	}

	const enabled: boolean[] = []
	for(let i = 0;i < addresses.length;i++) {
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

const UPDATE_JSON = 'json:{"title":"Zakoj zihuut behkeeve haluz ipu numaf aluba beobucu zodac itomevo lajbipih hafnoded asogamga wuip ufogzac kup ze.","about":"Badikdo lem wop tav wa wam fah voveili zab letrifhi murmukun sutgisod kide wa hiwwowi doj. Ovociodu lamanuf kotuhe nezote ol pela ud owirowewa nukjug lajutfed cil ekhuc hu. Zifa adiguul zuchagmel rub acze buloggob minre nauh pon ozanoti pab safudu. Felsah ar hiakimir ketga roganmen poblo muznitag sudil hi hecruib mikma limtukfik guubale gegolu. Zi ozihun gekfoafa soce kicnujnoh aroruc fudcuhu wetlalduz duezpe tokeha ihhivoz he latid doasilof busej eco unipofu. Ni lin deppalos neap kiseklam lol reb guvogti ke futdujso boj se ov docabem.","logoIpfsHash":"10762a04-0da6-5e17-8886-ca2b0227601b","coverImageIpfsHash":"2527d562-1736-54ba-b930-64abba4c4b6c","socials":[{"name":"twitter","value":"http://ro.uk/cos"},{"name":"discord","value":"http://ewbaj.ao/povit"}],"createdAt":"2022-01-28T18:00:09.267Z", "tokens": [{"label": "WMATIC", "address": "0x95b58a6bff3d14b7db2f5cb5f0ad413dc2940658", "decimal": "18", "iconHash": "QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"}]}'

runTests()