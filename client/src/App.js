import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Account from './pages/Account';
import YourTrips from './pages/YourTrips';
import AddTrip from './pages/AddTrip';
import Trip from './pages/Trip';
import Navbar from './components/Navbar';
import Notification from './components/Notification';
import ProtectedRoute from './components/ProtectedRoute';
import { useState, useContext, useEffect } from 'react'
import { SocketContext } from "../src/context/socket";




function App() {

  const { socket, notificationContent, setNotificationContent } = useContext(SocketContext)

  const [notificationWindow, setNotificationWindow] = useState(false)

  const setZindex = () => {
    if (!notificationWindow) {
      return '-1'
    }
  }


  useEffect(() => {
    socket?.on('getNotification', (notification) => {
      setNotificationContent(notification)
      setNotificationWindow(true)
    })
  }, [socket])


  return (
    <div className="App">

      <div className='notificationWindowContainer' style={{ zIndex: setZindex() }}>
        {
          notificationWindow &&
          <Notification
            notificationWindow={notificationWindow}
            setNotificationWindow={setNotificationWindow}
            notificationContent={notificationContent}
          />
        }
      </div>
      <Navbar />
      <Routes>
        <Route path='/' element={
          <ProtectedRoute redirectTo='/login'>
            <Home />
          </ProtectedRoute>
        } />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/account/:id' element={
          <ProtectedRoute redirectTo='/login'>
            <Account />
          </ProtectedRoute>
        } />
        <Route path='/your-trips' element={
          <ProtectedRoute redirectTo='/login'>
            <YourTrips />
          </ProtectedRoute>
        } />
        <Route path='/add-trip' element={
          <ProtectedRoute redirectTo='/login'>
            <AddTrip />
          </ProtectedRoute>
        } />
        <Route path='/:id' element={
          <ProtectedRoute redirectTo='/login'>
            <Trip />
          </ProtectedRoute>
        } />
      </Routes>
    </div>
  );
}

export default App;
