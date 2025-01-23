import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Main from './components/main-page/main-page';
import SignIn from './components/sign-up/sign-in';
import ProductDetails from './components/productDetails/ProductDetails';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/sign-in" element={<SignIn />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
