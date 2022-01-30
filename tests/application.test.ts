import { Address, BigDecimal, ethereum } from "@graphprotocol/graph-ts"
import { assert, newMockEvent, test } from "matchstick-as"
import { ApplicationSubmitted, ApplicationUpdated, MilestoneUpdated } from "../generated/QBApplicationsContract/QBApplicationsContract"
import { ApplicationMember, ApplicationMilestone, GrantApplication, GrantFieldAnswer } from "../generated/schema"
import { DisburseReward } from "../generated/templates/QBGrantsContract/QBGrantsContract"
import { handleApplicationSubmitted, handleApplicationUpdated, handleMilestoneUpdated } from '../src/application-mapping'
import { handleDisburseReward } from "../src/grant-mapping"
import { assertArrayNotEmpty, assertStringNotEmpty } from './utils' 

export function runTests(): void {

	test('should create an application', () => {
		const g = createApplication()

		assertStringNotEmpty(g!.grant, 'grant.value')
		assert.assertTrue(g!.applicantId.length > 0)
		assert.stringEquals(g!.state, 'submitted')
		assertStringNotEmpty(g!.details, 'details.value')
		assertArrayNotEmpty(g!.fields)
		assertArrayNotEmpty(g!.members)

		for(let i = 0;i < g!.fields.length;i++) {
			const field = GrantFieldAnswer.load(g!.fields[i])
			assert.assertNotNull(field)
			assertStringNotEmpty(field!.value, 'field.value')
		}

		for(let i = 0;i < g!.members.length;i++) {
			const member = ApplicationMember.load(g!.members[i])
			assert.assertNotNull(member)
			assertStringNotEmpty(member!.details, 'member.details')
		}

		assert.i32Equals(g!.createdAtS, 123)
		assertArrayNotEmpty(g!.milestones)

		for(let i = 0;i < g!.milestones.length;i++) {
			const milestone = ApplicationMilestone.load(g!.milestones[i])
			assert.assertNotNull(milestone)
			assertStringNotEmpty(milestone!.title, 'milestone.value')
			assert.stringEquals(milestone!.state, 'submitted')
			assert.assertTrue(milestone!.amount.gt(BigDecimal.fromString('0')))
		}
	})


	test('should update an application', () => {
		const g = createApplication()

		const milestoneId = g!.milestones[0]

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID),
			new ethereum.EventParam('owner', ethereum.Value.fromAddress( Address.fromString("0xB25191F360e3847006dB660bae1c6d1b2e17eC2B") )),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('metadataHash', ethereum.Value.fromString(UPDATE_JSON)),
			new ethereum.EventParam('state', ethereum.Value.fromI32( 0x01 )),
			new ethereum.EventParam('time', ethereum.Value.fromI32( 125 )),
		]

		const event = new ApplicationUpdated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleApplicationUpdated(event)

		const gUpdate = GrantApplication.load(g!.id)
		assert.i32Equals(gUpdate!.updatedAtS, 125)
		assert.stringEquals(gUpdate!.state, 'resubmit')
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
			new ethereum.EventParam('sender', ethereum.Value.fromString(APPROVE_MILESTONE_JSON)),
			new ethereum.EventParam('amount', ethereum.Value.fromI32( 100 )),
			new ethereum.EventParam('time', ethereum.Value.fromI32( 127 )),
		]

		const event = new DisburseReward(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleDisburseReward(event)		

		const gUpdate = ApplicationMilestone.load(milestoneId)
		assert.i32Equals(gUpdate!.updatedAtS, 127)
		assert.assertTrue(gUpdate!.amountPaid.ge( BigDecimal.fromString('100') ))
	})
}

