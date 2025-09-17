"use client"

import React from "react"
import BottomSheet from "@/components/ui/BottomSheet"

export type CameraScannerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onResult?: (text: string) => void
  title?: string
}

export default function CameraScanner({ open, onOpenChange, onResult, title = "Scan" }: CameraScannerProps) {
  const videoRef = React.useRef<HTMLVideoElement | null>(null)
  const streamRef = React.useRef<MediaStream | null>(null)
  const rafRef = React.useRef<number | null>(null)
  const detectorRef = React.useRef<any>(null)

  const stopStream = React.useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    const s = streamRef.current
    if (s) {
      s.getTracks().forEach(t => t.stop())
      streamRef.current = null
    }
  }, [])

  React.useEffect(() => {
    if (!open) {
      stopStream()
      return
    }
    let cancelled = false
    ;(async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false })
        if (cancelled) return
        streamRef.current = stream
        const video = videoRef.current
        if (video) {
          video.srcObject = stream
          await video.play().catch(() => {})
        }
        // Try native BarcodeDetector if available
        // @ts-ignore
        if (typeof window !== "undefined" && (window as any).BarcodeDetector) {
          // @ts-ignore
          detectorRef.current = new (window as any).BarcodeDetector({ formats: ["qr_code", "aztec", "pdf417", "code_128", "code_39"] })
          const canvas = document.createElement("canvas")
          const ctx = canvas.getContext("2d")
          const tick = async () => {
            const v = videoRef.current
            if (!v || !ctx) {
              rafRef.current = requestAnimationFrame(tick)
              return
            }
            const w = v.videoWidth
            const h = v.videoHeight
            if (w && h) {
              canvas.width = w
              canvas.height = h
              ctx.drawImage(v, 0, 0, w, h)
              try {
                const blobs = await detectorRef.current.detect(canvas)
                const code = blobs?.[0]?.rawValue
                if (code) {
                  onResult?.(code)
                  onOpenChange(false)
                  return
                }
              } catch {}
            }
            rafRef.current = requestAnimationFrame(tick)
          }
          rafRef.current = requestAnimationFrame(tick)
        }
      } catch (err) {
        // silently fail; user can close the sheet
        console.error("Camera error", err)
      }
    })()
    return () => {
      cancelled = true
      stopStream()
    }
  }, [open, onOpenChange, onResult, stopStream])

  return (
    <BottomSheet open={open} onOpenChange={(o)=>{ if(!o) stopStream(); onOpenChange(o) }} title={title}>
      <div className="space-y-3">
        <div className="rounded-lg overflow-hidden bg-black aspect-[3/4] w-full max-h-[60vh] mx-auto">
          <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
        </div>
        <div className="text-xs text-muted-foreground">
          Inquadra un QR o codice; la fotocamera si fermerà automaticamente quando rilevato.
        </div>
      </div>
    </BottomSheet>
  )
}


