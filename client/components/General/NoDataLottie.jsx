import React from 'react'
import Lottie from 'lottie-react';
import animationData from '/public/Lotties/not-authorized.json';

const NoDataLottie = ({message, height}) => {
    return (
        <div className='flex flex-col justify-center items-center h-[80%]'>
            <div className='flex flex-col w-full justify-center items-center'>
                <Lottie
                    animationData={animationData}
                    className='flex justify-center items-center'
                    loop={true}
                    style={{ height: height }}
                />
            </div>
            <p className='mt-1 font-medium text-sm text-primaryBlue'>
                {
                    message
                }
            </p>
        </div>
    )
}

export default NoDataLottie