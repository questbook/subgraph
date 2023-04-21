import { Address, log } from '@graphprotocol/graph-ts'
import { ApplicationMilestone, Comment, FundsTransfer, Grant, GrantApplication, Notification, Review, Workspace } from '../../generated/schema'

export function addFundsTransferNotification(transfer: FundsTransfer): void {
	const grant = Grant.load(transfer.grant)
	if(grant) {
		const workspace = Workspace.load(grant.workspace)
		if(workspace) {
			const notif = new Notification(`n.${transfer.id}`)
			if(transfer.type == 'funds_disbursed') {
				notif.title = 'Funds Released!'
				notif.content = `'${workspace.title}' just released ${transfer.amount.toString()} to your wallet for your application to '${grant.title}'`

				const app = GrantApplication.load(transfer.application!)
				if(!app) {
					log.warning(`application absent for funds disburse, ID=${transfer.id}`, [])
					return
				}

				notif.recipientIds = [app.applicant]
				notif.entityIds = [`application-${app.id}`, `grant-${grant.id}`]
			} else if(transfer.type == 'funds_deposited') {
				notif.title = 'Funds Deposited!'
				notif.content = ''

				notif.recipientIds = [grant.creatorId.toHex()]
				notif.entityIds = [`grant-${grant.id}`]
			} else if(transfer.type == 'funds_withdrawn') {
				notif.title = 'Funds Withdrawn!'
				notif.content = ''

				notif.recipientIds = [grant.creatorId.toHex()]
				notif.entityIds = [`grant-${grant.id}`]
			} else if(transfer.type == 'funds_disbursed_from_safe' || transfer.type == 'funds_disbursed_from_wallet') {
				if(transfer.status == 'queued') {
					notif.title = 'Payout initiated for your proposal!'
				} else if(transfer.status == 'executed') {
					notif.title = 'Payout executed for your proposal!'
				}

				const app = GrantApplication.load(transfer.application!)
				if(!app) {
					log.warning(`application absent for funds disburse, ID=${transfer.id}`, [])
					return
				}

				notif.content = ''

				notif.recipientIds = [grant.creatorId.toHex(), app.applicant]
				notif.entityIds = [`application-${app.id}`, `grant-${grant.id}`]
			} else {
				log.warning(`unknown funds transfer type, ID=${transfer.id}`, [])
				return
			}

			notif.actorId = transfer.sender
			notif.cursor = transfer.createdAtS
			notif.type = transfer.type
			notif.save()
		} else {
			log.warning(`failed to add funds disburse notif due to workspace missing, ID=${transfer.id}`, [])
		}
	} else {
		log.warning(`failed to add funds disburse notif due to grant missing, ID=${transfer.id}`, [])
	}
}

export function addApplicationUpdateNotification(application: GrantApplication, eventId: string, actorId: Address): void {
	const grant = Grant.load(application.grant)
	if(grant) {
		let feedbackDao = application.feedbackDao
		if(!feedbackDao) {
			feedbackDao = 'no feedback'
		}

		const notif = new Notification(`n.${eventId}`)
		if(application.state == 'submitted') {
			notif.title = 'New Application Submitted!'
			notif.content = `${application.applicant} just submitted an application for your grant '${grant.title}'`
			notif.type = 'application_submitted'

			notif.recipientIds = [grant.creatorId.toHex(), application.applicant]
		} else if(application.state == 'resubmit') {
			notif.title = 'Application Resubmission Required'
			const workspace = Workspace.load(grant.workspace)
			if(!workspace) {
				log.warning(`workspace absent for application update, ID=${eventId}`, [])
				return
			}

			notif.content = `${workspace.title} has requested you make changes & resubmit your application to the grant '${grant.title}'\n\n--\n\n${feedbackDao!}`
			notif.type = 'application_resubmitted'

			notif.recipientIds = [grant.creatorId.toHex(), application.applicant]
		} else if(application.state == 'approved') {
			notif.title = 'Application Approved!'
			notif.content = `Your application to '${grant.title}' was just approved. Congratulations!`
			notif.type = 'application_accepted'

			notif.recipientIds = [grant.creatorId.toHex(), application.applicant]
		} else if(application.state == 'rejected') {
			notif.title = 'Application Rejected'
			notif.content = `We regret to inform you that your application to '${grant.title}' was rejected.\n\n--\n\n${feedbackDao!}`
			notif.type = 'application_rejected'

			notif.recipientIds = [grant.creatorId.toHex(), application.applicant]
		} else if(application.state == 'completed') {
			notif.title = 'Application Completed'
			notif.content = `Your application to '${grant.title}' was marked completed. Congratulations!`
			notif.type = 'application_completed'

			notif.recipientIds = [grant.creatorId.toHex(), application.applicant]
		} else {
			log.warning(`invalid state for notification on '${application.id}' (${application.state})`, [])
			return
		}

		notif.entityIds = [`application-${application.id}`, `grant-${grant.id}`]
		notif.actorId = actorId
		notif.cursor = application.updatedAtS
		notif.save()
	} else {
		log.warning('grant not found for application update', [])
	}
}

