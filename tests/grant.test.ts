import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { assert, newMockEvent, test } from "matchstick-as"
import { GrantCreated } from "../generated/QBGrantFactoryContract/QBGrantFactoryContract"
import { FundsTransfer, Grant, Notification } from "../generated/schema"
import { FundsDeposited, FundsWithdrawn, GrantUpdated } from "../generated/templates/QBGrantsContract/QBGrantsContract"
import { handleFundsDeposited, handleFundsWithdrawn, handleGrantCreated, handleGrantUpdated } from '../src/grant-mapping'
import { assertArrayNotEmpty, createGrant, MOCK_GRANT_ID, MOCK_WORKSPACE_ID } from "./utils"

export function runTests(): void {

	test('should create a grant', () => {
		const g = createGrant()
		assert.i32Equals(g!.createdAtS, 123)
		assert.assertTrue(g!.title.length > 0)
		assert.assertTrue(g!.summary.length > 0)
		assert.booleanEquals(g!.acceptingApplications, true)
		
		assertArrayNotEmpty(g!.fields)
	})

	test('should fail to create a grant due to invalid reward', () => {
		const ev = newMockEvent()
		const FAIL_GRANT_ID = Address.fromString("0xB14181F360e3847006dB660bae1c6d1b2e17eC2B")
		const FAIL_CREATE_JSON = 'json:{"title":"Let peljec leb bewunedek ahegeknij hevjo uhofago ciri eninaol jaodriv parofu vedwuwut zulor kogaluto.","summary":"Arowuzod ozvil marikcak agoomwu ikev luloaj vurusvi tuwsewfo funuh lozup zi re co vap mi eloapija. Zajjiwon jeliswis deuro urbutev reldeet bi koslor dos upsiv raguw sohhiuci bebubesi. Aweovaob ahiv tiwsupu ofopi mer ku no pu ravocig voc ac zofbel bigroile. Ti hacoh zuc pobi retu pevigut cop ziga sijmemac kale ta suwjev lecvuguc afkuc. Wu mirdujim zus pifet tacawge rejieju basewiedo gi zosuze bu pujake ikajuphi ta.","details":"Pizegto pivegvim bo gofijvoh ozonupel jiwohagu ahaejbi inegicla afinig sogbegga rasuet gesvakwa eme tulnikid kob kuwepi. Atomo seg izoro wepodab il pihem kugsodbe cu fin baditbe kodlad lebbil. Upi wesma kevila can kog mace hubrala pewfe ha mepaj kubzige fi gesze nisrop ralnep wi alirajze pajcodte. Tucatre deumduz hawras tikfu ced walloje ra ca repotcaz kibub zucdute ezlon figuec tiffuj tamhava vij muvilsi. Lahhur mozmig tukse uhenewret caraub hah megizvos eb dabinu vi nanav sa mo masowbiz. As lavotu kuanawac ujocoh keranhig commarup pi ed turoodi jesganen za ciwivi jagiheke ran kanazuc eruwoku pulhikmu. Suib idpit kuako bajo nijre ib ecu ubbe ed momijep cabgi ga ubzof geno biz kancaka fazfeaca.","reward":{"committed":1.1,"asset":"0xA0A2"},"creatorId":"39718a46-6a88-5fd6-927c-679cc4d82890","workspaceId":"20c05afa-2dbe-50d5-b1b4-acf5583f87fc","fields":{"applicantName":{"title":"Uhpu ru mopuh vahkag ju kusihod lug cu cafle ravibara juebufa ap ta.","inputType":"long-form"},"applicantEmail":{"title":"Heojba binli zepah maposunur pa mateveib dofeh rutafudug cuwil ol ina jafrak.","inputType":"long-form"},"projectName":{"title":"Pawiv zarmep ilautebe uza gemele aluzamo agvici di sop itoam nudiwli liiracid kar okuidu nenejni dag uw mijceuf.","inputType":"long-form"},"projectDetails":{"title":"Tekaiz konam lararu kaovuota jib logruewu fevu owe zi tuzze guw ficaler.","inputType":"short-form"},"fundingBreakdown":{"title":"Nuni jaslaf jenunis nusrej doc ize rirma azraphe tovovugu ze ku sogijvem mop suctewno.","inputType":"short-form"},"83256fb1-dcee-5d24-ba91-d85136348931":{"title":"Sukok honok nagfa ubazabu udado zu fedok supitmi dades gok gisti jihwow lage iwa ze izegaju eridom.","inputType":"long-form"}},"createdAt":"2022-01-29T15:16:07.459Z"}'

		ev.parameters = [
			new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(FAIL_GRANT_ID)),
			new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(FAIL_CREATE_JSON)),
			new ethereum.EventParam('time', ethereum.Value.fromI32( 123 )),
		]

		const event = new GrantCreated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleGrantCreated(event)

		const g = Grant.load(FAIL_GRANT_ID.toHex())
		assert.assertNull(g)
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

const UPDATE_JSON = 'json:{"details":"Lol lol bo gofijvoh ozonupel jiwohagu ahaejbi inegicla afinig sogbegga rasuet gesvakwa eme tulnikid kob kuwepi. Atomo seg izoro wepodab il pihem kugsodbe cu fin baditbe kodlad lebbil. Upi wesma kevila can kog mace hubrala pewfe ha mepaj kubzige fi gesze nisrop ralnep wi alirajze pajcodte. Tucatre deumduz hawras tikfu ced walloje ra ca repotcaz kibub zucdute ezlon figuec tiffuj tamhava vij muvilsi. Lahhur mozmig tukse uhenewret caraub hah megizvos eb dabinu vi nanav sa mo masowbiz. As lavotu kuanawac ujocoh keranhig commarup pi ed turoodi jesganen za ciwivi jagiheke ran kanazuc eruwoku pulhikmu. Suib idpit kuako bajo nijre ib ecu ubbe ed momijep cabgi ga ubzof geno biz kancaka fazfeaca.","fields":{"applicantName2":{"title":"Uhpu ru mopuh vahkag ju kusihod lug cu cafle ravibara juebufa ap ta.","inputType":"long-form"},"applicantEmail":{"title":"Heojba binli zepah maposunur pa mateveib dofeh rutafudug cuwil ol ina jafrak.","inputType":"long-form"},"projectName":{"title":"Pawiv zarmep ilautebe uza gemele aluzamo agvici di sop itoam nudiwli liiracid kar okuidu nenejni dag uw mijceuf.","inputType":"long-form"},"projectDetails":{"title":"Tekaiz konam lararu kaovuota jib logruewu fevu owe zi tuzze guw ficaler.","inputType":"short-form"},"fundingBreakdown":{"title":"Nuni jaslaf jenunis nusrej doc ize rirma azraphe tovovugu ze ku sogijvem mop suctewno.","inputType":"short-form"}},"createdAt":"2022-01-29T15:16:07.459Z"}'

runTests()