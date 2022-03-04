import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AddExpence(props) {

	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState('');
    const [debitors, setDebitors] = useState('');
	const [tripParticipants, setTripParticipants] = useState([]);

	const storedToken = localStorage.getItem('authToken')
    const { id } = useParams()

	const getAllTripParticipants = () => {
		axios.get(`/api/trips/${id}/trip-participants`, { headers: { Authorization: `Bearer ${storedToken}` } })
		.then(res => {
			console.log('trip-participants: ', res.data);
			setTripParticipants(res.data)
		})
		.catch(err => {
			console.log(err)
		})
	}

	const handleSubmit = e => {
		e.preventDefault()
		// send the data from the state as a post request to 
		// the backend
		axios.post(`/api/expences/${id}`, { title, amount, debitors }, { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(response => {
				console.log(response)
			})
			.catch(err => console.log(err))
		// reset the form
		setTitle('')
		setAmount('')
		setDebitors([])
		// refresh the list of the trips in ProjectList
		//props.refreshTrips()
	}

	const handleChange = (e) => {
		var options = e.target.options;
		var value = [];
		for (let i = 0, l = options.length; i < l; i++) {
		  if (options[i].selected) {
			value.push(options[i].value);
		  }		  
		}
		//console.log('value: ', value);
		setDebitors(value);
	  }

	useEffect(() => {
		getAllTripParticipants()
	}, [])


	return (
		<>
			<h1>Add new Expence</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="title">Title: </label>
				<input
					id="title"
					type="text"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<label htmlFor="title">Amout: </label>
				<input
					id="amount"
					type="number"
					value={amount}
					onChange={e => setAmount(e.target.value)}
				/>
				<label htmlFor="debitors">Who is paining? </label>
				<select type='checkbox' name="debitors" multiple
				onChange={handleChange}>
					{tripParticipants.map(user => 
					
					<option value={user._id}>{user.name}</option>
					)}
				</select>
				{tripParticipants.map(user =>
					<div>
						<h3>{user.name}</h3>
						<input type="number" />

					</div> 
					)}

				<button type="submit">Add this Expence</button>
			</form>
			
			
		</>
	)
}
