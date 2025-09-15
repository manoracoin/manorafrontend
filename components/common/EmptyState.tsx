"use client"

import { PropsWithChildren } from "react"

// Simple empty state container: title + optional description/content.
// Styles are intentionally minimal so callers can keep their current look.
export interface EmptyStateProps extends PropsWithChildren {
  title: string
  description?: string
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 border rounded-lg bg-card/50">
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      )}
      {children && (
        <div className="mt-4">{children}</div>
      )}
    </div>
  )
}

export default EmptyState


