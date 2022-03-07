import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import EditAccount from '../components/EditAccount'



export default function Login() {

	//const [user, setUser] = useState({})
	const [name, setName] = useState('')
    const [email, setEmail] = useState('')
	const [user, setUser] = useState({})
	//console.log('user', user);

	const storedToken = localStorage.getItem('authToken')
	
	const { id } = useParams()

	const getUserData = () => {
		axios.get(`/api/account/${id}/`, { headers: { Authorization: `Bearer ${storedToken}` } })
		.then(res => {
			setName(res.data.name)
			setEmail(res.data.email)
			setUser(res.data)
		})
		.catch(err => {
			console.log(err)
		})
	}

	const handleSubmit = (e) => {
		e.preventDefault()
        const requestBody = { name, email }        
        axios.put(`/api/account/${id}`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
        getUserData()	
	}

	const handleNameChange = (e) => {
		setName(e.target.value)
	}

	const handleEmailChange = (e) => {
		setEmail(e.target.value)
	}

	useEffect(() => {
		getUserData()
	}, [])

	
		

	return (
		<>
			<h1>Your Account</h1>
			<h3>User Name: {user.name}</h3>	
			<h1>Your Email</h1>
			<h3>Email: {user.email}</h3>	
			<EditAccount 
			handleNameChange={handleNameChange} 
			handleEmailChange={handleEmailChange} 
			handleSubmit={handleSubmit}
			email={email}
			name={name}
			/>			
		</>
	)
}

