import Chart, { ArcElement, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip } from 'chart.js/auto';
import { useEffect } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import HomeLayout from '../../../layouts/HomeLayout';
import { getPaymentsRecord } from '../../../Redux/slices/RazorpaySlice';
import { getStats } from '../../../Redux/slices/StatSlice';

Chart.register(ArcElement, BarElement, CategoryScale, Legend, LinearScale, Title, Tooltip);

const AnalyticsPage = () => {
  const dispatch = useDispatch();
  const { allUserCount, subscribedCount } = useSelector((state) => state.stat);
  const { monthlySalesRecord } = useSelector((state) => state.razorpay);

  useEffect(() => {
    dispatch(getStats());
    dispatch(getPaymentsRecord());
  }, []);

  const userData = {
    labels: ["Registered User", "Enrolled User"],
    datasets: [
      {
        label: "User details",
        data: [allUserCount, subscribedCount],
        backgroundColor: ["yellow", "green"],
        borderWidth: 1
      }
    ]
  };

  const salesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: "Sales",
        data: monthlySalesRecord,
        borderColor: "rgb(255, 99, 132)",
        borderWidth: 2
      }
    ]
  };

  return (
    <HomeLayout>
      <div className="flex flex-col gap-10 p-6">
        {/* 🔙 Back Button */}
        <div>
          <Link to="/admin/dashboard">
            <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 transition duration-200">
              ← Back to Dashboard
            </button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold text-slate-500 text-center">Analytics Overview</h1>

        <div className="flex flex-col lg:flex-row justify-between gap-10">
          <div className="w-full lg:w-[30%]">
            <Pie data={userData} />
          </div>
          <div className="w-full lg:w-[70%]">
            <Line data={salesData} />
          </div>
        </div>
      </div>
    </HomeLayout>
  );
};

export default AnalyticsPage;
