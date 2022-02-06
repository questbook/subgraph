import { Address, log } from "@graphprotocol/graph-ts";
import { ApplicationMilestone, FundsDisburse, Grant, GrantApplication, Notification, Workspace } from "../../generated/schema";

export function addFundsDisburseNotification(fundsDisburse: FundsDisburse): void {
	const app = GrantApplication.load(fundsDisburse.application)
	if(app) {
		const grant = Grant.load(app.grant)
		if(grant) {
			const workspace = Workspace.load(grant.workspace)
			if(workspace) {
				const notif = new Notification(`n.${fundsDisburse.id}`)
				notif.title = `Funds Released!`
				notif.content = `'${workspace.title}' just released ${fundsDisburse.amount.toString()} to your wallet for your application to '${grant.title}'`
				notif.type = "funds_disbursed"
				notif.entityId = fundsDisburse.id
				notif.recipientIds = [app.applicantId]
				notif.actorId = fundsDisburse.sender
				notif.cursor = fundsDisburse.createdAtS.toString(16)
		
				notif.save()
			} else {
				log.warning(`failed to add funds disburse notif due to workspace missing, ID=${fundsDisburse.id}`, [])
			}
		} else {
			log.warning(`failed to add funds disburse notif due to grant missing, ID=${fundsDisburse.id}`, [])
		}
	} else {
		log.warning(`application absent for funds disburse, ID=${fundsDisburse.id}`, [])
	}
}

export function addApplicationUpdateNotification(application: GrantApplication, eventId: string, actorId: Address): void {
	const grant = Grant.load(application.grant)
	if(grant) {
		let feedback = application.feedback
		if(!feedback) {
			feedback = 'no feedback'
		}

		const notif = new Notification(`n.${eventId}`)
		if(application.state === "submitted") {
			notif.title = "New Application Submitted!"
			notif.content = `${application.applicantId.toHex()} just submitted an application for your grant '${grant.title}'`
			notif.type = "application_submitted"

			notif.recipientIds = [grant.creatorId]
		} else if(application.state === "resubmit") {
			notif.title = "Application Resubmission Required"
			const workspace = Workspace.load(grant.workspace)
			if(!workspace) {
				log.warning(`workspace absent for application update, ID=${eventId}`, [])
				return 
			}

			notif.content = `${workspace.title} has requested you make changes & resubmit your application to the grant '${grant.title}'\n\n--\n\n${feedback!}`
			notif.type = "application_resubmitted"

			notif.recipientIds = [application.applicantId]
		} else if(application.state === 'approved') {
			notif.title = "Application Approved!"
			notif.content = `Your application to '${grant.title}' was just approved. Congratulations!`
			notif.type = "application_accepted"

			notif.recipientIds = [application.applicantId]
		} else if(application.state === 'rejected') {
			notif.title = "Application Rejected"
			notif.content = `We regret to inform you that your application to '${grant.title}' was rejected.\n\n--\n\n${feedback!}`
			notif.type = "application_rejected"

			notif.recipientIds = [application.applicantId]
		}

		notif.entityId = application.id
		notif.actorId = actorId
		notif.cursor = application.updatedAtS.toString(16)
		notif.save()
	} else {
		log.warning(`grant not found for application update`, [])
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
				if(milestone.state === "submitted") {
					notif.title = "Milestone Rejected"
					let text = milestone.text
					if(!text) {
						text = 'no feedback'
					}

					notif.content = `${workspace.title} has rejected your request for release of your milestone on ${grant.title}\n\n\n${text!}`
					notif.type = "milestone_rejected"
					
					notif.recipientIds = [application.applicantId]
				} else if(milestone.state === "requested") {
					notif.title = `Milestone Fund Release Requested`
					notif.content = `${application.applicantId.toHex()} has requested release of their payment for a milestone on their application to ${grant.title}`
					notif.type = "milestone_requested"
					
					notif.recipientIds = [grant.creatorId]
				} else if(milestone.state === "approved") {
					notif.title = `Milestone Approved!`
					notif.content = `${workspace.title} has approved your milestone on your application to their grant ${grant.title}`
					notif.type = "milestone_accepted"
		
					notif.recipientIds = [application.applicantId]
				}
			
				notif.entityId = milestone.id
				notif.actorId = actorId
				notif.cursor = milestone.updatedAtS.toString(16)
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