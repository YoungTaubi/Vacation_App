import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { io } from 'socket.io-client'


const SocketContext = React.createContext()

function SocketProviderWrapper(props) {

    const [socket, setSocket] = useState(null)
    const [socketUser, setSocketUser] = useState(null)
    const [notificationContent, setNotificationContent] = useState({})
    const [notification, setNotification] = useState(false)

    const storedToken = localStorage.getItem('authToken')

    const getSocketUser = () => {
        axios.get('/api/trips/currentUser', { headers: { Authorization: `Bearer ${storedToken}` } })
            .then(res => {
                setSocketUser(res.data)
            })
    }

    const sendNotification = (receiverId, receiverName, type) => {
        socket.emit('sendNotification', {
            senderId: socketUser._id,
            senderName: socketUser.name,
            receiverId,
            receiverName,
            type
        })
        const requestBody = { receiverId }
        axios.put('/api/notification/updateNotification/true', requestBody, { headers: { Authorization: `Bearer ${storedToken}` } })
            .then(() => {

            })
            .catch(err => {
                const errorDescription = err.response.data.message
                console.log(errorDescription);
            })
    }

    const addNewUser = (user) => {
        setSocket(io('http://myvacation-app.herokuapp.com'))
        socket.emit('newUser', user._id, user._name)
        setSocketUser(user)
    }

    const deleteSocketUser = userId => {
        socket?.emit('logoutUser', userId)
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
        setSocket(io('http://myvacation-app.herokuapp.com'))
        getSocketUser()
    }, [])

    useEffect(() => {
        socket?.emit('newUser', socketUser?._id, socketUser?.name)
    }, [socket, socketUser])


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