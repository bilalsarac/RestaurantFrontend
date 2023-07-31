import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home/Home';
import Navbar from './components/Navbar/CustomNavbar';
import Auth from './components/Auth/Auth';
import User from './components/User/User';
import RestaurantProfile from './components/RestaurantProfile/RestaurantProfile';

function App() {
  return (
    <div className='App'>

      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home />}></Route>
          <Route exact path="/auth" element={<Auth />}></Route>
          <Route exact path="/users/:userId" element={<User />}></Route>
          <Route exact path="/restaurants/:restaurantId" element={<RestaurantProfile />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
