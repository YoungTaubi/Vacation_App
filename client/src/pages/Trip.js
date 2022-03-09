import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import AddExpence from '../components/AddExpence'
import ExpencesOverview from '../components/ExpencesOverview'
import AllExpences from '../components/AllExpences';
import axios from 'axios';
import '../Trip.css';
import {MdAddCircle} from 'react-icons/md'


export default function Home(props) {

    const [usersExpences, setUsersExpences] = useState(0)
    const [allExpences, setAllExpences] = useState([])
	const [currentTrip, setCurrentTrip] = useState({})
	const [addTripWindowOpen, setAddTripWindowOpen] = useState(false)
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



	return (
        <>
		<div class="container">
		<h2>{currentTrip.title}</h2>
		{
			addTripWindowOpen && 
			<AddExpence refreshAllExpencesFromUser={getAllExpencesFromUser} refreshAllExpences={getAllExpences} />
		} 
        
        {/* <ExpencesOverview allExpencesFromUser={usersExpences} /> */}
        {/* <AllExpences allExpencesOfTrip={allExpences} getAllExpences={getAllExpences} refreshAllExpencesFromUser={getAllExpencesFromUser}/> */}
		<MdAddCircle 
		class='addExpence'
		size='50px' color='#40394A'
		onClick={() => setAddTripWindowOpen(!addTripWindowOpen)} 
		/>
		</div>
		<div class='test'>
			<ul class='test1'>
					{allExpences.map(expence => 
						<li>{expence.amount}</li>
					)}
			</ul>
		</div>
		
        </>
	)
}