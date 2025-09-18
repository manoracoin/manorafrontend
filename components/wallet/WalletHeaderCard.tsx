"use client"

import { ReactNode, useId } from "react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Area, AreaChart, YAxis } from "recharts"

type WalletHeaderCardProps = {
  centerLabel?: string
  value: number
  locale?: string
  chartData: Array<{ value: number }>
  gradientStart: string
  gradientEnd: string
  leftAction?: ReactNode
  rightAction?: ReactNode
  formatValue?: (value: number, locale: string) => string
  valueAdornment?: ReactNode
}

export default function WalletHeaderCard({
  centerLabel,
  value,
  locale = 'en-US',
  chartData,
  gradientStart,
  gradientEnd,
  leftAction,
  rightAction,
  formatValue,
  valueAdornment,
}: WalletHeaderCardProps) {
  const gid = useId().replace(/:/g, '')
  const gradientId = `walletHeaderLine-${gid}`

  return (
    <div className="w-full">
      <div className={`flex items-center ${leftAction || rightAction ? 'justify-between' : 'justify-center'}`}>
        {leftAction}
        <div className="text-center">
          {centerLabel && (
            <div className="text-xs text-muted-foreground">{centerLabel}</div>
          )}
          <div className="text-3xl font-bold tracking-tight inline-flex items-center gap-2 leading-none">
            {valueAdornment}
            <span>{formatValue ? formatValue(value, locale) : new Intl.NumberFormat(locale === 'ar' ? 'ar' : 'en-US').format(value)}</span>
          </div>
        </div>
        {rightAction}
      </div>
      <div className="rounded-xl bg-card/50 p-2 mt-4">
        <ChartContainer
          config={{
            series: { label: centerLabel || 'Series', color: gradientEnd },
          }}
          className="h-28 w-full"
        >
          <AreaChart data={chartData} margin={{ left: 8, right: 8, top: 8, bottom: 0 }}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={gradientStart} />
                <stop offset="100%" stopColor={gradientEnd} />
              </linearGradient>
            </defs>
            <YAxis hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Area type="monotone" dataKey="value" stroke={`url(#${gradientId})`} strokeWidth={8} fillOpacity={0} strokeOpacity={0.18} />
            <Area type="monotone" dataKey="value" stroke={`url(#${gradientId})`} strokeWidth={3} fillOpacity={0} />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}


