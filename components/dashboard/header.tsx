"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search, Menu } from "lucide-react"
import LanguageSwitcher from "@/components/language-switcher"
import { useI18n } from "@/components/i18n-provider"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { routes } from "@/components/dashboard/sidebar"
import Image from "next/image"
import { useState } from "react"

export function Header() {
  const { t } = useI18n()
  const pathname = usePathname()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  return (
    <div className="sticky top-0 z-40 border-b border-border/50 bg-card/50/95 backdrop-blur supports-[backdrop-filter]:bg-card/50/75">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4 flex-1">
          {/* Mobile hamburger (removed in favor of BottomNav) */}
          <div className="hidden md:block">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label={t('common.menu')}>
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-full p-0 overflow-x-hidden">
                <div className="h-full flex flex-col">
                  <SheetHeader className="sr-only">
                    <SheetTitle>{t('common.menu')}</SheetTitle>
                  </SheetHeader>
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10">
                        <Image src="https://appoostobio.com/uploads/block_images/ec56e1051238fbf784ff56698ec327aa.png" alt={t('common.logoAlt')} fill className="object-contain" />
                      </div>
                      <span className="text-lg font-semibold">RealFund</span>
                    </div>
                  </div>
                  {/* Mobile search */}
                  <div className="p-0 border-b space-y-3">
                    <div className="relative w-full px-4 py-3">
                      <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder={t('header.searchPlaceholder')} className="pl-10 w-full max-w-full" />
                    </div>
                  </div>
                  <nav className="flex-1 overflow-y-auto px-2 py-2">
                    <ul className="space-y-1">
                      {routes.map((route) => (
                        <li key={route.href}>
                          <SheetClose asChild>
                            <Link
                              href={route.href}
                              className={`flex items-center px-3 py-3 rounded-md ${pathname === route.href ? 'bg-primary/10 text-primary' : 'hover:bg-muted/40'}`}
                              aria-current={pathname === route.href ? 'page' : undefined}
                            >
                              <route.icon className="h-5 w-5 mr-3" />
                              <span>{t(route.key)}</span>
                            </Link>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="border-t border-border/50 mt-auto sticky bottom-0 bg-background">
                    <div className="p-4">
                      <SheetClose asChild>
                        <Link href="/dashboard/profile">
                          <Button variant="ghost" className="w-full justify-start hover:bg-primary/10">
                            <div className="flex items-center">
                              <div className="relative rounded-full overflow-hidden w-10 h-10">
                                <Image
                                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"
                                  alt={t('common.userAvatarAlt')}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="ml-3 text-left">
                                <p className="text-sm font-medium">John Doe</p>
                                <p className="text-xs text-muted-foreground">john@example.com</p>
                              </div>
                            </div>
                          </Button>
                        </Link>
                      </SheetClose>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
          {/* Mobile logo + hide desktop search */}
          <div className="relative w-8 h-8 md:hidden">
            <Image src="https://appoostobio.com/uploads/block_images/ec56e1051238fbf784ff56698ec327aa.png" alt={t('common.logoAlt')} fill className="object-contain" />
          </div>
          <div className="relative w-full md:w-96 max-w-full hidden md:block">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder={t('header.searchPlaceholder')} className="pl-8" />
          </div>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {/* Mobile search toggle: expands a bar below the top bar */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={t('header.searchPlaceholder')}
            onClick={() => setMobileSearchOpen((v) => !v)}
          >
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <LanguageSwitcher />
          <ModeToggle />
        </div>
      </div>
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 border-t">
          <div className="relative w-full mt-3">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search properties" className="pl-8" />
          </div>
        </div>
      )}
    </div>
  )
}