import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { SocketContext } from '../context/socket';

export default function Home() {

	const storedToken = localStorage.getItem('authToken')

	const { setNotificationStateFalse, notification } = useContext(SocketContext)

	const [invites, setInvites] = useState([])
	const [currentUser, setCurrentUser] = useState(null)


	const getUser = () => {
		axios.get(`/api/trips/currentUser`, { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(res => {
				setCurrentUser(res.data)
			})
			.catch(err => {
				console.log(err)
			})
	}

	// Get all invites
	const getInvites = () => {
		axios.get(`/api/trips/invites`, { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(res => {
				setInvites(res.data)
			})
			.catch(err => {
				console.log(err)
			})
	}

	const handleSubit = (id, updatedParticipants) => {
		const requestBody = { participants: updatedParticipants }
		axios.put(`/api/trips/invites/${id}`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(() => {
			})
			.catch(err => console.log(err))
		getInvites()
	}

	const declineInvite = (id) => {
		let updatedParticipants
		invites.forEach(invite => {
			if (invite._id.toString() === id.toString()) {
				updatedParticipants = invite.participants.filter(participant => {
					if (participant._id.toString() !== currentUser._id.toString()) {
						return participant
					}
				})
			}
		})
		handleSubit(id, updatedParticipants)
	}

	const joinTrip = (id) => {
		let participants = []
		invites.map((invite) => {
			if (invite._id.toString() === id.toString()) {
				return participants = invite.participants
			}
		})
		const updatedParticipants = participants.map(participant =>
			participant._id.toString() === currentUser._id.toString() ? { ...participant, joining: true } : participant
		);
		handleSubit(id, updatedParticipants)
	}

	useEffect(() => {
		getUser()
		getInvites()
		setNotificationStateFalse()
	}, [])

	useEffect(() => {
		getInvites()
		setNotificationStateFalse()
	}, [notification])

	return (
		<>
			<div class="homeContainer container">
				{currentUser &&
					<h2 class='headline'>Welcome {currentUser.name}</h2>
				}
				{invites.length > 0 ?
					<>
						<h3 class='subHeadline'>You have {invites.length} new invite{invites.length > 1 && 's'}</h3>
						<div class='showInvitesContainer'>
							{invites.map(invite =>
								<div key={invite._id}>
									<h3 class='bold menuSelected'>{invite.owner.name} </h3>
									<h3>invited you to:</h3>
									<h3>{invite.title}</h3>
									<h3>Do you want to join?</h3>

									<button class='submitButton' onClick={() => { joinTrip(invite._id) }}>Yes, I´d love to!</button>
									<button class='submitButton' onClick={() => { declineInvite(invite._id, false) }}>No, thanks</button>
								</div>
							)}
						</div>
					</>
					:
					<h3 class='subHeadline' >You haven't received any invites yet</h3>
				}
			</div>
		</>
	)
}
