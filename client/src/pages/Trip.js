import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import AddExpence from '../components/AddExpence'
import ExpencesOverview from '../components/ExpencesOverview'
import AllExpences from '../components/AllExpences';
import axios from 'axios';
import '../Trip.css';
import {MdAddCircle} from 'react-icons/md'
import {RiCloseLine} from 'react-icons/ri'
import {motion, AnimatePresence} from 'framer-motion'


export default function Home(props) {

    const [usersExpences, setUsersExpences] = useState(0)
    const [allExpences, setAllExpences] = useState([])
	const [currentTrip, setCurrentTrip] = useState({})
	const [addTripWindowOpen, setAddTripWindowOpen] = useState(false)
	const [toggleMenu, setToggleMenu] = useState(false)
    console.log('state users expences: ',usersExpences );
	console.log('allExpences state: ', allExpences);

    const { id } = useParams()

    const storedToken = localStorage.getItem('authToken')
    

    const getAllExpencesFromUser = () => {
		axios.get(`/api/expences/${id}/users-expences`, { headers: { Authorization: `Bearer ${storedToken}` } })
		.then(res => {
			console.log('users-expences: ', res.data);
			setUsersExpences(res.data)
		})
		.catch(err => {
			console.log(err)
		})
	}

    const getAllExpences = () => {
		axios.get(`/api/expences/${id}/all-expences`, { headers: { Authorization: `Bearer ${storedToken}` } })
		.then(res => {
			console.log('all-expences: ', res.data);
			setAllExpences(res.data)
		})
		.catch(err => {
			console.log(err)
		})
	}

	const getCurrentTrip = () => {
		axios.get(`/api/trips/${id}`, { headers: { Authorization: `Bearer ${storedToken}` } })
		.then(res => {
			console.log('current trip: ', res.data);
			setCurrentTrip(res.data)
		})
		.catch(err => {
			console.log(err)
		})
	}

    useEffect(() => {
        getAllExpencesFromUser()
        getAllExpences()
		getCurrentTrip()
    }, [id])

	useEffect(() => {
		getCurrentTrip()
	}, [])

	const handleAddTripWindow = () => {
		setAddTripWindowOpen(!addTripWindowOpen)
	}

	const closeTripWindow = <RiCloseLine 
							class='closeAddExpence'
							size='50px' color='#40394A'
							onClick={() => handleAddTripWindow()} 
							/>
	
	const openTripWindow = <MdAddCircle 
							class='addExpence'
							size='50px' color='#40394A'
							onClick={() => handleAddTripWindow()} 
							/>

	const showOverview = () => {
		return <motion.div
		initial={animateFrom}
		animate={animateTo}
		exit={{ opacity: 0, y: -20 }}
		transition={{ duration: 0.15 }}
		>
		<ExpencesOverview 
			allExpencesFromUser={usersExpences} 
		/> 
		</motion.div>
	}	

	const showAllExpences = () => {		
		return <motion.p
		initial={animateFrom}
		animate={animateTo}
		exit={{ opacity: 0, y: -0 }}
		transition={{ duration: 0.15 }}
		>		
		<AllExpences 
			allExpencesOfTrip={allExpences} 
			getAllExpences={getAllExpences} 
			refreshAllExpencesFromUser={getAllExpencesFromUser}		
			/>		
		</motion.p>
	}

	const animateFrom = {opacity: 1, x: -40}
	const animateTo = {opacity: 1, x: 0}

	
	return (
        <>
		<div class="container">
		<h2 class='headline'>{currentTrip.title}</h2>
		{
			addTripWindowOpen && 			
			<AddExpence 
			refreshAllExpencesFromUser={getAllExpencesFromUser} 
			refreshAllExpences={getAllExpences} 
			closeWindow={handleAddTripWindow}	
			/>
		} 
		{!addTripWindowOpen && openTripWindow}
		<div class='menuContainer'>
		<h3 class={!toggleMenu && 'menuSelected'} onClick={() => {setToggleMenu(!toggleMenu)}}>Overview</h3>
		<h3 class={toggleMenu && 'menuSelected'} onClick={() => {setToggleMenu(true)}}>All Expenses</h3>
        </div>
		{toggleMenu ? showAllExpences() : showOverview()}		
		</div>		
        </>
	)
}