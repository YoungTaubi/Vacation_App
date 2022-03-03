import logo from './logo.svg';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Account from './pages/Account';
import YourTrips from './pages/YourTrips';
import AddTrip from './pages/AddTrip';
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
          }
          />           
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path='/account' element={<Account />} />
        <Route path='/your-trips' element={<YourTrips />} />
        <Route path='/add-trip' element={<AddTrip />} />
      </Routes>
    </div>
  );
}

export default App;
