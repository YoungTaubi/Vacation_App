import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';

export default function AddExpence(props) {

    console.log(props);

    


   
    return (
		<>
			<h1>Overview</h1>
			<h1>All your Expences</h1>
			<h2>{props.allExpencesFromUser.amount}</h2>
			<h1>Your total Debt</h1>
			{/* <ul>
			{usersExpences.map(expence => 
            <li><Link to={`/${expence._id}`}>{expence.title}</Link></li>
            )}
			</ul> */}
			
		</>
	)

    //test

}