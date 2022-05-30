import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'



export default function TripList(props) {

	const [trips, setTrips] = useState([])

	const storedToken = localStorage.getItem('authToken')

	const animateFrom = { opacity: 0, x: -40 }
	const animateTo = { opacity: 1, x: 0 }

	const getTrips = () => {
		axios.get('/api/trips', { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(response => {
				setTrips(response.data)
			})
			.catch(err => {
				console.log(err)
			})
	}

	useEffect(() => {
		getTrips()
	}, [])

	return (
		<>
			<ul>
				{trips.map((trip, index) =>
					<motion.li
						initial={animateFrom}
						animate={animateTo}
						transition={{ delay: 0.05 * index }}
						onClick={() => {
							props.closeSumMenu()
							props.closeNavbar()
						}} >
						<Link to={`/${trip._id}`}>{trip.title}</Link>
					</motion.li>
				)}
			</ul>
		</>
	)
}
