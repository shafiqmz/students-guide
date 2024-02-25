import ShowPost from '@/components/Post/ShowPost'
import WritePost from '@/components/Post/WritePost'
import React from 'react'

const PostApproval = ({ id }) => {
    return (
        <ShowPost classroom={true} classroomId={id} postApproval={true} />
    )
}

export default PostApproval