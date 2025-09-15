"use client"

import { useState, useCallback, useRef } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import useEmblaCarousel from 'embla-carousel-react'
import { 
  MapPin, 
  Building2, 
  Calendar,
  Percent,
  Maximize,
  ArrowLeft,
  Users,
  FileText,
  PieChart,
  Clock,
  ChevronRight,
  Info,
  Flag,
  ChevronLeft,
  X,
  Expand,
  AlertCircle,
  DollarSign,
  Upload,
  RotateCw,
  ZoomIn,
  Hammer,
  Briefcase,
  Banknote,
  Building,
  CheckCircle2
} from "lucide-react"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useI18n } from "@/components/i18n-provider"

interface Property {
  id: string
  title: string
  type: string
  location: string
  price: number
  image: string
  bedrooms: number
  bathrooms: number
  sqft: number
  status: string
  featured: boolean
  progress: number
  duration: string
  roi: string
  description: string
  provider: string
  investmentHighlights: string[]
  financials: {
    totalInvestment: number
    minInvestment: number
    targetIRR: string
    preferredReturn: string
    investmentTerm: string
    distributions: string
  }
  documents: Array<{ name: string; type: string }>
  timeline: Array<{ date: string; event: string }>
}

interface ImageEditorProps {
  imageUrl: string
  onSave: (editedImage: string) => void
  onClose: () => void
}

