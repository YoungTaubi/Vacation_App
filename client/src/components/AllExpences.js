import React, { useEffect, useState } from 'react'
import axios from 'axios';

export default function AddExpence(props) {
    
    const [userId, setUserId] = useState(null)

    const allExpences = props.allExpencesOfTrip

    console.log('props all exp.',allExpences);    
    console.log('user id:',userId);  

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
    
    useEffect(() => {
        //props.getAllExpences()
        getUserId()
    }, [])
   
    return (
		<>
			<h1>All Expences</h1>
            {allExpences.map((expence) => 
                <div>
                    <h3>{expence.title}</h3>
                    <h3>{expence.amount} €</h3>
                    <h3>Paied by: {expence.creditorName}</h3>
                    {
                        userId === expence.creditor && 
                        <h3>Meins</h3>
                    }   
                </div>           
            )} 
					
		</>
	)    
}