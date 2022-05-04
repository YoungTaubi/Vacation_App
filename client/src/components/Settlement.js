// import { calcLength } from 'framer-motion'
import React, { useEffect, useState, useContext } from 'react'
import { AuthContext } from '../context/auth'
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion'
// import styled from "styled-components";
import { RiCloseLine } from 'react-icons/ri'
import Switch from "../components/Switch";



//import { useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';

export default function AddExpence(props) {

      const { user } = useContext(AuthContext)
      // const [renderDebitors, setRenderDebitors] = useState({})
      // const [renderCreditors, setRenderCreditors] = useState({})
      // show who owe´s whom what
      // if user is in debt, user see´s whom he owe´s
      // if user has credit, user see`s whom he get´s money from
      console.log('props', props.creditors);
      console.log('props', props.debitors);
      console.log('user', user);
      console.log('tripwindow', props.settlementWindowOpen);

      const { id } = useParams()

      const storedToken = localStorage.getItem('authToken')

      const showSettlement = () => {

            let renderDebitors = props.settlements.map(settlemt => {

                  if (user._id === settlemt.creditor._id && !settlemt.markedAsReceived) {
                        return <div>
                              {settlemt.markedAsPaied ?
                                    <>
                                          <h4 className='margin-top-20'>{settlemt.debitor.name} paid you {settlemt.amount}€</h4>
                                          <div className='switch-container' style={{ width: '270px' }}>

                                                <p>Did you receive the payment?</p>
                                                <Switch
                                                      // checked={settlemt.markedAsReceived}
                                                      handleChange={handleMarkedAsReceived}
                                                      id={settlemt._id}
                                                      paied={settlemt.markedAsReceived}
                                                />
                                          </div>
                                    </>
                                    :
                                    <div>
                                          <h4 className='margin-top-20'>You get {settlemt.amount}€ from {settlemt.debitor.name}</h4>
                                          <p className='margin-top-5'>{settlemt.debitor.name} did not pay yet</p>
                                    </div>

                              }
                        </div>
                  } else if (user._id === settlemt.debitor._id) {
                        return <>
                              {settlemt.markedAsPaied ?
                                    <div className='margin-top-20'>
                                          <h4>You payed {settlemt.creditor.name} {settlemt.amount}€</h4>
                                    </div>
                                    :
                                    <div className='margin-top-20'>
                                          <h4>You owe {settlemt.creditor.name} {settlemt.amount}€</h4>
                                    </div>

                              }

                              <div className='switch-container'>
                                    {settlemt.markedAsPaied ?
                                          <p>Mark as not paied</p>
                                          :
                                          <p>Mark as paied</p>
                                    }
                                    <Switch
                                          checked={settlemt.markedAsPaied}
                                          handleChange={handleMarkedAsPaied}
                                          id={settlemt._id}
                                          paied={settlemt.markedAsPaied}
                                    />
                              </div>
                        </>


                  }
            })
            return renderDebitors
      }

      // const onChange = (newValue) => {
      //       console.log(newValue);
      //   };

      //   const initialSelectedIndex = options.findIndex(({value}) => value === "true");

      const handleSettlement = () => {
            console.log('settlement');
            const requestBody = { test: 'test' }
            axios.post(`api/expences/${id}/settlement`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
      }

      const handleMarkedAsPaied = (settlementId, markedAsPaied) => {
            const requestBody = {
                  settlementId: settlementId,
                  markedAsPaied: markedAsPaied
            }
            axios.put(`api/expences/${id}/markedAsPaied`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
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

            axios.put(`api/expences/${id}/markedAsReceived`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })

            setTimeout(() => props.updateSettlements(), 1000)
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
            handleSettlement()
      }, [props.settlementWindowOpen])

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
                  <div class='background'></div>
                  <motion.div
                        initial={{ scale: 0, y: 0, x: 0 }}
                        animate={{ scale: 1, y: 1, x: 0 }}
                  >

                        <div class="settlementContainer">

                              <RiCloseLine
                                    class='closeAddExpence'
                                    size='50px' color='#40394A'
                                    onClick={() => props.closeWindow()}
                              />

                              <h2>Settlement</h2>

                              {showSettlement()}

                              {/* <button onClick={() => handleSettlement()}>Settlement</button> */}
                        </div>
                  </motion.div>

            </>
      )
}