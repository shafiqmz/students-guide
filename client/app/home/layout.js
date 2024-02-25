'use client';
import React, { useEffect, useState } from 'react';
import useWindowDimensions from '@/components/General/CustomHooks/useWindowDimension';
import SidebarDrawer from '@/components/General/SidebarDrawer';
import Navbar from '@/components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { getLoggedInUserInfo } from '@/redux/features/User/userActions';
import Lottie from 'lottie-react';
import NotAuthorized from '@/components/General/NotAuthorized';
import PageLoader from '@/components/General/PageLoader';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children }) {
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const dimensions = useWindowDimensions();
  const { push } = useRouter()
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [isNotAuthorized, setIsNotAuthorized] = useState(true);

  const handleOverlayClick = () => {
    if (drawerOpen && dimensions.width <= 950) {
      setDrawerOpen(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    dispatch(
      getLoggedInUserInfo(JSON.parse(localStorage.getItem('token')))   
    ).then(() => {
      setLoading(false);
    });
    if (userInfo?._id) {
      setIsNotAuthorized(false);
    }
  }, []);

  return (
    <html lang='en'>
      <body>
        {loading ? (
          <PageLoader page={true} />
        ) : !userInfo?._id ? (
          <NotAuthorized height={250} open={isNotAuthorized} onClose={() => setIsNotAuthorized(false)} />
        ) : (
          <div className='flex flex-col overflow-x-hidden'>
            <Navbar setDrawerOpen={setDrawerOpen} drawerOpen={drawerOpen} />
            <div className='relative'>
              {drawerOpen && dimensions.width <= 950 && (
                <div
                  className='fixed top-0 left-0 w-full h-full bg-black opacity-20 transition-all z-[90] cursor-pointer'
                  onClick={handleOverlayClick}
                ></div>
              )}
              <SidebarDrawer open={drawerOpen} setOpen={setDrawerOpen} />
              <div
                className={`${
                  !drawerOpen || !(dimensions.width > 950)
                    ? 'pl-[45px]'
                    : 'pl-[240px]'
                } mt-[65px] transition-all h-screen w-screen bg-main `}
              >
                {children}
              </div>
            </div>
          </div>
        )}
      </body>
    </html>
  );
}
