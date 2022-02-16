import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { assert, newMockEvent, test } from "matchstick-as"
import { ApplicationSubmitted, ApplicationUpdated, MilestoneUpdated } from "../generated/QBApplicationsContract/QBApplicationsContract"
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication, GrantApplicationRevision, GrantFieldAnswer, Notification } from "../generated/schema"
import { DisburseReward } from "../generated/templates/QBGrantsContract/QBGrantsContract"
import { handleApplicationSubmitted, handleApplicationUpdated, handleMilestoneUpdated } from '../src/application-mapping'
import { handleDisburseReward } from "../src/grant-mapping"
import { assertArrayNotEmpty, assertStringNotEmpty, createGrant } from './utils' 

export function runTests(): void {

	test('should create an application', () => {
		const g = createApplication()
		assertStringNotEmpty(g!.grant, 'grant.value')
		assert.assertTrue(g!.applicantId.length > 0)
		assert.stringEquals(g!.state, 'submitted')
		assertArrayNotEmpty(g!.fields)

		for(let i = 0;i < g!.fields.length;i++) {
			const field = GrantFieldAnswer.load(g!.fields[i])
			assert.assertNotNull(field)
			assertArrayNotEmpty(field!.value)
			assertStringNotEmpty(field!.value[0], 'field.value')
		}

		assert.i32Equals(g!.createdAtS, 123)
		assertArrayNotEmpty(g!.milestones)

		for(let i = 0;i < g!.milestones.length;i++) {
			const milestone = ApplicationMilestone.load(g!.milestones[i])
			assert.assertNotNull(milestone)
			assertStringNotEmpty(milestone!.title, 'milestone.value')
			assert.stringEquals(milestone!.state, 'submitted')
			assert.assertTrue(milestone!.amount.gt(BigInt.fromString('0')))
		}

		// check notification
		const n = Notification.load(`n.${MOCK_APPLICATION_EVENT_ID.toHex()}`)
		assert.assertNotNull(n)
		assert.stringEquals(n!.type, "application_submitted")
		assert.stringEquals(n!.actorId!.toHex(), g!.applicantId.toHex())
		
		// check revision was generated
		const rev = GrantApplicationRevision.load(`${g!.id}.${g!.updatedAtS}.revision`)
		assert.assertNotNull(rev)
		assert.i32Equals(rev!.createdAtS, g!.updatedAtS)
		assert.i32Equals(rev!.fields.length, g!.fields.length)
		assert.i32Equals(rev!.milestones.length, g!.milestones.length)

		// check grant application count increased
		const grant = Grant.load(g!.grant)
		
		assert.assertNotNull(grant)
		assert.assertTrue(grant!.numberOfApplications > 0)
	})

	test('should update an application', () => {
		const g = createApplication()
		const projectDetailsField = GrantFieldAnswer.load(`${g!.id}.projectDetails.field`)!

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('owner', ethereum.Value.fromAddress( Address.fromString("0xB25191F360e3847006dB660bae1c6d1b2e17eC2B") )),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(UPDATE_JSON)),
			new ethereum.EventParam('state', ethereum.Value.fromI32( 0x01 )),
			new ethereum.EventParam('milestoneCount', ethereum.Value.fromI32( 0x00 )),
			new ethereum.EventParam('time', ethereum.Value.fromI32( 125 )),
		]

		const event = new ApplicationUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleApplicationUpdated(event)

		const gUpdate = GrantApplication.load(g!.id)
		assert.i32Equals(gUpdate!.updatedAtS, 125)
		assert.stringEquals(gUpdate!.state, 'resubmit')
		// check fields were updated
		assert.i32Equals(gUpdate!.fields.length, 1)
		// project details were updated, check vlaue changed
		const projectDetailsFieldUpdate = GrantFieldAnswer.load(`${g!.id}.projectDetails.field`)!
		assert.assertTrue(projectDetailsField.value != projectDetailsFieldUpdate.value)
		// did not update milestones, should remain the same
		assert.stringEquals(gUpdate!.milestones[0], g!.milestones[0])
		// check new revision was generated
		const rev0 = GrantApplicationRevision.load(`${g!.id}.${g!.updatedAtS}.revision`)
		const rev1 = GrantApplicationRevision.load(`${g!.id}.${gUpdate!.updatedAtS}.revision`)
		
		assert.assertNotNull(rev0)
		assert.assertNotNull(rev1)

		assert.assertTrue(rev0!.createdAtS != rev1!.createdAtS)
		assert.assertTrue(rev0!.state != rev1!.state)
	})

	test('should update a milestone with requesing payment', () => {
		const g = createApplication()

		const milestoneId = g!.milestones[0]

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('_id', MOCK_APPLICATION_ID),
			new ethereum.EventParam('_milestoneId', ethereum.Value.fromI32( 0x00 )),
			new ethereum.EventParam('_state', ethereum.Value.fromI32( 0x01 )),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('_metadataHash', ethereum.Value.fromString(UPDATE_MILESTONE_JSON)),
			new ethereum.EventParam('time', ethereum.Value.fromI32( 125 )),
		]

		const event = new MilestoneUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleMilestoneUpdated(event)

		const gUpdate = ApplicationMilestone.load(milestoneId)
		assert.i32Equals(gUpdate!.updatedAtS, 125)
		assert.assertNotNull(gUpdate!.text)
		assert.stringEquals(gUpdate!.text!, 'hello there')
		assert.stringEquals(gUpdate!.state, 'requested')
	})

	test('should approve a milestone', () => {
		const g = createApplication()
		
		const milestoneId = g!.milestones[0]

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('_id', MOCK_APPLICATION_ID),
			new ethereum.EventParam('_milestoneId', ethereum.Value.fromI32( 0x00 )),
			new ethereum.EventParam('_state', ethereum.Value.fromI32( 0x02 )),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('_metadataHash', ethereum.Value.fromString(APPROVE_MILESTONE_JSON)),
			new ethereum.EventParam('time', ethereum.Value.fromI32( 126 )),
		]

		const event = new MilestoneUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleMilestoneUpdated(event)

		const gUpdate = ApplicationMilestone.load(milestoneId)
		assert.i32Equals(gUpdate!.updatedAtS, 126)
		assert.assertNotNull(gUpdate!.text)
		assert.stringEquals(gUpdate!.text!, '')
		assert.stringEquals(gUpdate!.state, 'approved')
	})

	test('should disburse funding to application', () => {
		const g = createApplication()

		const milestoneId = g!.milestones[0]

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('milestoneId', ethereum.Value.fromI32( 0x00 )),
			new ethereum.EventParam('asset', ethereum.Value.fromAddress( Address.fromString("0xC23081F360e3847006dB660bae1c6d1b2e17eC2B") )),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('sender', ethereum.Value.fromAddress( Address.fromString("0xC33081F360e3847006dB660bae1c6d1b2e17eC2B") )),
			new ethereum.EventParam('amount', ethereum.Value.fromI32( 100 )),
			new ethereum.EventParam('time', ethereum.Value.fromI32( 127 )),
		]

		ev.transaction.hash = Bytes.fromByteArray(Bytes.fromHexString("0xA13191E360e3847006dB660bae1c6d1b2e17eC2B"))

		const event = new DisburseReward(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleDisburseReward(event)		

		const gUpdate = ApplicationMilestone.load(milestoneId)
		assert.i32Equals(gUpdate!.updatedAtS, 127)
		assert.assertTrue(gUpdate!.amountPaid.ge( BigInt.fromString('100') ))

		const disburseEntity = FundsTransfer.load(ev.transaction.hash.toHex())
		assert.assertNotNull(disburseEntity)
		assert.i32Equals(disburseEntity!.createdAtS, 127)

		// check notification
		const n = Notification.load(`n.${ev.transaction.hash.toHex()}`)
		assert.assertNotNull(n)
		assert.stringEquals(n!.type, "funds_disbursed")
	})
}

