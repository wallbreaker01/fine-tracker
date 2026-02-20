import SideMenu from '@/components/SideMenu'
import React from 'react'

type Props = { children: React.ReactNode }

const Layout = ({ children }: Props) => {
  return (
    <SideMenu>{children}</SideMenu>
  )
}

export default Layout