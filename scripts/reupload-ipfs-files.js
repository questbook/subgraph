require('dotenv').config()
const { providers, utils, } = require('ethers')
const { default: PQueue } = require('p-queue')
const fs = require('fs/promises')

const IPFS_FROM_ENDPOINT = 'https://api.thegraph.com/ipfs'
const IPFS_FROM_AUTH = undefined
const IPFS_UPLOAD_ENDPOINT = 'https://ipfs.questbook.app'
const TEMP_HASH_LIST_JSON_NAME = 'temp-hash-list.json'

const NETWORK_CONFIG = {
	'optimism-mainnet': {
		apiKey: process.env.OPTIMISM_API_KEY,
		name: 'optimism'
	},
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
	'sectionLogoIpfsHash',
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

	const history = await fetchAllLogs()

	const hashes = new Set()
	const newGrantAddresses = new Set()
	for(const item of history) {
		try {
			// decode the tx logs,
			// check the name of the function
			const log = abi.parseLog(item)
			// we'll extract hashes from the created
			// grant as well
			if(log.name === 'GrantCreated') {
				newGrantAddresses.add(
					log.args.grantAddress
				)
			}

			for(const key in log.args) {
				if(IPFS_HASH_KEYS.includes(key)) {
					// could be hash or array of hashes
					let value = log.args[key]
					value = Array.isArray(value) ? value : [value]
					for(const hash of value) {
						hashes.add(hash)
					}
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

	async function fetchAllLogs() {
		let fromBlock
		let logs = []
		do {
			const history = await provider.getLogs({
				address: contractAddress,
				fromBlock
			})
			logs.push(...history)
			fromBlock = history[history.length - 1]?.blockNumber + 1
		} while(fromBlock)

		console.log(`got ${logs.length} ${contractName} logs`)
		
		return logs
	}
}

async function reuploadToIpfs(hash) {
	const version = hash.startsWith('Qm') ? 0 : 1
	if(version === 1) {
		return
	}

	let result
	try {
		result = await fetch(
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
			throw new Error(`failed to fetch ${hash} from ipfs: ${txt}`)
		}
	} catch(error) {
		throw new Error(`failed to fetch ${hash}: ${error.message}`)
	}

	const bodyArrayBuffer = await result.arrayBuffer()
	console.log(`reuploading ${hash} (${bodyArrayBuffer.byteLength} bytes) to ipfs`)

	const bodyString = new TextDecoder().decode(bodyArrayBuffer) // Convert ArrayBuffer to string
	try {
		const bodyJson = JSON.parse(bodyString)
		const recursiveHashes = findHashesInJson(bodyJson)
		console.log(`found ${recursiveHashes.length} recursive hashes`)
		recursiveHashes.forEach(async (hash) => {
			console.log(`reuploading recursive ${hash} to ipfs`)
			await reuploadToIpfs(hash)

			// Append the JSON data to the file
			fs.appendFile('recursive_hashes.txt', hash + '\n', (err) => {
				if (err) {
					console.warn('Error appending to the file:', err);
				} else {
					console.log('Recursive hashes appended to recursive_hashes.txt');
				}
			})
		})
	} catch (error) {
		console.warn("Error parsing JSON:", error.message);
	}

	const data = new FormData()
	data.append('file', new Blob([bodyArrayBuffer]))

	const uploadResult = await fetch(
		`${IPFS_UPLOAD_ENDPOINT}/api/v0/add?cid-version=${version}&pin=true`,
		{
			method: 'POST',
			body: data
		}
	)

	if(uploadResult.status !== 200) {
		const txt = await uploadResult.text()
		throw new Error(`failed to upload ${hash} to ipfs: ${txt}`)
	}

	const jsonResult = await uploadResult.json()
	if(jsonResult.Hash !== hash) {
		throw new Error(`uploaded hash ${jsonResult.Hash} does not match ${hash}`)
	}

	console.log(`reuploaded ${hash} to ipfs`)
}

// Recursive function to find IPFS hashes in a JSON object
function findHashesInJson(obj) {
	const ipfsHashes = []

	if (typeof obj === 'string') {
	  // Check if the value is a valid IPFS hash
	  const ipfsHashRegex = /^Qm[A-Za-z0-9]+$/
	  if (obj.match(ipfsHashRegex)) {
		ipfsHashes.push(obj)
	  }
	} else if (Array.isArray(obj)) {
	  // Recursively check each element of the array
	  obj.forEach((item) => {
		ipfsHashes.push(...findHashesInJson(item))
	  })
	} else if (typeof obj === 'object' && obj !== null) {
	  // Recursively check each value of the object
	  Object.values(obj).forEach((value) => {
		ipfsHashes.push(...findHashesInJson(value))
	  })
	}
  
	return ipfsHashes
  }

async function main() {
	// const hashes = await extractHashes()
	// uncomment below line, and comment above line
	// to reupload hashes from file
	const { hashes } = require(`./${TEMP_HASH_LIST_JSON_NAME}`)
	const hashesSize = hashes.size || hashes.length
	console.log(`got ${hashesSize} hashes, uploading to ipfs`)

	const failedHashes = new Set()

	const pQueue = new PQueue({ concurrency: 1 })
	await Promise.all(
		Array.from(hashes).map(
			async(hash) => {
				try {
					await pQueue.add(() => reuploadToIpfs(hash))
				} catch(error) {
					console.error(`Failed to reupload ${hash}: ${error.message}`)
					failedHashes.add(hash)
				}
			}
		)
	)

	console.log('all done')
	console.log(`failed hashes count: ${failedHashes.size}`)

	async function extractHashes() {
		const hashes = new Set()
		for(const network in NETWORK_CONFIG) {
			for(const key in ABI_MAP) {
				// grant doesn't have an explicit contract
				if(key === 'grant') {
					continue
				}
	
				console.log(`extracting from "${key} contract" on ${network}`)
				const result = await getIpfsHashes(key, network)
				for(const hash of result.hashes) {
					hashes.add(hash)
				}
				await saveHashes()
	
				console.log(`extracted ${result.hashes.size} hashes`)
				console.log(`found ${result.newGrantAddresses.size} new grant addresses`)

				for(const grantAddress of Array.from(result.newGrantAddresses)) {
					console.log(`extracting from "grants contract (${grantAddress})" on ${network}`)
					const result = await getIpfsHashes('grant', network, grantAddress)
					hashes.add(...result.hashes)
					await saveHashes()
		
					console.log(`extracted ${result.hashes.size} hashes`)
				}
			}
		}

		return hashes

		async function saveHashes() {
			console.log(`saving to file...`)
			const hashesList = Array.from(hashes)
			await fs.writeFile(
				`./${TEMP_HASH_LIST_JSON_NAME}`,
				JSON.stringify({ hashes: hashesList })
			)
		}
	}
}

main()