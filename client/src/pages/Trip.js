import React from 'react'
import AddExpence from '../components/AddExpence'
import ExpencesOverview from '../components/ExpencesOverview'

export default function Home() {
	return (
        <>
		<h1>This is your trip to ...</h1>
        <AddExpence />
        <ExpencesOverview />
        </>
	)
}