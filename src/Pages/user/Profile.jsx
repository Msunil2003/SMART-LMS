import { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import HomeLayout from '../../layouts/HomeLayout';
import { deleteProfile, editProfile, getProfile } from '../../Redux/slices/AuthSlice';
import { cancelPurchase } from '../../Redux/slices/RazorpaySlice';

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.auth?.data);
  const razorpayLoading = useSelector((state) => state.razorpay.loading);

  const [data, setData] = useState({
    previewImage: userData.avatar?.secure_url,
    name: userData.name,
    avatar: undefined,
    userId: userData._id,
    haschanges: false,
  });

  function handleImage(e) {
    const uploadImage = e.target.files[0];
    if (uploadImage) {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadImage);
      fileReader.addEventListener('load', function () {
        setData({
          ...data,
          previewImage: this.result,
          avatar: uploadImage,
          haschanges: true,
        });
      });
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setData({
      ...data,
      [name]: value,
      haschanges: true,
    });
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('name', data.name);
    formdata.append('avatar', data.avatar);
    await dispatch(editProfile(formdata));
    await dispatch(getProfile());
  }

  async function onDelete(e) {
    e.preventDefault();
    const res = await dispatch(deleteProfile(data.userId));
    if (res?.payload?.success) {
      toast.success("Account deleted");
      navigate('/signup');
    }
  }

  async function handleCancel(e) {
    e.preventDefault();
    try {
      const res = await dispatch(cancelPurchase()).unwrap();
      if (res?.success) {
        toast.success(res.message || "Purchase cancelled and refunded");
        await dispatch(getProfile());
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.message || "Something went wrong while cancelling");
    }
  }

  return (
    <HomeLayout>
      <div className='flex justify-center items-center lg:h-screen mb-4'>
        <form onSubmit={onFormSubmit} className='lg:w-[60%] w-[90%] flex flex-col gap-8 bg-white rounded-lg px-8 shadow-lg py-8'>
          {/* Profile Picture */}
          <div className='flex items-center justify-center w-full'>
            <div className='relative'>
              <img src={data.previewImage} alt="profile" className="rounded-full w-32 h-32" />
              <input
                type="file"
                id="imageUpload"
                accept='.jpg, .jpeg, .png, .svg'
                className='hidden'
                onChange={handleImage}
              />
              <label htmlFor="imageUpload" className='absolute bottom-2 right-0 rounded-full bg-slate-200 w-7 h-7 flex items-center justify-center cursor-pointer'>
                <FiEdit size={'18px'} color='black' />
              </label>
            </div>
          </div>

          {/* Profile Fields */}
          <div className='grid lg:grid-cols-2 grid-cols-1 gap-8 w-full'>
            <div className='flex w-full relative'>
              <label htmlFor="name" className='absolute bg-white bottom-9 left-5 '>Name *</label>
              <input className='h-12 w-full font-semibold px-4 py-2 border-2 bg-transparent text-black rounded-md capitalize border-slate-400 outline-0' type="text" name='name' id='name' value={data.name} onChange={handleChange} />
            </div>
            <div className='flex w-full relative'>
              <label htmlFor="email" className='absolute bg-white bottom-9 left-5 '>Email *</label>
              <input type="text" name='email' id='email' defaultValue={userData?.email} className='h-12 w-full font-semibold px-4 py-2 border-2 bg-transparent rounded-md border-slate-400 outline-0 input-disabled' disabled />
            </div>
            <div className='flex relative'>
              <label htmlFor="role" className='absolute bg-white bottom-9 left-5 '>Role *</label>
              <input type="text" name='role' id='role' defaultValue={userData?.role} className='h-12 w-full font-semibold px-4 py-2 border-2 bg-transparent rounded-md capitalize border-slate-400 outline-0 input-disabled' disabled />
            </div>
            <div className='flex relative'>
              <label htmlFor="purchase" className='absolute bg-white bottom-9 left-5 '>Purchase Status *</label>
              <input type="text" name='purchase' id='purchase' defaultValue={userData.access?.valid ? "Active" : "Inactive"} className='h-12 w-full font-semibold px-4 py-2 border-2 bg-transparent rounded-md capitalize border-slate-400 outline-0 input-disabled' disabled />
            </div>
          </div>

          {/* Actions */}
          <div className='w-full flex lg:flex-row flex-col gap-8 items-center'>
            <Link to={'/profile/changePassword'} className='w-full lg:w-fit'>
              <button className='btn btn-primary w-full lg:w-fit normal-case'>Change Password</button>
            </Link>

            <button className='btn btn-secondary w-full lg:w-fit normal-case' disabled={!data.haschanges} type='submit'>Save Changes</button>

            <button className='flex items-center text-red-500 gap-2 font-semibold' onClick={onDelete}>
              <FiTrash2 />
              Delete Account
            </button>
          </div>

          {/* Cancel Purchase (if valid) */}
          {userData.access?.valid && (
            <button
              onClick={handleCancel}
              disabled={razorpayLoading}
              className='btn btn-error text-white w-full'
            >
              {razorpayLoading ? "Cancelling..." : "Cancel Purchase"}
            </button>
          )}
        </form>
      </div>
    </HomeLayout>
  );
}

export default Profile;
