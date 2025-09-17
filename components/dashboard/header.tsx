"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bell, Search } from "lucide-react"
import LanguageSwitcher from "@/components/language-switcher"
import { useI18n } from "@/components/i18n-provider"
import Image from "next/image"
import { useState } from "react"

export function Header() {
  const { t } = useI18n()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  return (
    <div className="sticky top-0 z-40 border-b border-border/50 bg-card/50/95 backdrop-blur supports-[backdrop-filter]:bg-card/50/75">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4 flex-1">
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