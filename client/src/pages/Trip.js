import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import AddExpence from '../components/AddExpence'
import ExpencesOverview from '../components/ExpencesOverview'
import AllExpences from '../components/AllExpences';
import axios from 'axios';


export default function Home(props) {

    const [usersExpences, setUsersExpences] = useState(0)
    const [allExpences, setAllExpences] = useState([])
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

    useEffect(() => {
        getAllExpencesFromUser()
        getAllExpences()
    }, [id])



	return (
        <>
		<h1>This is your trip to ...</h1>
        <AddExpence refreshAllExpencesFromUser={getAllExpencesFromUser} refreshAllExpences={getAllExpences} />
        <ExpencesOverview allExpencesFromUser={usersExpences} />
        <AllExpences allExpencesOfTrip={allExpences} getAllExpences={getAllExpences} refreshAllExpencesFromUser={getAllExpencesFromUser}/>
        </>
	)
}