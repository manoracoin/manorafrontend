"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const properties = [
  {
    name: "Luxury Apartments NYC",
    value: "$2.4M",
    image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    progress: 85,
  },
  {
    name: "Miami Beach Resort",
    value: "$1.8M",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    progress: 62,
  },
  {
    name: "SF Tech Hub",
    value: "$3.2M",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    progress: 43,
  },
]

export function RecentProperties() {
  return (
    <div className="space-y-8">
      {properties.map((property) => (
        <div key={property.name} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src={property.image} alt={property.name} />
            <AvatarFallback>SC</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{property.name}</p>
            <p className="text-sm text-muted-foreground">
              Target: {property.value}
            </p>
          </div>
          <div className="ml-auto font-medium">{property.progress}%</div>
        </div>
      ))}
    </div>
  )
}