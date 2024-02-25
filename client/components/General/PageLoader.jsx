import Lottie from 'lottie-react'
import React from 'react'
import animationData from '/public/Lotties/page-loader.json';

const PageLoader = ({page}) => {
  return (
    <div className={`flex ${page ? "w-screen h-screen" : "h-full w-full"} items-center justify-center`}>
        <Lottie
            animationData={animationData}
            className='flex justify-center items-center'
            loop={true}
            style={{ height: '50%', width: "50%" }}
          />
    </div>
    )
}

export default PageLoader