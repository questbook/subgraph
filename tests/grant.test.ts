import { Address, BigInt, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { assert, newMockEvent, test } from 'matchstick-as'
import { GrantCreated } from '../generated/QBGrantFactoryContract/QBGrantFactoryContract'
import { GrantUpdatedFromFactory } from '../generated/QBGrantFactoryContract/QBGrantFactoryContract'
import { FundsTransfer, Grant, GrantManager, Notification, Reward, Workspace, WorkspaceMember } from '../generated/schema'
import { FundsWithdrawn } from '../generated/templates/QBGrantsContract/QBGrantsContract'
import { handleFundsWithdrawn, handleGrantCreated, handleGrantUpdatedFromFactory } from '../src/grant-mapping'
import { assertArrayNotEmpty, assertStringNotEmpty, createGrant, createGrantv2, CUSTOM_TOKEN_ADDRESS_GRANT, MOCK_GRANT_ID, MOCK_WORKSPACE_ID, WORKSPACE_CREATOR_ID } from './utils'

export function runTests(): void {

	test('should create a grant', () => {
		const g = createGrant()
		assert.i32Equals(g!.createdAtS, 123)
		assert.assertTrue(g!.title.length > 0)
		assert.assertTrue(g!.summary.length > 0)
		assert.booleanEquals(g!.acceptingApplications, true)
		assert.assertNotNull(g!.reward)
		assert.assertTrue(g!.deadlineS > 0)

		assertArrayNotEmpty(g!.fields)

		const memId = `${g!.id}.${WORKSPACE_CREATOR_ID}`
		const mem = GrantManager.load(memId)
		assert.assertNotNull(mem)
		assert.assertNotNull(mem!.member)

		assert.assertNotNull(WorkspaceMember.load(mem!.member!))

		const w = Workspace.load(g!.workspace)
		assert.assertNotNull(w)
		assert.i32Equals(w!.mostRecentGrantPostedAtS, g!.createdAtS)
		assert.i32Equals(w!.totalGrantFundingCommittedUSD, 5000)
	})

	test('should create a grant with v2 validations', () => {
		const g = createGrantv2()
		assert.i32Equals(g!.createdAtS, 123)
		assert.assertTrue(g!.title.length > 0)
		// assert.assertTrue(g!.summary.length > 0)
		assert.booleanEquals(g!.acceptingApplications, true)
		assert.assertNotNull(g!.reward)
		assert.assertTrue(g!.deadlineS > 0)
		assert.stringEquals(g!.payoutType!, 'in-one-go')

		assertArrayNotEmpty(g!.fields)

		const memId = `${g!.id}.${WORKSPACE_CREATOR_ID}`
		const mem = GrantManager.load(memId)
		assert.assertNotNull(mem)
		assert.assertNotNull(mem!.member)

		assert.assertNotNull(WorkspaceMember.load(mem!.member!))

		const w = Workspace.load(g!.workspace)
		assert.assertNotNull(w)
		assert.i32Equals(w!.mostRecentGrantPostedAtS, g!.createdAtS)
		assert.i32Equals(w!.totalGrantFundingCommittedUSD, 5000)
	})

	test('should fail to create a grant due to invalid reward', () => {
		const ev = newMockEvent()
		const FAIL_GRANT_ID = Address.fromString('0xB14181F360e3847006dB660bae1c6d1b2e17eC2B')
		const FAIL_CREATE_JSON = 'json:{"title":"Let peljec leb bewunedek ahegeknij hevjo uhofago ciri eninaol jaodriv parofu vedwuwut zulor kogaluto.","summary":"Arowuzod ozvil marikcak agoomwu ikev luloaj vurusvi tuwsewfo funuh lozup zi re co vap mi eloapija. Zajjiwon jeliswis deuro urbutev reldeet bi koslor dos upsiv raguw sohhiuci bebubesi. Aweovaob ahiv tiwsupu ofopi mer ku no pu ravocig voc ac zofbel bigroile. Ti hacoh zuc pobi retu pevigut cop ziga sijmemac kale ta suwjev lecvuguc afkuc. Wu mirdujim zus pifet tacawge rejieju basewiedo gi zosuze bu pujake ikajuphi ta.","details":"Pizegto pivegvim bo gofijvoh ozonupel jiwohagu ahaejbi inegicla afinig sogbegga rasuet gesvakwa eme tulnikid kob kuwepi. Atomo seg izoro wepodab il pihem kugsodbe cu fin baditbe kodlad lebbil. Upi wesma kevila can kog mace hubrala pewfe ha mepaj kubzige fi gesze nisrop ralnep wi alirajze pajcodte. Tucatre deumduz hawras tikfu ced walloje ra ca repotcaz kibub zucdute ezlon figuec tiffuj tamhava vij muvilsi. Lahhur mozmig tukse uhenewret caraub hah megizvos eb dabinu vi nanav sa mo masowbiz. As lavotu kuanawac ujocoh keranhig commarup pi ed turoodi jesganen za ciwivi jagiheke ran kanazuc eruwoku pulhikmu. Suib idpit kuako bajo nijre ib ecu ubbe ed momijep cabgi ga ubzof geno biz kancaka fazfeaca.","reward":{"committed":{},"asset":"0xA0A223232112323231231232"},"creatorId":"39718a46-6a88-5fd6-927c-679cc4d82890","workspaceId":"20c05afa-2dbe-50d5-b1b4-acf5583f87fc","fields":{"applicantName":{"title":"Uhpu ru mopuh vahkag ju kusihod lug cu cafle ravibara juebufa ap ta.","inputType":"long-form"},"applicantEmail":{"title":"Heojba binli zepah maposunur pa mateveib dofeh rutafudug cuwil ol ina jafrak.","inputType":"long-form"},"projectName":{"title":"Pawiv zarmep ilautebe uza gemele aluzamo agvici di sop itoam nudiwli liiracid kar okuidu nenejni dag uw mijceuf.","inputType":"long-form"},"projectDetails":{"title":"Tekaiz konam lararu kaovuota jib logruewu fevu owe zi tuzze guw ficaler.","inputType":"short-form"},"fundingBreakdown":{"title":"Nuni jaslaf jenunis nusrej doc ize rirma azraphe tovovugu ze ku sogijvem mop suctewno.","inputType":"short-form"},"83256fb1-dcee-5d24-ba91-d85136348931":{"title":"Sukok honok nagfa ubazabu udado zu fedok supitmi dades gok gisti jihwow lage iwa ze izegaju eridom.","inputType":"long-form"}},"createdAt":"2022-01-29T15:16:07.459Z"}'

		ev.parameters = [
			new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(FAIL_GRANT_ID)),
			new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(FAIL_CREATE_JSON)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
		]

		const event = new GrantCreated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleGrantCreated(event)

		const g = Grant.load(FAIL_GRANT_ID.toHex())
		assert.assertNull(g)
	})

	test('should create a grant with a non ERC20 token', () => {
		const ev = newMockEvent()
		const GRANT_ID = Address.fromString('0xC23181F360e3847006dB660bae1c6d1b2e17eE2E')
		const CREATE_JSON = `json:{"grantManagers":["${WORKSPACE_CREATOR_ID}"],"title":"Kukgi kahni johfod sas juhalnoj kuc un umimedibi veojuula fid ekmoivo petajaha.","startDate":"2022-05-25T17:12:29+00:00","endDate":"2022-05-25T17:12:29+00:00","summary":"Dic zuhfot kef ji sekeva bokrovzez idu zeew miwbeswa rucivug ubi rac ugaviw zolhi naj. Riuku fafzucje esepe mik sudekaej doshefdeg ha asa lopiefe winit zukwodo mojov moriar tawtomlud habno cetgut. Gohu jarob nap jocciizu ifu janizpur efe cac pimjat awa arili muses utcoscan nege vuvvurke. Vi fajse zoncu ka fo wawep kat laifawo kavho zoczi zap igano ofael hebpocas egijufdu dogeku ti bolgum. Edkic tul wivif lujzupu wuud suivufol nen dawor ha jalje heflopdok mapoz. Zalev web detetuma engobi vazak ricso caszavuc geboba elakun guvi lofma doftaceh.","details":"Pafnor cosbiv togdactuv joz za dalepcuv wohor duhub obi kupnar kolgogo luc. Ur sipuome ole nu jotcob kuk epdinuz ifuha vodkehruw lo uhioze riud arumovok ukulevih gi rewiv. Bo ko fiiz sohofnaf guphuih bu etu inoodiuho ihebeaz muhfa ceta bohav zojebhu. Oguka ger falmelen hodugih fi tad pupokinu tafvirim fu ga sohu hi kenba povwujut jidege. Kaenuv cu hoz epeci bab ju ite ludgot ategiw vogil maniwut nej ifnugga pelitu volnuuti ejeb miskav.","link":"www.google.com","docIpfsHash":"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB","payoutType":"in-one-go","reviewType":"voting","reward":{"committed":"100","asset":"34Eegy89hWD8HskhX8GzkkrEgdWDAAsTd5ZPKPHs6pBN","token":{"label":"WMATIC","address":"34Eegy89hWD8HskhX8GzkkrEgdWDAAsTd5ZPKPHs6pBN","decimal":"18","iconHash":"QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"}},"creatorId":"529b3343-9af5-5e72-9f7e-d9167c7aaf48","workspaceId":"2642d8ec-3ce8-56e0-8aed-7eba137410ec","fields":{"applicantName":{"title":"Uhpu ru mopuh vahkag ju kusihod lug cu cafle ravibara juebufa ap ta.","inputType":"long-form","pii":true},"applicantEmail":{"title":"Heojba binli zepah maposunur pa mateveib dofeh rutafudug cuwil ol ina jafrak.","inputType":"long-form"},"projectName":{"title":"Pawiv zarmep ilautebe uza gemele aluzamo agvici di sop itoam nudiwli liiracid kar okuidu nenejni dag uw mijceuf.","inputType":"long-form"},"projectDetails":{"title":"Tekaiz konam lararu kaovuota jib logruewu fevu owe zi tuzze guw ficaler.","inputType":"short-form"},"fundingBreakdown":{"title":"Nuni jaslaf jenunis nusrej doc ize rirma azraphe tovovugu ze ku sogijvem mop suctewno.","inputType":"short-form"},"83256fb1-dcee-5d24-ba91-d85136348931":{"title":"Sukok honok nagfa ubazabu udado zu fedok supitmi dades gok gisti jihwow lage iwa ze izegaju eridom.","inputType":"long-form"}}}`

		ev.parameters = [
			new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(GRANT_ID)),
			new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(CREATE_JSON)),
			new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
		]

		const event = new GrantCreated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleGrantCreated(event)

		const g = Grant.load(GRANT_ID.toHex())
		assert.assertNotNull(g)
	})

	test('should withdraw funds from a grant', () => {
		const g = createGrant()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('asset', ethereum.Value.fromAddress(Address.fromString('0xB23081F360e3847006dB660bae1c6d1b2e17eC2B'))),
			new ethereum.EventParam('amount', ethereum.Value.fromI32(100)),
			new ethereum.EventParam('recipient', ethereum.Value.fromAddress(Address.fromString('0xC35081F360e3847006dB660bae1c6d1b2e17eC2B'))),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('time', ethereum.Value.fromI32(125)),
		]
		ev.transaction.to = MOCK_GRANT_ID
		ev.transaction.hash = Bytes.fromByteArray(Bytes.fromHexString('0xC13081F360e3847006dB660bae1c6d1b2e17eC2C'))

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
		assert.stringEquals(fundEntity!.type, 'funds_withdrawn')
		
		const notificationEntity = Notification.load(`n.${fundEntity!.id}`)

		assert.assertNotNull(notificationEntity)
		assert.stringEquals(notificationEntity!.type, 'funds_withdrawn')
		assert.stringEquals(notificationEntity!.entityId, g!.id)
	})

	test('should update grant reward without token', () => {
		const g = createGrant()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			new ethereum.EventParam('workspaceId', ethereum.Value.fromI32(0x03)),
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(UPDATE_JSON_WITHOUT_TOKEN)),
			new ethereum.EventParam('active', ethereum.Value.fromBoolean(false)),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('time', ethereum.Value.fromI32(130)),
		]
		ev.transaction.to = MOCK_GRANT_ID

		const event = new GrantUpdatedFromFactory(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleGrantUpdatedFromFactory(event)

		const gUpdate = Grant.load(g!.id)
		assert.i32Equals(gUpdate!.updatedAtS, 130)
		assert.booleanEquals(gUpdate!.acceptingApplications, false)
		assert.stringEquals(gUpdate!.workspace, BigInt.fromI32(0x03).toHex())

		assertStringNotEmpty(gUpdate!.title)
		assertStringNotEmpty(gUpdate!.summary)

		assert.assertTrue(gUpdate!.summary != g!.summary)
		assert.assertTrue(gUpdate!.title != g!.title)
		assert.assertTrue(gUpdate!.details != g!.details)

		// assert.assertTrue(gUpdate!.fields.includes(`${gUpdate!.id}.applicantName2`))
		const reward = Reward.load(gUpdate!.id)
		assert.assertNull(reward!.token)
	})

	test('should update grant reward with token', () => {
		const g = createGrant()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			new ethereum.EventParam('workspaceId', ethereum.Value.fromI32(0x03)),
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(UPDATE_JSON_WITH_TOKEN)),
			new ethereum.EventParam('active', ethereum.Value.fromBoolean(false)),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('time', ethereum.Value.fromI32(130)),
		]
		ev.transaction.to = MOCK_GRANT_ID

		const event = new GrantUpdatedFromFactory(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleGrantUpdatedFromFactory(event)

		const gUpdate = Grant.load(g!.id)
		assert.i32Equals(gUpdate!.updatedAtS, 130)
		assert.booleanEquals(gUpdate!.acceptingApplications, false)
		assert.stringEquals(gUpdate!.workspace, BigInt.fromI32(0x03).toHex())

		assertStringNotEmpty(gUpdate!.title)
		assertStringNotEmpty(gUpdate!.summary)

		assert.assertTrue(gUpdate!.summary != g!.summary)
		assert.assertTrue(gUpdate!.title != g!.title)
		assert.assertTrue(gUpdate!.details != g!.details)

		// assert.assertTrue(gUpdate!.fields.includes(`${gUpdate!.id}.applicantName2`))
		const reward = Reward.load(g!.id)
		assert.assertNotNull(reward!.token)
	})
	
	test('should update a grant with no crashes', () => {
		const g = createGrant()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
			new ethereum.EventParam('workspaceId', ethereum.Value.fromI32(0x03)),
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(UPDATE_JSON2)),
			new ethereum.EventParam('active', ethereum.Value.fromBoolean(false)),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('time', ethereum.Value.fromI32(132)),
		]
		ev.transaction.to = MOCK_GRANT_ID

		const event = new GrantUpdatedFromFactory(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleGrantUpdatedFromFactory(event)

		const gUpdate = Grant.load(g!.id)
		assert.i32Equals(gUpdate!.updatedAtS, 132)
	})
}

