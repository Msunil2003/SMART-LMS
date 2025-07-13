import { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import About from './Pages/About';
import LogIn from './Pages/auth/LogIn';
import RequiredAuth from './Pages/auth/RequiredAuth';
import SignUp from './Pages/auth/SignUp';
import UnprotectedRoute from './Pages/auth/UnprotectedRoute';
import Contact from './Pages/Contact';
import CourseDescription from './Pages/course/CourseDescription';
import CourseList from './Pages/course/CourseList';
import CreateCourse from './Pages/course/CreateCourse';
import EditCourse from './Pages/course/EditCourse';
import AddCourseLecture from './Pages/dashboard/AddCourseLecture';
import AdminDashboardHome from './Pages/dashboard/AdminFeatures/AdminDashboard';
import AnalyticsPage from './Pages/dashboard/AdminFeatures/AnalyticsPage';
import CoursesPage from './Pages/dashboard/AdminFeatures/CoursesPage';
import UserManagemet from './Pages/dashboard/AdminFeatures/UserManagement';
import WidgetsPage from './Pages/dashboard/AdminFeatures/WidgetsPage';
import CourseLectures from './Pages/dashboard/CourseLectures';
import EditCourseLecture from './Pages/dashboard/EditCourseLecture';
import HomePage from './Pages/HomePage';
import NotFound from './Pages/NotFound';
import ChangePassword from './Pages/password/ChangePassword';
import ResetPassword from './Pages/password/ResetPassword';
import Checkout from './Pages/payments/Checkout';
import CheckoutFail from './Pages/payments/CheckoutFail';
import CheckoutSuccess from './Pages/payments/CheckoutSuccess';
import BannedUserPage from './Pages/user/BannedUserPage'; // ✅ keep only one import
import Profile from './Pages/user/Profile';

function App() {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      '/': 'Learning Management System',
      '/about': 'About - Learning Management System',
      '/contact': 'Contact - Learning Management System',
      '/signup': 'Sign Up - Learning Management System',
      '/login': 'Log In - Learning Management System',
      '/courses': 'All Courses - Learning Management System',
      '/course/description': 'Course Description - LMS',
      '/course/create': 'Create Course - LMS',
      '/admin/dashboard': 'Admin Dashboard - LMS',
      '/profile': 'Profile - LMS',
      '/profile/changePassword': 'Change Password - LMS',
    };
    document.title = titles[location.pathname] || 'Learning Management System';
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="*" element={<NotFound />} />
      <Route path="/" element={<HomePage />} />

      {/* ✅ Unauthenticated Routes */}
      <Route element={<UnprotectedRoute />}>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
      </Route>

      <Route path="/reset-password/:resetToken" element={<ResetPassword />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/courses" element={<CourseList />} />
      <Route path="/course/description" element={<CourseDescription />} />
      <Route path="/banned" element={<BannedUserPage />} /> {/* ✅ Fixed closing tag */}

      {/* ✅ Admin Routes */}
      <Route element={<RequiredAuth allowedRole={['ADMIN']} />}>
        <Route path="/course/create" element={<CreateCourse />} />
        <Route path="/course/:name/:id/editCourse" element={<EditCourse />} />
        <Route path="/course/:name/:id/lectures/addlecture" element={<AddCourseLecture />} />
        <Route path="/course/:name/:id/lectures/editlecture" element={<EditCourseLecture />} />
        <Route path="/admin/dashboard" element={<AdminDashboardHome />} />
        <Route path="/admin/dashboard/analytics" element={<AnalyticsPage />} />
        <Route path="/admin/dashboard/widgets" element={<WidgetsPage />} />
        <Route path="/admin/dashboard/courses" element={<CoursesPage />} />
        <Route path="/admin/users" element={<UserManagemet />} />
      </Route>

      {/* ✅ Shared USER/ADMIN Routes */}
      <Route element={<RequiredAuth allowedRole={['ADMIN', 'USER']} />}>
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/changePassword" element={<ChangePassword />} />
        <Route path="/course/:name/checkout" element={<Checkout />} />
        <Route path="/course/:name/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/course/:name/checkout/fail" element={<CheckoutFail />} />
        <Route path="/course/:name/:id/lectures" element={<CourseLectures />} />
      </Route>
    </Routes>
  );
}

export default App;
