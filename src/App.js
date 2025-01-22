import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Main from './components/main-page/main-page';
import SignIn from './components/sign-up/sign-in'; // SignIn komponens importálása
import SignUp from './components/sign-up/sign-up'; // SignUp komponens importálása
import ProductDetails from './components/productDetails/ProductDetails';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/signin" element={<SignIn />} /> {/* Bejelentkezés oldal */}
        <Route path="/signup" element={<SignUp />} /> {/* Regisztráció oldal */}
        <Route path="/product-details" element={<ProductDetails />} /> {/* Termék részletek oldal */}
      </Routes>
    </HashRouter>
  );
}

export default App;
