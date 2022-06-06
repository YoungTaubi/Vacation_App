import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Multiselect from 'multiselect-react-dropdown';
import { RiCloseLine } from 'react-icons/ri'
import { motion } from 'framer-motion'

export default function AddExpence(props) {

	const [title, setTitle] = useState('');
	const [amount, setAmount] = useState(0);
	const [debitors, setDebitors] = useState([]);
	const [tripParticipants, setTripParticipants] = useState([]);
	const [multiplier, setMultiplier] = useState({})

	const storedToken = localStorage.getItem('authToken')
	const { id } = useParams()

	const getAllTripParticipants = () => {
		axios.get(`/api/trips/${id}/trip-participants`, { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(res => {
				setTripParticipants(res.data)
			})
			.catch(err => {
				console.log(err)
			})
	}

	const handleSubmit = e => {
		e.preventDefault()
		axios.post(`/api/expences/${id}`, { title, amount, debitors }, { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(response => {
				setTitle('')
				setAmount('')
				setDebitors([])
				// refresh the list of the trips in ProjectList
				props.refreshAllExpencesFromUser()
				props.refreshAllExpences()
				props.closeWindow()
			})
			.catch(err => console.log(err))
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
	}


	useEffect(() => {
		updateDebt()
	}, [multiplier, amount])

	useEffect(() => {
		getAllTripParticipants()
	}, [id])


	const updateDebt = () => {
		const allMultipliers = Object.entries(multiplier)
		let multiplierTotal = 0
		const debitorsUpd = []
		for (let [key, value] of allMultipliers) {
			multiplierTotal += Number(value)
		}
		let procentage = amount / multiplierTotal
		debitors.map((debitor) => {
			for (let [key, value] of allMultipliers) {
				if (debitor._id === key) {
					let result = procentage * Number(value)
					debitorsUpd.push({ ...debitor, debitorDebt: result, markedAsPaied: false })
				}
			}
			setDebitors(() => debitorsUpd)
		}
		)
	}


	const handleAmountChanage = (e) => {
		setAmount(e.target.value)
		updateDebt()
	}


	const test = () => {
		return true
	}

	useEffect(() => {
		getAllTripParticipants()
	}, [])


	function onSelect(selectedList, selectedItem) {
		setInitialMultiplier(selectedItem._id)
		setDebitors((state) => [...state, selectedItem]);

	}

	function onRemove(selectedList, removedItem) {
		let debitorsCopy = debitors.filter(participant => participant._id !== removedItem._id)
		setDebitors(debitorsCopy);
	}


	return (
		<>
			<div class='background'></div>
			<motion.div

				initial={{ scale: 0, y: 0, x: 0 }}
				animate={{ scale: 1, y: 1, x: 0 }}>

				<div class="addExpenceContainer">

					<form class='addExpenceForm' onSubmit={handleSubmit}>
						<h2>Add new Expence</h2>
						<label htmlFor="title">Title: </label>
						<input
							class='addExpenseInput'
							id="title"
							type="text"
							value={title}
							onChange={e => setTitle(e.target.value)}
						/>
						<label htmlFor="title">Amout: </label>
						<input
							class='addExpenseInput'
							id="amount"
							type="number"
							placeholder='0 €'
							value={amount}
							onChange={handleAmountChanage}
						/>
						<label htmlFor="debitors">Who is paining? </label>

						<Multiselect
							style={{
								chips: {
									background: '#CCFFBD',
									color: '#40394A',
									fontSize: '1em',
									borderRadius: '2em',
									margin: '5px'
								},
								multiselectContainer: {
									color: '#40394A'
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
									border: 'none',
									borderRadius: '20px',
								},
								option: {
									border: 'none',

								}

							}}
							options={tripParticipants} // Options to display in the dropdow
							// Preselected value to persist in dropdown
							onSelect={onSelect} // Function will trigger on select event
							onRemove={onRemove} // Function will trigger on remove event
							displayValue="name" // Property name to display in the dropdown options
							id="css_custom"
							avoidHighlightFirstOption
							placeholder='Search Participants'
						/>
						<div class='addBuyersContainer'>
							{debitors.map(user =>
								<div class='buyer'>
									<h4>{user.name}</h4>
									<h4 class='amount'>{user.debitorDebt ? Math.round((user.debitorDebt + Number.EPSILON) * 100) / 100 + ' €' : 0 + ' €'}</h4>
									<input
										class='multiplierInput'
										id='debitors.debitorDebt'
										type="number"
										value={multiplier.key}
										placeholder='1'
										min={test ? '2' : '1'}
										onChange={(e) => {
											handleDebtChange(e, user._id)
										}}
									/>
								</div>
							)}
						</div>



						<button class='submitButton' type="submit">Add this Expense</button>
						<RiCloseLine
							class='closeAddExpence'
							size='50px' color='#40394A'
							onClick={() => props.closeWindow()}
						/>
					</form>

				</div>

			</motion.div>

		</>
	)
}
