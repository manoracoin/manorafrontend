"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Building2, Users2, Home, Wallet2, ChevronLeft, ChevronRight, Compass, Coins, MessageSquare, Newspaper } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Image from "next/image"
import { useState, useEffect } from "react"
import { useI18n } from "@/components/i18n-provider"
import SidebarBalanceCard from "@/components/dashboard/SidebarBalanceCard"

export const routes = [
  {
    key: 'nav.dashboard',
    icon: Home,
    href: '/dashboard',
  },
  {
    key: 'nav.explorer',
    icon: Compass,
    href: '/dashboard/explorer',
  },
  {
    key: 'nav.properties',
    icon: Building2,
    href: '/dashboard/properties',
  },
  {
    key: 'nav.ico',
    icon: Coins,
    href: '/dashboard/ico',
  },
  {
    key: 'nav.news',
    icon: Newspaper,
    href: '/dashboard/news',
  },
  {
    key: 'nav.messages',
    icon: MessageSquare,
    href: '/dashboard/messages',
  },
  {
    key: 'nav.wallet',
    icon: Wallet2,
    href: '/dashboard/wallet',
  },
]

export function Sidebar() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('sidebarCollapsed')
    if (stored !== null) {
      setIsCollapsed(stored === 'true')
    }
  }, [])

  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebarCollapsed', String(newState))
  }

  if (!mounted) {
    return null
  }

  return (
    <div className={cn(
      "hidden md:flex sticky top-0 h-screen overflow-y-auto shrink-0 bg-card/50 border-r border-border/50 flex-col transition-all duration-300",
      isCollapsed ? "w-[70px]" : "w-[240px]"
    )}>
      {/* Logo */}
      <div className="p-4">
        <Link href="/dashboard" className="flex justify-center">
          <div className={cn(
            "relative flex-shrink-0 transition-all duration-300",
            isCollapsed ? "w-8 h-8" : "w-12 h-12"
          )}>
            <Image
              src="https://appoostobio.com/uploads/block_images/ec56e1051238fbf784ff56698ec327aa.png"
              alt={t('common.logoAlt')}
              fill
              className="object-contain"
              priority
            />
          </div>
        </Link>
      </div>

      {/* Balance Card */}
      {!isCollapsed && (
        <div className="px-3 pb-2">
          <SidebarBalanceCard total={47850} available={12350} invested={35500} />
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 px-3 py-2">
        <div className="space-y-1">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Button
                key={route.href}
                variant={pathname === route.href ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start",
                  pathname === route.href && "bg-primary/10 text-primary hover:bg-primary/20",
                  isCollapsed && "px-2"
                )}
                asChild
              >
                <Link href={route.href} className="flex items-center" aria-current={pathname === route.href ? 'page' : undefined}>
                  <Icon className={cn(
                    "flex-shrink-0",
                    isCollapsed ? "h-5 w-5" : "h-5 w-5 mr-3"
                  )} />
                  {!isCollapsed && <span>{t(route.key)}</span>}
                </Link>
              </Button>
            )
          })}
        </div>
      </div>

      {/* User Profile & Collapse Toggle - Sticky at bottom */}
      <div className="border-t border-border/50 sticky bottom-0 bg-card/50">
        <div className="p-4">
          <div className="mb-2 flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleCollapsed}
            >
              {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
              ) : (
                <ChevronLeft className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Link href="/dashboard/profile">
            <Button variant="ghost" className={cn(
              "w-full justify-start hover:bg-primary/10",
              isCollapsed && "px-2"
            )}>
              <div className="flex items-center">
                <div className={cn(
                  "relative rounded-full overflow-hidden",
                  isCollapsed ? "w-8 h-8" : "w-10 h-10"
                )}>
                  <Image
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"
                    alt={t('common.userAvatarAlt')}
                    fill
                    className="object-cover"
                  />
                </div>
                {!isCollapsed && (
                  <div className="ml-3 text-left">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john@example.com</p>
                  </div>
                )}
              </div>
            </Button>
          </Link>
          
        </div>
      </div>
    </div>
  )
}