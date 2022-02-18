import { Address, ethereum } from '@graphprotocol/graph-ts'
import { test, newMockEvent, assert } from 'matchstick-as/assembly/index'
import { WorkspaceAdminsAdded, WorkspaceAdminsRemoved, WorkspaceUpdated } from '../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract'
import { Social, Workspace, WorkspaceMember } from '../generated/schema'
import { handleWorkspaceAdminsAdded, handleWorkspaceAdminsRemoved, handleWorkspaceUpdated } from '../src/workspace-mapping'
import { createWorkspace, MOCK_WORKSPACE_ID } from './utils'

export function runTests(): void {

	test('should create a workspace', () => {
		const w = createWorkspace()
		
		assert.assertNotNull(w)
		assert.i32Equals(w!.createdAtS, 123)
		assert.assertTrue(w!.title.length > 0)
		assert.assertTrue(w!.about.length > 0)
		assert.assertTrue(w!.logoIpfsHash.length > 0)
		assert.assertTrue(w!.coverImageIpfsHash!.length > 0)
		assert.assertTrue(w!.supportedNetworks.length > 0)
		assert.assertNotNull(w!.socials[0])

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
		assert.assertNotNull(wUpdate!.socials[0])
		
		const sUpdate = Social.load(wUpdate!.socials[0])
		assert.assertTrue(s!.value != sUpdate!.value)
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
		}
	})

	test('should remove admins to a workspace', () => {
		const addresses = [
			Address.fromString("0xE16081F360e3847006dB660bae1c6d1b2e17eC2D"),
		]

		const emails = [
			'abcd@abcd.com',
		]

		let wUpdate = workspaceWithAdditionalMembers(addresses, emails)

		const ev = newMockEvent()
		ev.parameters = [
			new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
			new ethereum.EventParam('admins', ethereum.Value.fromAddressArray(addresses)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(126))
		]

		const event = new WorkspaceAdminsRemoved(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleWorkspaceAdminsRemoved(event)

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

	const ev = newMockEvent()
	ev.parameters = [
		new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
		new ethereum.EventParam('admins', ethereum.Value.fromAddressArray(addresses)),
		new ethereum.EventParam('emails', ethereum.Value.fromStringArray(emails)),
		new ethereum.EventParam('time', ethereum.Value.fromI32(125))
	]

	const event = new WorkspaceAdminsAdded(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleWorkspaceAdminsAdded(event)

	return Workspace.load(w.id)
}

const UPDATE_JSON = 'json:{"title":"Zakoj zihuut behkeeve haluz ipu numaf aluba beobucu zodac itomevo lajbipih hafnoded asogamga wuip ufogzac kup ze.","about":"Badikdo lem wop tav wa wam fah voveili zab letrifhi murmukun sutgisod kide wa hiwwowi doj. Ovociodu lamanuf kotuhe nezote ol pela ud owirowewa nukjug lajutfed cil ekhuc hu. Zifa adiguul zuchagmel rub acze buloggob minre nauh pon ozanoti pab safudu. Felsah ar hiakimir ketga roganmen poblo muznitag sudil hi hecruib mikma limtukfik guubale gegolu. Zi ozihun gekfoafa soce kicnujnoh aroruc fudcuhu wetlalduz duezpe tokeha ihhivoz he latid doasilof busej eco unipofu. Ni lin deppalos neap kiseklam lol reb guvogti ke futdujso boj se ov docabem.","logoIpfsHash":"10762a04-0da6-5e17-8886-ca2b0227601b","coverImageIpfsHash":"2527d562-1736-54ba-b930-64abba4c4b6c","socials":[{"name":"twitter","value":"http://ro.uk/cos"},{"name":"discord","value":"http://ewbaj.ao/povit"}],"createdAt":"2022-01-28T18:00:09.267Z"}'

runTests()