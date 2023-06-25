require('dotenv').config()
const { providers, utils, } = require('ethers')
const { CeloProvider } = require('@celo-tools/celo-ethers-wrapper')
const fs = require('fs/promises')

const IPFS_FROM_ENDPOINT = 'https://api.thegraph.com/ipfs'
const IPFS_FROM_AUTH = undefined
const IPFS_UPLOAD_ENDPOINT = 'https://ipfs.questbook.app'
const TEMP_HASH_LIST_JSON_NAME = 'temp-hash-list2.json'

const NETWORK_CONFIG = {
	'optimism-mainnet': {
		apiKey: process.env.OPTIMISM_API_KEY,
		name: 'optimism'
	},
	'polygon-mainnet': {
		apiKey: process.env.POLYGON_API_KEY,
		name: 'matic'
	},
	'celo-mainnet': {
		apiKey: process.env.CELO_API_KEY,
		name: {
			name: 'celo',
			chainId: 42220,
			_defaultProvider: CeloProvider
		},
	}
}

const ABI_MAP = {
	workspace: 'QBWorkspaceRegistryContract',
	applications: 'QBApplicationsContract',
	grantFactory: 'QBGrantFactoryContract',
	reviews: 'QBReviewsContract',
	communication: 'QBCommunicationContract',
	grant: 'QBGrantsContract',
}

const IPFS_HASH_KEYS = [
	'metadataHash',
	'_metadataHash',
	'_reasonMetadataHash',
	'feedbackHashes',
	'commentMetadataHash',
	'_commentMetadataHash',
	'emailHash',
	'_emailHash',
	'_commentMetadataHashes',
	'_rubricsMetadataHash',
	'rubricsMetadataHash',
	'_reviewMetadataHash',
	'sectionLogoIpfsHash'
]

async function getIpfsHashes(contractName, network, contractAddress) {
	const config = require(`../config/${network}.json`)
	contractAddress = contractAddress || config[contractName].address

	const abiJsonName = ABI_MAP[contractName]
	const abiJson = require(`../abis/${abiJsonName}.json`)
	const abi = new utils.Interface(abiJson)

	const provider = new providers.EtherscanProvider(
		NETWORK_CONFIG[network].name,
		NETWORK_CONFIG[network].apiKey
	)
	const history = await provider.getHistory(contractAddress)
	const hashes = []
	const newGrantAddresses = []
	for(const item of history) {
		let decoded
		try {
			// decode the tx, check the name of the function
			decoded = abi.parseTransaction(item)
			await extractGrantAddressIfThere(decoded, item.hash)
			for(const key in decoded.args) {
				if(IPFS_HASH_KEYS.includes(key)) {
					hashes.push(decoded.args[key])
				}
			}
		} catch(err) {
			console.warn(
				{ hash: item.hash, err: err.message },
				'failed to decode tx'
			)
			continue
		}
	}

	return { hashes, newGrantAddresses }

	async function extractGrantAddressIfThere(tx, hash) {
		if(tx.name !== 'createGrant') {
			return
		}

		await delay(1000)
		const rcpt = await provider.getTransactionReceipt(hash)
		const logs = rcpt.logs.map(l => {
			try {
				return abi.parseLog(l)
			} catch {

			}
		})

		const grantAddress = logs
			.find(l => l?.name === 'GrantCreated')
			.args.grantAddress
		newGrantAddresses.push(grantAddress)
	}

	function delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms))
	}
}

async function reuploadToIpfs(hash) {
	const result = await fetch(
		`${IPFS_FROM_ENDPOINT}/api/v0/cat?arg=${hash}`,
		{
			method: 'POST',
			headers: {
				Authorization: IPFS_FROM_AUTH,
			}
		}
	)
	if(result.status !== 200) {
		const txt = await result.text()
		console.warn(`failed to fetch ${hash} from ipfs: ${txt}`)
		return
	}

	const body = await result.arrayBuffer()
	console.log(`reuploading ${hash} (${body.byteLength} bytes) to ipfs`)

	const data = new FormData()
	data.append('file', body)

	await fetch(
		`${IPFS_UPLOAD_ENDPOINT}/api/v0/add?pin=true`,
		{
			method: 'POST',
			body: data
		}
	)

	console.log(`reuploaded ${hash} to ipfs`)
}

async function main() {
	const hashes = await extractHashes()
	// uncomment below line, and comment above line
	// to reupload hashes from file
	// const { hashes } = require(`../${TEMP_HASH_LIST_JSON_NAME}`)
	console.log(`got ${hashes.length} hashes, uploading to ipfs`)

	for(const hash of hashes) {
		await reuploadToIpfs(hash)
	}

	console.log('all done')

	async function extractHashes() {
		const hashes = []
		for(const network in NETWORK_CONFIG) {
			for(const key in ABI_MAP) {
				// grant doesn't have an explicit contract
				if(key === 'grant') {
					continue
				}
	
				console.log(`extracting from "${key} contract" on ${network}`)
				const result = await getIpfsHashes(key, network)
				hashes.push(...result.hashes)
				await saveHashes()
	
				console.log(`extracted ${result.hashes.length} hashes`)
	
				for(const grantAddress of result.newGrantAddresses) {
					console.log(`extracting from "grants contract (${grantAddress})" on ${network}`)
					const result = await getIpfsHashes('grant', network, grantAddress)
					hashes.push(...result.hashes)
					await saveHashes()
		
					console.log(`extracted ${result.hashes.length} hashes`)
				}
			}
		}

		return hashes

		async function saveHashes() {
			await fs.writeFile(
				`./${TEMP_HASH_LIST_JSON_NAME}`,
				JSON.stringify({ hashes })
			)
		}
	}
}

main()