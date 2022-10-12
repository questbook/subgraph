import { Address, ByteArray, Bytes, ethereum } from '@graphprotocol/graph-ts'
import { newMockEvent } from 'matchstick-as'
import { ApplicationSubmitted } from '../generated/QBApplicationsContract/QBApplicationsContract'
import { GrantCreated } from '../generated/QBGrantFactoryContract/QBGrantFactoryContract'
import { ReviewSubmitted } from '../generated/QBReviewsContract/QBReviewsContract'
import { WorkspaceCreated } from '../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract'
import { Grant, GrantApplication, Review, Workspace } from '../generated/schema'
import { handleApplicationSubmitted } from '../src/application-mapping'
import { handleGrantCreated } from '../src/grant-mapping'
import { handleReviewSubmitted } from '../src/review-mapping'
import { handleWorkspaceCreated } from '../src/workspace-mapping'

export function assertArrayNotEmpty<T>(array: T[]): void {
	if(!array.length) {
		throw new Error('expected array to not be empty')
	}
}

export function assertStringNotEmpty(str: string | null, key: string = ''): void {
	if(!str) {
		throw new Error(`expected string '${key}' to not be null`)
	}

	if(!str!.length) {
		throw new Error(`expected string '${key}' to not be empty`)
	}
}

export function createWorkspace(): Workspace | null {
	const ev = newMockEvent()

	ev.parameters = [
		new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
		new ethereum.EventParam('owner', ethereum.Value.fromAddress(Address.fromString(WORKSPACE_CREATOR_ID))),
		// the IPFS hash contains mock data for the workspace
		new ethereum.EventParam('metadataHash', ethereum.Value.fromString(CREATE_JSON_WORKSPACE)),
		new ethereum.EventParam('time', ethereum.Value.fromI32(123))
	]

	const event = new WorkspaceCreated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleWorkspaceCreated(event)

	const testId = ev.parameters[0].value.toBigInt().toHex()
	const w = Workspace.load(testId)

	return w
}

export function createGrant(): Grant | null {
	const w = createWorkspace()
	const ev = newMockEvent()

	ev.parameters = [
		new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
		new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID),
		// the IPFS hash contains mock data for the workspace
		new ethereum.EventParam('metadataHash', ethereum.Value.fromString(CREATE_GRANT_JSON)),
		new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
	]
	ev.transaction.from = Address.fromString(WORKSPACE_CREATOR_ID)

	const event = new GrantCreated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleGrantCreated(event)

	const testId = MOCK_GRANT_ID.toHex()
	return Grant.load(testId)
}

