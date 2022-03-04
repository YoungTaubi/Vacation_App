import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function AddExpence(props) {

    const [usersExpences, setUsersExpences] = useState([])
    //console.log('state users expences: ',usersExpences );

    const storedToken = localStorage.getItem('authToken')
    const { id } = useParams()
    

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
			<h1>Overview {usersExpences.amount}</h1>
			{/* <ul>
			{usersExpences.map(expence => 
            <li><Link to={`/${expence._id}`}>{expence.title}</Link></li>
            )}
			</ul> */}
			
		</>
	)

    //test

}