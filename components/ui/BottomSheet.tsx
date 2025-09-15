"use client"

import { PropsWithChildren } from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"

export interface BottomSheetProps extends PropsWithChildren {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
}

export default function BottomSheet({ open, onOpenChange, title, children }: BottomSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="rounded-t-2xl pb-6 pt-2 px-0 max-h-[80vh] flex flex-col">
        <div className="mx-auto mt-2 mb-2 h-1.5 w-12 rounded-full bg-muted-foreground/30" />
        {(title ?? "") && (
          <SheetHeader>
            <SheetTitle>{title}</SheetTitle>
          </SheetHeader>
        )}
        <div className="p-4 space-y-3 overflow-y-auto flex-1 min-h-0 overscroll-contain">
          {children}
        </div>
      </SheetContent>
    </Sheet>
  )
}


