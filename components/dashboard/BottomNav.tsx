"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Building2, Wallet2, Compass } from "lucide-react"

export default function BottomNav() {
  const pathname = usePathname()
  const items = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/dashboard/properties", label: "Properties", icon: Building2 },
    { href: "/dashboard/wallet", label: "Wallet", icon: Wallet2 },
    { href: "/dashboard/explorer", label: "Explorer", icon: Compass },
    { href: "/dashboard/profile", label: "Profile", icon: null },
  ] as const

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/50 bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <ul className="grid grid-cols-5">
        {items.map((item) => {
          const isActive = pathname === item.href
          const Icon = item.icon
          return (
            <li key={item.href}>
              <Link href={item.href} className={cn("flex flex-col items-center justify-center py-2 text-xs", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}
                aria-current={isActive ? "page" : undefined}
              >
                {Icon ? (
                  <Icon className="h-5 w-5 mb-0.5" />
                ) : (
                  <span className="relative w-6 h-6 rounded-full overflow-hidden mb-0.5 border border-border/60">
                    <Image src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=60&auto=format&fit=crop" alt="User" fill className="object-cover" />
                  </span>
                )}
                <span>{item.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
