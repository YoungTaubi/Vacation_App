import React from 'react'
import AddExpence from '../components/AddExpence'
import ExpencesOverview from '../components/ExpencesOverview'
import { useLocation } from 'react-router-dom'

export default function Home() {

    // const location = useLocation()
    // const { multiplier } = location.state

    // console.log('multiplier state: ', location.state);

	return (
        <>
		<h1>This is your trip to ...</h1>
        <AddExpence />
        <ExpencesOverview />
        </>
	)
}