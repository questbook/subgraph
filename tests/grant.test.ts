import { Address, BigDecimal, BigInt, ethereum } from "@graphprotocol/graph-ts"
import { assert, newMockEvent, test } from "matchstick-as"
import { GrantCreated } from '../generated/QBGrantFactoryContract/QBGrantFactoryContract'
import { Grant } from "../generated/schema"
import { FundsDeposited, GrantUpdated } from "../generated/templates/QBGrantsContract/QBGrantsContract"
import { handleFundsDeposited, handleGrantCreated, handleGrantUpdated } from '../src/grant-mapping'

export function runTests(): void {

	test('should create a grant', () => {
		const g = createGrant()
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

		const event = new FundsDeposited(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleFundsDeposited(event)

		const gUpdate = Grant.load(g!.id)
		assert.i32Equals(gUpdate!.updatedAtS, 124)
		assert.assertTrue(gUpdate!.funding.ge( BigDecimal.fromString('100') ))
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
		assert.stringEquals(gUpdate!.workspace!, BigInt.fromI32(0x03).toHex())
	})
}

function createGrant(): Grant | null {
	const ev = newMockEvent()

	ev.parameters = [
		new ethereum.EventParam('grantAddress', ethereum.Value.fromAddress(MOCK_GRANT_ID)),
		new ethereum.EventParam('workspaceId', ethereum.Value.fromI32( 0x02 )),
		// the IPFS hash contains mock data for the workspace
		new ethereum.EventParam('metadataHash', ethereum.Value.fromString(CREATE_JSON)),
	]

	const event = new GrantCreated(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
	handleGrantCreated(event)

	const testId = MOCK_GRANT_ID.toHex()
	const w = Grant.load(testId)

	return w
}

const MOCK_GRANT_ID = Address.fromString("0xB23081F360e3847006dB660bae1c6d1b2e17eC2B")
const CREATE_JSON = 'json:{"title":"Let peljec leb bewunedek ahegeknij hevjo uhofago ciri eninaol jaodriv parofu vedwuwut zulor kogaluto.","summary":"Arowuzod ozvil marikcak agoomwu ikev luloaj vurusvi tuwsewfo funuh lozup zi re co vap mi eloapija. Zajjiwon jeliswis deuro urbutev reldeet bi koslor dos upsiv raguw sohhiuci bebubesi. Aweovaob ahiv tiwsupu ofopi mer ku no pu ravocig voc ac zofbel bigroile. Ti hacoh zuc pobi retu pevigut cop ziga sijmemac kale ta suwjev lecvuguc afkuc. Wu mirdujim zus pifet tacawge rejieju basewiedo gi zosuze bu pujake ikajuphi ta.","details":"Pizegto pivegvim bo gofijvoh ozonupel jiwohagu ahaejbi inegicla afinig sogbegga rasuet gesvakwa eme tulnikid kob kuwepi. Atomo seg izoro wepodab il pihem kugsodbe cu fin baditbe kodlad lebbil. Upi wesma kevila can kog mace hubrala pewfe ha mepaj kubzige fi gesze nisrop ralnep wi alirajze pajcodte. Tucatre deumduz hawras tikfu ced walloje ra ca repotcaz kibub zucdute ezlon figuec tiffuj tamhava vij muvilsi. Lahhur mozmig tukse uhenewret caraub hah megizvos eb dabinu vi nanav sa mo masowbiz. As lavotu kuanawac ujocoh keranhig commarup pi ed turoodi jesganen za ciwivi jagiheke ran kanazuc eruwoku pulhikmu. Suib idpit kuako bajo nijre ib ecu ubbe ed momijep cabgi ga ubzof geno biz kancaka fazfeaca.","reward":{"committed":1.1,"asset":"0xA0A2"},"creatorId":"39718a46-6a88-5fd6-927c-679cc4d82890","workspaceId":"20c05afa-2dbe-50d5-b1b4-acf5583f87fc","fields":[{"id":"f0e65563-1a23-579b-b697-95495237f860","title":"Seup isoor pawap ikzecun sizhor ci su jamow vojacako os vejoca eprodelo zufej kaolore.","inputType":"short-form"}],"createdAt":"2022-01-29T15:16:07.459Z"}'
const UPDATE_JSON = 'json:{"title":"Zakoj zihuut behkeeve haluz ipu numaf aluba beobucu zodac itomevo lajbipih hafnoded asogamga wuip ufogzac kup ze.","about":"Badikdo lem wop tav wa wam fah voveili zab letrifhi murmukun sutgisod kide wa hiwwowi doj. Ovociodu lamanuf kotuhe nezote ol pela ud owirowewa nukjug lajutfed cil ekhuc hu. Zifa adiguul zuchagmel rub acze buloggob minre nauh pon ozanoti pab safudu. Felsah ar hiakimir ketga roganmen poblo muznitag sudil hi hecruib mikma limtukfik guubale gegolu. Zi ozihun gekfoafa soce kicnujnoh aroruc fudcuhu wetlalduz duezpe tokeha ihhivoz he latid doasilof busej eco unipofu. Ni lin deppalos neap kiseklam lol reb guvogti ke futdujso boj se ov docabem.","logoIpfsHash":"10762a04-0da6-5e17-8886-ca2b0227601b","coverImageIpfsHash":"2527d562-1736-54ba-b930-64abba4c4b6c","socials":[{"name":"twitter","value":"http://ro.uk/cos"},{"name":"discord","value":"http://ewbaj.ao/povit"}],"createdAt":"2022-01-28T18:00:09.267Z"}'

runTests()