import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function Home() {

const storedToken = localStorage.getItem('authToken')

const [invites, setInvites] = useState([])
const [inviteAnswer, setInviteAnswer] = useState([])
const [userId, setUserId] = useState(null)

const navigate = useNavigate()

	// Get user Id
	const getUserId= () => {
	axios.get(`/api/expences/user-id`, { headers: { Authorization: `Bearer ${storedToken}` } })
	.then(res => {
		//console.log('user Id: ', res.data);
		setUserId(res.data)
	})
	.catch(err => {
		console.log(err)
	})
	}

	// Get all invites
	const getInvites= () => {
	axios.get(`/api/trips/invites`, { headers: { Authorization: `Bearer ${storedToken}` }})
	.then(res => {
	  console.log('invites: ', res.data);
	  setInvites(res.data)
	})
	.catch(err => {
	  console.log(err)
	})
  	}

	const handleSubit = (id) => {
		const requestBody = { participants: inviteAnswer}
		console.log('requestBody', requestBody);
		axios.put(`/api/trips/invites/${id}`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` }})
			.then(() => {
				
				// this redirects using react router
				navigate(`/${id}`)
			})
			.catch(err => console.log(err))
	}

	const joinTrip = (id) => {
		// console.log('clicked');
		let participants = []
		// const filteredInvites = invites.filter((invite => invite._id.toString() === id.toString()))
		invites.map((invite) => {
			if (invite._id.toString() === id.toString()) {
				return participants = invite.participants
			}
		})
		console.log('participants',participants);
		const updatedParticipants = participants.map(participant =>
			participant._id.toString() === userId.toString() ? { ...participant, joining: true } : participant
		);
		console.log('participants upd', updatedParticipants );
		setInviteAnswer(() => updatedParticipants)
		console.log('inviteAnswer', inviteAnswer);
		//handleSubit(id)
	}
  	
  	useEffect(() => {
	      getUserId()
		  getInvites()
  	}, [])

	return (
		<>
		<h1>This is the Home Page</h1>
		{invites.map(invite => 
			<div key={invite._id}>
				<h3>{invite.owner.name} invited you to:</h3>
				<h3>{invite.title}</h3>
				<h3>Do you want to join?</h3>
				<button onClick={() => joinTrip(invite._id)}>Yes</button>
				<button onClick={() => handleSubit(invite._id)}>Submit</button>
			</div>
		)}
		</>
	)
}
