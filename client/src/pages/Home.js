import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function Home() {

const storedToken = localStorage.getItem('authToken')

const [invites, setInvites] = useState([])
const [inviteAnswer, setInviteAnswer] = useState([])
const [userId, setUserId] = useState(null)
const [currentUser, setCurrentUser] = useState(null)
const [submitButtonState, setSubmitButtonState] = useState(true)

const navigate = useNavigate()

	// Get the current user (makes Get user Id obsolete => needs to be updated)
	const getUser = () => {
	axios.get(`/api/trips/currentUser`, { headers: { Authorization: `Bearer ${storedToken}` } })
	.then(res => {
		// console.log('user: ', res.data);
		setCurrentUser(res.data)
	})
	.catch(err => {
		console.log(err)
	})
	}

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
	//   console.log('invites: ', res.data);
	  setInvites(res.data)
	})
	.catch(err => {
	  console.log(err)
	})
  	}

	const handleSubit = (id) => {
		const requestBody = { participants: inviteAnswer}
		// console.log('requestBody', requestBody);
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
		// console.log('participants',participants);
		const updatedParticipants = participants.map(participant =>
			participant._id.toString() === userId.toString() ? { ...participant, joining: true } : participant
		);
		// console.log('participants upd', updatedParticipants );
		setInviteAnswer(() => updatedParticipants)
		// console.log('inviteAnswer', inviteAnswer);
		//handleSubit(id)
	}

	const toggleSubmitButtonState = () => {
		setSubmitButtonState(!submitButtonState)
	}
  	
  	useEffect(() => {
		  getUser()
	      getUserId()
		  getInvites()
		  
  	}, [])

	useEffect(() => {
		getInvites()
	}, [inviteAnswer])

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
				{submitButtonState ?
				<button class='submitButton' onClick={() => {toggleSubmitButtonState(); joinTrip(invite._id)}}>Yes</button> :
				<button class='submitButton' onClick={() => {toggleSubmitButtonState(); handleSubit(invite._id)}}>Submit</button>
				}
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
