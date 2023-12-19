import React from 'react'
import SideBar from './SideBar'

const Layout = ({ children }) => {
  return (
    <>
        <SideBar/>
        {children}
    </>
  )
}

export default Layout