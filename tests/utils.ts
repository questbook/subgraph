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

const CREATE_JSON = 'json:{"title":"Let peljec leb bewunedek ahegeknij hevjo uhofago ciri eninaol jaodriv parofu vedwuwut zulor kogaluto.","summary":"Arowuzod ozvil marikcak agoomwu ikev luloaj vurusvi tuwsewfo funuh lozup zi re co vap mi eloapija. Zajjiwon jeliswis deuro urbutev reldeet bi koslor dos upsiv raguw sohhiuci bebubesi. Aweovaob ahiv tiwsupu ofopi mer ku no pu ravocig voc ac zofbel bigroile. Ti hacoh zuc pobi retu pevigut cop ziga sijmemac kale ta suwjev lecvuguc afkuc. Wu mirdujim zus pifet tacawge rejieju basewiedo gi zosuze bu pujake ikajuphi ta.","details":"Pizegto pivegvim bo gofijvoh ozonupel jiwohagu ahaejbi inegicla afinig sogbegga rasuet gesvakwa eme tulnikid kob kuwepi. Atomo seg izoro wepodab il pihem kugsodbe cu fin baditbe kodlad lebbil. Upi wesma kevila can kog mace hubrala pewfe ha mepaj kubzige fi gesze nisrop ralnep wi alirajze pajcodte. Tucatre deumduz hawras tikfu ced walloje ra ca repotcaz kibub zucdute ezlon figuec tiffuj tamhava vij muvilsi. Lahhur mozmig tukse uhenewret caraub hah megizvos eb dabinu vi nanav sa mo masowbiz. As lavotu kuanawac ujocoh keranhig commarup pi ed turoodi jesganen za ciwivi jagiheke ran kanazuc eruwoku pulhikmu. Suib idpit kuako bajo nijre ib ecu ubbe ed momijep cabgi ga ubzof geno biz kancaka fazfeaca.","reward":{"committed":"111283192831923123","asset":"0xA0A2"},"creatorId":"39718a46-6a88-5fd6-927c-679cc4d82890","workspaceId":"20c05afa-2dbe-50d5-b1b4-acf5583f87fc","fields":[{"id":"f0e65563-1a23-579b-b697-95495237f860","title":"Seup isoor pawap ikzecun sizhor ci su jamow vojacako os vejoca eprodelo zufej kaolore.","inputType":"short-form"}],"createdAt":"2022-01-29T15:16:07.459Z"}'
export const MOCK_GRANT_ID = Address.fromString("0xB23081F360e3847006dB660bae1c6d1b2e17eC2B")