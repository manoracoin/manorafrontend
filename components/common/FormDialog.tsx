"use client"

import { PropsWithChildren } from "react"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// FormDialog is a thin wrapper around the existing Dialog to standardize
// title/header/content/footer layout for form-based modals. It intentionally
// preserves the same structure and styling used in Explorer, so adopting it
// does not change visuals.
export interface FormDialogProps extends PropsWithChildren {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  footer?: React.ReactNode
  className?: string
}

export function FormDialog({ open, onOpenChange, title, footer, className, children }: FormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={className}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        {children}
        {footer && (
          <DialogFooter>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default FormDialog


