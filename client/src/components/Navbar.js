import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import axios from 'axios';
import TripList from '../components/TripList'
import YourTrips from '../pages/YourTrips'
import '../Navbar.css';

export default function Navbar() {

	const { isLoggedIn, user, logoutUser } = useContext(AuthContext)
	const [userId, setUserId] = useState(null)
	const [open, setOpen] = useState(false)
	const [navOpen, setNavOpen] = useState(false)
	console.log('open', open);
 
	const storedToken = localStorage.getItem('authToken')

	const getUserId= () => {
		axios.get(`/api/expences/user-id`, { headers: { Authorization: `Bearer ${storedToken}` } })
		.then(res => {
			//console.log('user Id: ', res.data);
			setUserId(res.data)
		})
		.catch(err => {
			console.log(err)
		})
	}

	// const toggleSubList = () => {

	// }

	useEffect(() => {
        getUserId()
    }, [])

	return (
		<nav>
			
			{isLoggedIn ?
				(
					<>
					<h1 class='burgerMenu' onClick={() => setNavOpen(!navOpen)}>+</h1>
					{ navOpen && 
					<nav class='navbar'>
						<ul>
							<Link to={`/account/${userId}`}>
								<li>Your Account</li>
							</Link>
							<Link to='/'>
								<li>Home</li>
							</Link>
							<Link to='/add-trip'>
								<li>Add new trip</li>
							</Link>							
							<li onClick={() => setOpen(!open)}>Your Trips</li>
							{open && 
							<li class='sublist'>							
							<TripList />
							</li>
							}
							<li onClick={logoutUser}>Logout</li>
						</ul>
						
					</nav>
					}
					</>
				) : (
					<>
						<Link to='/signup'>
							<button>Signup</button>
						</Link>
						<Link to='/login'>
							<button>Login</button>
						</Link>
					</>
				)}
		</nav>
	)
}
