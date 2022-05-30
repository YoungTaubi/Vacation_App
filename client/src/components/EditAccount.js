import React from 'react'

export default function EditAccount(props) {

	const submitChanges = (e) => {
		props.toggleAccountWindow()
		props.handleSubmit(e)
	}

	return (
		<>
			<div class='container'>
				<h2 class='headline'>Edit Account</h2>
				<div>
					<form class='addTripContaier' onSubmit={submitChanges}>
						<label htmlFor="name">Name: </label>
						<input
							class='addTripInput'
							id="name"
							type="text"
							value={props.name}
							placeholder={props.name}
							onChange={props.handleNameChange}
						/>
						<label htmlFor="email">Email: </label>
						<input
							class='addTripInput'
							id="email"
							type="text"
							value={props.email}
							placeholder={props.email}
							onChange={props.handleEmailChange}
						/>
						<button class='submitButton' type="submit">Save changes</button>
					</form>
				</div>
			</div>
		</>
	)
}