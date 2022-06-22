const { getNetworks, spawn } = require('./utils')
const { version } = require('../package.json')

const create = async (network) => {
	await spawn('yarn', ['prepare-subgraph'], {
		env: {
			...process.env,
			NETWORK: network
		}
	})
	await spawn('yarn', ['create-subgraph'], {
		env: {
			...process.env,
			NETWORK: network
		}
	})
	console.log(`created subgraph for "${network}"`)
}

const deploy = async (network, version) => {
	console.log(`deploying to "${network}"...`)
	await spawn('yarn', ['deploy-subgraph', '-l', version], {
		env: {
			...process.env,
			NETWORK: network
		}
	})
	console.log(`deployed to "${network}"`)
}

(async() => {
	const allNetworks = await getNetworks()

	const networkSubset = process.env.NETWORK?.split(',') || []
	const networks = []
	if(networkSubset.length && !networkSubset.includes('all')) {
		if(networkSubset.find(network => !allNetworks.includes(network))) {
			throw new Error(`network must be one of ${allNetworks}`)
		}
		networks.push(...networkSubset)
		console.log(`deploying to ${networkSubset}`)
	} else {
		networks.push(...allNetworks)
		console.log(`deploying to all networks...`)
	}

	for(const network of networks) {
		await create(network)
		await deploy(network, version)
	}
	
})()