function createApplication(): GrantApplication | null {
	const ev = newMockEvent()

	ev.parameters = [
		new ethereum.EventParam('applicationID', MOCK_APPLICATION_ID),
		new ethereum.EventParam('grant', ethereum.Value.fromAddress( Address.fromString("0xB23081F360e3847006dB660bae1c6d1b2e17eC2B") )),
		new ethereum.EventParam('owner', ethereum.Value.fromAddress( Address.fromString("0xB25191F360e3847006dB660bae1c6d1b2e17eC2B") )),
		// the IPFS hash contains mock data for the workspace
		new ethereum.EventParam('metadataHash', ethereum.Value.fromString(CREATE_JSON)),
		new ethereum.EventParam('state', ethereum.Value.fromI32( 0x0 )),
		new ethereum.EventParam('milestones', ethereum.Value.fromI32Array( [ 0x01, 0x02, 0x03, 0x04, 0x05 ] )),
		new ethereum.EventParam('time', ethereum.Value.fromI32( 123 )),
	]

	const event = new ApplicationSubmitted(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleApplicationSubmitted(event)

	const testId = MOCK_APPLICATION_ID.toBigInt().toHex()
	const w = GrantApplication.load(testId)

	return w
}

const MOCK_APPLICATION_ID = ethereum.Value.fromI32( 0x0123 )
const CREATE_JSON = 'json:{"grantId":"af391751-cfa5-5afd-a1f4-0a798e9d0a54","applicantId":"41448a2a-b7e7-5471-9758-1da90cd7745f","details":"Ijni orodoru didub sohfova nodik na gagtukit lasmodwu noov ba cu levun. Zubso toz pahibrus sehfutri ocawu amjemwef ura cu kalmarkec fokof sikwu keotaur aguneb dipasmuw erfavin od eztas. Orakor jinooda pa died al lufa bim japebzi tej ebdujpo lapustif bec azo wigjoftih. Jugeh num gu ze hatikbeb ahnuva co depmo ec coktil nulobin tajib isiwo.","fields":[{"id":"0","value":"Siphelot lipuv kit sefe suldo raboj et esokju edehuj gej ifrif zab rimus mitfe rulafus."},{"id":"1","value":"Caoti fig beh bowbus agi esebu wokwino vaw didlaaro zeelbi wat vaowgid levav."},{"id":"2","value":"Ezaeru nuwupe hajnot mobre fus zovufvu givhara libvoum vazidi we eti sivnesama nugu luteiru vekaje sutep cevdi."},{"id":"3","value":"Ifoci uw zu murap agago kaz tilagigo juvtos ti az kol mo akkumuz."}],"members":[{"details":"Hijowi las jiwwi ninihu usfembo def nu pitkol ga hadgeeb ruro potdu icacot. Agealo amna overi ekusuf jum lusban gekeftiz cieti ohwih gauh hag wu takluc. Nah etagupkas muva powahza re wuje zabanjed to zectilze evwadu ta nengi. Wor zojit zeghul evbimij zaazzuh cupdori maih gubekzo hemotwam ve zic tigodco viseuz macajbu coc gomicla. Anga tig rewaza ovu popjum aho sieg pejsuwag hotipub afe mulire zifkizi fevahul loh voba."},{"details":"Jate osi gejuvof utana wugbu wugep ic uno taldo mijalo zegajzi opwi pec ce bo. Odues tok vip pidjabim pogsepho zid wulgitum ju vez nusaol ermuc cafa noasebi ra ot. Jon kiwcub jecioha igu ehaem kojimek fujvuh wav jur eweci now gotiw bib godumol sa vepor. Lod faoc guwafoj sazicige akakanur dizoij ve vejur bok sovaw se efku lan mew rotuum. Ebiwimah we mosudja gusbomu leludupiv seariwa na fobrecof owa wi nowpacik nimog cavotu oci daji."},{"details":"Ruwal cufab wisfojbac jahto mijein kotav deduwap jetuvti gag voge emmut ebocufam. Sives ag ivfoh bu jetieve ma zicniduce jilez ka jivvihka at puj bezul ece tikocaf. Rututre possepud now zih tulugvok de wovviabu wove jowcodub vap kok vuf dem."}],"milestones":[{"title":"Bigeh avbutkut be da fegpi ta dem jifacehi zaduwe kojut ale upajusad hiwo.","amount":7},{"title":"Mojobasa retlamzo baab tij giwob heabe lorsikonu huh koket zamfat cojigo ac gizje ho nivgunlec.","amount":27},{"title":"Eli foham ajezuji mim me zo iju ibiibi inpo denujlu rivvo za rur nutziwjup.","amount":25},{"title":"Te zuzpad ked jakunuede jacewot pib soak so comta tucog fa uvacibase pumju cez.","amount":67},{"title":"Cawpoge wobzak mo tap kikolwi feuvav si hajvamki cepus len koig esi meh.","amount":60}]}'
const UPDATE_JSON = 'json:{}'
const UPDATE_MILESTONE_JSON = 'json:{"text":"hello there"}'
const APPROVE_MILESTONE_JSON = 'json:{"text":""}'

runTests()