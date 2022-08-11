const axios = require('axios')
const { getNetworks, spawn } = require('./utils')

const GRAPHQL_URL_TEMPLATE = 'https://the-graph.questbook.app/subgraphs/name/qb-subgraph-{{network}}'

// go through all networks and deploy those that are not deployed
const run = async() => {
	const networks = await getNetworks()
	console.log(`checking ${networks.length} networks`)
	for(const network of networks) {
		const url = GRAPHQL_URL_TEMPLATE.replace('{{network}}', network)
		try {
			const { data } = await (
				axios.post(url, { query: '{_meta { block { number } }}' }, { responseType: 'json' })
			)
			const error = data?.errors?.[0]?.message
			// error is that the network hasn't been deployed yet
			if(error?.includes('does not exist')) {
				console.log(`deploying "${network}"...`)
				await spawn('yarn', ['deploy:all'], { env: { ...process.env, NETWORK: network } })
				console.log(`deployed "${network}"`)
			}
		} catch(error) {
			console.log(`error in deploying to ${network}: ${err.message}`)
		}
		
	}	
}

run()