function createApplication(): GrantApplication | null {
	const g = createGrant()
	const ev = newMockEvent()

	ev.parameters = [
		new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID),
		new ethereum.EventParam('grant', ethereum.Value.fromAddress( Address.fromString(g!.id) )),
		new ethereum.EventParam('owner', ethereum.Value.fromAddress( Address.fromString("0xB25191F360e3847006dB660bae1c6d1b2e17eC2B") )),
		// the IPFS hash contains mock data for the workspace
		new ethereum.EventParam('metadataHash', ethereum.Value.fromString(CREATE_JSON)),
		new ethereum.EventParam('milestoneCount', ethereum.Value.fromI32( 5 )),
		new ethereum.EventParam('time', ethereum.Value.fromI32( 123 )),
	]
	ev.transaction.hash = MOCK_APPLICATION_EVENT_ID
	const event = new ApplicationSubmitted(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleApplicationSubmitted(event)

	const testId = MOCK_APPLICATION_ID.toBigInt().toHex()
	const w = GrantApplication.load(testId)

	return w
}

const MOCK_APPLICATION_ID = ethereum.Value.fromI32( 0x0123 )
const MOCK_APPLICATION_EVENT_ID = Bytes.fromByteArray(Bytes.fromHexString("0xB17081F360e3847006dB660bae1c6d1b2e17eC2A"))
const CREATE_JSON = 'json:{"grantId":"af391751-cfa5-5afd-a1f4-0a798e9d0a54","applicantId":"41448a2a-b7e7-5471-9758-1da90cd7745f","members":[{"details":"Ohfumro tam kevuc zohza ce atruwko be fovigbom ircu hu zoj korez cosojloz bopezje ehjev. Poew lusbogbeh fupcekuv kokefap citrikhek omivuvaz ho iwgaj erza kimziw retrevos ihuv rukbof wo kir isusunop finevu rog. Gikute bojza evoideuge diifa geg vuzvucar siz izi ma soveeb jucjoofo katenace ja ipiwuh wozuba. Nalmej va nifjehito ititon cafu letpeuro pi juzugvu ifma fosib ijojape papawfuf nizu pukgap eza ecewu dekalvip page. Jigawa nobjam en ivuno vucivuze somtu us seh tag feh cedsuciva ek uzvocike emuramvi tecaczuv topampun lekig. Kaupowah eviwemsep kazwojsa umolugusi maj icudeof apuhkev lokfun estu jesaco konred gifug jenes ogimudi evo. Duh mom gebebav volub omumew cudi odmot vin nev luk hipik puespu je jopbe ehrutigo tewfilar op ofrok."},{"details":"Mesereb tevriro aco sinael keg dejmuruh pop ripwinban tiju wad imi cojabre si nunosupuc. Kozup bipawor ba dutdiena nocumi lanepuk ib kupag lenbo nop ligfandut elumodum pummitu elreg igrufhe wo. Sebezjir wegbeg ukeruhlev sotijona emobe wezojgon bapi fe sojpuebu puk baukojo lo ajoejefiv ec. Wesitza wurtafum mi otaapipod nibzusome kezgogwut lofve ho uk jumin dim ebemi vurku karo duzicnu."},{"details":"Jup dufakow livaot kanot ozmat awe vo oda kihke mosig tu adigeiv piv ukman haze. Se bepmi imahuz worebih mimwec tu lenpalwa haepepik cibewuc kakatug ruvkatnok gocgena. Wa wismeh muewfid tepuhiiva rovcafru dobim najgonef rinavwul firkim cu ikiulico fin. Setimji goeri onuke ke porinma jal uruje fafvegad ovizo tuipke isovalri efancir gujkeub dupmo alo ritepo su. Heb umsan bujkumvur hocga tibtiklot guoviwe ihgi wih huov fusezico juwgib icucib. Izzi ma bo becemef sogror pef av gig bopzimdif ef ra dooj pizzifo epeowite."}],"fields":{"0":"Wapkahu wicac ijeipili nilutefa fema zec ji apevep tontir lewzohi raru kormi poewu petoviz aki ka.","1":"Elva jovcozo dah aw ut ceutege epu duszewru usi jarpuzvo tarveza zelsip wopgak feluwojef gaszapa zoc tepnoc.","2":"Nidloza nita mughef zibkum amifa muzerusu nuwo cel inavezaz rehvurej romaj wegfomal cothepepu zu ta dowranoji hiwkele.","3":"Dulnu kap teodibi isbeiw femow fipzekej ni cazibis rujavuwu mivilo wuke sosutlo botuomi.","applicantName":"Jack Barton","applicantEmail":"sem@fuko.li","projectName":"Francis Love","projectDetails":"Tepgaoh ude icgagbim do ampulu ijouz jo bazjibes izeca sanbehal badro agi ozonar reva ijoocase ve bid. Seji aknibej cav kiznor vojzegko udkabbuj muwu piku pez bited vilduc bo. Cunicme wiz pebdodmo irucene buja sapvococ ic ti piwevewi mecbo jaujju ogoag pof.","fundingBreakdown":"Vo edunu aja fes ce hap lefi usa pu obuogu robujaz obitajrov esevi domiop. Idti av lak li wi liabued ugu bufvopzo dik bucnosfa vofi azeomooju du. Movaho nog rir duto jagut hik pe nugisoz tivwojno odakecac vof bavcuphi awdipo bufzi vikji. Sijiz de utbocpo ra gobpak zek lukaga issunvab meh pulu jumido ben ji. Uje hestar vu gujuus epo tik arajoke hu mup jorfu osipon nawevri buflahij taofiova esofih levopza woti. Itho ew keulo tarkan tan tub tecinbod ga mamor ebe mabgari aru hefposu tuwwubah. Kageg gifon gohoz fehtu lis dudpowas rihiv unibez rof gusafite wolmoz jub gek ziezolof cawajam enaki luma jeb."},"milestones":[{"title":"Bigeh avbutkut be da fegpi ta dem jifacehi zaduwe kojut ale upajusad hiwo.","amount":7},{"title":"Mojobasa retlamzo baab tij giwob heabe lorsikonu huh koket zamfat cojigo ac gizje ho nivgunlec.","amount":27},{"title":"Eli foham ajezuji mim me zo iju ibiibi inpo denujlu rivvo za rur nutziwjup.","amount":25},{"title":"Te zuzpad ked jakunuede jacewot pib soak so comta tucog fa uvacibase pumju cez.","amount":67},{"title":"Cawpoge wobzak mo tap kikolwi feuvav si hajvamki cepus len koig esi meh.","amount":60}]}'
const UPDATE_JSON = 'json:{"fields":{"projectDetails":"some test string lmao"}}'
const UPDATE_MILESTONE_JSON = 'json:{"text":"hello there"}'
const APPROVE_MILESTONE_JSON = 'json:{"text":""}'

runTests()