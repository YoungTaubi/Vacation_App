import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function AddExpence(props) {

	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState(0);
    const [debitors, setDebitors] = useState([]
	// 	{
	// 	debitorId: '',
	// 	debitorDebt: 0
	// }
	);
	console.log('debitor State: ', debitors);
	//console.log('debitorDebt State: ', debitors.debitorDebt);
	const [tripParticipants, setTripParticipants] = useState([]);
	const [multiplier, setMultiplier] = useState({
		// 0: 0
	})
	console.log('multiplier State:', multiplier );

	const storedToken = localStorage.getItem('authToken')
    const { id } = useParams()

	const getAllTripParticipants = () => {
		axios.get(`/api/trips/${id}/trip-participants`, { headers: { Authorization: `Bearer ${storedToken}` } })
		.then(res => {
			//console.log('trip-participants: ', res.data);
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
		console.log('Debitor: ', debitors);
		axios.post(`/api/expences/${id}`, { title, amount, debitors }, { headers: { Authorization: `Bearer ${storedToken}` } })			
			.then(response => {
				
				console.log('responce: ',response.data)
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
		let options = e.target.options;
		let value = [];
		//console.log('options: ', options);
		for (let i = 0, l = options.length; i < l; i++) {
		  if (options[i].selected) {
			value.push({debitorId: options[i].value, debitorName: options[i].innerText});
		  }		  
		}
		//console.log('value: ', value);
		setDebitors(value);
	  }

	function handleDebtChange(e, id) {
		setMultiplier(() => ({
			...multiplier,
			[id]: e.target.value			
		}))			
		updateDebt()
		// console.log('Debitor: ', debitors);
	}
	

	useEffect(() => {
		updateDebt()
	}, [multiplier])

	//console.log(Object.keys(multiplier));
	//console.log(Object.values(multiplier));	

	const updateDebt = () => {	
		const allMultipliers = Object.entries(multiplier)	
		let multiplierTotal = 0
		for (let [key, value] of allMultipliers) {
			multiplierTotal += Number(value)			
		}
		let procentage = amount / multiplierTotal
		console.log('procentage', procentage );
		//console.log('all multi: ', multiplier);
		debitors.map((debitor) => {			
	 		//console.log('debitor: ', debitor);
			 for (let [key, value] of allMultipliers) {				
				//console.log(key, value);
				if (debitor.debitorId === key) {
					 debitor.debitorDebt = procentage * Number(value)
					console.log('test',debitor.debitorDebt);
				}
			// 	if (debitor.debitorId === key) {
			// 		setDebitors(() => ({
			// 			...debitors,
			// 			debitorDebt: procentage * Number(value)
			// 		}))
			// 		console.log('test',debitor.debitorDebt);
			//    }
			
			 }
			 
	 		console.log('multiplier total: ', multiplierTotal);
	 		// console.log(Object.keys(multiplier));
	 }	 
	)}
	
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
					placeholder='0'
					value={amount}
					onChange={e => setAmount(e.target.value)}
				/>
				<label htmlFor="debitors">Who is paining? </label>
				<select type='checkbox' name="debitors.debitorId" multiple
				onChange={handleChange}>
					{tripParticipants.map(user => 
					
					<option value={user._id} >{user.name}</option>
					)}
				</select>
				{debitors.map(user =>
					<div>
						<h3>{user.debitorName}</h3>
						<h3>{user.debitorDebt}</h3>
						<input 
						id='debitors.debitorDebt'
						type="number"
						value={multiplier.pizza} 
						placeholder='1'
						onChange={(e) => {
							handleDebtChange(e, user.debitorId)
							
							}}
						/>

					</div> 
					)}

				<button type="submit">Add this Expence</button>
			</form>
			
			
		</>
	)
}
