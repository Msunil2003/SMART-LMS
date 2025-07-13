import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import HomeLayout from '../../../layouts/HomeLayout';

function AdminDashboardHome() {
  const user = useSelector((state) => state.auth.user);

  return (
    <HomeLayout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 gap-12">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-slate-500">
          Welcome, {user?.fullName || 'Admin'} 👋
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl px-4">
          <FeatureCard
            to="/admin/dashboard/analytics"
            icon="📈"
            title="View Analytics"
            color="from-indigo-500 to-purple-500"
          />

          <FeatureCard
            to="/admin/dashboard/widgets"
            icon="👥"
            title="User & Revenue Stats"
            color="from-green-400 to-teal-500"
          />

          <FeatureCard
            to="/admin/dashboard/courses"
            icon="📚"
            title="Manage Courses"
            color="from-yellow-400 to-orange-500"
          />

          {/* ➕ New Card: Manage Users */}
          <FeatureCard
            to="/admin/users"
            icon="🧑‍💼"
            title="Manage Users"
            color="from-blue-500 to-sky-600"
          />
        </div>
      </div>
    </HomeLayout>
  );
}

const FeatureCard = ({ to, icon, title, color }) => (
  <Link
    to={to}
    className={`bg-gradient-to-br ${color} rounded-xl text-white p-8 flex flex-col items-center justify-center text-center shadow-lg 
    transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95`}
  >
    <span className="text-5xl mb-4">{icon}</span>
    <p className="text-lg md:text-xl font-semibold">{title}</p>
  </Link>
);

export default AdminDashboardHome;
