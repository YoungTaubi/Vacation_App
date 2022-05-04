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
    
    const showAllExpences = () => {
        const expenceAndSettlementList = allExpences.expencesAndSettlements.map(ele => {
            if (ele.type === 'expence') { 
                return <>
                <div className='margin-top-20'>
                    <h4 class='title'>{ele.title}</h4>
                    <h4>{ele.amount} €</h4>
                    <h4>Paied by: {ele.creditorName}</h4>
                    {
                        userId === ele.creditor && 
                        <button class='deleteButton' onClick={() => deleteExpence(ele._id)}>Delete this expense</button>    
                    } 
                </div>  
                </> 
            } else if (ele.type === 'settlement') {
                return <>
                <div className='margin-top-20'>
                    <h4 class='title'>Compensation</h4>
                    <h4>{ele.debitor.name} payed {ele.creditor.name} {ele.amount}€</h4>
                </div>
                </>

            }
        })
        return expenceAndSettlementList
    }

    useEffect(() => {
        //props.getAllExpences()
        getUserId()
    }, [])
   
    return (
		<>
            {allExpences.expencesAndSettlements.length > 0 ?
            showAllExpences()

            /* <>
            <div class='allExpencesContainer'>
            {allExpences.expencesAndSettlements.map((expence) => 
                 
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
            </> */
            : 
            <h2>There are no expenses yet...</h2>
            }
					
		</>
	)    
}