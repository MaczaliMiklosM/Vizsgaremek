import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

import Main from './pages/Main/MainPage';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Profile from './pages/Profile/Profile';
import About from './pages/About/About';
import Notifications from './pages/Notifications/Notifications';
import Wishlist from './pages/Wishlist/Wishlist';
import Collection from './pages/Collection/Collection';
import Basket from './pages/Basket/Basket';
import CheckOut from './pages/CheckOut/CheckOut';
import ProductsPage from './pages/Product/ProductsPage';
import BidPage from './pages/Bid/BidPage';
import MyProductsPage from './pages/MyProducts/MyProductsPage';
import TermsPage from './pages/Terms/TermsPage';
import AdminDashboard from './pages/AdminDashboard/AdminDashboard';
import RequireAdmin from './components/Auth/RequireAdmin';
import MyBidsPage from './pages/MyBidPage/MyBidsPage';
import MyOrdersPage from './pages/MyOrders/MyOrdersPage';

function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/product-details/:id" element={<ProductDetails />} />
        <Route path="/bid/:id" element={<BidPage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/mybids" element={<MyBidsPage />} />
        <Route path="/basket" element={<Basket />} />
        <Route path="/checkout" element={<CheckOut />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products/:category" element={<ProductsPage />} />
        <Route path="/myproducts" element={<MyProductsPage />} />
        <Route path="/my-orders" element={<MyOrdersPage />} />

        <Route
              path="/admin"
              element={
                <RequireAdmin>
                   <AdminDashboard />
               </RequireAdmin>
            }
         />
        <Route
          path="*"
          element={
            <h2 style={{ textAlign: 'center', padding: '50px' }}>
              404 - Page Not Found
            </h2>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
