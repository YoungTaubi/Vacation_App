import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/auth'

export default function Signup() {

	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const navigate = useNavigate()

	const { loginUser } = useContext(AuthContext)

	const handleSubmit = e => {
		e.preventDefault()
		const requestBody = { email, password, name }
		axios.post('/api/auth/signup', requestBody)
			.then(response => {
				console.log('i have a token mothafukkas')
				const token = response.data.authToken
				// store the token
				loginUser(token)
				// redirect to home
				navigate('/')
			})
			.catch(err => {
				const errorDescription = err.response.data.message
				setErrorMessage(errorDescription)
			})
	}

	const handleEmail = e => setEmail(e.target.value)
	const handleName = e => setName(e.target.value)
	const handlePassword = e => setPassword(e.target.value)
	const [errorMessage, setErrorMessage] = useState(undefined);

	return (
		<>
			<h1>Signup</h1>
			<form onSubmit={handleSubmit}>
				<label htmlFor="email">Email: </label>
				<input type="text" value={email} onChange={handleEmail} />
				<label htmlFor="password">Password: </label>
				<input type="password" value={password} onChange={handlePassword} />
				<label htmlFor="name">Name: </label>
				<input type="text" value={name} onChange={handleName} />
				<button type="submit">Sign Up</button>
			</form>

			{errorMessage && <h5>{errorMessage}</h5>}

			<h3>Already have an account?</h3>
			<Link to='/login'>Login</Link>
		</>
	)
}
