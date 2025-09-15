"use client"

import { cn } from "@/lib/utils"

type Validator = { name: string; blocks: number; uptime: string }

type TopValidatorsListProps = {
  title: string
  validators: Validator[]
  containerClassName?: string
}

export default function TopValidatorsList({ title, validators, containerClassName }: TopValidatorsListProps) {
  return (
    <div className={containerClassName}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="space-y-3">
        {validators.map((v, idx) => (
          <div key={v.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                'h-9 w-9 rounded-full text-white flex items-center justify-center text-xs font-semibold',
                idx % 5 === 0 && 'bg-indigo-500',
                idx % 5 === 1 && 'bg-emerald-500',
                idx % 5 === 2 && 'bg-teal-500',
                idx % 5 === 3 && 'bg-rose-500',
                idx % 5 === 4 && 'bg-sky-500',
              )}>
                {v.name.split(' ').map(s=>s[0]).join('').slice(0,2)}
              </div>
              <div className="truncate">
                <div className="font-medium truncate">{v.name}</div>
                <div className="text-xs/relaxed opacity-90">{v.uptime} uptime</div>
              </div>
            </div>
            <div className="text-sm opacity-90">{v.blocks.toLocaleString()} blocks</div>
          </div>
        ))}
      </div>
    </div>
  )
}


