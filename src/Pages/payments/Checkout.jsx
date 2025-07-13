import { useEffect } from 'react';
import { BsCurrencyRupee } from 'react-icons/bs';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import HomeLayout from '../../layouts/HomeLayout';

function Checkout() {
  const navigate = useNavigate();
  const { state } = useLocation();

  const userData = useSelector((state) => state.auth?.data);
  const userEmail = userData?.email || "";

  // Construct payment URL with prefilled email
  const PAYMENT_PAGE_URL = `https://rzp.io/rzp/BmpIC8m4?prefill[email]=${encodeURIComponent(userEmail)}`;

  useEffect(() => {
    if (!state) {
      navigate("/courses");
    } else {
      document.title = 'Checkout - Learning Management System';
    }
  }, []);

  function handlePaymentRedirect() {
    window.location.href = PAYMENT_PAGE_URL;
  }

  return (
    <HomeLayout>
      <div className='lg:h-screen flex justify-center items-center mb-6 lg:mb-0'>
        <div className='lg:w-1/3 w-11/12 m-auto bg-white rounded-lg shadow-lg flex flex-col gap-4 justify-center items-center pb-4'>
          <h1 className='bg-yellow-500 text-black font-bold text-3xl w-full text-center py-3 rounded-t-lg'>Course Access Bundle</h1>
          <p className='px-4 text-xl tracking-wider text-slate-500 text-center'>
            This one-time purchase gives access to all platform courses for <span className='text-2xl text-blue-500 font-bold'>1 year</span>.
          </p>
          <p className='px-5 text-xl tracking-wider text-yellow-500 text-center font-semibold'>
            Includes current and future course releases!
          </p>
          <p className='flex gap-1 items-center text-xl justify-center text-green-500'>
            <BsCurrencyRupee /> <span className='text-3xl font-bold'>999</span> only
          </p>
          <p className='text-slate-500 text-xl font-semibold px-4 text-center'>
            100% refund available if cancelled within 7 days
          </p>
          <button className='btn btn-primary w-[90%]' onClick={handlePaymentRedirect}>
            Pay with Razorpay
          </button>
        </div>
      </div>
    </HomeLayout>
  );
}

export default Checkout;
