"use client"

import { useEffect, useRef } from "react"

interface CandlestickPoint {
  time: string
  open: number
  high: number
  low: number
  close: number
}

interface CandlestickChartProps {
  height?: number
}

const dummyData: CandlestickPoint[] = [
  { time: "2024-02-01", open: 242, high: 248, low: 240, close: 246 },
  { time: "2024-02-02", open: 246, high: 251, low: 244, close: 249 },
  { time: "2024-02-05", open: 249, high: 252, low: 247, close: 250 },
  { time: "2024-02-06", open: 250, high: 253, low: 248, close: 251 },
  { time: "2024-02-07", open: 251, high: 255, low: 250, close: 254 },
  { time: "2024-02-08", open: 254, high: 256, low: 251, close: 252 },
  { time: "2024-02-09", open: 252, high: 255, low: 249, close: 250 },
  { time: "2024-02-12", open: 250, high: 252, low: 247, close: 248 },
  { time: "2024-02-13", open: 248, high: 250, low: 245, close: 246 },
  { time: "2024-02-14", open: 246, high: 249, low: 244, close: 247 },
  { time: "2024-02-15", open: 247, high: 251, low: 246, close: 250 },
  { time: "2024-02-16", open: 250, high: 253, low: 248, close: 251 },
  { time: "2024-02-19", open: 251, high: 254, low: 249, close: 253 },
  { time: "2024-02-20", open: 253, high: 256, low: 251, close: 255 },
  { time: "2024-02-21", open: 255, high: 257, low: 252, close: 253 },
  { time: "2024-02-22", open: 253, high: 255, low: 250, close: 251 },
  { time: "2024-02-23", open: 251, high: 254, low: 249, close: 252 },
  { time: "2024-02-26", open: 252, high: 254, low: 248, close: 249 },
  { time: "2024-02-27", open: 249, high: 251, low: 246, close: 247 },
  { time: "2024-02-28", open: 247, high: 250, low: 245, close: 248 },
  { time: "2024-02-29", open: 248, high: 251, low: 247, close: 250 },
  { time: "2024-03-01", open: 250, high: 252, low: 248, close: 251 },
  { time: "2024-03-04", open: 251, high: 255, low: 250, close: 254 },
  { time: "2024-03-05", open: 254, high: 257, low: 252, close: 256 },
]

export default function CandlestickChart({ height = 300 }: CandlestickChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const chartRef = useRef<any | null>(null)

  useEffect(() => {
    let cleanup = () => {}

    ;(async () => {
      if (!containerRef.current) return

      const mod = await import("lightweight-charts")
      const createChart = mod.createChart
      const ColorType = mod.ColorType
      const CandlestickSeriesDef = (mod as any).CandlestickSeries

      const chart = createChart(containerRef.current, {
        autoSize: true,
        height,
        layout: {
          background: { type: ColorType.Solid, color: "transparent" },
          textColor: "hsl(var(--muted-foreground))",
        },
        grid: {
          horzLines: { color: "rgba(148,163,184,0.22)", visible: true, style: (mod as any).LineStyle.Dotted },
          vertLines: { color: "rgba(148,163,184,0.22)", visible: true, style: (mod as any).LineStyle.Dotted },
        },
        rightPriceScale: { borderVisible: false },
        timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
        crosshair: {
          mode: 0,
          vertLine: { color: "rgba(148,163,184,0.35)", style: (mod as any).LineStyle.Dotted, width: 1 },
          horzLine: { color: "rgba(148,163,184,0.35)", style: (mod as any).LineStyle.Dotted, width: 1 },
        } as any,
      })

      chartRef.current = chart

      const series = typeof (chart as any).addCandlestickSeries === 'function'
        ? (chart as any).addCandlestickSeries()
        : (chart as any).addSeries(CandlestickSeriesDef)
      series.applyOptions({
        upColor: "#10b981",
        downColor: "#ef4444",
        wickUpColor: "#10b981",
        wickDownColor: "#ef4444",
        borderUpColor: "transparent",
        borderDownColor: "transparent",
      })

      // Nasconde eventuale watermark (plugin) impostando un testo/canvas trasparente
      try { (chart as any).watermark?.applyOptions?.({ visible: false, color: "transparent", text: "" }) } catch {}

      const parsed = dummyData.map(d => ({
        time: { year: Number(d.time.slice(0,4)), month: Number(d.time.slice(5,7)), day: Number(d.time.slice(8,10)) },
        open: d.open,
        high: d.high,
        low: d.low,
        close: d.close,
      }))
      series.setData(parsed as any)
      chart.timeScale().fitContent()

      const ro = new ResizeObserver(() => {
        if (!containerRef.current || !chartRef.current) return
        chartRef.current.applyOptions({ height })
      })
      ro.observe(containerRef.current)

      cleanup = () => {
        ro.disconnect()
        if (chartRef.current) {
          chartRef.current.remove()
          chartRef.current = null
        }
      }
    })()

    return () => cleanup()
  }, [height])

  return (
    <div ref={containerRef} style={{ width: "100%", height, overflow: "hidden", position: "relative" }} />
  )
}
