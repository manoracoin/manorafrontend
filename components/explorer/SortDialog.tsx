"use client"

import BottomSheet from "@/components/ui/BottomSheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export interface SortDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sortBy: string
  setSortBy: (value: string) => void
  options: string[]
}

export function SortDialog({ open, onOpenChange, sortBy, setSortBy, options }: SortDialogProps) {
  const [isDesktop, setIsDesktop] = useState<boolean>(false)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 640px)')
    const handler = (e: MediaQueryListEvent | MediaQueryList) => setIsDesktop('matches' in e ? e.matches : (e as MediaQueryList).matches)
    // Initial
    setIsDesktop(mql.matches)
    // Subscribe
    const listener = (e: MediaQueryListEvent) => handler(e)
    mql.addEventListener ? mql.addEventListener('change', listener) : mql.addListener(listener)
    return () => { mql.removeEventListener ? mql.removeEventListener('change', listener) : mql.removeListener(listener) }
  }, [])
  const Content = (
    <>
      <RadioGroup value={sortBy} onValueChange={setSortBy} className="gap-3">
        {options.map((option) => (
          <label key={option} className="flex items-center gap-3 py-1">
            <RadioGroupItem value={option} />
            <span className="text-sm">{option}</span>
          </label>
        ))}
      </RadioGroup>
      <div className="mt-4 flex justify-end">
        <Button onClick={() => onOpenChange(false)}>Done</Button>
      </div>
    </>
  )
  if (!isDesktop) {
    return (
      <BottomSheet open={open} onOpenChange={onOpenChange} title="Sort">
        {Content}
      </BottomSheet>
    )
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle>Sort</DialogTitle>
        </DialogHeader>
        {Content}
      </DialogContent>
    </Dialog>
  )
}

export default SortDialog