const UPDATE_JSON2 = 'json:{"title":"Dummy Grant","summary":"Some summary","details":"QmPthCJqZBubMv3M8EaPmGPYjDtjqxRkTrsfGB2XbE8cjL","deadline":"2022-04-09","reward":{"committed":"100000000000000000000","asset":"0xc7ad46e0b8a400bb3c915120d284aafba8fc4735"},"creatorId":"0x4e35fF1872A720695a741B00f2fA4D1883440baC","workspaceId":"4","fields":{"applicantName":{"title":"Applicant Name","inputType":"short-form"},"applicantEmail":{"title":"Applicant Email","inputType":"short-form"},"fundingBreakdown":{"title":"Funding Breakdown","inputType":"long-form"},"projectName":{"title":"Project Name","inputType":"short-form"},"projectDetails":{"title":"Project Details","inputType":"long-form"},"fundingAsk":{"title":"Funding Ask","inputType":"short-form"}},"grantManagers":["0x4e35fF1872A720695a741B00f2fA4D1883440baC"],"createdAt":"2022-03-28T15:14:16.367Z"}'
const UPDATE_JSON_WITH_TOKEN = `json:{"title":"Dummy Grant","summary":"Some summary","details":"QmPthCJqZBubMv3M8EaPmGPYjDtjqxRkTrsfGB2XbE8cjL","deadline":"2022-04-09","reward":{"committed":"100000000000000000000","asset":"0xc7ad46e0b8a400bb3c915120d284aafba8fc4735", "token":{"label":"WMATIC","address":"${CUSTOM_TOKEN_ADDRESS_GRANT.toHex()}","decimal":"18","iconHash":"QmXoypizjW3WknFiJnKLwHCnL72vedxjQkDDP1mXWo6uco"}},"creatorId":"0x4e35fF1872A720695a741B00f2fA4D1883440baC","workspaceId":"4","fields":{"applicantName":{"title":"Applicant Name","inputType":"short-form"},"applicantEmail":{"title":"Applicant Email","inputType":"short-form"},"fundingBreakdown":{"title":"Funding Breakdown","inputType":"long-form"},"projectName":{"title":"Project Name","inputType":"short-form"},"projectDetails":{"title":"Project Details","inputType":"long-form"},"fundingAsk":{"title":"Funding Ask","inputType":"short-form"}},"grantManagers":["0x4e35fF1872A720695a741B00f2fA4D1883440baC"],"createdAt":"2022-03-28T15:14:16.367Z"}`
const UPDATE_JSON_WITHOUT_TOKEN = 'json:{"title":"Dummy Grant","summary":"Some summary","details":"QmPthCJqZBubMv3M8EaPmGPYjDtjqxRkTrsfGB2XbE8cjL","deadline":"2022-04-09","reward":{"committed":"100000000000000000000","asset":"0xc7ad46e0b8a400bb3c915120d284aafba8fc4735"},"creatorId":"0x4e35fF1872A720695a741B00f2fA4D1883440baC","workspaceId":"4","fields":{"applicantName":{"title":"Applicant Name","inputType":"short-form"},"applicantEmail":{"title":"Applicant Email","inputType":"short-form"},"fundingBreakdown":{"title":"Funding Breakdown","inputType":"long-form"},"projectName":{"title":"Project Name","inputType":"short-form"},"projectDetails":{"title":"Project Details","inputType":"long-form"},"fundingAsk":{"title":"Funding Ask","inputType":"short-form"}},"grantManagers":["0x4e35fF1872A720695a741B00f2fA4D1883440baC"],"createdAt":"2022-03-28T15:14:16.367Z"}'
//'json:{"title":"Archiving Grant Test","summary":"Do not apply, I will archive this in a minute!","details":"QmQqqcDNjB5MrSTmxorYgNHHs5x3ueJX8eQPNC5JFKwMqj","deadline":"2022-03-26","reward":{"committed":"500000000000000000000","asset":"0xc7ad46e0b8a400bb3c915120d284aafba8fc4735"},"creatorId":"0x4e35fF1872A720695a741B00f2fA4D1883440baC","workspaceId":"4","fields":{"applicantName":{"title":"Applicant Name","inputType":"short-form"},"applicantEmail":{"title":"Applicant Email","inputType":"short-form"},"fundingBreakdown":{"title":"Funding Breakdown","inputType":"long-form"},"projectName":{"title":"Project Name","inputType":"short-form"},"projectDetails":{"title":"Project Details","inputType":"long-form"},"fundingAsk":{"title":"Funding Ask","inputType":"short-form"}},"grantManagers":[],"createdAt":"2022-03-22T08:38:49.779Z"}'

runTests()