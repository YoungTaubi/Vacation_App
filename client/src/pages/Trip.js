import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import AddExpence from '../components/AddExpence'
import ExpencesOverview from '../components/ExpencesOverview'
import axios from 'axios';


export default function Home() {

    const [usersExpences, setUsersExpences] = useState([])
    console.log('state users expences: ',usersExpences );

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

    useEffect(() => {
        getAllExpencesFromUser()
    }, [])


	return (
        <>
		<h1>This is your trip to ...</h1>
        <AddExpence refreshAllExpencesFromUser={getAllExpencesFromUser}/>
        <ExpencesOverview allExpencesFromUser={usersExpences} />
        </>
	)
}