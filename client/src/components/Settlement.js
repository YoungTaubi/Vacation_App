// import { calcLength } from 'framer-motion'
import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/auth'
import axios from 'axios';
import { useParams } from 'react-router-dom';

//import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

export default function AddExpence(props) {

      const { user } = useContext(AuthContext)
      // const [renderDebitors, setRenderDebitors] = useState({})
      // const [renderCreditors, setRenderCreditors] = useState({})
      // show who owe´s whom what
      // if user is in debt, user see´s whom he owe´s
      // if user has credit, user see`s whom he get´s money from
      console.log('props',props.creditors); 
      console.log('props',props.debitors); 
      console.log('user', user);

      const { id } = useParams()

      const storedToken = localStorage.getItem('authToken')

      const showSettlement = () => {            
            let renderDebitors = props.settlements.map(settlemt => {                  
                  if (user._id === settlemt.creditor._id) {
                        console.log('creditor');                  
                        return <div>
                        <h4>You get {settlemt.amount}€ from {settlemt.debitor.name}</h4>
                        <div>
                        {settlemt.markedAsPaied &&
                        <input 
                              type="checkbox"
                              checked={settlemt.markedAsReceived}   
                              onChange={() => handleMarkedAsReceived(settlemt._id, settlemt.markedAsReceived)}      
                        />
                        }
                        </div>
                        </div>
                  } else if (user._id === settlemt.debitor._id) {
                        console.log('debitor');
                        return <div>
                        <h4>You owe {settlemt.creditor.name} {settlemt.amount}€</h4>
                        <div>
                        <input 
                              type="checkbox"
                              checked={settlemt.markedAsPaied}   
                              onChange={() => handleMarkedAsPaied(settlemt._id, settlemt.markedAsPaied)}      
                        />
                        </div>
                        </div>
                  }                  
            })
            return renderDebitors            
      }

      const handleSettlement = () => {
            console.log('settlement');
            const requestBody = {test: 'test'}
            axios.post(`api/expences/${id}/settlement`, requestBody,{ headers: { Authorization: `Bearer ${storedToken}` } })
      }

      const handleMarkedAsPaied = (settlementId, markedAsPaied) => {
            const requestBody = {
                  settlementId: settlementId,
                  markedAsPaied: markedAsPaied
            }
            axios.put(`api/expences/${id}/markedAsPaied`, requestBody,{ headers: { Authorization: `Bearer ${storedToken}` } })
            props.updateSettlements()
            // showSettlement()
            // if (renderDebitors.userIsCreditor) {
            //       renderDebitors.debitors.forEach(debitor => {
            //             console.log('click');
            //             debitor.markedAsPaied = true
            //       })

            // }
      }

      const handleMarkedAsReceived = (settlementId, markedAsReceived) => {
            const requestBody = {
                  settlementId: settlementId,
                  markedAsReceived: markedAsReceived
            }
            axios.put(`api/expences/${id}/markedAsReceived`, requestBody,{ headers: { Authorization: `Bearer ${storedToken}` } })
            props.updateSettlements()
      }

      // const handleSubmit = (e) => {
      //   const requestBody = { name, email }        
      //   axios.put(`/api/account/${id}`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
      //   getUserData()	
	// }

      // const debitors = () => {
      //       // props.creditors.forEach(creditor => {
      //       //       if (user._id === creditor._id) {
      //       //             console.log('debitors1', creditor.debitor);
      //       //             setRenderDebitors({userIsCreditor : true, debitors : creditor.debitor}) 
      //       //       } 
      //       // })      
      // }

      // const creditors = () => {
      //       // props.debitors.forEach(debitor => {
      //       //       if (user._id === debitor._id) {
      //       //             setRenderCreditors({userIsCreditor : false, creditors : debitor.payCreditors}) 
      //       //       }
      //       // })      
      // }

      // const showDebitors = () => {                
      //       let arr = renderDebitors.debitors.map(debitor => {
      //       return <div><h4>You get {debitor.paing}€ from {debitor.name}</h4>
      //       <div>
      //       <input 
      //             type="checkbox"
      //             checked={debitor.markedAsPaied}   
      //             onChange={() => handleMarkedAsPaied(debitor._id)}      
      //       />
      //       </div></div>
      //       })
      //       return arr
      // }

      // const showCreditors = () => {                
      //       let arr = renderCreditors.creditors.map(creditor => {
      //       return <h4>You owe {creditor.amount}€ to {creditor.creditorName}</h4>
      //       })
      //       return arr
      // }


      useEffect(() => {
                       
      }, [])

      useEffect(() => {
            showSettlement()
      }, [id])

      // useEffect(() => {
      //       if (typeof renderDebitors.debitors !== undefined &&
      //             typeof renderCreditors.creditors !== undefined )
      //       showDebitors()
      // },[renderDebitors, renderCreditors])

      // console.log('renderDebitors', renderDebitors);
      // console.log('renderCreditors', renderCreditors);
      
      return (
	            <>
                    <h2>Settlement</h2>

                    {showSettlement()}

                    {/* {props.settlements.map(settlement => 
                        <>
                        <h3>{settlement.creditor.name}</h3>
                        <h3>{settlement.debitor.name}</h3>
                        <h3>{settlement.amount}</h3>
                        </>
                    )} */}

                    {/* {renderDebitors.userIsCreditor && typeof renderDebitors.debitors !== undefined &&
                        showDebitors()
                    }
                    {renderCreditors.userIsCreditor === false && typeof renderCreditors.creditors !== undefined &&
                        showCreditors()
                    } */}

                    <button onClick={() => handleSettlement()}>Settlement</button>
                                      					 
	            </>
	      )    
}



                   