import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Multiselect from 'multiselect-react-dropdown';
import '../MultiselectDropdown.css';
import { useNavigate } from 'react-router-dom';


export default function AddTrip(props) {

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [participants, setParticipants] = useState([])
	const [allUsers, setAllUsers] = useState([])

	const storedToken = localStorage.getItem('authToken')

	const navigate = useNavigate()

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
			.then(res => {
				console.log('res',res)
				// reset the form
				setTitle('')
				setDescription('')
				setParticipants([])
				navigate(`/${res.data._id}`)
			})
			.catch(err => console.log(err))
		// reset the form
		setTitle('')
		setDescription('')
		setParticipants([])
		//navigate(`/projects/${id}`)

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
		<div class="container">
			<h2>Add a new Trip</h2>
			<form class='addTripContaier' onSubmit={handleSubmit}>
				<label htmlFor="title">Title: </label>
				<input
					class='addTripInput'
					id="title"
					type="text"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<label htmlFor="title">Description: </label>
				<input
					class='addTripInput'
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
    					  background: '#CCFFBD',
						  color: '#40394A',
						  fontSize: '1em',
						  borderRadius: '2em',
						  margin: '5px'
						//   position: 'absolut'
    					},
    					multiselectContainer: {
    					  color: '#40394A',
						  
						//   background: 'red',
    					},
    					searchBox: {
						// background: 'rgb(240, 240,240)',
    					  width: '240px',
						  minHeight: '40px',
						  maxHeight: 'fit-content',
						  border: '1px solid rgb(200,200,200)',
    					  borderRadius: '20px',
						//   textAlign: 'center'
						//   display: 'flex',
						//   justifyContent: 'center',
    					//   alignItems: 'center',
						//   position: 'relativ',
						//   boxSizing: 'border-box'
    					},
						optionContainer: {
							// background: '#CCFFBD'
							border: 'none',
							borderRadius: '20px',
						},
						option: {
							background: '#CCFFBD',
							border: 'none',
						}	
		
						}}	
				options={allUsers} // Options to display in the dropdown
				// customCloseIcon={'cancel'}
				 // Preselected value to persist in dropdown
				onSelect={onSelect} // Function will trigger on select event
				onRemove={onRemove} // Function will trigger on remove event
				displayValue="name" // Property name to display in the dropdown options
				id="css_custom"
				avoidHighlightFirstOption
				placeholder='Search Participants'
				// closeIcon="close"
			/>
				<button class='submitButton' type="submit">Add this Trip</button>
			</form>
		</div>

			
			
				

				
			
			
		</>
	)
}
