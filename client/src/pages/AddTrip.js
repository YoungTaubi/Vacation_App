import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import '../MultiselectDropdown.css';


export default function AddTrip(props) {

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [participants, setParticipants] = useState([])
	const [allUsers, setAllUsers] = useState([])
	const [select, setSelect] = useState([])

	const storedToken = localStorage.getItem('authToken')
	const currentSelect = []

	const getAllUsers = () => {
		axios.get('/api/trips/users', { headers: { Authorization: `Bearer ${storedToken}` } })
		.then(res => {
			//console.log('users: ', res.data);
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
				//console.log(response)
			})
			.catch(err => console.log(err))
		// reset the form
		setTitle('')
		setDescription('')
		setParticipants([])
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
		setParticipants(value);
	  }


	function onSelect(selectedList, selectedItem) {
		console.log('options',selectedItem);
		console.log('selectedList: ', selectedList); 	
		setParticipants(selectedList);	
		
	}

	function onRemove(selectedList, removedItem) {
		
	}

	useEffect(() => {
		getAllUsers()
	}, [])


	return (
		<>
		<div>
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
				{/* <select type='checkbox' name="participants" multiple
				onChange={handleChange}>
					{allUsers.map(user => 
					
					<option value={user._id}>{user.name}</option>
					)}
				</select> */}
				<Multiselect 
				style={{chips: {
    					background: 'green'
    					},
    					multiselectContainer: {
    					  color: 'red'
    					},
    					searchBox: {
    					  border: 'none',
    					  'borderBottom': '1px solid blue',
    					  'borderRadius': '0px'
    					}}}	
				options={allUsers} // Options to display in the dropdown
				 // Preselected value to persist in dropdown
				onSelect={onSelect} // Function will trigger on select event
				onRemove={onRemove} // Function will trigger on remove event
				displayValue="name" // Property name to display in the dropdown options
			/>
				<button type="submit">Add this Trip</button>
			</form>
		</div>

			
			
				

				
			
			
		</>
	)
}
