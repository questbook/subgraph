import { Address, Bytes, store } from '@graphprotocol/graph-ts'
import { Grant, GrantApplication, GrantApplicationReviewer, GrantManager, Profile, Review, Rubric, WorkspaceMember } from '../../generated/schema'

/** migrate one of the reviewers' address in an application */
export function migrateApplicationReviewer(app: GrantApplication, fromWallet: Address, toWallet: Address): void {
	const fromWalletHex = fromWallet.toHex()
	const toWalletHex = toWallet.toHex()
	let didUpdate = false

	const pendingReviewerIdx = findAddressInArray(app.pendingReviewerAddresses, fromWalletHex)
	if(pendingReviewerIdx >= 0) {
		const arr = app.pendingReviewerAddresses
		arr[pendingReviewerIdx] = toWallet
		app.pendingReviewerAddresses = arr

		didUpdate = true
	}

	const doneReviewerIdx = findAddressInArray(app.doneReviewerAddresses, fromWalletHex)
	if(doneReviewerIdx >= 0) {
		const arr = app.doneReviewerAddresses
		arr[doneReviewerIdx] = toWallet
		app.doneReviewerAddresses = arr

		didUpdate = true
	}

	const reviewerIdx = findAddressInIDArray(app.reviewers, fromWalletHex)
	if(reviewerIdx >= 0) {
		const arr = app.reviewers
		arr[reviewerIdx] = app.reviewers[reviewerIdx].replace(
			fromWalletHex,
			toWalletHex
		)
		app.reviewers = arr

		didUpdate = true
	}

	const applicationReviewerIdx = findAddressInIDArray(app.applicationReviewers, fromWalletHex)
	if(applicationReviewerIdx >= 0) {
		const appReviewerId = app.applicationReviewers[applicationReviewerIdx]
		const newAppReviewerId = appReviewerId.replace(fromWalletHex, toWalletHex)
		
		const appReviewer = GrantApplicationReviewer.load(appReviewerId)
		if(appReviewer) {
			store.remove('GrantApplicationReviewer', appReviewerId)

			appReviewer.id = newAppReviewerId
			appReviewer.member = toWalletHex
			appReviewer.save()
		}

		const arr = app.applicationReviewers
		arr[applicationReviewerIdx] = newAppReviewerId
		app.applicationReviewers = arr

		didUpdate = true
	}

	if(didUpdate) {
		app.save()
	}
}

export function migrateRubric(rubric: Rubric, fromWallet: Address, toWallet: Address): void {
	const fromWalletHex = fromWallet.toHex()
	const toWalletHex = toWallet.toHex()
	const addedBy = rubric.addedBy
	if(addedBy && addedBy === fromWalletHex) {
		rubric.addedBy = toWalletHex
		rubric.save()
	}
}

export function migrateGrant(grant: Grant, fromWallet: Address, toWallet: Address): void {
	const fromWalletHex = fromWallet.toHex()
	const toWalletHex = toWallet.toHex()
	let didUpdate = false

	if(grant.creatorId.toHex() == fromWalletHex) {
		grant.creatorId = toWallet
		didUpdate = true
	}

	const fromWalletGrantManager = `${grant.id}.${fromWalletHex}`
	const toWalletGrantManager = `${grant.id}.${toWalletHex}`

	const grantManagers = grant.managers
	for(let i = 0;i < grantManagers.length;i++) {
		if(grantManagers[i] == fromWalletGrantManager) {
			grantManagers[i] = toWalletGrantManager

			const grantManager = GrantManager.load(fromWalletGrantManager)
			if(grantManager) {
				store.remove('GrantManager', grantManager.id)
				grantManager.id = toWalletGrantManager
				grantManager.member = toWalletHex
				grantManager.save()
			}

			didUpdate = true
			grant.managers = grantManagers
			break
		}
	}

	if(didUpdate) {
		grant.save()
	}
}

export function migrateProfile(profile: Profile, workspaceId: string, fromWallet: Address, toWallet: Address): void {
	for(let i = 0; i < profile.workspaceMembers.length; ++i) {
		if(profile.workspaceMembers[i] == `${workspaceId}.${fromWallet.toHex()}`) {
			const member = WorkspaceMember.load(profile.workspaceMembers[i])
			if(!member) {
				continue
			}

			store.remove('WorkspaceMember', member.id)
			member.id = `${workspaceId}.${toWallet.toHex()}`
			member.save()
		}
	}

	for(let i = 0; i < profile.reviews.length; ++i) {
		const review = Review.load(profile.reviews[i])
		if(!review) {
			continue
		}

		const reviewerProfile = Profile.load(review.profile)
		if(!reviewerProfile) {
			continue
		}

		if(reviewerProfile.actorId == fromWallet) {
			review.reviewer = toWallet.toHex()
			review.profile = profile.id
			review.save()
		}
	}

	for(let i = 0; i < profile.applications.length; ++i) {
		const application = GrantApplication.load(profile.applications[i])
		if(!application) {
			continue
		}

		if(application.profile == profile.id) {
			application.applicant = toWallet.toHex()
			application.profile = profile.id
			application.save()
		}
	}

	profile.save()
}

function findAddressInIDArray(arr: string[], addressHex: string): i32 {
	for(let i = 0;i < arr.length;i++) {
		if(arr[i].endsWith(addressHex)) {
			return i
		}
	}

	return -1
}

function findAddressInArray(arr: Bytes[], addressHex: string): i32 {
	for(let i = 0;i < arr.length;i++) {
		if(arr[i].toHex() == addressHex) {
			return i
		}
	}

	return -1
}