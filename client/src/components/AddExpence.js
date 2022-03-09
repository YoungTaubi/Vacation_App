import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';

export default function AddExpence(props) {

	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState(0);
    const [debitors, setDebitors] = useState([]
	// 	{
	// 	debitorId: '',
	// 	debitorDebt: 0
	// }
	);
	// console.log('debitor State: ', debitors);
	//console.log('debitorDebt State: ', debitors.debitorDebt);
	const [tripParticipants, setTripParticipants] = useState([]);
	const [multiplier, setMultiplier] = useState({
		// 0: 0
	})
	console.log('multiplier State:', multiplier );
	//console.log('tripParticipants state', tripParticipants);

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
		//console.log('Debitor: ', debitors);
		axios.post(`/api/expences/${id}`, { title, amount, debitors }, { headers: { Authorization: `Bearer ${storedToken}` } })			
			.then(response => {
				
				//console.log('responce: ',response.data)
			})
			.catch(err => console.log(err))
		// reset the form
		setTitle('')
		setAmount('')
		setDebitors([])
		// refresh the list of the trips in ProjectList
		props.refreshAllExpencesFromUser()
		props.refreshAllExpences()
	}

	const handleChange = (e) => {
		let options = e.target.options;
		let value = [];
		//console.log('options: ', options);
		for (let i = 0, l = options.length; i < l; i++) {
		  if (options[i].selected) {
			//console.log(options[i].value);
			setInitialMultiplier(options[i].value)
			value.push({debitorId: options[i].value, debitorName: options[i].innerText});
			}		  
		}
		//console.log('value: ', value);
		setDebitors(value);
		// props.refreshAllExpencesFromUser()
	}

	function setInitialMultiplier(id) {
		setMultiplier(() => ({
			...multiplier,
			[id]: 1		
		}))
	}

	function handleDebtChange(e, id) {
		setMultiplier(() => ({
			...multiplier,
			[id]: e.target.value			
		}))			
		updateDebt()
		//props.refreshAllExpencesFromUser()
		// console.log('Debitor: ', debitors);
	}
	

	useEffect(() => {
		updateDebt()
	}, [multiplier, amount])

	useEffect(() => {
		getAllTripParticipants()
	}, [id])

	//console.log(Object.keys(multiplier));
	//console.log(Object.values(multiplier));	

	const updateDebt = () => {	
		const allMultipliers = Object.entries(multiplier)	
		let multiplierTotal = 0
		const debitorsUpd = []
		for (let [key, value] of allMultipliers) {
			multiplierTotal += Number(value)			
		}
		let procentage = amount / multiplierTotal
		//console.log('procentage', procentage );
		//console.log('all multi: ', multiplier);
		debitors.map((debitor) => {	
					
	 		//console.log('debitor: ', debitor);
			 for (let [key, value] of allMultipliers) {				
				//console.log(key, value);
				if (debitor.debitorId === key) {
					let result = procentage * Number(value)
					debitor.debitorDebt = procentage * Number(value)
					//console.log('debitors debt: ',debitor.debitorDebt);
					debitorsUpd.push({...debitor, debitorDebt: result})
					// (...debitor, {debitorDebt: [result]})
				}
			// 	if (debitor.debitorId === key) {
			// 		setDebitors(() => ({
			// 			...debitors,
			// 			debitorDebt: procentage * Number(value)
			// 		}))
			// 		console.log('test',debitor.debitorDebt);
			//    }			
			 }		 
	 		//console.log('multiplier total: ', multiplierTotal);
			//console.log('array', debitorsUpd);
	 		// console.log(Object.keys(multiplier));
			setDebitors(debitorsUpd)
			props.refreshAllExpencesFromUser()			
			//props.getAllExpencesFromUser()
	 }	 
	)}


	const handleAmountChanage = (e) => {
		setAmount(e.target.value)
		updateDebt()
		
		// console.log('debitors debt: ',debitors)
		
	}

	

	const test = () => {
		return true
	}
	
	useEffect(() => {
		getAllTripParticipants()
	}, [])

	
	function onSelect(selectedList, selectedItem) {
		//console.log('options',selectedItem);
		console.log('selectedList: ', selectedList); 	
		setDebitors(selectedList);
		console.log('debitor State: ', debitors);
		test2()		
	}

	function onRemove(selectedList, removedItem) {
		setDebitors(selectedList);
		console.log('selectedList deselect: ', selectedList); 
		console.log('debitor State: ', debitors);
	}

	console.log('debitor State out: ', debitors);

	const test2 = () => {
		console.log('debitor State test2: ', debitors);
		return debitors.map((user, index) =>
			<h2 key={index}>hallo</h2>
			)
	}



	return (
		<>
		<div class="addExpenceContainer">
			
			<form class='addExpenceForm' onSubmit={handleSubmit}>
				<h2>Add new Expence</h2>
				<label htmlFor="title">Title: </label>
				<input
					class='addTripInput'
					id="title"
					type="text"
					value={title}
					onChange={e => setTitle(e.target.value)}
				/>
				<label htmlFor="title">Amout: </label>
				<input
					class='addTripInput'
					id="amount"
					type="number"
					placeholder='0'
					value={amount}
					onChange={handleAmountChanage}
				/>
				<label htmlFor="debitors">Who is paining? </label>
				{/* <select type='checkbox' name="debitors.debitorId" multiple
				onChange={handleChange}>
					{tripParticipants.map(user => 
					
					<option value={user._id} >{user.name}</option>
					)}
				</select>  */}
				<Multiselect 
				style={{chips: {
    					  background: '#CCFFBD',
						  color: '#40394A',
						  fontSize: '1em',
						  borderRadius: '2em',
						  margin: '5px'
    					},
    					multiselectContainer: {
    					  color: '#40394A',
    					},
    					searchBox: {
    					  width: '240px',
						  minHeight: '40px',
						  maxHeight: 'fit-content',
						  background: 'rgb(245,245,245)',
						  border: '1px solid rgb(200,200,200)',
    					  borderRadius: '20px',
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
				options={tripParticipants} // Options to display in the dropdown
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
				{/* {debitors.map(user =>
					<div>
						<h3>{user.debitorName}</h3>
						<h3>{user.debitorDebt ? user.debitorDebt +' €' : 0 +' €'}</h3>
						<input 
						id='debitors.debitorDebt'
						type="number"
						value={multiplier.key} 
						placeholder='1'
						min={test ? '2' : '1'}
						onChange={(e) => {
							handleDebtChange(e, user.debitorId)							
							}}
						/>

					</div> 
					)} */}
					{debitors.map(user =>
					<h2>{user.name}</h2>
					)} 
				

				<button class='submitButton' type="submit">Add this Expence</button>
			</form>
			
		</div>
		</>
	)
}
