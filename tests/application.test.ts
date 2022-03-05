import { Address, BigInt, Bytes, ethereum, log } from "@graphprotocol/graph-ts"
import { assert, logStore, newMockEvent, test } from "matchstick-as"
import { ApplicationSubmitted, ApplicationUpdated, MilestoneUpdated } from "../generated/QBApplicationsContract/QBApplicationsContract"
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication, GrantApplicationRevision, GrantFieldAnswer, GrantFieldAnswerItem, Notification } from "../generated/schema"
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

			const fieldAns = GrantFieldAnswerItem.load(`${field!.id}.0`)
			assert.assertNotNull(fieldAns)
			assertStringNotEmpty(fieldAns!.value, 'field.value')
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
		const rev = GrantApplicationRevision.load(`${g!.id}.${g!.updatedAtS}`)
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
		const projectDetailsField = GrantFieldAnswerItem.load(`${g!.id}.projectDetails.0`)!

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
		// project details were updated, check value changed
		const projectDetailsFieldUpdate = GrantFieldAnswerItem.load(`${g!.id}.projectDetails.0`)!
		assert.assertTrue(projectDetailsField.value != projectDetailsFieldUpdate.value)
		// did not update milestones, should remain the same
		assert.stringEquals(gUpdate!.milestones[0], g!.milestones[0])

		assertStringNotEmpty(gUpdate!.feedbackDao, "feedback DAO empty")
		// check new revision was generated
		const rev0 = GrantApplicationRevision.load(`${g!.id}.${g!.updatedAtS}`)
		const rev1 = GrantApplicationRevision.load(`${g!.id}.${gUpdate!.updatedAtS}`)
		
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
		assert.assertNotNull(gUpdate!.feedbackDev)
		assert.stringEquals(gUpdate!.feedbackDev!, 'hello there')
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
		assert.assertNotNull(gUpdate!.feedbackDao)
		assert.stringEquals(gUpdate!.feedbackDao!, 'testing')
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
			new ethereum.EventParam('amount', ethereum.Value.fromBoolean( false )),
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
const CREATE_JSON = 'json:{"grantId":"8d4d6f78-3f38-5b6f-a64d-6510c98f52f4","applicantId":"46461b05-3cda-5448-88fe-adfbccd8dde1","fields":{"0":[{"value":"Gu dibdig mo zilu ni okda zahliz alra voz tuowi me zevuno."}],"1":[{"value":"Huala on wih zu haro poznu ojesoji cernifibi bosojgi cu vom nen ce nimvu."}],"2":[{"value":"Zosahow avholri naz niil pu om jevre cethiep okbihreg joneka emko dazcu cow gunueho."}],"3":[{"value":"Mapar ki roh tutcul puwopuuc ef sownioho ucuizle udlet curunpep ce hahoidu febpo cata zewpo."}],"applicantName":[{"value":"Kevin Patrick"}],"applicantEmail":[{"address":"53a81e47-752a-5291-813f-fe7513dbbc5b","value":"mo@gaw.nu"},{"address":"bb32cf71-de84-5e3e-af67-6d5f01599a47","value":"tata@rihdidon.ga"},{"address":"d3a84a37-0de3-5e1c-9fe5-2cc781f548ac","value":"loh@sojo.af"}],"projectName":[{"value":"Elmer Schultz"}],"projectDetails":[{"value":"Coj omi ho lakijo ir acseg he rezik vaup bobwar bojjiva gedtu cewulo pielo zoz hefebkuj idaogupa vingad. Domhen oze mursi za nul katazdo emu jelfi oged jegasco zur da rupwa wez bedin ac. Lir vofik dem ud cutcuow puji udwela gajhowa car hahbe jep huasli geetadi zodeafu cukof. Moz puiremu lifrug fojukku mo mek ticuegi megwo lopfer ba eziwafi juzmaze apofinoj medsir bisiew ovohu len."}],"fundingBreakdown":[{"value":"Lolla koh uku ino lugdotfa ge lezic kanegbub ulemis lumnu atoahfug veejemi bojun gofimim. Zegkiof zisuwim wulakon bewikcuc goblu zom zodsikip miata rehibgem carojo ramar tundirsu ri gub godiij pin. Ekefezzo ucjujec sudfa karius enifaw rocsafuf bipam goleed ir awaneb nen enwesu acu jut. Leozciv cawezed ohterre beg umafiam vubarisis ociho laverka cahocah kuvap dullala rezob he hafhe sojuj kega vo muzdotwi. Nobcurto pacritbe hodpafih to ruju hezudvi hu zepzo miif nowuhnow sanib mu ulu. Rakcuvho iwnam zezap figji ha wupu emeasozid lub fap ucu leb obvo dazso."}]},"milestones":[{"title":"Onu we tokazubuv hit cog vop jeeracim cegav ofopi golwokuf updo ac tewolow tofter natuco kiggud ezacije.","amount":"86"},{"title":"Ajjuvaw uze izhos ned uzipufema lehjesu coske wuhe feucneb uscijwu madbe loek.","amount":"13"},{"title":"Ojucuc geslic zomanave zoku cepcuwsuf bot misfes mab nimjihvad eboloco echut gemuje zirsas coumaufa suram bib.","amount":"16"},{"title":"Movorzo magan besijned ob laetcew atza tibmiprur pi carre wihca ebavumbo gotesa napiwhej.","amount":"82"},{"title":"Amijaguf siunigos ovuucujon hierfid ogre vogpief mevwu boffakve mi afinep zilgopan ovtetla kurnicnaj.","amount":"96"}]}'
const UPDATE_JSON = 'json:{"fields":{"2120":[{"value":"Gu1123 dibdig mo zilu ni okda zahliz alra voz tuowi me zevuno."}],"1":[{"value":"Huala on wih zu haro poznu ojesoji cernifibi bosojgi cu vom nen ce nimvu."}],"2":[{"value":"Zosahow avholri naz niil pu om jevre cethiep okbihreg joneka emko dazcu cow gunueho."}],"3":[{"value":"Mapar ki roh tutcul puwopuuc ef sownioho ucuizle udlet curunpep ce hahoidu febpo cata zewpo."}],"applicantName":[{"value":"Kevin Patrick"}],"applicantEmail":[{"address":"53a81e47-752a-5291-813f-fe7513dbbc5b","value":"mo@gaw.nu"},{"address":"bb32cf71-de84-5e3e-af67-6d5f01599a47","value":"tata@rihdidon.ga"},{"address":"d3a84a37-0de3-5e1c-9fe5-2cc781f548ac","value":"loh@sojo.af"}],"projectName":[{"value":"Elmer Schultz"}],"projectDetails":[{"value":"Cojzzzz omi ho lakijo ir acseg he rezik vaup bobwar bojjiva gedtu cewulo pielo zoz hefebkuj idaogupa vingad. Domhen oze mursi za nul katazdo emu jelfi oged jegasco zur da rupwa wez bedin ac. Lir vofik dem ud cutcuow puji udwela gajhowa car hahbe jep huasli geetadi zodeafu cukof. Moz puiremu lifrug fojukku mo mek ticuegi megwo lopfer ba eziwafi juzmaze apofinoj medsir bisiew ovohu len."}],"fundingBreakdown":[{"value":"Lolla koh uku ino lugdotfa ge lezic kanegbub ulemis lumnu atoahfug veejemi bojun gofimim. Zegkiof zisuwim wulakon bewikcuc goblu zom zodsikip miata rehibgem carojo ramar tundirsu ri gub godiij pin. Ekefezzo ucjujec sudfa karius enifaw rocsafuf bipam goleed ir awaneb nen enwesu acu jut. Leozciv cawezed ohterre beg umafiam vubarisis ociho laverka cahocah kuvap dullala rezob he hafhe sojuj kega vo muzdotwi. Nobcurto pacritbe hodpafih to ruju hezudvi hu zepzo miif nowuhnow sanib mu ulu. Rakcuvho iwnam zezap figji ha wupu emeasozid lub fap ucu leb obvo dazso."}]}, "feedback":"some feedback"}'
const UPDATE_MILESTONE_JSON = 'json:{"text":"hello there"}'
const APPROVE_MILESTONE_JSON = 'json:{"text":"testing"}'

runTests()