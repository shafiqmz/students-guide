import ShowPost from '@/components/Post/ShowPost'
import WritePost from '@/components/Post/WritePost'
import React from 'react'

const Announcements = ({ id }) => {
    return (
        <>
            <WritePost announcement={true} classroom={true} classroomId={id} />
            <ShowPost announcement={true} classroom={true} classroomId={id} />
        </>
    )
}

export default Announcements