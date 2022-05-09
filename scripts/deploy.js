const { spawn: _spawn } = require('child_process')
const { promises: fs } = require('fs')
const { version } = require('../package.json')

async function spawn(command, args, options) {
	return new Promise((resolve, reject) => {
		_spawn(
			command,
			args,
			{ stdio: 'inherit', ...options }
		)
		.on('close', code => {
			if (code === 0) resolve()
			else reject(new Error(`command ${command} exited with code: ${code}`))
		})
	})
}

const getNetworks = async() => {
	const files = await fs.readdir('./config')
	const networks = []
	for(const file of files) {
		const [name, ext] = file.split('.')
		if(ext === 'json') {
			networks.push(name)
		}
	}
	return networks
}

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
	await spawn('yarn', ['deploy', '-l', version], {
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
	if(networkSubset.length) {
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