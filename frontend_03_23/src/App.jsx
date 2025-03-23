import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Main from './components/Main/MainPage';
import SignIn from './components/SignUp/SignIn';
import SignUp from './components/SignUp/SignUp';
import ProductDetails from './components/ProductDetails/ProductDetails';
import Profile from './components/Profile/Profile';
import About from './components/About/About';
import Notifications from './components/Notifications/Notifications';
import Wishlist from './components/Wishlist/Wishlist';
import Collection from './components/Collection/Collection';
import Basket from './components/Basket/Basket';
import CheckOut from './components/CheckOut/CheckOut';
import ProductsPage from './components/Product/ProductsPage';
import BidPage from './components/Bid/BidPage';
import MyProductsPage from './components/MyProducts/MyProductsPage';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/bid/:id" element={<BidPage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:category" element={<ProductsPage />} />
        <Route path="/myproducts" element={<MyProductsPage />} />
        <Route path="*" element={<h2 style={{ textAlign: 'center', padding: '50px' }}>404 - Page not found</h2>} />
      </Routes>
    </HashRouter>
  );
}

export default App;
