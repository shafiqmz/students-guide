"use client"

import React, { useEffect, useState } from 'react'
import AdminDashboard from './AdminDashboard';
import useGetRole from '@/components/General/CustomHooks/useGetRole';
import SuperadminDashboard from './SuperadminDashboard';
import NotAuthorized from '@/components/General/NotAuthorized';

const page = () => {
    const [isNotAuthorized, setIsNotAuthorized] = useState(false);
    const role = useGetRole();

    useEffect(() => {
        if (role !== "Admin" && role !== "Superadmin") {
            setIsNotAuthorized(true)
        }
    }, [])

    return (
        <>
            {
                role === 'Admin' ? <AdminDashboard /> : role === "Superadmin" ? <SuperadminDashboard /> : null
            }
            <NotAuthorized height={250} open={isNotAuthorized} onClose={() => setIsNotAuthorized(false)} />
        </>
    )
}

export default page