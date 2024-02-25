"use client"
import ShowPost from '@/components/Post/ShowPost'
import React from 'react'

const page = () => {
  return (
    <div className='px-2 md:px-8 lg:px-20 pb-20 pt-4 h-screen overflow-y-auto overflow-x-hidden'>
        <ShowPost saved={true} />
    </div>
  )
}

export default page