"use client"
import NotAuthorized from '@/components/General/NotAuthorized'
import React, {useState} from 'react'

const page = () => {
    const [isNotAuthorized, setIsNotAuthorized] = useState(true)
  return (
    <NotAuthorized message="It seems like there is no token in your url param. You might need to click the link sent to your email." height={250} open={isNotAuthorized} onClose={() => setIsNotAuthorized(false)} />
  )
}

export default page