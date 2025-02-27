import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Main from './components/Main/MainPage';
import SignIn from './components/SignUp/SignIn';
import SignUp from './components/SignUp/SignUp';
import ProductDetails from './components/productDetails/ProductDetails';
import Profile from './components/Profile/Profile'
import About from './components/About/About'
import Notifications from './components/Notifications/Notifications'
import Favorites from './components/Favorites/Favorites'
import Collection from './components/Collection/Collection'

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/signin/" element={<SignIn />} />
        <Route path="/signup/" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/collection" element={<Collection />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
