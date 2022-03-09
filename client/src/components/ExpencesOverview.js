import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function AddExpence(props) {

    console.log('props',props);

    


   
    return (
		<>
		<div class='allExpencesContainer'>
		<div class='expencesContainer'>
			<h3 class="title">All your Expences:</h3>
			<h3>{Math.round((props.allExpencesFromUser.amount + Number.EPSILON) * 100) / 100} €</h3>
		</div>
			{
			props.allExpencesFromUser.userTotalCredit > props.allExpencesFromUser.userTotalDebt ?
			<>
		<div class='expencesContainer'>
			<h3 class="title">Your total Credit:</h3>
			<h3>{Math.round((props.allExpencesFromUser.userTotalCredit + Number.EPSILON) * 100) / 100} €</h3> 
		</div>
			</>:
			<>
		<div class='expencesContainer'>
			<h3 class="title">Your total Debt:</h3>
			<h3>{Math.round((props.allExpencesFromUser.userTotalDebt + Number.EPSILON) * 100) / 100} €</h3>
		</div>
			</>
			}
		<div class='expencesContainer'>
			<h3 class="title">Total trip Expences:</h3>
			<h3>{Math.round((props.allExpencesFromUser.totalTripExpences + Number.EPSILON) * 100) / 100} €</h3>
		</div>
		</div>	
		</>
	)

    //test

}