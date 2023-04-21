import { log } from '@graphprotocol/graph-ts'
import { ProfileCreated, ProfileUpdated } from '../generated/QbUtilityRegistryContract/QbUtilityRegistryContract' 
import { Profile } from '../generated/schema'

export function handleProfileCreated(event: ProfileCreated): void {
	const metadataHash = event.params.metadataHash
	const profileAddress = event.params.profileAddress
	const timestamp = event.params.timestamp.toI32()

	let profile = Profile.load(profileAddress.toHex())
	if(profile) {
		log.error('Profile already exists: {}', [profileAddress.toHex()])
		return
	}

	profile = new Profile(profileAddress.toHex())
	profile.actorId = profileAddress
	profile.createdAt = timestamp
	profile.updatedAt = timestamp
	profile.applications = []
	profile.workspaceMembers = []
	profile.reviews = []

	// Parse the metadata hash and fill in the details
	// profile.fullName = "John Doe"
	// profile.profilePictureIpfsHash = ""
	// profile.publicKey = ""

	profile.save()
}

export function handleProfileUpdated(event: ProfileUpdated): void {
	const metadataHash = event.params.metadataHash
	const profileAddress = event.params.profileAddress
	const timestamp = event.params.timestamp.toI32()

	const profile = Profile.load(profileAddress.toHex())
	if(!profile) {
		log.error('Profile does not exist: {}', [profileAddress.toHex()])
		return
	}

	profile.updatedAt = timestamp

	// Parse the metadata hash and fill in the details
	// profile.fullName = "John Doe"
	// profile.profilePictureIpfsHash = ""
	// profile.publicKey = ""

	profile.save()
}