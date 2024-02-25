import React from 'react'

const Message = ({ own, message }) => {
  return (
    <div className='flex w-full'>
      <div className={`flex ${own ? "ml-auto bg-secondaryOrange" : "bg-primaryBlue"}  my-2 p-2 rounded-xl text-white text-[10px] xs:text-xs md:text-md`} style={{ maxWidth: "60%", wordWrap: "break-word" }}>
        <p className="w-100">{message}</p>
      </div>
    </div>
  )
}

export default Message