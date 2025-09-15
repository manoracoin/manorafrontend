"use client"

import { PropsWithChildren, ReactNode } from "react"
import BottomSheet from "@/components/ui/BottomSheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

// FiltersDialog is a simple shell that embeds the same FiltersPanel content
// inside a dialog for mobile view. The caller passes the same children used
// by FiltersPanel (we keep it generic so layout remains identical).
export interface FiltersDialogProps extends PropsWithChildren {
  open: boolean
  onOpenChange: (open: boolean) => void
  showDefaultFooter?: boolean
}

export function FiltersDialog({ open, onOpenChange, children, showDefaultFooter = true }: FiltersDialogProps) {
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop('matches' in e ? e.matches : (e as MediaQueryList).matches)
    setIsDesktop(mql.matches)
    const listener = (e: MediaQueryListEvent) => handler(e)
    mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener)
    return () => { mql.removeEventListener ? mql.removeEventListener('change', listener) : mql.removeListener(listener) }
  }, [])
  const Content = (
    <>
      {children}
      {showDefaultFooter && (
        <div className="mt-2 flex justify-end">
          <Button onClick={() => onOpenChange(false)}>Done</Button>
        </div>
      )}
    </>
  )
  if (!isDesktop) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title="Filters">
        {Content}
      </BottomSheet>
    )
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Filters</DialogTitle>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  )
}

export default FiltersDialog


