import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import { CgMenuLeft } from '@react-icons/all-files/cg/CgMenuLeft';
import { BiHomeSmile } from '@react-icons/all-files/bi/BiHomeSmile';
import { CgWorkAlt } from '@react-icons/all-files/cg/CgWorkAlt';
import { BiSpreadsheet } from '@react-icons/all-files/bi/BiSpreadsheet';
import { SiGoogleclassroom } from '@react-icons/all-files/si/SiGoogleclassroom';
import { BsChatSquareDots } from '@react-icons/all-files/bs/BsChatSquareDots';
import { DiGoogleAnalytics } from '@react-icons/all-files/di/DiGoogleAnalytics';
import { FaUniversity } from "@react-icons/all-files/fa/FaUniversity";
import { FaUsers } from '@react-icons/all-files/fa/FaUsers';
import useWindowDimensions from './CustomHooks/useWindowDimension';
import { useEffect } from 'react';
import useGetRole from './CustomHooks/useGetRole';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import CampaignIcon from '@mui/icons-material/Campaign';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';

const drawerWidth = 260;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} - 10px)`,
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const SidebarDrawer = ({ open, setOpen }) => {
  const dimensions = useWindowDimensions();
  const isBigScreen = dimensions.width > 950;
  const role = useGetRole();
  const { push } = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const path = usePathname();

  const toggleDrawerOpenClose = () => {
    if (!isBigScreen) setOpen(!open);
  };

  useEffect(() => {
    if (path.includes('/home')) {
      if (path.includes('/home/classrooms')) setCurrentPage(1);
      else if (path.includes('/home/recommendations')) setCurrentPage(2);
      else if (path.includes('/home/jobs')) setCurrentPage(3);
      else if (path.includes('/home/chat')) setCurrentPage(4);
      else if (path.includes('/home/announcements')) setCurrentPage(5);
      else if (path.includes('/home/user-management')) setCurrentPage(6);
      else if (path.includes('/home/dashboard')) setCurrentPage(7);
      else if (path.includes('/home/reported-posts')) setCurrentPage(8);
      else if (path.includes('/home/approve-posts')) setCurrentPage(9);
      else setCurrentPage(0);
    }
  }, [path]);

  useEffect(() => {
    setOpen(isBigScreen);
  }, [dimensions]);

  return (
    <Box>
      <CssBaseline />
      <Drawer
        variant='permanent'
        open={open}
        classes={{ paper: 'drawer-background' }}
      >
        {!isBigScreen && (
          <DrawerHeader>
            <div
              onClick={toggleDrawerOpenClose}
              className={`${isBigScreen ? 'text-disabled' : 'cursor-pointer'
                } transition-transform ease-linear flex ${open ? 'justify-end' : 'justify-center'
                } items-center w-full ${open && 'ml-3'}`}
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <CgMenuLeft
                className={`${!isBigScreen && 'hover:scale-110'} text-2xl`}
              />
            </div>
          </DrawerHeader>
        )}
        <List>
          {open && (
            <>
              {
                (role !== 'Superadmin') && (
                  <div
                    className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg '
                      } ${currentPage === 0 && 'bg-mainHover'}`}
                    onClick={() => {
                      push('/home');
                      setCurrentPage(0);
                      toggleDrawerOpenClose();
                    }}
                  >
                    <div className='ml-3 flex items-center'>
                      <BiHomeSmile className='text-2xl text-primaryBlue' />
                      <p className='text-lg ml-3'>Home</p>
                    </div>
                  </div>
                )}
              {(role === 'Student' || role === 'Teacher') && (
                <div
                  className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg'
                    } ${currentPage === 1 && 'bg-mainHover'}`}
                  onClick={() => {
                    push('/home/classrooms');
                    setCurrentPage(1);
                    toggleDrawerOpenClose();
                  }}
                >
                  <div className='ml-3 flex items-center'>
                    <SiGoogleclassroom className='text-xl text-primaryBlue' />
                    <p className='text-lg ml-3'>My Classrooms</p>
                  </div>
                </div>
              )}
              {role === 'Student' && (
                <div
                  className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg'
                    } ${currentPage === 2 && 'bg-mainHover'}`}
                  onClick={() => {
                    push('/home/recommendations');
                    setCurrentPage(2);
                    toggleDrawerOpenClose();
                  }}
                >
                  <div className='ml-3 flex items-center'>
                    <BiSpreadsheet className='text-2xl text-primaryBlue' />
                    <p className='text-lg ml-3'>Recommendations</p>
                  </div>
                </div>
              )}
            
                <div
                  className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg'
                    } ${currentPage === 3 && 'bg-mainHover'}`}
                  onClick={() => {
                    push('/home/jobs');
                    setCurrentPage(3);
                    toggleDrawerOpenClose();
                  }}
                >
                  <div className='ml-3 flex items-center'>
                    <CgWorkAlt className='text-2xl text-primaryBlue' />
                    <p className='text-lg ml-3'>Jobs</p>
                  </div>
                </div>

              {(role !== 'Superadmin') && (
                <div
                  className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg'
                    } ${currentPage === 4 && 'bg-mainHover'}`}
                  onClick={() => {
                    push('/home/chat');
                    setCurrentPage(4);
                    toggleDrawerOpenClose();
                  }}
                >
                  <div className='ml-3 flex items-center'>
                    <BsChatSquareDots className='text-xl text-primaryBlue' />
                    <p className='text-lg ml-3'>Chats</p>
                  </div>
                </div>
              )}
              {(role === 'Student' || role === "Teacher" || role === "Admin") && (
                <div
                  className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg'
                    } ${currentPage === 5 && 'bg-mainHover'}`}
                  onClick={() => {
                    push('/home/announcements');
                    setCurrentPage(5);
                    toggleDrawerOpenClose();
                  }}
                >
                  <div className='ml-3 flex items-center'>
                    <CampaignIcon className='text-2xl text-primaryBlue' />
                    <p className='text-lg ml-3'>Announcements</p>
                  </div>
                </div>
              )}
              {(role === "Admin" || role === "Superadmin") && (
                <div
                  className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg'
                    } ${currentPage === 6 && 'bg-mainHover'}`}
                  onClick={() => {
                    push('/home/user-management');
                    setCurrentPage(6);
                    toggleDrawerOpenClose();
                  }}
                >
                  <div className='ml-3 flex items-center'>
                    <FaUsers className='text-2xl text-primaryBlue' />
                    <p className='text-lg ml-3'>User Management</p>
                  </div>
                </div>
              )}
              {(role === 'Admin' || role === 'Superadmin') && (
                <div
                  className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg'
                    } ${currentPage === 7 && 'bg-mainHover'}`}
                  onClick={() => {
                    push('/home/dashboard');
                    setCurrentPage(7);
                    toggleDrawerOpenClose();
                  }}
                >
                  <div className='ml-3 flex items-center'>
                    <DiGoogleAnalytics className='text-xl text-primaryBlue' />
                    <p className='text-lg ml-3'>Dashboard</p>
                  </div>
                </div>
              )}
              {role === 'Admin' && (
                <div
                  className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg'
                    } ${currentPage === 8 && 'bg-mainHover'}`}
                  onClick={() => {
                    push('/home/reported-posts');
                    setCurrentPage(8);
                    toggleDrawerOpenClose();
                  }}
                >
                  <div className='ml-3 flex items-center'>
                    <ReportGmailerrorredIcon className='text-2xl text-primaryBlue' />
                    <p className='text-lg ml-3'>Reported Posts</p>
                  </div>
                </div>
              )}
              {role === 'Admin' && (
                <div
                  className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg'
                    } ${currentPage === 9 && 'bg-mainHover'}`}
                  onClick={() => {
                    push('/home/approve-posts');
                    setCurrentPage(9);
                    toggleDrawerOpenClose();
                  }}
                >
                  <div className='ml-3 flex items-center'>
                    <DynamicFeedIcon className='text-2xl text-primaryBlue' />
                    <p className='text-lg ml-3'>Approve Posts</p>
                  </div>
                </div>
              )}
              {role === 'Superadmin' && (
                <div
                  className={`flex items-center cursor-pointer hover:bg-mainHover p-3 ${isBigScreen && 'rounded-lg'
                    } ${currentPage === 10 && 'bg-mainHover'}`}
                  onClick={() => {
                    push('/home/university-management');
                    setCurrentPage(10);
                    toggleDrawerOpenClose();
                  }}
                >
                  <div className='ml-3 flex items-center'>
                    <FaUniversity className='text-2xl text-primaryBlue' />
                    <p className='text-lg ml-3'>University Management</p>
                  </div>
                </div>
              )}
            </>
          )}
        </List>
      </Drawer>
    </Box>
  );
};

export default SidebarDrawer;
