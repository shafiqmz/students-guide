'use client';
import useWindowDimensions from '@/components/General/CustomHooks/useWindowDimension';
import { useEffect, useState } from 'react';
import WritePost from './../../components/Post/WritePost';
import ShowPost from '@/components/Post/ShowPost';
import { IoChatboxOutline } from "@react-icons/all-files/io5/IoChatboxOutline"
import useGetRole from '@/components/General/CustomHooks/useGetRole';
import Loading from '@/components/General/Loading';
import NoDataLottie from '@/components/General/NoDataLottie';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';

export default function Home() {
  const dimensions = useWindowDimensions();
  const isSmallScreen = dimensions.width < 720;
  const [isHovered, setIsHovered] = useState(false);
  const role = useGetRole();
  const isAdmin = !(role === 'Student' || role === 'Teacher');
  const [classrooms, setClassrooms] = useState([])
  const [classroomLoading, setClassroomLoading] = useState(false)
  const token = JSON.parse(localStorage.getItem("token"))
  const { push } = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (role === 'Teacher' || role === 'Student')
      fetchClassrooms();
    else if (role === "Superadmin") {
      push("/home/dashboard")
    }
  }, [])

  const fetchClassrooms = () => {
    setClassroomLoading(true)
    axios.get(`${process.env.API_URL}classroom/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setClassrooms(res.data)
        setClassroomLoading(false)
      }).catch(err => {
        enqueueSnackbar("Unable to fetch data at the moment", { variant: "error" })
        setClassroomLoading(false)
      })
  }

  return (
    <div className={`flex ${isAdmin && "justify-center"} overflow-y-auto`}>
      <div
        className={`${isAdmin ? "w-full pr-2 xs:px-6 sm:px-12 md:px-16" : dimensions.width >= 720
            ? 'w-[64%] pl-2 pr-4 md:px-8 lg:px-12 xl:px-16'
            : `w-full ${dimensions.width < 400
              ? 'pl-2 pr-4'
              : dimensions.width < 500
                ? 'px-4'
                : dimensions.width < 600
                  ? 'px-12'
                  : 'px-16'
            }`
          } h-screen flex flex-col items-center pt-8 pb-20 overflow-y-auto`}
      >
        <WritePost adminAnnouncement={isAdmin} />
        <ShowPost />
      </div>
      {!isSmallScreen && !isAdmin && (
        <div
          className={`${dimensions.width < 950 ? 'w-4/12' : 'w-[28%]'
            } h-screen mr-4 overflow-y-auto overflow-x-hidden fixed top-[64px] right-0`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ overflowY: isHovered ? 'auto' : 'hidden' }}
        >
          <div className="flex flex-col mt-4 ml-4">
            <h3 className='text-bgContrast font-semibold text-md mb-2'>Your classrooms</h3>
            {
             classroomLoading ? <Loading height={150} /> : classrooms && classrooms.length > 0 ? classrooms.map(classroom => (
                <p key={classroom.classroomId} onClick={() => push(`/home/classrooms/${classroom.classroomId}`)} className="text-sm text-bgContrast ml-2 mt-2 p-2 w-full hover:bg-mainHover cursor-pointer rounded-lg hover:font-semibold transition-all">
                  {classroom.title}
                </p>
              )) : <NoDataLottie height={150} message={"No classrooms joined yet"} />
            }
          </div>
        
        </div>
      )}
    </div>
  );
}
