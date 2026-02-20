"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { iconMap, navItems } from '@/lib/constants'
import { CircleUser } from 'lucide-react'
import Image from 'next/image'

type SideMenuProps = {
  children: React.ReactNode
}

const SideMenu: React.FC<SideMenuProps> = ({ children }) => {
  const pathname = usePathname() || '/'

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 rounded-md px-2 py-1.5"
          >
            <div className="bg-primary text-primary-foreground flex size-9 items-center justify-center rounded-md text-lg font-semibold">
              <Image src="/file.svg" alt="Fine Tracker Logo" width={32} height={32} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold leading-tight">Fine Tracker</p>
              <p className="text-xs text-sidebar-foreground/70">
                We collect fines for fun!
              </p>
            </div>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            {/* <SidebarGroupLabel>Navigation</SidebarGroupLabel> */}
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map((item) => {
                  const Icon = iconMap[item.href] ?? iconMap['/']
                  const isRoot = item.href === '/'
                  const isActive = isRoot
                    ? pathname === '/'
                    : pathname === item.href || pathname.startsWith(item.href + '/')

                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.href}>
                          <Icon className="text-sidebar-foreground/70" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="bg-sidebar-accent/40 flex items-center gap-3 rounded-md px-3 py-2">
            <CircleUser className="h-9 w-9" />
            <div className="min-w-0">
              <p className="text-sm font-medium leading-tight">Fine Tracker</p>
              <p className="text-xs text-sidebar-foreground/70">
                admin@fine-tracker.app
              </p>
            </div>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarRail />
      <SidebarInset>
        <header className="flex h-16 items-center gap-3 border-b px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-lg font-semibold">Fine Tracker</h1>
        </header>
        <div className="flex-1 px-4 py-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}

export default SideMenu