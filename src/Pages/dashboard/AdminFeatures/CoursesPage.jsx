import { useEffect } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import HomeLayout from '../../../layouts/HomeLayout';
import { deleteCourse, getAllCourse } from '../../../Redux/slices/CourseSlice';

const CoursesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const Courses = useSelector((state) => state.course.courseData);

  useEffect(() => {
    dispatch(getAllCourse());
  }, []);

  async function onDelete(id) {
    const res = await dispatch(deleteCourse(id));
    if (res?.payload?.success) {
      dispatch(getAllCourse());
    }
  }

  return (
    <HomeLayout>
      <div className="p-6 flex flex-col gap-6">
        {/* 🔙 Back Button */}
        <div className="self-start">
          <Link to="/admin/dashboard">
            <button className="px-4 py-2 bg-slate-700 text-white rounded hover:bg-slate-800 transition duration-200">
              ← Back to Dashboard
            </button>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-500">Course Overview</h1>
          <Link to="/course/create">
            <button className="btn btn-success text-white font-semibold mt-4 lg:mt-0">
              Create New Course
            </button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="table text-center">
            <thead>
              <tr className="text-white text-lg">
                <th>S No.</th>
                <th>Title</th>
                <th>Category</th>
                <th>Instructor</th>
                <th>Lectures</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {Courses?.map((course, idx) => (
                <tr key={course?._id} className="hover:bg-base-300">
                  <td>{idx + 1}</td>
                  <td>
                    <button
                      onClick={() =>
                        navigate(`/course/${course.title}/${course._id}/lectures`, { state: course })
                      }
                      className="text-blue-300 hover:underline"
                    >
                      {course.title}
                    </button>
                  </td>
                  <td>{course.category}</td>
                  <td>{course.createdBy}</td>
                  <td>{course.numberOfLectures}</td>
                  <td className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        navigate(`/course/${course.title}/${course._id}/editCourse`, { state: course })
                      }
                      className="text-blue-500 text-xl"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => onDelete(course._id)}
                      className="text-red-500 text-xl"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HomeLayout>
  );
};

export default CoursesPage;