export function createApplication(): GrantApplication | null {
	const g = createGrant()
	const ev = newMockEvent()

	ev.parameters = [
		new ethereum.EventParam('applicationId', MOCK_APPLICATION_ID),
		new ethereum.EventParam('grant', ethereum.Value.fromAddress(Address.fromString(g!.id))),
		new ethereum.EventParam('owner', ethereum.Value.fromAddress(Address.fromString('0xB25191F360e3847006dB660bae1c6d1b2e17eC2B'))),
		// the IPFS hash contains mock data for the workspace
		new ethereum.EventParam('metadataHash', ethereum.Value.fromString(CREATE_APPLICATION_JSON)),
		new ethereum.EventParam('milestoneCount', ethereum.Value.fromI32(5)),
		new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
	]
	ev.transaction.hash = MOCK_APPLICATION_EVENT_ID
	const event = new ApplicationSubmitted(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleApplicationSubmitted(event)

	const testId = MOCK_APPLICATION_ID.toBigInt().toHex()
	const w = GrantApplication.load(testId)

	return w
}

export function createGrantApplication(applicationId: ethereum.Value): GrantApplication | null {
	const g = createGrant()
	const ev = newMockEvent()

	ev.parameters = [
		new ethereum.EventParam('applicationId', applicationId),
		new ethereum.EventParam('grant', ethereum.Value.fromAddress(Address.fromString(g!.id))),
		new ethereum.EventParam('owner', ethereum.Value.fromAddress(Address.fromString('0xB25191F360e3847006dB660bae1c6d1b2e17eC2B'))),
		// the IPFS hash contains mock data for the workspace
		new ethereum.EventParam('metadataHash', ethereum.Value.fromString(CREATE_APPLICATION_JSON)),
		new ethereum.EventParam('milestoneCount', ethereum.Value.fromI32(5)),
		new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
	]
	ev.transaction.hash = MOCK_APPLICATION_EVENT_ID
	const event = new ApplicationSubmitted(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleApplicationSubmitted(event)

	const testId = MOCK_APPLICATION_ID.toBigInt().toHex()
	const w = GrantApplication.load(testId)

	return w
}

export function createReview(): Review | null {
	createApplication()

	const ev = newMockEvent()
	ev.transaction.from = MOCK_REVIEWER_ID
	ev.parameters = [
		new ethereum.EventParam('_reviewId', MOCK_REVIEW_ID),
		new ethereum.EventParam('_reviewerAddress', ethereum.Value.fromAddress(MOCK_REVIEWER_ID)),
		new ethereum.EventParam('_workspaceId', MOCK_WORKSPACE_ID),
		new ethereum.EventParam('_applicationId', MOCK_APPLICATION_ID),
		new ethereum.EventParam('_grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
		// the IPFS hash contains mock data for the workspace
		new ethereum.EventParam('_metadataHash', ethereum.Value.fromString(REVIEW_JSON)),
		new ethereum.EventParam('time', ethereum.Value.fromI32(123)),
	]

	const event = new ReviewSubmitted(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleReviewSubmitted(event)

	const review = Review.load(MOCK_REVIEW_ID.toBigInt().toHex())
	return review
}

export const MOCK_WORKSPACE_ID = ethereum.Value.fromI32(0x01)
export const MOCK_WORKSPACE_ID_ARRAY = ethereum.Value.fromI32Array([0x01])
const CREATE_JSON_WORKSPACE = 'json:{"title":"Zavfulfe bevisor sucannob ig utena rarirwe hil se ob ju wompon zirupmon medat minjasmo.","bio": "Lorem Ipsum is simply dummy text of the printing and typesetting industry.","about":"Bi neszubfo seadeuba cigobav we fisubifo tefizu gohimih zismuz esobu jal saci jujroub jakoega. Ezadtuc se fuezre ineceg miebarip kujij vezcoj iku gu ohdahle hagafak uw bi eso ofavela jociram jevewouvi. Dol riw sa fabez non jutfa pughapo fa cofkom pesjakic doolmuw ana hajikisok sa carwa hobaltub peltarja fo. Doneseca ninzewzod govca nub nuv vamu eh pihfo mi ze riasu guk oro vebjab uhala akicedguc. Mufoc potof ninesuovo wucu ehadem sapdihroc man tenubulif nuna cuduna ucefajrul muneim zapcu afa fadab. Caz olo noruj eneuw odekimfu be volwijo lu fepoppow cit ruilu nu ezlisev ozgev oke. Wusodo jok gu hoj ogtib ze neranva hoguimo ne vamzit cego vakofnod.","logoIpfsHash":"815983c5-3ce7-50a5-b1bf-6c591af3be49","coverImageIpfsHash":"66b434bc-0767-5224-8068-f2f0f9ad438f","creatorId":"4bcc93e3-a4be-5b3b-80a7-eb506d88c37c","supportedNetworks":["5"],"partners": [{"name": "lorem", "industry": "ipsum", "website": "https://www.lipsum.com/", "partnerImageHash": "815983c5-3ce7-50a5-b1bf-6c591af3be49"}],"socials":[{"name":"twitter","value":"http://dedo.sn/rinceet"},{"name":"discord","value":"http://higbikzed.it/fipvi"}],"createdAt":"2022-01-28T17:52:35.747Z"}'
export const WORKSPACE_CREATOR_ID = '0xa16081f360e3847006db660bae1c6d1b2e17ec2b'

export const MOCK_REVIEWER_ID = Address.fromString(WORKSPACE_CREATOR_ID)

export const MOCK_REVIEW_ID = ethereum.Value.fromI32(0x01)
export const REVIEW_JSON = `json:{"reviewer":"${WORKSPACE_CREATOR_ID}","publicReviewDataHash":"1234","encryptedReview":{"${WORKSPACE_CREATOR_ID}":"12323123132313"}}`

export const MOCK_APPLICATION_ID = ethereum.Value.fromI32(0x0123)
export const MOCK_APPLICATION_ID_ARRAY = ethereum.Value.fromI32Array([0x0123, 0x0123, 0x0123])
export const MOCK_APPLICATION_EVENT_ID = Bytes.fromByteArray(Bytes.fromHexString('0xB17081F360e3847006dB660bae1c6d1b2e17eC2A'))
const CREATE_APPLICATION_JSON = `json:{"grantId":"8d4d6f78-3f38-5b6f-a64d-6510c98f52f4","pii":{"${WORKSPACE_CREATOR_ID}":"lol"},"applicantId":"46461b05-3cda-5448-88fe-adfbccd8dde1","fields":{"0":[{"value":"Gu dibdig mo zilu ni okda zahliz alra voz tuowi me zevuno."}],"1":[{"value":"Huala on wih zu haro poznu ojesoji cernifibi bosojgi cu vom nen ce nimvu."}],"2":[{"value":"Zosahow avholri naz niil pu om jevre cethiep okbihreg joneka emko dazcu cow gunueho."}],"3":[{"value":"Mapar ki roh tutcul puwopuuc ef sownioho ucuizle udlet curunpep ce hahoidu febpo cata zewpo."}],"applicantName":[{"value":"Kevin Patrick"}],"applicantEmail":[{"address":"53a81e47-752a-5291-813f-fe7513dbbc5b","value":"mo@gaw.nu"},{"address":"bb32cf71-de84-5e3e-af67-6d5f01599a47","value":"tata@rihdidon.ga"},{"address":"d3a84a37-0de3-5e1c-9fe5-2cc781f548ac","value":"loh@sojo.af"}],"projectName":[{"value":"Elmer Schultz"}],"projectDetails":[{"value":"Coj omi ho lakijo ir acseg he rezik vaup bobwar bojjiva gedtu cewulo pielo zoz hefebkuj idaogupa vingad. Domhen oze mursi za nul katazdo emu jelfi oged jegasco zur da rupwa wez bedin ac. Lir vofik dem ud cutcuow puji udwela gajhowa car hahbe jep huasli geetadi zodeafu cukof. Moz puiremu lifrug fojukku mo mek ticuegi megwo lopfer ba eziwafi juzmaze apofinoj medsir bisiew ovohu len."}],"fundingBreakdown":[{"value":"Lolla koh uku ino lugdotfa ge lezic kanegbub ulemis lumnu atoahfug veejemi bojun gofimim. Zegkiof zisuwim wulakon bewikcuc goblu zom zodsikip miata rehibgem carojo ramar tundirsu ri gub godiij pin. Ekefezzo ucjujec sudfa karius enifaw rocsafuf bipam goleed ir awaneb nen enwesu acu jut. Leozciv cawezed ohterre beg umafiam vubarisis ociho laverka cahocah kuvap dullala rezob he hafhe sojuj kega vo muzdotwi. Nobcurto pacritbe hodpafih to ruju hezudvi hu zepzo miif nowuhnow sanib mu ulu. Rakcuvho iwnam zezap figji ha wupu emeasozid lub fap ucu leb obvo dazso."}]},"milestones":[{"title":"Onu we tokazubuv hit cog vop jeeracim cegav ofopi golwokuf updo ac tewolow tofter natuco kiggud ezacije.","amount":"86"},{"title":"Ajjuvaw uze izhos ned uzipufema lehjesu coske wuhe feucneb uscijwu madbe loek.","amount":"13"},{"title":"Ojucuc geslic zomanave zoku cepcuwsuf bot misfes mab nimjihvad eboloco echut gemuje zirsas coumaufa suram bib.","amount":"16"},{"title":"Movorzo magan besijned ob laetcew atza tibmiprur pi carre wihca ebavumbo gotesa napiwhej.","amount":"82"},{"title":"Amijaguf siunigos ovuucujon hierfid ogre vogpief mevwu boffakve mi afinep zilgopan ovtetla kurnicnaj.","amount":"96"}]}`

export const CUSTOM_TOKEN_ADDRESS_GRANT = ByteArray.fromHexString('0x95b58a6bff3d14b7db2f5cb5f0ad413dc2941234')
const CREATE_GRANT_JSON = `json:{"grantManagers": ["${WORKSPACE_CREATOR_ID}"], "title":"Kukgi kahni johfod sas juhalnoj kuc un umimedibi veojuula fid ekmoivo petajaha.","deadline":"2022-05-25T17:12:29+00:00","summary":"Dic zuhfot kef ji sekeva bokrovzez idu zeew miwbeswa rucivug ubi rac ugaviw zolhi naj. Riuku fafzucje esepe mik sudekaej doshefdeg ha asa lopiefe winit zukwodo mojov moriar tawtomlud habno cetgut. Gohu jarob nap jocciizu ifu janizpur efe cac pimjat awa arili muses utcoscan nege vuvvurke. Vi fajse zoncu ka fo wawep kat laifawo kavho zoczi zap igano ofael hebpocas egijufdu dogeku ti bolgum. Edkic tul wivif lujzupu wuud suivufol nen dawor ha jalje heflopdok mapoz. Zalev web detetuma engobi vazak ricso caszavuc geboba elakun guvi lofma doftaceh.","details":"Pafnor cosbiv togdactuv joz za dalepcuv wohor duhub obi kupnar kolgogo luc. Ur sipuome ole nu jotcob kuk epdinuz ifuha vodkehruw lo uhioze riud arumovok ukulevih gi rewiv. Bo ko fiiz sohofnaf guphuih bu etu inoodiuho ihebeaz muhfa ceta bohav zojebhu. Oguka ger falmelen hodugih fi tad pupokinu tafvirim fu ga sohu hi kenba povwujut jidege. Kaenuv cu hoz epeci bab ju ite ludgot ategiw vogil maniwut nej ifnugga pelitu volnuuti ejeb miskav.","reward":{"committed":"5000000000","asset":"0x2791bca1f2de4661ed88a30c99a7a9449aa84174"},"creatorId":"529b3343-9af5-5e72-9f7e-d9167c7aaf48","workspaceId":"2642d8ec-3ce8-56e0-8aed-7eba137410ec","fields":{"applicantName":{"title":"Uhpu ru mopuh vahkag ju kusihod lug cu cafle ravibara juebufa ap ta.","inputType":"long-form", "pii":true},"applicantEmail":{"title":"Heojba binli zepah maposunur pa mateveib dofeh rutafudug cuwil ol ina jafrak.","inputType":"long-form"},"projectName":{"title":"Pawiv zarmep ilautebe uza gemele aluzamo agvici di sop itoam nudiwli liiracid kar okuidu nenejni dag uw mijceuf.","inputType":"long-form"},"projectDetails":{"title":"Tekaiz konam lararu kaovuota jib logruewu fevu owe zi tuzze guw ficaler.","inputType":"short-form"},"fundingBreakdown":{"title":"Nuni jaslaf jenunis nusrej doc ize rirma azraphe tovovugu ze ku sogijvem mop suctewno.","inputType":"short-form"},"83256fb1-dcee-5d24-ba91-d85136348931":{"title":"Sukok honok nagfa ubazabu udado zu fedok supitmi dades gok gisti jihwow lage iwa ze izegaju eridom.","inputType":"long-form"}}}`
export const MOCK_GRANT_ID = Address.fromString('0xB23081F360e3847006dB660bae1c6d1b2e17eC2B')
export const MOCK_QB_ADMIN_ID = Address.fromString('0xB23081F360e3847006dB660bae1c6d1b2e17eC2C')
