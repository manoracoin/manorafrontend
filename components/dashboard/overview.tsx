"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export function Overview() {
  const data = useMemo(() => [
    {
      name: "Jan",
      total: 1200,
    },
    {
      name: "Feb",
      total: 2100,
    },
    {
      name: "Mar",
      total: 1800,
    },
    {
      name: "Apr",
      total: 2400,
    },
    {
      name: "May",
      total: 2800,
    },
    {
      name: "Jun",
      total: 3200,
    },
  ], [])

  const chartConfig = useMemo(() => ({
    xAxis: {
      dataKey: "name",
      fontSize: 12,
      stroke: "#888888",
      tickLine: false,
      axisLine: false,
      padding: { left: 10, right: 10 },
      tick: { fill: "#888888" }
    },
    yAxis: {
      fontSize: 12,
      stroke: "#888888",
      tickLine: false,
      axisLine: false,
      width: 80,
      tickFormatter: (value: number) => `$${value}`,
      tick: { fill: "#888888" }
    },
    bar: {
      dataKey: "total",
      fill: "currentColor",
      radius: [4, 4, 0, 0],
      className: "fill-amber-500"
    }
  }), [])

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <XAxis {...chartConfig.xAxis} />
        <YAxis {...chartConfig.yAxis} />
        <Bar {...chartConfig.bar} />
      </BarChart>
    </ResponsiveContainer>
  )
}