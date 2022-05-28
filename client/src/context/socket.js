import React, { useState, useEffect, useContext } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'
import { AuthContext } from './auth'

const SocketContext = React.createContext()

function SocketProviderWrapper(props) {  

    
    
    const [socket, setSocket] = useState(null)
    const [socketUser, setSocketUser] = useState(null)
    const [notificationContent, setNotificationContent] = useState({})
    const [notification, setNotification] = useState(false)

    // console.log('socket', socket);

    const storedToken = localStorage.getItem('authToken')

    const getSocketUser = () => {
        axios.get('/api/trips/currentUser', { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(res => {
            setSocketUser(res.data)
        })
    } 

    const sendNotification = (receiverId, receiverName, type) => {
        // console.log('sending notification to:', receiverName,'from', socketUser._id);
        socket.emit('sendNotification', {
           senderId: socketUser._id,
           senderName: socketUser.name,
           receiverId,
           receiverName,
           type
        })
        const requestBody = {receiverId}
        axios.put('/api/notification/updateNotification/true', requestBody,{ headers: { Authorization: `Bearer ${storedToken}` } })
        .then(() => {

        })
        .catch(err => {
            const errorDescription = err.response.data.message
            console.log(errorDescription);
        })
    }

    const addNewUser = (user) => {
        setSocket(io('http://localhost:5000'))
        // console.log('isLoggedIn', isLoggedIn);
        socket.emit('newUser', user._id, user._name)
        setSocketUser(user)
        // console.log('new user from add new user: ', userName);
    }

    const deleteSocketUser = userId => {
        //socket.disconnect()
        socket?.emit('logoutUser', userId)
        // console.log('deleteSocketUser');
    }

    const setNotificationStateFalse = () => {
		axios.put('/api/notification/updateNotification/false', { headers: { Authorization: `Bearer ${storedToken}` } })
        .then(() => {

        })
        .catch(err => {
            const errorDescription = err.response.data.message
            console.log(errorDescription);
        })
		setNotification(false)
	} 


    useEffect(() => {
      setSocket(io('http://localhost:5000'))
      getSocketUser()
    //   console.log('socketUser', socketUser);
    }, [])
  
    useEffect(() => {
        socket?.emit('newUser', socketUser?._id, socketUser?.name)
        //console.log('new user: ', socketUser?.name);
    }, [socket, socketUser])

    useEffect(() => {
        console.log(socketUser);
    }, [socketUser])    

	return (
		<SocketContext.Provider value={{ 
            sendNotification, 
            socket, 
            deleteSocketUser, 
            addNewUser, 
            notificationContent,
            setNotificationContent,
            notification, 
            setNotification, 
            setNotificationStateFalse
            }}>
			{props.children}
		</SocketContext.Provider>
	)
}

export { SocketProviderWrapper, SocketContext }