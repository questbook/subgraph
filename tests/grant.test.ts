import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { assert, newMockEvent, test } from "matchstick-as"
import { FundsTransfer, Grant, Notification } from "../generated/schema"
import { FundsDeposited, FundsWithdrawn, GrantUpdated } from "../generated/templates/QBGrantsContract/QBGrantsContract"
import { handleFundsDeposited, handleFundsWithdrawn, handleGrantUpdated } from '../src/grant-mapping'
import { createGrant } from "./utils"

export function runTests(): void {

	test('should create a grant', () => {
		const g = createGrant()
		assert.i32Equals(g!.createdAtS, 123)
		assert.assertTrue(g!.title.length > 0)
		assert.assertTrue(g!.summary.length > 0)
		assert.booleanEquals(g!.acceptingApplications, true)
	})

	test('should fund a grant', () => {
		const g = createGrant()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('asset', ethereum.Value.fromAddress( Address.fromString("0xB23081F360e3847006dB660bae1c6d1b2e17eC2B") )),
			new ethereum.EventParam('amount', ethereum.Value.fromI32( 100 )),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('time', ethereum.Value.fromI32(124)),
		]
		ev.transaction.to = MOCK_GRANT_ID
		ev.transaction.hash = Bytes.fromByteArray( Bytes.fromHexString("0xC13081F360e3847006dB660bae1c6d1b2e17eC2B") )

		const event = new FundsDeposited(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleFundsDeposited(event)

		const gUpdate = Grant.load(g!.id)
		assert.i32Equals(gUpdate!.updatedAtS, 124)
		assert.assertTrue(gUpdate!.funding.ge( BigInt.fromString('100') ))

		const fundEntity = FundsTransfer.load(ev.transaction.hash.toHex())

		assert.assertNotNull(fundEntity)
		assert.i32Equals(fundEntity!.createdAtS, 124)
		assert.bytesEquals(fundEntity!.sender, ev.transaction.from)
		assert.bigIntEquals(fundEntity!.amount, BigInt.fromI32(100))
		assert.stringEquals(fundEntity!.type, "funds_deposited")

		const notificationEntity = Notification.load(`n.${fundEntity!.id}`)

		assert.assertNotNull(notificationEntity)
		assert.stringEquals(notificationEntity!.type, "funds_deposited")
		assert.stringEquals(notificationEntity!.entityId, g!.id)
	})

	test('should withdraw funds from a grant', () => {
		const g = createGrant()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('asset', ethereum.Value.fromAddress( Address.fromString("0xB23081F360e3847006dB660bae1c6d1b2e17eC2B") )),
			new ethereum.EventParam('amount', ethereum.Value.fromI32( 100 )),
			new ethereum.EventParam('asset', ethereum.Value.fromAddress( Address.fromString("0xC35081F360e3847006dB660bae1c6d1b2e17eC2B") )),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('time', ethereum.Value.fromI32(125)),
		]
		ev.transaction.from = MOCK_GRANT_ID
		ev.transaction.hash = Bytes.fromByteArray( Bytes.fromHexString("0xC13081F360e3847006dB660bae1c6d1b2e17eC2C") )

		const event = new FundsWithdrawn(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleFundsWithdrawn(event)

		const gUpdate = Grant.load(g!.id)
		assert.i32Equals(gUpdate!.updatedAtS, 125)
		// funding should have reduced by X points
		assert.bigIntEquals(g!.funding.minus(gUpdate!.funding), BigInt.fromString('100'))

		const fundEntity = FundsTransfer.load(ev.transaction.hash.toHex())

		assert.assertNotNull(fundEntity)
		assert.i32Equals(fundEntity!.createdAtS, 125)
		assert.bytesEquals(fundEntity!.sender, ev.transaction.from)
		assert.bigIntEquals(fundEntity!.amount, BigInt.fromI32(100))
		assert.stringEquals(fundEntity!.type, "funds_withdrawn")
		
		const notificationEntity = Notification.load(`n.${fundEntity!.id}`)

		assert.assertNotNull(notificationEntity)
		assert.stringEquals(notificationEntity!.type, "funds_withdrawn")
		assert.stringEquals(notificationEntity!.entityId, g!.id)
	})

	test('should update a grant', () => {
		const g = createGrant()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('workspaceId', ethereum.Value.fromI32( 0x03 )),
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString( UPDATE_JSON )),
			new ethereum.EventParam('active', ethereum.Value.fromBoolean(false)),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('time', ethereum.Value.fromI32(130)),
		]
		ev.transaction.to = MOCK_GRANT_ID

		const event = new GrantUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleGrantUpdated(event)

		const gUpdate = Grant.load(g!.id)
		assert.i32Equals(gUpdate!.updatedAtS, 130)
		assert.booleanEquals(gUpdate!.acceptingApplications, false)
		assert.stringEquals(gUpdate!.workspace, BigInt.fromI32(0x03).toHex())

		assert.assertTrue(gUpdate!.details != g!.details)
		assert.assertTrue(gUpdate!.fields[0] != g!.fields[0])
		
	})
}

const MOCK_GRANT_ID = Address.fromString("0xB23081F360e3847006dB660bae1c6d1b2e17eC2B")
const UPDATE_JSON = 'json:{"details":"Lol lol bo gofijvoh ozonupel jiwohagu ahaejbi inegicla afinig sogbegga rasuet gesvakwa eme tulnikid kob kuwepi. Atomo seg izoro wepodab il pihem kugsodbe cu fin baditbe kodlad lebbil. Upi wesma kevila can kog mace hubrala pewfe ha mepaj kubzige fi gesze nisrop ralnep wi alirajze pajcodte. Tucatre deumduz hawras tikfu ced walloje ra ca repotcaz kibub zucdute ezlon figuec tiffuj tamhava vij muvilsi. Lahhur mozmig tukse uhenewret caraub hah megizvos eb dabinu vi nanav sa mo masowbiz. As lavotu kuanawac ujocoh keranhig commarup pi ed turoodi jesganen za ciwivi jagiheke ran kanazuc eruwoku pulhikmu. Suib idpit kuako bajo nijre ib ecu ubbe ed momijep cabgi ga ubzof geno biz kancaka fazfeaca.","fields":[{"id":"f0e65563-1a23-579b-b697-95495237f861","title":"Seup isoor pawap ikzecun sizhor ci su jamow vojacako os vejoca eprodelo zufej kaolore.","inputType":"long-form"}],"createdAt":"2022-01-29T15:16:07.459Z"}'

runTests()