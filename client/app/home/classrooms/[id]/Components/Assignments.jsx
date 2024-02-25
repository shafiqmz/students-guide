import ShowPost from '@/components/Post/ShowPost'
import WritePost from '@/components/Post/WritePost'
import React from 'react'

const Assignments = ({ id, role }) => {
    return (
        <>
            {role === "Teacher" && <WritePost assignment={true} classroom={true} classroomId={id} />}
            <ShowPost assignment={true} classroom={true} classroomId={id} />
        </>
    )
}

export default Assignments