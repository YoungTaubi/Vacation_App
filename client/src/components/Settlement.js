import React, { useEffect, useContext } from 'react'
import { AuthContext } from '../context/auth'
import { SocketContext } from '../context/socket';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion'
import { RiCloseLine } from 'react-icons/ri'
import Switch from "../components/Switch";

export default function AddExpence(props) {

      const { user } = useContext(AuthContext)
      const { sendNotification } = useContext(SocketContext)

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
                                                      handleChange={handleMarkedAsReceived}
                                                      id={settlemt._id}
                                                      paied={settlemt.markedAsReceived}
                                                      receiverId={settlemt.debitor._id}
                                                      receiverName={settlemt.debitor.name}
                                                      type={3}
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
                                    <div>
                                          <h4>You payed {settlemt.creditor.name} {settlemt.amount}€</h4>
                                    </div>
                                    :
                                    <div>
                                          <h4>You owe {settlemt.creditor.name} {settlemt.amount}€</h4>
                                    </div>

                              }

                              <div className='switch-container'>
                                    {settlemt.markedAsPaied ?
                                          <p>Mark as not paid</p>
                                          :
                                          <p>Mark as paid</p>
                                    }
                                    <Switch
                                          checked={settlemt.markedAsPaied}
                                          handleChange={handleMarkedAsPaied}
                                          id={settlemt._id}
                                          paied={settlemt.markedAsPaied}
                                          receiverId={settlemt.creditor._id}
                                          receiverName={settlemt.creditor.name}
                                          type={2}
                                    />
                              </div>
                        </>


                  }
            })
            return renderDebitors
      }

      const handleSettlement = () => {
            const requestBody = { test: 'test' }
            axios.post(`api/expences/${id}/settlement`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
      }

      const handleMarkedAsPaied = (settlementId, markedAsPaied, receiverId, receiverName, type) => {
            const requestBody = {
                  settlementId: settlementId,
                  markedAsPaied: markedAsPaied
            }
            axios.put(`api/expences/${id}/markedAsPaied`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
            props.updateSettlements()
            console.log('sendNotification', receiverId, receiverName, type);
            !markedAsPaied && sendNotification(receiverId, receiverName, type)
      }

      const handleMarkedAsReceived = (settlementId, markedAsReceived, receiverrId, receiverrName, type) => {
            const requestBody = {
                  settlementId: settlementId,
                  markedAsReceived: markedAsReceived
            }

            axios.put(`api/expences/${id}/markedAsReceived`, requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
            console.log('sendNotification', receiverrId, receiverrName, type);
            sendNotification(receiverrId, receiverrName, type)
            setTimeout(() => props.updateSettlements(), 1000)
      }


      useEffect(() => {
            handleSettlement()
      }, [props.settlementWindowOpen])


      return (
            <>
                  <div class='background'></div>
                  <motion.div
                        initial={{ scale: 0, y: 0, x: 0 }}
                        animate={{ scale: 1, y: 1, x: 0 }}
                  >
                        <div class="settlementWindow">

                              <RiCloseLine
                                    class='closeAddExpence'
                                    size='50px' color='#40394A'
                                    onClick={() => props.closeWindow()}
                              />

                              <h2>Settlement</h2>
                              <div className='settlementContainer'>
                                    <div className='eachSettlement margin-top-20'>
                                          {showSettlement()}
                                    </div>
                              </div>
                        </div>
                  </motion.div>

            </>
      )
}