import React, { useEffect, useState } from 'react'
//import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddExpence(props) {
    
    const [userId, setUserId] = useState(null)

    const allExpences = props.allExpencesOfTrip

    console.log('props all exp.',allExpences);    
    console.log('user id:',userId);  

    //const { expenceId } = useParams()
    //const navigate = useNavigate()

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

    const deleteExpence = (id) => {
		axios.delete(`/api/expences/${id}`, { headers: { Authorization: `Bearer ${storedToken}` } })
			.then(() => {
                props.getAllExpences()
                props.refreshAllExpencesFromUser()
			    //	// redirect to the project list
			    //navigate(`/${expenceId}`)
			})
			.catch(err => console.log(err))
	}   
    useEffect(() => {
        //props.getAllExpences()
        getUserId()
    }, [])
   
    return (
		<>
            {allExpences.length > 0 ?
            <>
            <div class='allExpencesContainer'>
            {allExpences.map((expence) => 
                 
                <>
                    <h4 class='title'>{expence.title}</h4>
                    <h4>{expence.amount} €</h4>
                    <h4>Paied by: {expence.creditorName}</h4>
                    {
                        userId === expence.creditor && 
                        <button class='deleteButton' onClick={() => deleteExpence(expence._id)}>Delete this expense</button>    
                    }   
                </>         
            )}
            </div>
            </> :
            <h2>There are no expenses yet...</h2>
            }
					
		</>
	)    
}