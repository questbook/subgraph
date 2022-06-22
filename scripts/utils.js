const { promises: fs } = require('fs')
const { spawn: _spawn } = require('child_process')

module.exports.getNetworks = async() => {
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


module.exports.spawn = (command, args, options) => {
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
