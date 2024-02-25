import React from 'react';
import { Avatar, Tooltip } from '@mui/material';
import Link from 'next/link';
import { FaRegCopy } from "@react-icons/all-files/fa/FaRegCopy"
import { useSnackbar } from 'notistack';

const ClassRoomCard = ({ classroom }) => {
    const { enqueueSnackbar } = useSnackbar()

    const copyClassroomLinkToClipboard = (event) => {
        event.preventDefault();
        const classroomLink = `http://localhost:3000/home/classrooms/join/${classroom.classroomId}`;

        const textArea = document.createElement("textarea");
        textArea.value = classroomLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        enqueueSnackbar("Copied link to share for the joinees.", { variant: "success" })
    }

    return (
        <Link
            href={`classrooms/${classroom.classroomId}`}
            className='bg-white w-[95%] mt-5 rounded-lg cursor-pointer hover:drop-shadow-lg transition-all p-2 md:p-4'
            style={{
                textDecoration: 'none'
            }}
        >
            <div className="flex justify-between items-center">
                <h3 className="text-textColor text-sm md:text-lg font-semibold w-3/4">{classroom.title}</h3>
                <div className="flex flex-col  justify-end ">
                    <p className='text-[7px] xs:text-[10px]'>{`Enrolled: ${classroom.studentCount}`}</p>
                    <Tooltip title="Share classroom link">
                        <div onClick={copyClassroomLinkToClipboard}
                            className='p-2 transition-all hover:bg-mainHover rounded-full cursor-pointer ml-2'>
                            <FaRegCopy className='cursor-pointer text-secondaryOrange text-lg ease-linear  transition-all delay-200' />
                        </div>
                    </Tooltip>
                </div>
            </div>

            <p className="text-xs md:text-sm w-4/5 text-bgContrast mt-2 ">{classroom.description}</p>
            <div className="flex justify-between items-center mt-2">
                <div className="w-4/5 flex flex-col">
                    <p className='text-xs mt-2'>Class Code: <span className='font-semibold'>{classroom.classCode}</span></p>
                    <p className="text-xs text-bgContrast mt-1">by <span className='font-semibold'>{classroom.teacherName}</span></p>
                </div>
                <Avatar src={classroom.teacherProfile} alt={classroom.teacherName} />
            </div>
        </Link>
    );
};

export default ClassRoomCard;