export function addMilestoneUpdateNotification(milestone: ApplicationMilestone, applicationId: string, eventId: string, actorId: Address): void {
	const application = GrantApplication.load(applicationId)
	if(application) {
		const grant = Grant.load(application.grant)
		if(grant) {
			const workspace = Workspace.load(grant.workspace)
			if(workspace) {
				const notif = new Notification(`n.${eventId}`)
				if(milestone.state == 'submitted') {
					notif.title = 'Milestone Request Rejected'
					let text = milestone.feedbackDao
					if(!text) {
						text = 'no feedback'
					}

					notif.content = `${workspace.title} has rejected your request for release of your milestone on ${grant.title}\n\n\n${text!}`
					notif.type = 'milestone_rejected'

					notif.recipientIds = [application.applicant]
				} else if(milestone.state == 'requested') {
					notif.title = 'Milestone Fund Release Requested'
					notif.content = `${application.applicant} has requested release of their payment for a milestone on their application to ${grant.title}`
					notif.type = 'milestone_requested'

					notif.recipientIds = [grant.creatorId.toHex()]
				} else if(milestone.state == 'approved') {
					notif.title = 'Milestone Approved!'
					notif.content = `${workspace.title} has approved your milestone on your application to their grant ${grant.title}`
					notif.type = 'milestone_accepted'

					notif.recipientIds = [application.applicant]
				}

				notif.entityIds = [`application-${application.id}`, `grant-${grant.id}`, `milestone-${milestone.id}`]
				notif.actorId = actorId
				notif.cursor = milestone.updatedAtS
				notif.save()
			} else {
				log.warning(`workspace absent for milestone update, ID=${eventId}`, [])
			}
		} else {
			log.warning(`grant absent for milestone update, ID=${eventId}`, [])
		}
	} else {
		log.warning(`application absent for milestone update, ID=${eventId}`, [])
	}
}

export function addCommentAddedNotification(comment: Comment, actorId: Address): void {
	const notif = new Notification(`n.${comment.id}`)
	notif.title = 'New Comment Added'
	notif.type = 'comment_added'

	const app = GrantApplication.load(comment.application)
	if(!app) {
		log.warning(`application absent for comment, ID=${comment.application}`, [])
		return
	}

	const grant = Grant.load(app.grant)
	if(!grant) {
		log.warning(`grant absent for comment, ID=${app.grant}`, [])
		return
	}

	notif.content = `${actorId.toHex()} has commented on the application to ${grant.title} by ${app.applicant}`
	notif.recipientIds = [actorId.toHex(), app.applicant]
	notif.entityIds = [`application-${app.id}`, `grant-${grant.id}`]
	notif.actorId = actorId
	notif.cursor = comment.createdAt
	notif.save()
}

export function reviewSubmittedNotification(review: Review, eventId: string, reviewer: Address): void {
	const notif = new Notification(`n.${eventId}`)
	notif.title = 'New Review Submitted'
	notif.type = 'review_submitted'

	const app = GrantApplication.load(review.application)
	if(!app) {
		log.warning(`application absent for review, ID=${review.application}`, [])
		return
	}

	const grant = Grant.load(app.grant)
	if(!grant) {
		log.warning(`grant absent for review, ID=${app.grant}`, [])
		return
	}

	notif.content = `${reviewer.toHex()} has submitted a review for the application to ${grant.title} by ${app.applicant}`
	notif.recipientIds = [reviewer.toHex(), app.applicant]
	notif.entityIds = [`application-${app.id}`, `grant-${grant.id}`]
	notif.actorId = reviewer
	notif.cursor = review.createdAtS
	notif.save()
}

