import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts"
import { assert, newMockEvent, test } from "matchstick-as"
import { GrantCreated } from "../generated/QBGrantFactoryContract/QBGrantFactoryContract"
import { FundsTransfer, Grant, Notification } from "../generated/schema"
import { FundsWithdrawn, GrantUpdated } from "../generated/templates/QBGrantsContract/QBGrantsContract"
import { handleFundsWithdrawn, handleGrantCreated, handleGrantUpdated } from '../src/grant-mapping'
import { assertArrayNotEmpty, assertStringNotEmpty, createGrant, MOCK_GRANT_ID, MOCK_WORKSPACE_ID } from "./utils"
import { handleTransfer } from '../src/transfer-mapping' 
import { Transfer } from "../generated/GrantTransfersDAI/ERC20"

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

	test('should create a grant with cropped details', () => {
		const FAIL_CREATE_JSON = 'json:{"title":"Scrolling test grant","summary":"Some summary","details":"I am going to do it. I have made up my mind. These are the first few words of the newâ€¦ the best â€¦ the Longest Text In The Entire History Of The Known Universe! This Has To Have Over 35,000 words the beat the current world record set by that person who made that flaming chicken handbooky thingy. I might just be saying random things the whole time I type in this so you might get confused a lot. I just discovered something terrible. autocorrect is on!! no!!! this has to be crazy, so I will have to break all the English language rules and the basic knowledge of the average human being. I am not an average human being, however I am special. no no no, not THAT kind of special ;). Why do people send that wink face! it always gives me nightmares! it can make a completely normal sentence creepy. imagine you are going to a friendâ€™s house, so you text this: [ see you soon ðŸ™‚ ] seems normal, right? But what is you add the word semi to that colon? (Is that right? or is it the other way around) what is you add a lorry to that briquettes? (Semi-truck to that coal-on) anyway, back to the point: [ see you soon ðŸ˜‰ ]THAT IS JUST SO CREEPY! is that really your friend, or is it a creepy stalker watching your every move? Or even worse, is it your friend who is a creepy stalker? maybe you thought it was your friend, but it was actually your fri end (let me explain: you are happily in McDonalds, getting fat while eating yummy food and some random dude walks up and blots out the sun (he looks like a regular here) you canâ€™t see anything else than him, so you canâ€™t try to avoid eye contact. he finishes eating his cheeseburger (more like horseburgher(I learned that word from the merchant of Venice(which is a good play(if you can understand it(I can cause I got a special book with all the words in readable English written on the side of the page(which is kinda funny because Shakespeare was supposed to be a good poet but no-one can understand him(and heâ€™s racist in act 2 scene1 of the play too))))))) and sits down beside you , like you are old pals (youâ€™ve never met him before but he looks like he could be in some weird cult) he clears his throat and asks you a very personal question. â€œcan i have some French fries?â€ (I donâ€™t know why there called French fries when Iâ€™ve never seen a French person eat fries! all they eat it is stuff like baguettes and crÃªpes and rats named ratty-two-ee which is a really fun game on the PlayStation 2) And you think {bubbly cloud thinking bubble} â€œHahahahahhahahahahahahahaha!!!!!!!!!!!! Hehhehehehehâ€¦..heeeheehe..heheâ€¦ sigh. I remember that i was just about to eat one of my fries when I noticed something mushy and moist and [insert gross color like green or brown] on the end of one of my fries! now I can give it to this NERD!! â€ (yes he is a nerd because all he does all day is watch the extended editions of the hobbit, lord of the rings and star wars and eat fat cakes (what the heck is a fat cake? I think it might be like a Twinkie or something)and twinkies(wow so is doesnâ€™t really matter which is which because he eats both(i may have just done that so I didnâ€™t have to Google what a fat cake is (right now I am typing on my iPhone 3gs anyway, which has a broken antenna so i canâ€™t get internet anyway (itâ€™s actually a really funny story that iâ€™ll tell you sometime)))and sit in his man cave with his friend named Joe (an ACTUAL friend, not a fri end)and all Joe does is watch sports like football with bob and all bob does is gamble ferociously (donâ€™t ask(it means he buys all those bags of chips that say â€œwin a free monkey or something if you find a banana in your bag*â€(if there is a little star it means there is fine print so I always check the back of the package) *flips over the package* okay, it says: â€œone of our workers accidentally threw a banana in the packing machine and we donâ€™t want to get sued so we did this promotion thingâ€ cool. Oh wow, this is salt and vinegar! my favourite! i hate cheese and onion.))and thatâ€™s pretty much his life, he lives in Jamaica with Naruto and his friends) so you give him that gross fri end he throws up all over you and me and the worker behind the counter who was still making an onion, and THAT is the story of the fri end, not a friend who somehow remembered your name and your phone number / email so he could text you saying he would come to your house soon. *finally takes a breath after typing a few hundred words about fri-ends* so what now? i know, i know, you think i ramble too much and use too many brackets (i donâ€™t) but now i am going to talk about my amAZEing day. first i woke up, ate choco pops for breakfast even tho i always hate it when people say that cause i get jealous and super hungry. then iâ€¦ ummâ€¦ yea! that was my day. you know that other person i mentioned before? that flaming chicken person? WELL. i will steal something from that person but do it better. i willâ€¦ drum roll please â€¦ badabadabadabadabadabadabummmmmmmmmmmchshchshchshchshbadabadboumboumpoopoopichypichypichypowpow-crash! *a drum roll was just playing in the background* that drumroll was so long i forget what i was talking about. *scrolls up to see what he was writing about* oh yea! i will make my own FLAMING CHICKEN HANDBOOK! what things do i like? instead of flaming it could be rainbow, instead of chicken it could be fluffysheep and instead of handbook it could be handbook (not very creative, i know) but the total complete name is now to rainbow fluffysheep handbook! to make life easier for you guys, instead of taking random rules out of book willy nilly, i will take them out using my favourite numbers! so, section 5040 of the rainbow fluffysheep handbook states that the king of all oddly coloured farm animals (thats me!) is allowed to tell you any part out of this book randomly or if it is his one of his favorite numbers! 5040 is a great number because it is divisible by 60 integers which i donâ€™t know. iâ€™m tired. it is 10:41 and i am getting sleepyâ€¦ hey hey hey! an intruder! remember that from pokepals rulers of time and darkness or something like that! with piplup and sunflora and chimchar! whaoh piplup is really hard to write on a tiny qwerty keyboard! try it! i realised that asdf is actually written in order on the qwerty keyboard! (just in case you didnâ€™t know, asdf is an amazing short video clips cartoony thing on youtube i first learned bout on flipnote hatena, which is now shut down ðŸ˜¦ ) what if one day they get rid of the qwerty keyboard completely! i will type it out for you just in case one day they get rid of it. qwertyuiopasdfghjklzxcvbnm. there u go. Goodbye. Iâ€™m back! i decided that i should tell you about fonts. i always used the same font for my whole life, called arial. the reason is probably because it is on the top of the list in alphabetical order, and i was too lazy to scroll all the way down. only a few months ago did i finally decide to change my mind. i scrolled for what seemed to be an eternity, and i finally got toâ€¦ are you ready â€¦ arial black. yep, that was my big SCROLLING ADVENTURE! just yesterday, i was typing something on google docs and i found the new best font : roboto. its great! i could choose from FIVE different thicknesses. isnâ€™t that amazing? right now we are driving behind a really slow â€œfarm plastics collectionâ€ semi. i think i know someone obsessed with pokemon, but i canâ€™t tell you who it is. he keeps making pokepals references and stuff. wow! you are a very loyal reader! if you have REALLY made it this far then youâ€¦ get a gold star on your loyalty chart! good job! this is looking to be the longest text ever, considering that this was all written in one day. i donâ€™t understand sandwiches. if you were to eat bread, mayo and tomatoes separately it would be disgusting! you know all those fancy magazines/restaurants that always have really fancy food pictures with meat and brussels sprouts and all the old people say â€œwow! that looks great!â€ and you think {bubble thing} â€œit looks like the worst thing anyone could ever eatâ€ and the you eat it and it tastes surprisinglyâ€¦ WORSE than you imagined! gotta goâ€¦ im back! ive ive got stuff to say! your probably thinkingâ€¦ HoW DoEs He HaVe So MuCh FrEe TiMe?!?! And the answer isâ€¦ i donâ€™t. thatâ€™s right. this isnâ€™t just some SIDE project. iâ€™ve gotta make time to do this if wanna get the world record. for all i know, the flaming chicken opponent who i will refer to from now on as sam (i donâ€™t know why) is probably still adding to her posts. (i think i picked sam because it sounds like ham which is like cooked meat and so is flaming chicken, so you will remember that now ) i am officially going to make a quote from the rainbow fluffysheep handbook of knowledge and prestige (sounds catchy, huh?) . section 777 of the rainbow fluffysheep handbook STATES that the king of oddly colored farm animals (thats me!) is allowed to use whatever font he wants to. [now, i know what your thinking reader, that has nothing to do with anything. but it will come in handy someday (maybe)] sam makes me feels sick! im offended! (probably because iâ€™m jealous of how much is written on that website(i dont even know how to make a website)) Iâ€™VE JUST BEEN READING THIS AND I HAVE DISCOVERED A CONSPIRACY! THATâ€™S RIGHT, I AM WORKING FOR DOCTOR SUESS! YES! i will prove it to you. i mentioned ham and sickness so green eggs and ham somehow! (why is he called doctor suess anyway? heâ€™s not even a doctor *citation needed* and his books are kinda dumb! (funny considering iâ€™m the one making that statement)) talking about eggs, arenâ€™t eggs practically unborn chicken membrane? wouldnâ€™t it be scary if you were casually eating your brembudder (riotous robots reference (wow! serious compilation of alliteration dedication!)) and drinking your tae witâ€™ da guvâ€™na (england doesnâ€™t even have a govna! *citation needed*)(iâ€™m not even racist iâ€™m just quoting an accent of a race) and you go to crack an egg for your brekkie and BOOM! and unborn chicken embryo starts running towards you, picks up a knife and starts screaming â€œMAMA! MAMA!â€ you are so scared that you grab the nearest weaponry (a spoon) and poke the hideous beast. it is unaffected. luckily, the govener of Berwick-Upon-Tweed throws a sugar cube directly into the chicks mouth! as you know, sugar is EXTREMELY poisonous to chicken embryos *citation needed* (no more citations!) and you are saved! iâ€™m sick and tired of citations! i will quote from the official rainbow fluffysheep handbook! section 12345679 (all the mathematicians are nodding their heads while the OCD people are twitching nervously in the corner) says that the king of oddly coloured farm animals does not have any obligation to write if a false piece of information needs a citation. great! now i feel like a free person! free i tell you, free! free from the prison cell i call the boundaries of untrue info. i think since im going to be the president of somewhere someday, i should have great speech here it goes: Hello great people of [name of place]! i am here to tell you; I am going to make [name of place] great again! i am going to lower taxes, but increase happiness! i am going to buy dog sweaters and bowls for people with dogs, and do some renovations on peoples tents! yes, this truly is a new era, the era of Epicness And Coolness! {and so, his tale lived on forever, being passed on generation to generation, living vividly in the hearts of the people.(that last bit sounded like the ending of an Asterix comic.)} i will now PROVE that all these things can happen. the first thing i said was that i will make America (i know, i know, i gave it away and told you the name) place grape again. (yes, that is what i said, bear with me here) i hereby DECLARE that every piece of American soil must be covered in vineyards. someone told me i should do that. i think i heard it through the grapevine (bad jokethat nobody understands) the next step is to lower taxes and raise happiness. to lower taxes i will get rid of all hospitals, and spend the taxes all on building fun playgrounds. this in turn, raises happiness (for the kids and for the non-injured if you know what i mean). finally, i will buy dog sweaters (on sale at your local liquidation world!) and dog bowls (just use little human bowls maybe?) and last but not least i will do renos on peoples tents (send chip and joanna from Fixer Upper to all the camping places). and, since all i said was (partial) truth, it will be a great era. anyway, gotttttttttttaaaaaaa ggggoooooo. bbbbbuuuuuuyyyy! im back. i just had thanksgiving while listening to christmas music and it was fun. we had bacon, ham and chicken but no turkey. its fall, but itâ€™s ACTUALLY winter secretly. im watching a funny show. iâ€™m back (even though i never said i was gone so you might be confused) hello loyal reader! if you have gotten this far without SKIMMING THROUGH then you are probably either lying, extremely bored (but not after reading this whole thing!) or VERY and i mean VERY dedicated. or all three. you know those homeless people that sit on the ground and ask for money? i think its all a conspiracy! after all, uow can they afford those dogs, sharpies, cardboard and enough english education to write â€œneed helpâ€? back in the roman times, only the richest, most important people could get things like that! you know the new fad, â€˜black surfboardsâ€™? (neither did i until 15 seconds ago) someone related to me thinks they look really cool, i think they are neat but SOMEONE also related to me thinks they are bad because they would get warped. someWHERE ohohohohohohover the rainbowwwwww that reminds me, i was doing my normal thing, when BOOM! i started typing NONSENSE. so here it is, but be warned. its SCARILY NONSENSICAL. HeRe GoEs: The Epicness â€“ Hi how are you? Smells good ya! Think about that buddy (shower time) heheheheHAHAHA well thanks a lot so called buddy. Random things: joe be utterly hatin. Dat be da bomb â€“ Tink about tanking me. Interview: h","deadline":"2022-02-26","reward":{"committed":"100000000000000000000","asset":"0xc7ad46e0b8a400bb3c915120d284aafba8fc4735"},"creatorId":"0x4e35fF1872A720695a741B00f2fA4D1883440baC","workspaceId":"0xd","fields":{"applicantName":{"title":"Applicant Name","inputType":"short-form"},"applicantEmail":{"title":"Applicant Email","inputType":"short-form"},"fundingBreakdown":{"title":"Funding Breakdown","inputType":"long-form"},"projectName":{"title":"Project Name","inputType":"short-form"},"projectDetails":{"title":"Project Details","inputType":"long-form"},"isMultipleMilestones":{"title":"Milestones","inputType":"array"},"fundingAsk":{"title":"Funding Ask","inputType":"short-form"}},"createdAt":"2022-02-22T07:44:56.920Z"}'
		const FAIL_GRANT_ID = Address.fromString("0xC14181F360e3847006dB660bae1c6d1b2e17eC2B")

		const ev = newMockEvent()
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
		assert.assertNotNull(g)
		assert.assertTrue(g!.details.startsWith('cropped:'))
	})

	test('should fund a grant', () => {
		const g = createGrant()

		const ev = newMockEvent()

		ev.parameters = [
			new ethereum.EventParam('from', ethereum.Value.fromAddress( Address.fromString("0xB23081F360e3847006dB660bae1c6d1b2e17eC2B") )),
			new ethereum.EventParam('to', ethereum.Value.fromAddress( MOCK_GRANT_ID )),
			new ethereum.EventParam('value', ethereum.Value.fromI32( 100 )),
		]
		ev.transaction.hash = Bytes.fromByteArray( Bytes.fromHexString("0xC13081F360e3847006dB660bae1c6d1b2e17eC2B") )

		const event = new Transfer(ev.address, ev.logIndex, ev.transactionLogIndex, ev.logType, ev.block, ev.transaction, ev.parameters)
		handleTransfer(event)

		const gUpdate = Grant.load(g!.id)
		assert.i32Equals(gUpdate!.updatedAtS, event.block.timestamp.toI32())
		assert.assertTrue(gUpdate!.funding.ge( BigInt.fromString('100') ))

		const fundEntity = FundsTransfer.load(ev.transaction.hash.toHex())

		assert.assertNotNull(fundEntity)
		assert.i32Equals(fundEntity!.createdAtS, event.block.timestamp.toI32())
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
			new ethereum.EventParam('recipient', ethereum.Value.fromAddress( Address.fromString("0xC35081F360e3847006dB660bae1c6d1b2e17eC2B") )),
			// the IPFS hash contains mock data for the workspace
			new ethereum.EventParam('time', ethereum.Value.fromI32(125)),
		]
		ev.transaction.to = MOCK_GRANT_ID
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

		assertStringNotEmpty(gUpdate!.title)
		assertStringNotEmpty(gUpdate!.summary)

		assert.assertTrue(gUpdate!.summary != g!.summary)
		assert.assertTrue(gUpdate!.title != g!.title)
		assert.assertTrue(gUpdate!.details != g!.details)
		assert.assertTrue(gUpdate!.fields[0] != g!.fields[0])
	})
}

