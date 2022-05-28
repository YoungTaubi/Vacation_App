import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'
import { SocketContext } from '../context/socket';
import axios from 'axios';
import TripList from '../components/TripList'
import '../Navbar.css';
import { HiMenuAlt3 } from 'react-icons/hi'
import { RiCloseLine } from 'react-icons/ri'
import { motion } from 'framer-motion'
import splitify_logo from '../splitify_logo.png'


export default function Navbar() {

	const { isLoggedIn, user, logoutUser } = useContext(AuthContext)
	const { socket, deleteSocketUser, notification, setNotification, setNotificationStateFalse } = useContext(SocketContext)
	const [userId, setUserId] = useState(null)
	const [open, setOpen] = useState(false)
	const [navOpen, setNavOpen] = useState(false)
	// console.log('open', open);

	const storedToken = localStorage.getItem('authToken')



	const getUserId = () => {
		axios.get(`/api/expences/user-id`, { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(res => {
				//console.log('user Id: ', res.data);
				setUserId(res.data)
				setNotification(res.data.notificationState)
			})
			.catch(err => {
				console.log(err)
			})
	}
	

	const burgerMenu = <HiMenuAlt3 class='burgerMenu'
		size='40px' color='black'
		onClick={() => setNavOpen(!navOpen)} />

	const closeMenu = <RiCloseLine class='burgerMenu'
		size='40px'
		onClick={() => setNavOpen(!navOpen)} />


	const closeSumMenu = () => {
		setOpen(!open)
	}

	const closeNavbar = () => {
		setNavOpen(!navOpen)
	}

	useEffect(() => {
		getUserId()
	}, [])

	useEffect(() => {
		socket?.on('getNotification', () => {
			// console.log('getting Notification', notification);
			setNotification(true)
			// console.log('getting Notification 2', notification);
		})
	}, [socket])

	const animateFrom = { opacity: 0.7, x: -40 }
	const animateTo = { opacity: 1, x: 0 }

	return (
		<nav>

			{isLoggedIn &&
				(
					<>

						{navOpen ? closeMenu : burgerMenu}
						{navOpen &&
							<>
								<div class='background'></div>

								<motion.nav
									class='navbar'
									initial={animateFrom}
									animate={animateTo}
									transition={{ delay: 0.05 }}
								>
									<img class='logo2' src={splitify_logo} alt='logo' />
									<ul>
										<Link to='/'>
											<li onClick={() => { 
												setNavOpen(!navOpen); 
												setOpen(false) 
												setNotificationStateFalse()
												}}>Home</li>
										</Link>
										{notification && <div className='notification'></div>}
										<Link to={`/account/${userId}`}>
											<li onClick={() => { setNavOpen(!navOpen); setOpen(false) }}>Your Account</li>
										</Link>
										<Link to='/add-trip'>
											<li onClick={() => { setNavOpen(!navOpen); setOpen(false) }}>Add new trip</li>
										</Link>
										<li onClick={() => setOpen(!open)}><p>Your Trips</p></li>
										{open &&
											<li class='sublist'>
												<TripList closeSumMenu={closeSumMenu} closeNavbar={closeNavbar} />
											</li>
										}
										<li onClick={() => {
											logoutUser()
											deleteSocketUser(user?._id)
										}
										}><p>Logout</p></li>
									</ul>
								</motion.nav>
							</>
						}
					</>
				)}
		</nav>
	)
}
