import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function AddExpence(props) {

    console.log('props',props);

    


   
    return (
		<>
			<h1>Overview</h1>
			<h1>All your Expences</h1>
			<h2>{props.allExpencesFromUser.amount}</h2>
			{
			props.allExpencesFromUser.userTotalCredit > props.allExpencesFromUser.userTotalDebt ?
			<>
			<h1>Your total Credit</h1>
			<h2>{props.allExpencesFromUser.userTotalCredit}</h2> 
			</>:
			<> 
			<h1>Your total Debt</h1>
			<h2>{props.allExpencesFromUser.userTotalDebt}</h2>
			</>
			}
			<h1>Total trip Expences</h1>
			<h2>{props.allExpencesFromUser.totalTripExpences}</h2>
			
		</>
	)

    //test

}