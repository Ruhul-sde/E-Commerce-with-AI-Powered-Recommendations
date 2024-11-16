import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from './components/Header';
import Footer from './components/Footer';
import SummaryApi from './common';
import Context from './context';
import { setUserDetails } from './store/userSlice';

const App = () => {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
      });
      const data = await response.json();

      if (data.success) {
        dispatch(setUserDetails(data.data));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      const response = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include',
      });
      const data = await response.json();

      setCartProductCount(data?.data?.count || 0);
    } catch (error) {
      console.error('Error fetching cart product count:', error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, []);

  return (
    <Context.Provider
      value={{
        fetchUserDetails, // Fetch user details
        cartProductCount, // Current user's cart product count
        fetchUserAddToCart,
      }}
    >
      <ToastContainer position="top-center" />
      <Header />
      <main className="min-h-[calc(100vh-120px)] pt-16">
        <Outlet />
      </main>
      <Footer />
    </Context.Provider>
  );
};

export default App;
