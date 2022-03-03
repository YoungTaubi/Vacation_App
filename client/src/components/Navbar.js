import React, { useContext } from 'react'
import { Link } from 'react-router-dom'
import { AuthContext } from '../context/auth'

export default function Navbar() {

	const { isLoggedIn, user, logoutUser } = useContext(AuthContext)

	return (
		<nav>
			
			{isLoggedIn ?
				(
					<>
						<Link to='/account'>
							<button>Your Account</button>
						</Link>
							<button onClick={logoutUser}>Logout</button>
						<Link to='/'>
							<button>Home</button>
						</Link>
						<Link to='/your-trips'>
							<button>Your Trips</button>
						</Link>
						<Link to='/add-trip'>
							<button>Add new trip</button>
						</Link>
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
