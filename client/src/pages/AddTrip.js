import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function AddTrip(props) {

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [participants, setParticipants] = useState([])
	const [allUsers, setAllUsers] = useState([])

	const storedToken = localStorage.getItem('authToken')

	const getAllUsers = () => {
		axios.get('/api/trips/users', { headers: { Authorization: `Bearer ${storedToken}` } })
		.then(res => {
			console.log('users: ', res.data);
			setAllUsers(res.data)
		})
		.catch(err => {
			console.log(err)
		})
	}

	const handleSubmit = e => {
		e.preventDefault()
		// send the data from the state as a post request to 
		// the backend
		axios.post('/api/trips', { title, description, participants }, { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(response => {
				console.log(response)
			})
			.catch(err => console.log(err))
		// reset the form
		setTitle('')
		setDescription('')
		setParticipants([])
		// refresh the list of the trips in ProjectList
		//props.refreshTrips()
	}

	useEffect(() => {
		getAllUsers()
	}, [])

	return (
		<>
			<h1>Add new Trip</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="title">Title: </label>
				<input
					id="title"
					type="text"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<label htmlFor="title">Description: </label>
				<input
					id="description"
					type="text"
					value={description}
					onChange={e => setDescription(e.target.value)}
				/>
				<label htmlFor="participants">Participants: </label>
				<select type='checkbox' name="participants" multiple
				// onChange={e => setParticipants({multiValue: [...e.target.selectedOptions].map(o => o.value)})}>
				onChange={e => setParticipants(e.target.value)}>
					{allUsers.map(user => 
					
					<option value={user._id}>{user.name}</option>
					)}
				</select>
				<button type="submit">Add this Trip</button>
			</form>
			
			
		</>
	)
}
