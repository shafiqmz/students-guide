"use client"

import { useSelector } from 'react-redux';

function useGetRole() {
  const userInfo = useSelector(state => state.user?.userInfo);

  return userInfo?.role;
}

export default useGetRole;
