import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { AuthContext } from '../context/auth'
import '../Login.css';
import splitify_logo from '../splitify_logo.png'

export default function Login() {

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState(undefined);

	const navigate = useNavigate()

	const { storeToken, verifyStoredToken } = useContext(AuthContext)

	const handleSubmit = e => {
		e.preventDefault()
		const requestBody = { email, password }
		axios.post('/api/auth/login', requestBody)
			.then(response => {
				// redirect to projects
				console.log('i have a token mothafukkas')
				const token = response.data.authToken
				//console.log(response);
				// store the token
				storeToken(token)
				verifyStoredToken()				
				.then(() => {
					// redirect to projects
					navigate('/')
				})
				
			})
			.catch(err => {
				const errorDescription = err.response.data.message
				setErrorMessage(errorDescription)
			})
	}

	const handleEmail = e => setEmail(e.target.value)
	const handlePassword = e => setPassword(e.target.value)

	return (
		<>
		<div class='backgroundLogin'>
			<img class='logo' src={splitify_logo} alt='logo'/>
			<h2 class='headline2'>Login</h2>
			<form class='loginContaier' onSubmit={handleSubmit}>
				<label htmlFor="email">Email: </label>
				<input class='addTripInput' type="text" value={email} onChange={handleEmail} />
				<label htmlFor="password">Password: </label>
				<input class='addTripInput' type="password" value={password} onChange={handlePassword} />
				<button class='submitButton' type="submit">Log In</button>
			</form>

			{errorMessage && <h5>{errorMessage}</h5>}

			<h3>Don't have an account?</h3>
			<Link to='/signup'>Signup</Link>
		</div>
		</>
	)
}

