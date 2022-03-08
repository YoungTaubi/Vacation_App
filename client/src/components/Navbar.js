import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import axios from 'axios';
import TripList from '../components/TripList'
import '../Navbar.css';
import {HiMenuAlt3} from 'react-icons/hi'
import {RiCloseLine} from 'react-icons/ri'
import {motion} from 'framer-motion'

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

	const burgerMenu =  <HiMenuAlt3 class='burgerMenu'
						size='40px' color='black'
						onClick={() => setNavOpen(!navOpen)}/>

	const closeMenu =  <RiCloseLine class='burgerMenu'
						size='40px' 
						onClick={() => setNavOpen(!navOpen)}/>


	const closeSumMenu = () => {
		setOpen(!open)
	}

	const closeNavbar = () => {
		setNavOpen(!navOpen)
	}

	useEffect(() => {
        getUserId()
    }, [])

	const animateFrom = {opacity: 0.7, x: -40}
	const animateTo = {opacity: 1, x: 0}

	return (
		<nav>
			
			{isLoggedIn ?
				(
					<>
					{navOpen ? closeMenu : burgerMenu}
					{ navOpen && 
					<>
					<div class='background'></div>
					<motion.nav 
					class='navbar'
					initial={animateFrom}
					animate={animateTo}
					transition={{delay: 0.05}}
					>
						<ul>
							<Link to={`/account/${userId}`}>
								<li onClick={() => {setNavOpen(!navOpen); setOpen(false)}}>Your Account</li>
							</Link>
							<Link to='/'>
								<li onClick={() => {setNavOpen(!navOpen); setOpen(false)}}>Home</li>
							</Link>
							<Link to='/add-trip'>
								<li onClick={() => {setNavOpen(!navOpen); setOpen(false)}}>Add new trip</li>
							</Link>							
							<li onClick={() => setOpen(!open)}><p>Your Trips</p></li>
							{open && 
							<li class='sublist'>							
							<TripList closeSumMenu={closeSumMenu} closeNavbar={closeNavbar}/>
							</li>
							}
							<li onClick={logoutUser}><p>Logout</p></li>
						</ul>						
					</motion.nav>					
					</>
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
