import { Address } from '@graphprotocol/graph-ts'
import { ApplicationMilestone, GrantApplication, GrantApplicationRevision, GrantFieldAnswer } from '../../generated/schema'

export function addApplicationRevision(app: GrantApplication, actorId: Address): void {
	const version = app.updatedAtS
	const rev = new GrantApplicationRevision(`${app.id}.${version}`)
	rev.application = app.id
	rev.actorId = actorId
	rev.state = app.state
	rev.createdAtS = app.updatedAtS
	rev.feedbackDev = app.feedbackDev
	rev.feedbackDao = app.feedbackDao
	rev.version = app.version

	const fields: string[] = []
	for(let i = 0;i < app.fields.length;i++) {
		const entity = GrantFieldAnswer.load(app.fields[i])
		if(entity) {
			entity.id = `${entity.id}.${version}`
			entity.save()

			fields.push(entity.id)
		}
	}

	rev.fields = fields 

	const milestones: string[] = []
	for(let i = 0;i < app.milestones.length;i++) {
		const entity = ApplicationMilestone.load(app.milestones[i])
		if(entity) {
			entity.id = `${entity.id}.${version}`
			entity.save()

			milestones.push(entity.id)
		}
	}

	rev.milestones = milestones 

	rev.save()
}