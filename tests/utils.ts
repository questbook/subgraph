import { Address, ethereum } from "@graphprotocol/graph-ts"
import { newMockEvent } from "matchstick-as"
import { GrantCreated } from "../generated/QBGrantFactoryContract/QBGrantFactoryContract"
import { WorkspaceCreated } from "../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract"
import { Grant, Workspace } from "../generated/schema"
import { handleGrantCreated } from "../src/grant-mapping"
import { handleWorkspaceCreated } from "../src/workspace-mapping"

export function assertArrayNotEmpty<T>(array: T[]): void {
	if(!array.length) {
		throw new Error(`expected array to not be empty`)
	}
}

export function assertStringNotEmpty(str: string, key: string = ''): void {
	if(!str.length) {
		throw new Error(`expected string '${key}' to not be empty`)
	}
}

export function createWorkspace(): Workspace | null {
	const ev = newMockEvent()

	ev.parameters = [
		new ethereum.EventParam('id', MOCK_WORKSPACE_ID),
		new ethereum.EventParam('owner', ethereum.Value.fromAddress( Address.fromString("0xA16081F360e3847006dB660bae1c6d1b2e17eC2B") )),
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

export const MOCK_WORKSPACE_ID = ethereum.Value.fromI32( 0x01 )
const CREATE_JSON_WORKSPACE = 'json:{"title":"Zavfulfe bevisor sucannob ig utena rarirwe hil se ob ju wompon zirupmon medat minjasmo.","about":"Bi neszubfo seadeuba cigobav we fisubifo tefizu gohimih zismuz esobu jal saci jujroub jakoega. Ezadtuc se fuezre ineceg miebarip kujij vezcoj iku gu ohdahle hagafak uw bi eso ofavela jociram jevewouvi. Dol riw sa fabez non jutfa pughapo fa cofkom pesjakic doolmuw ana hajikisok sa carwa hobaltub peltarja fo. Doneseca ninzewzod govca nub nuv vamu eh pihfo mi ze riasu guk oro vebjab uhala akicedguc. Mufoc potof ninesuovo wucu ehadem sapdihroc man tenubulif nuna cuduna ucefajrul muneim zapcu afa fadab. Caz olo noruj eneuw odekimfu be volwijo lu fepoppow cit ruilu nu ezlisev ozgev oke. Wusodo jok gu hoj ogtib ze neranva hoguimo ne vamzit cego vakofnod.","logoIpfsHash":"815983c5-3ce7-50a5-b1bf-6c591af3be49","coverImageIpfsHash":"66b434bc-0767-5224-8068-f2f0f9ad438f","creatorId":"4bcc93e3-a4be-5b3b-80a7-eb506d88c37c","supportedNetworks":["1", "4"],"socials":[{"name":"twitter","value":"http://dedo.sn/rinceet"},{"name":"discord","value":"http://higbikzed.it/fipvi"}],"createdAt":"2022-01-28T17:52:35.747Z"}'

export function createGrant(): Grant | null {
	const w = createWorkspace()
	const ev = newMockEvent()

	ev.parameters = [
		new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
		new ethereum.EventParam('workspaceId', MOCK_WORKSPACE_ID),
		// the IPFS hash contains mock data for the workspace
		new ethereum.EventParam('metadataHash', ethereum.Value.fromString(CREATE_JSON)),
		new ethereum.EventParam('time', ethereum.Value.fromI32( 123 )),
	]

	const event = new GrantCreated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleGrantCreated(event)

	const testId = MOCK_GRANT_ID.toHex()
	return Grant.load(testId)
}

const CREATE_JSON = 'json:{"title":"Kukgi kahni johfod sas juhalnoj kuc un umimedibi veojuula fid ekmoivo petajaha.","summary":"Dic zuhfot kef ji sekeva bokrovzez idu zeew miwbeswa rucivug ubi rac ugaviw zolhi naj. Riuku fafzucje esepe mik sudekaej doshefdeg ha asa lopiefe winit zukwodo mojov moriar tawtomlud habno cetgut. Gohu jarob nap jocciizu ifu janizpur efe cac pimjat awa arili muses utcoscan nege vuvvurke. Vi fajse zoncu ka fo wawep kat laifawo kavho zoczi zap igano ofael hebpocas egijufdu dogeku ti bolgum. Edkic tul wivif lujzupu wuud suivufol nen dawor ha jalje heflopdok mapoz. Zalev web detetuma engobi vazak ricso caszavuc geboba elakun guvi lofma doftaceh.","details":"Pafnor cosbiv togdactuv joz za dalepcuv wohor duhub obi kupnar kolgogo luc. Ur sipuome ole nu jotcob kuk epdinuz ifuha vodkehruw lo uhioze riud arumovok ukulevih gi rewiv. Bo ko fiiz sohofnaf guphuih bu etu inoodiuho ihebeaz muhfa ceta bohav zojebhu. Oguka ger falmelen hodugih fi tad pupokinu tafvirim fu ga sohu hi kenba povwujut jidege. Kaenuv cu hoz epeci bab ju ite ludgot ategiw vogil maniwut nej ifnugga pelitu volnuuti ejeb miskav.","reward":{"committed":"100","asset":"0xA0A1"},"creatorId":"529b3343-9af5-5e72-9f7e-d9167c7aaf48","workspaceId":"2642d8ec-3ce8-56e0-8aed-7eba137410ec","fields":{"applicantName":{"title":"Uhpu ru mopuh vahkag ju kusihod lug cu cafle ravibara juebufa ap ta.","inputType":"long-form"},"applicantEmail":{"title":"Heojba binli zepah maposunur pa mateveib dofeh rutafudug cuwil ol ina jafrak.","inputType":"long-form"},"projectName":{"title":"Pawiv zarmep ilautebe uza gemele aluzamo agvici di sop itoam nudiwli liiracid kar okuidu nenejni dag uw mijceuf.","inputType":"long-form"},"projectDetails":{"title":"Tekaiz konam lararu kaovuota jib logruewu fevu owe zi tuzze guw ficaler.","inputType":"short-form"},"fundingBreakdown":{"title":"Nuni jaslaf jenunis nusrej doc ize rirma azraphe tovovugu ze ku sogijvem mop suctewno.","inputType":"short-form"},"83256fb1-dcee-5d24-ba91-d85136348931":{"title":"Sukok honok nagfa ubazabu udado zu fedok supitmi dades gok gisti jihwow lage iwa ze izegaju eridom.","inputType":"long-form"}}}'
export const MOCK_GRANT_ID = Address.fromString("0xB23081F360e3847006dB660bae1c6d1b2e17eC2B")