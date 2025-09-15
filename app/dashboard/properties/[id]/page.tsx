import PropertyDetails from "./property-details"

// Sample data - In a real app, this would come from an API
const properties = [
  {
    id: "a9b7c1f4-2d3e-4a1b-9c0d-1234567890ab",
    title: "Luxury Downtown Apartment",
    type: "Apartment",
    location: "New York, NY",
    price: 2500000,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
    bedrooms: 3,
    bathrooms: 2,
    sqft: 2100,
    status: "For Sale",
    featured: true,
    progress: 62,
    duration: "24.00 months",
    roi: "12%",
    description: "Premium residential development in the heart of downtown. This luxury apartment complex features high-end finishes, modern amenities, and spectacular city views.",
    provider: "RealFund Development LLC",
    investmentHighlights: [
      "Prime downtown location",
      "High rental demand area",
      "Luxury finishes and amenities",
      "Pre-leased units available",
      "Strong market appreciation potential"
    ],
    financials: {
      totalInvestment: 2500000,
      minInvestment: 25000,
      targetIRR: "15-18%",
      preferredReturn: "8%",
      investmentTerm: "3-5 years",
      distributions: "Quarterly"
    },
    documents: [
      { name: "Investment Memorandum", type: "PDF" },
      { name: "Financial Projections", type: "PDF" },
      { name: "Market Analysis", type: "PDF" },
      { name: "Due Diligence Report", type: "PDF" }
    ],
    timeline: [
      { date: "Q2 2024", event: "Investment Period" },
      { date: "Q3 2024", event: "Construction Start" },
      { date: "Q4 2025", event: "Construction Complete" },
      { date: "Q1 2026", event: "Stabilization" },
      { date: "2026-2029", event: "Hold Period" }
    ]
  },
  {
    id: "b1c2d3e4-5f67-489a-abcd-2345678901bc",
    title: "Modern Office Complex",
    type: "Commercial",
    location: "San Francisco, CA",
    price: 8500000,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    bedrooms: 0,
    bathrooms: 6,
    sqft: 12000,
    status: "For Sale",
    featured: false,
    progress: 45,
    duration: "36.00 months",
    roi: "15%",
    description: "State-of-the-art office complex in the heart of San Francisco's tech district. Features modern amenities, sustainable design, and flexible workspace solutions.",
    provider: "RealFund Commercial",
    investmentHighlights: [
      "Prime tech district location",
      "LEED certified building",
      "High occupancy rate",
      "Long-term corporate leases",
      "Strong rental growth potential"
    ],
    financials: {
      totalInvestment: 8500000,
      minInvestment: 50000,
      targetIRR: "18-20%",
      preferredReturn: "9%",
      investmentTerm: "5-7 years",
      distributions: "Quarterly"
    },
    documents: [
      { name: "Investment Memorandum", type: "PDF" },
      { name: "Financial Projections", type: "PDF" },
      { name: "Market Analysis", type: "PDF" },
      { name: "Due Diligence Report", type: "PDF" }
    ],
    timeline: [
      { date: "Q3 2024", event: "Investment Period" },
      { date: "Q4 2024", event: "Renovation Start" },
      { date: "Q2 2025", event: "Renovation Complete" },
      { date: "Q3 2025", event: "Full Occupancy" },
      { date: "2025-2030", event: "Hold Period" }
    ]
  },
  {
    id: "c2d3e4f5-6789-4abc-bcde-3456789012cd",
    title: "Waterfront Residence",
    type: "House",
    location: "Miami, FL",
    price: 4200000,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
    bedrooms: 5,
    bathrooms: 4,
    sqft: 4500,
    status: "For Sale",
    featured: true,
    progress: 78,
    duration: "18.00 months",
    roi: "9%",
    description: "Luxurious waterfront residence with private dock access. Features high-end finishes, panoramic water views, and resort-style amenities.",
    provider: "RealFund Luxury Homes",
    investmentHighlights: [
      "Exclusive waterfront location",
      "Private dock access",
      "Resort-style amenities",
      "High appreciation area",
      "Strong rental potential"
    ],
    financials: {
      totalInvestment: 4200000,
      minInvestment: 35000,
      targetIRR: "12-15%",
      preferredReturn: "7%",
      investmentTerm: "2-4 years",
      distributions: "Quarterly"
    },
    documents: [
      { name: "Investment Memorandum", type: "PDF" },
      { name: "Financial Projections", type: "PDF" },
      { name: "Market Analysis", type: "PDF" },
      { name: "Due Diligence Report", type: "PDF" }
    ],
    timeline: [
      { date: "Q2 2024", event: "Investment Period" },
      { date: "Q3 2024", event: "Upgrades Start" },
      { date: "Q4 2024", event: "Upgrades Complete" },
      { date: "Q1 2025", event: "Marketing & Sale" },
      { date: "2025-2027", event: "Hold Period" }
    ]
  }
]

export function generateStaticParams() {
  return properties.map((property) => ({
    id: property.id,
  }))
}

export default function Page({ params }: { params: { id: string } }) {
  const property = properties.find(p => p.id === params.id)

  if (!property) {
    return <div>Property not found</div>
  }

  return <PropertyDetails property={property} />
}