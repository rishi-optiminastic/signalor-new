'use client'
import { IconMenu2, IconX } from '@tabler/icons-react'
import { AnimatePresence, motion } from 'motion/react'
import React, { useState, createContext, useContext } from 'react'

import { cn } from '@fe/lib/utils'

interface Links {
  label: string
  href: string
  icon: React.JSX.Element | React.ReactNode
}

interface SidebarContextProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  animate: boolean
  hoverExpand: boolean
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined)

export const useSidebar = () => {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider')
  }
  return context
}

export const SidebarProvider = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  animate = true,
  hoverExpand = true,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
  hoverExpand?: boolean
}) => {
  const [openState, setOpenState] = useState(false)

  const open = openProp !== undefined ? openProp : openState
  const setOpen = setOpenProp !== undefined ? setOpenProp : setOpenState

  return (
    <SidebarContext.Provider value={{ open, setOpen, animate: animate, hoverExpand }}>
      {children}
    </SidebarContext.Provider>
  )
}

export const Sidebar = ({
  children,
  open,
  setOpen,
  animate,
  hoverExpand,
}: {
  children: React.ReactNode
  open?: boolean
  setOpen?: React.Dispatch<React.SetStateAction<boolean>>
  animate?: boolean
  hoverExpand?: boolean
}) => {
  return (
    <SidebarProvider open={open} setOpen={setOpen} animate={animate} hoverExpand={hoverExpand}>
      {children}
    </SidebarProvider>
  )
}

export const SidebarBody = (props: React.ComponentProps<typeof motion.div>) => {
  return (
    <>
      <DesktopSidebar {...props} />
      <MobileSidebar {...(props as React.ComponentProps<'div'>)} />
    </>
  )
}

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate, hoverExpand } = useSidebar()
  return (
    <>
      <motion.div
        className={cn(
          'border-sidebar-border bg-sidebar hidden h-full w-[280px] shrink-0 border-r px-4 py-4 md:flex md:flex-col',
          className,
        )}
        animate={{
          width: animate ? (open ? '280px' : '72px') : '280px',
        }}
        onMouseEnter={() => {
          if (hoverExpand) setOpen(true)
        }}
        onMouseLeave={() => {
          if (hoverExpand) setOpen(false)
        }}
        {...props}
      >
        {children}
      </motion.div>
    </>
  )
}

export const MobileSidebar = ({ className, children, ...props }: React.ComponentProps<'div'>) => {
  const { open, setOpen } = useSidebar()
  return (
    <>
      <div
        className={cn(
          'border-sidebar-border bg-sidebar flex h-12 w-full flex-row items-center justify-between border-b px-4 py-4 md:hidden',
        )}
        {...props}
      >
        <div className="z-20 flex w-full justify-end">
          <IconMenu2 className="text-foreground" onClick={() => setOpen(!open)} />
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{
                duration: 0.3,
                ease: 'easeInOut',
              }}
              className={cn(
                'bg-background fixed inset-0 z-[100] flex h-full w-full flex-col justify-between p-6 md:p-10',
                className,
              )}
            >
              <div
                className="text-foreground absolute top-6 right-6 z-50"
                onClick={() => setOpen(!open)}
              >
                <IconX />
              </div>
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  )
}

export const SidebarLink = ({
  link,
  className,
  ...props
}: {
  link: Links
  className?: string
} & React.ComponentProps<'a'>) => {
  const { open, animate } = useSidebar()
  return (
    <a
      href={link.href}
      className={cn('group/sidebar flex items-center justify-start gap-2 py-2', className)}
      {...props}
    >
      {link.icon}

      <motion.span
        animate={{
          display: animate ? (open ? 'inline-block' : 'none') : 'inline-block',
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="text-sidebar-foreground/85 group-hover/sidebar:text-sidebar-foreground !m-0 inline-block !p-0 text-sm whitespace-pre transition duration-150 group-hover/sidebar:translate-x-1"
      >
        {link.label}
      </motion.span>
    </a>
  )
}
