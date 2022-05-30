import React, { useContext } from 'react'
import { AuthContext } from '../context/auth'
import axios from 'axios';

export default function AddExpence(props) {


    const allExpences = props.allExpencesOfTrip

    const { user } = useContext(AuthContext)
    const userId = user._id

    const storedToken = localStorage.getItem('authToken')


    const deleteExpence = (id) => {
        axios.delete(`/api/expences/${id}`, { headers: { Authorization: `Bearer ${storedToken}` } })
            .then(() => {
                props.getAllExpences()
                props.refreshAllExpencesFromUser()
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

    return (
        <>
            {allExpences.expencesAndSettlements.length > 0 ?
                <div className='allExpencesContainer'>
                    {showAllExpences()}
                </div>
                :
                <h2>There are no expenses yet...</h2>
            }

        </>
    )
}