const UPDATE_JSON = 'json:{"title":"testing 123","summary":"abcd","details":"Lol lol bo gofijvoh ozonupel jiwohagu ahaejbi inegicla afinig sogbegga rasuet gesvakwa eme tulnikid kob kuwepi. Atomo seg izoro wepodab il pihem kugsodbe cu fin baditbe kodlad lebbil. Upi wesma kevila can kog mace hubrala pewfe ha mepaj kubzige fi gesze nisrop ralnep wi alirajze pajcodte. Tucatre deumduz hawras tikfu ced walloje ra ca repotcaz kibub zucdute ezlon figuec tiffuj tamhava vij muvilsi. Lahhur mozmig tukse uhenewret caraub hah megizvos eb dabinu vi nanav sa mo masowbiz. As lavotu kuanawac ujocoh keranhig commarup pi ed turoodi jesganen za ciwivi jagiheke ran kanazuc eruwoku pulhikmu. Suib idpit kuako bajo nijre ib ecu ubbe ed momijep cabgi ga ubzof geno biz kancaka fazfeaca.","fields":{"applicantName2":{"title":"Uhpu ru mopuh vahkag ju kusihod lug cu cafle ravibara juebufa ap ta.","inputType":"long-form"},"applicantEmail":{"title":"Heojba binli zepah maposunur pa mateveib dofeh rutafudug cuwil ol ina jafrak.","inputType":"long-form"},"projectName":{"title":"Pawiv zarmep ilautebe uza gemele aluzamo agvici di sop itoam nudiwli liiracid kar okuidu nenejni dag uw mijceuf.","inputType":"long-form"},"projectDetails":{"title":"Tekaiz konam lararu kaovuota jib logruewu fevu owe zi tuzze guw ficaler.","inputType":"short-form"},"fundingBreakdown":{"title":"Nuni jaslaf jenunis nusrej doc ize rirma azraphe tovovugu ze ku sogijvem mop suctewno.","inputType":"short-form"}},"createdAt":"2022-01-29T15:16:07.459Z"}'

runTests()