function ImageEditor({ imageUrl, onSave, onClose }: ImageEditorProps) {
  const [rotation, setRotation] = useState(0)
  const [scale, setScale] = useState(1)
  const [currentImage, setCurrentImage] = useState(imageUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCurrentImage(e.target?.result as string)
        setRotation(0)
        setScale(1)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new window.Image()

    img.onload = () => {
      const size = Math.max(img.width, img.height)
      canvas.width = size
      canvas.height = size

      if (ctx) {
        ctx.clearRect(0, 0, size, size)
        ctx.translate(size / 2, size / 2)
        ctx.rotate((rotation * Math.PI) / 180)
        ctx.scale(scale, scale)
        ctx.drawImage(
          img,
          -img.width / 2,
          -img.height / 2,
          img.width,
          img.height
        )
        const editedImage = canvas.toDataURL('image/jpeg')
        onSave(editedImage)
      }
    }

    img.src = currentImage
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="relative w-full h-[400px] bg-background/50 rounded-lg overflow-hidden">
        <div
          className="absolute inset-0 bg-center bg-no-repeat bg-contain"
          style={{
            backgroundImage: `url(${currentImage})`,
            transform: `rotate(${rotation}deg) scale(${scale})`,
          }}
        />
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="w-full sm:w-auto"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload New Image
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Rotation</label>
            <span className="text-sm text-muted-foreground">{rotation}°</span>
          </div>
          <div className="flex items-center gap-2">
            <RotateCw className="h-4 w-4" />
            <Slider
              value={[rotation]}
              onValueChange={(value) => setRotation(value[0])}
              min={0}
              max={360}
              step={1}
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Zoom</label>
            <span className="text-sm text-muted-foreground">{scale.toFixed(1)}x</span>
          </div>
          <div className="flex items-center gap-2">
            <ZoomIn className="h-4 w-4" />
            <Slider
              value={[scale]}
              onValueChange={(value) => setScale(value[0])}
              min={0.5}
              max={2}
              step={0.1}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function PropertyDetails({ property }: { property: Property }) {
  const { t } = useI18n()
  const [editingCover, setEditingCover] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=60")
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60")
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null)
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [showCloseAccountDialog, setShowCloseAccountDialog] = useState(false)
  
  const maxInvestment = property.financials.totalInvestment - (property.financials.totalInvestment * (property.progress / 100))

  const images = [
    property.image,
    "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60"
  ]

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCurrentSlide(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  const handleImageSave = (type: 'cover' | 'profile') => (editedImage: string) => {
    if (type === 'cover') {
      setCoverImage(editedImage)
      setEditingCover(false)
    } else {
      setProfileImage(editedImage)
      setEditingProfile(false)
    }
  }

  const projectTimeline = [
    {
      phase: "Planning & Approvals",
      date: "Q2 2024",
      status: "completed",
      icon: Building,
      description: "Obtaining necessary permits and approvals for construction",
      milestones: [
        "Site analysis completed",
        "Architectural plans approved",
        "Building permits secured"
      ]
    },
    {
      phase: "Construction Phase",
      date: "Q3 2024 - Q4 2025",
      status: "in-progress",
      icon: Hammer,
      description: "Main construction phase including structural work and finishing",
      milestones: [
        "Foundation work",
        "Structural framework",
        "Interior finishing",
        "Exterior completion"
      ]
    },
    {
      phase: "Pre-leasing",
      date: "Q3 2025",
      status: "upcoming",
      icon: Briefcase,
      description: "Securing tenants and rental agreements",
      milestones: [
        "Marketing campaign launch",
        "Tenant screening",
        "Lease agreements"
      ]
    },
    {
      phase: "Property Management",
      date: "Q1 2026",
      status: "upcoming",
      icon: Building2,
      description: "Operational phase with active property management",
      milestones: [
        "Management team setup",
        "Systems implementation",
        "Tenant move-ins"
      ]
    },
    {
      phase: "Investment Returns",
      date: "Q2 2026 onwards",
      status: "upcoming",
      icon: Banknote,
      description: "Regular dividend distributions to investors",
      milestones: [
        "First dividend distribution",
        "Quarterly performance reviews",
        "Annual investor meetings"
      ]
    }
  ]

  return (
    <div className="space-y-6">
      {/* Hero Header with Overlapped Investment Form */}
      <div className="relative h-[600px] -mx-8 -mt-6">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-background/20" />
        </div>

        {/* Content */}
        <div className="absolute inset-x-0 bottom-0 p-8">
          <div className="flex items-center gap-2 mb-4">
            <Link href="/dashboard/properties">
              <Button variant="outline" size="icon" className="bg-background/50 backdrop-blur-sm">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm">Equity</Badge>
              <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm">Mezzanine</Badge>
              <Badge variant="secondary" className="bg-background/50 backdrop-blur-sm">
                <Flag className="h-4 w-4 mr-1" />
                Italy
              </Badge>
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-white">{property.title}</h1>
              <p className="text-lg text-white/90 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {property.location}
              </p>
              <p className="text-sm text-white/80">ID: {property.id}</p>
            </div>
          </div>
        </div>

        {/* Overlapped Investment Form */}
        <div className="absolute right-8 top-8 w-[400px]">
          <Card className="p-6 bg-background/95 backdrop-blur-sm border-primary/10">
            <div className="space-y-6">
              {/* Investment Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{property.progress}% raised</span>
                  <span className="text-sm text-muted-foreground">Target: €{property.financials.totalInvestment.toLocaleString()}</span>
                </div>
                <div className="w-full bg-secondary rounded-full h-2">
                  <div 
                    className="bg-primary rounded-full h-2" 
                    style={{ width: `${property.progress}%` }}
                  />
                </div>
              </div>

              {/* Investment Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-secondary/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">{property.roi}</p>
                  <p className="text-xs text-muted-foreground">Est. ROI</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">24</p>
                  <p className="text-xs text-muted-foreground">months</p>
                </div>
                <div className="p-3 bg-secondary/50 rounded-lg text-center">
                  <p className="text-2xl font-bold">€1K</p>
                  <p className="text-xs text-muted-foreground">Min. Inv.</p>
                </div>
              </div>

              {/* Days Left */}
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">10 days left to invest</span>
                <span className="font-medium">€{(maxInvestment).toLocaleString()} available</span>
              </div>

              <Button className="w-full" size="lg">
                Invest Now
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <Tabs defaultValue="overview" className="custom-tabs">
          <TabsList>
            <TabsTrigger value="overview">{t('property.overview')}</TabsTrigger>
            <TabsTrigger value="financials">{t('property.financials')}</TabsTrigger>
            <TabsTrigger value="documents">{t('property.documents')}</TabsTrigger>
            <TabsTrigger value="timeline">{t('property.timeline')}</TabsTrigger>
          </TabsList>

          <div className="p-6">
            <TabsContent value="overview" className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About the Property</h3>
                <p className="text-muted-foreground">{property.description}</p>

                <div className="grid gap-6 md:grid-cols-2">
                  <Card className="p-6">
                    <h4 className="text-lg font-semibold mb-4">Property Details</h4>
                    <ul className="space-y-4">
                      <li className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Property Type</p>
                          <p className="text-sm text-muted-foreground">{property.type}</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                          <Maximize className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Total Area</p>
                          <p className="text-sm text-muted-foreground">{property.sqft.toLocaleString()} sqft</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Investment Term</p>
                          <p className="text-sm text-muted-foreground">{property.financials.investmentTerm}</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                          <Percent className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Target IRR</p>
                          <p className="text-sm text-muted-foreground">{property.financials.targetIRR}</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                          <DollarSign className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Minimum Investment</p>
                          <p className="text-sm text-muted-foreground">€{property.financials.minInvestment.toLocaleString()}</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                          <Clock className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Distribution Frequency</p>
                          <p className="text-sm text-muted-foreground">{property.financials.distributions}</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                          <PieChart className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Preferred Return</p>
                          <p className="text-sm text-muted-foreground">{property.financials.preferredReturn}</p>
                        </div>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-secondary/50 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">Current Investors</p>
                          <p className="text-sm text-muted-foreground">124 investors</p>
                        </div>
                      </li>
                    </ul>
                  </Card>

                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold">Investment Highlights</h4>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">
                        Key Features
                      </Badge>
                    </div>
                    <div className="space-y-4">
                      {property.investmentHighlights.map((highlight, index) => (
                        <div 
                          key={index} 
                          className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                        >
                          <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <ChevronRight className="h-4 w-4 text-primary" />
                          </div>
                          <p className="text-sm leading-tight">{highlight}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Project Timeline Section */}
                <div className="pt-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold">Project Timeline</h3>
                    <Badge variant="secondary" className="bg-primary/10 text-primary">
                      Development Phases
                    </Badge>
                  </div>
                  
                  <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[43px] top-0 bottom-0 w-px bg-border" />

                    {/* Timeline Items */}
                    <div className="space-y-8">
                      {projectTimeline.map((item, index) => (
                        <div key={index} className="relative flex gap-6">
                          {/* Timeline Node */}
                          <div className={`w-[88px] h-[88px] rounded-full border-2 flex items-center justify-center bg-card z-10
                            ${item.status === 'completed' ? 'border-green-500 text-green-500' : 
                              item.status === 'in-progress' ? 'border-primary text-primary' : 
                              'border-muted-foreground text-muted-foreground'}`}
                          >
                            <item.icon className="w-8 h-8" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 pt-4">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="text-lg font-semibold">{item.phase}</h4>
                              <Badge variant="secondary" className="text-sm">
                                {item.date}
                              </Badge>
                              {item.status === 'completed' && (
                                <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                                  <CheckCircle2 className="w-3 h-3 mr-1" />
                                  Completed
                                </Badge>
                              )}
                              {item.status === 'in-progress' && (
                                <Badge variant="secondary" className="bg-primary/10 text-primary">
                                  <Clock className="w-3 h-3 mr-1" />
                                  In Progress
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground mb-3">
                              {item.description}
                            </p>
                            <div className="space-y-2">
                              {item.milestones.map((milestone, idx) => (
                                <div 
                                  key={idx}
                                  className="flex items-start gap-2 text-sm"
                                >
                                  <div className={`w-1.5 h-1.5 rounded-full mt-1.5
                                    ${item.status === 'completed' ? 'bg-green-500' : 
                                      item.status === 'in-progress' ? 'bg-primary' : 
                                      'bg-muted-foreground'}`}
                                  />
                                  <span>{milestone}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="financials" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-medium">Investment Details</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Total Investment</span>
                      <span className="font-medium">€{property.financials.totalInvestment.toLocaleString()}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Minimum Investment</span>
                      <span className="font-medium">€{property.financials.minInvestment.toLocaleString()}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Target IRR</span>
                      <span className="font-medium">{property.financials.targetIRR}</span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Returns</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Preferred Return</span>
                      <span className="font-medium">{property.financials.preferredReturn}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Investment Term</span>
                      <span className="font-medium">{property.financials.investmentTerm}</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Distributions</span>
                      <span className="font-medium">{property.financials.distributions}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="documents" className="space-y-6">
              <div className="space-y-4">
                {property.documents.map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <span>{doc.name}</span>
                    </div>
                    <Button variant="outline" size="sm">Download</Button>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-6">
              <div className="space-y-4">
                {property.timeline.map((item, index) => (
                  <div key={index} className="flex gap-4 pb-4 last:pb-0 relative">
                    <div className="w-px bg-border absolute top-8 bottom-0 left-[17px]" />
                    <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 relative z-10">
                      <Clock className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-medium">{item.event}</p>
                      <p className="text-sm text-muted-foreground">{item.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </div>
  )
}