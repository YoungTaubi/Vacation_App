import logo from './logo.svg';
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
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>        
        <Route path='/' element={
        <ProtectedRoute redirectTo='/login'>
          <Home />
        </ProtectedRoute> 
        }/>           
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/account' element={
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
