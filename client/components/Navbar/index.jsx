'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import useWindowDimensions from '../General/CustomHooks/useWindowDimension';
import { Avatar, Divider, IconButton, MenuItem, Tooltip } from '@mui/material';
import StyledMenu from '../General/MuiCustom/StyledMenu';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logoutUser } from '@/redux/features/User/userSlice';
import { IoMdNotificationsOutline } from '@react-icons/all-files/io/IoMdNotificationsOutline';
import { BiMessageAltDetail } from '@react-icons/all-files/bi/BiMessageAltDetail';
import Notifications from '../Notifications';
import MessageNotifications from '../MessageNotifications';
import useGetRole from '../General/CustomHooks/useGetRole';

const Navbar = () => {
  const dimensions = useWindowDimensions();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [messageAnchorEl, setMessageAnchorEl] = React.useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = React.useState(null);
  const userInfo = useSelector((state) => state.user.userInfo);
  const open = Boolean(anchorEl);
  const openMessage = Boolean(messageAnchorEl);
  const openNotification = Boolean(notificationAnchorEl);
  const { push } = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const role = useGetRole();
  const isAdmin = !(role === 'Student' || role === 'Teacher');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(localStorage.getItem('token') !== null);
    }
  }, []);

  const toggleAnchorEl = (event) => {
    setAnchorEl((prevAnchorEl) => (prevAnchorEl ? null : event.currentTarget));
  };
  const toggleMessageAnchorEl = (event) => {
    setMessageAnchorEl((prevAnchorEl) =>
      prevAnchorEl ? null : event.currentTarget
    );
  };
  const toggleNotificationAnchorEl = (event) => {
    setNotificationAnchorEl((prevAnchorEl) =>
      prevAnchorEl ? null : event.currentTarget
    );
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleMessageClose = () => {
    setMessageAnchorEl(null);
  };
  const handleCloseNotification = () => {
    setNotificationAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    push('/login');
  };

  return (
    <div
      className='bg-white shadow-md w-100 h-16 fixed flex w-full items-center z-[99]'
      onClick={(e) => e.preventDefault()}
    >
      <Image
        src='/Logo/default-cropped.png'
        alt='Students Guide'
        height={30}
        width={dimensions.width > 500 ? 170 : 150}
        className='ml-5 cursor-pointer'
        onClick={() => push('/home')}
      />
      <div
        className={`ml-auto ${dimensions.width < 350 ? 'pr-2' : 'pr-6'
          } flex items-center`}
      >
        {isLoggedIn ?
          <>
            
            {(role === "Admin" || role === "Superadmin") && dimensions.width > 550 &&
              <>
                <p onClick={() => push("/home/dashboard")} className="mr-1 sm:mr-2 text-sm sm:text-md hover:bg-gray-100 rounded-md px-3 py-2 transition-all cursor-pointer ">Dashboard</p>
                <p onClick={() => push("/home/user-management")} className="mr-1 sm:mr-2 text-sm sm:text-md hover:bg-gray-100 rounded-md px-3 py-2 transition-all cursor-pointer ">Users</p>
              </>
            }

            {
              role !== 'Superadmin' &&
              <>
                <Tooltip enterDelay={1000} title='Messages'>
                  <IconButton
                    onClick={toggleMessageAnchorEl}
                    size='small'
                    aria-controls={open ? 'account-menu' : undefined}
                    aria-haspopup='true'
                    aria-expanded={open ? 'true' : undefined}
                    className='mr-1'
                  >
                    <div className='relative'>
                      {/* <div className='w-2 h-2 bg-primaryBlue z-50 absolute rounded-full right-0'></div> */}
                      <BiMessageAltDetail className='text-2xl sm:text-3xl md:text-4xl' />
                    </div>
                  </IconButton>
                </Tooltip>

                <StyledMenu
                  id='demo-customized-menu'
                  MenuListProps={{
                    'aria-labelledby': 'demo-customized-button',
                  }}
                  anchorEl={messageAnchorEl}
                  open={openMessage}
                  onClose={handleMessageClose}
                  className='overflow-y-scroll rounded-lg h-96'
                >
                  <MessageNotifications handleCloseMessageNotification={handleMessageClose} />
                </StyledMenu>
              

            <Tooltip enterDelay={1000} title='Account settings'>
              <IconButton
                onClick={toggleNotificationAnchorEl}
                size='small'
                sx={{}}
                aria-controls={openNotification ? 'account-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={openNotification ? 'true' : undefined}
                className='mr-1'
              >
                <div className='relative'>
                  {/* <div className='w-2 h-2 bg-primaryBlue z-50 absolute rounded-full right-0'></div> */}
                  <IoMdNotificationsOutline className='text-2xl sm:text-3xl md:text-4xl' />
                </div>
              </IconButton>
            </Tooltip>
            <StyledMenu
              id='demo-customized-menu'
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={notificationAnchorEl}
              open={openNotification}
              onClose={handleCloseNotification}
              className='overflow-y-scroll rounded-lg h-96'
            >
              <Notifications handleCloseNotification={handleCloseNotification} />
            </StyledMenu>
            </>
            }
            <Tooltip enterDelay={1000} title='Account settings'>
              <IconButton
                onClick={toggleAnchorEl}
                size='small'
                sx={{ ml: 1 }}
                aria-controls={open ? 'account-menu' : undefined}
                aria-haspopup='true'
                aria-expanded={open ? 'true' : undefined}
              >
                <Avatar
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  src={userInfo?.profilePicture}
                  alt={userInfo?.name}
                >
                </Avatar>
              </IconButton>
            </Tooltip>
            <StyledMenu
              id='demo-customized-menu'
              MenuListProps={{
                'aria-labelledby': 'demo-customized-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={() => push('/home/profile')} disableRipple>
                My Profile
              </MenuItem>
              {
                role !== "Superadmin" && (
                  <MenuItem onClick={() => push('/home/saved-posts')} disableRipple>
                Saved posts
              </MenuItem>
                )
              }
              <MenuItem onClick={() => push('/change-password')} disableRipple>
                Change Password
              </MenuItem>
              <MenuItem onClick={handleLogout} disableRipple>
                Logout
              </MenuItem>
            </StyledMenu>

            <p className='ml-1 sm:ml-2 text-sm sm:textmd '>
              {userInfo && userInfo.name && userInfo.name.split(" ")[0]}{' '}
              {userInfo?.name?.split(" ")[1] && userInfo?.name?.split(" ")[1]}
            </p>
          </> : <button onClick={() => push("/login")} className='bg-secondaryOrange hover:bg-lightOrange transition px-5 py-2 text-normal rounded-lg text-white'>Login</button>}
      </div>
    </div>
  );
};

export default Navbar;
