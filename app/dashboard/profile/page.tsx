"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { 
  Mail, 
  MapPin, 
  Edit, 
  RotateCw, 
  ZoomIn, 
  Upload, 
  Building2, 
  Briefcase, 
  Phone, 
  Globe, 
  Calendar, 
  User, 
  Shield, 
  History, 
  Settings, 
  Link as LinkIcon, 
  KeyRound, 
  AlertCircle,
  MonitorIcon,
  SmartphoneIcon,
  LaptopIcon,
  X,
  CheckCircle2,
  XCircle,
  Facebook,
  Chrome,
  Home,
  ArrowUpRight,
  Percent,
  DollarSign,
  Clock,
  Users,
  ChevronRight,
  Building,
  ImageIcon,
  Info
} from "lucide-react"
import NextImage from "next/image"
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

// Sample property data
const userProperties = [
  {
    id: "a9b7c1f4-2d3e-4a1b-9c0d-1234567890ab",
    name: "Luxury Downtown Apartment",
    type: "Apartment",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
    ownership: {
      tokens: 150,
      totalTokens: 1000,
      percentage: 15
    },
    performance: {
      value: 250000,
      appreciation: "+15%",
      monthlyYield: "8.5%",
      lastDistribution: "2024-03-01",
      nextDistribution: "2024-04-01"
    }
  },
  {
    id: "b1c2d3e4-5f67-489a-abcd-2345678901bc",
    name: "Modern Office Complex",
    type: "Commercial",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    ownership: {
      tokens: 250,
      totalTokens: 2000,
      percentage: 12.5
    },
    performance: {
      value: 450000,
      appreciation: "+12%",
      monthlyYield: "7.2%",
      lastDistribution: "2024-03-01",
      nextDistribution: "2024-04-01"
    }
  },
  {
    id: "c2d3e4f5-6789-4abc-bcde-3456789012cd",
    name: "Waterfront Residence",
    type: "House",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
    ownership: {
      tokens: 100,
      totalTokens: 1500,
      percentage: 6.67
    },
    performance: {
      value: 300000,
      appreciation: "+18%",
      monthlyYield: "9.1%",
      lastDistribution: "2024-03-01",
      nextDistribution: "2024-04-01"
    }
  }
]

const propertyTypes = [
  "Apartment",
  "House",
  "Commercial",
  "Retail",
  "Industrial",
  "Land"
]

const steps = [
  {
    id: "basic",
    name: "Basic Info",
    icon: Building
  },
  {
    id: "ownership",
    name: "Ownership",
    icon: Users
  },
  {
    id: "performance",
    name: "Performance",
    icon: ChevronRight
  },
  {
    id: "images",
    name: "Images",
    icon: ImageIcon
  }
]

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
    const img = new Image()

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

export default function ProfilePage() {
  const [editingCover, setEditingCover] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [coverImage, setCoverImage] = useState("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&auto=format&fit=crop&q=60")
  const [profileImage, setProfileImage] = useState("https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60")
  const [showCloseAccountDialog, setShowCloseAccountDialog] = useState(false)
  const [editingProperty, setEditingProperty] = useState<typeof userProperties[0] | null>(null)
  const [currentStep, setCurrentStep] = useState("basic")

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    location: "",
    image: "",
    ownership: {
      tokens: 0,
      totalTokens: 0,
      percentage: 0
    },
    performance: {
      value: 0,
      appreciation: "",
      monthlyYield: "",
      lastDistribution: "",
      nextDistribution: ""
    }
  })

  const handleImageSave = (type: 'cover' | 'profile') => (editedImage: string) => {
    if (type === 'cover') {
      setCoverImage(editedImage)
      setEditingCover(false)
    } else {
      setProfileImage(editedImage)
      setEditingProfile(false)
    }
  }

  const handleCloseAccount = () => {
    // In a real application, this would make an API call to close the account
    console.log("Closing account...")
    // After successful account closure, you would typically:
    // 1. Clear all local storage/cookies
    // 2. Redirect to logout or home page
  }

  const handleEditProperty = (property: typeof userProperties[0]) => {
    setEditingProperty(property)
    setFormData({
      name: property.name,
      type: property.type,
      location: property.location,
      image: property.image,
      ownership: { ...property.ownership },
      performance: { ...property.performance }
    })
    setCurrentStep("basic")
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNestedInputChange = (
    parent: keyof typeof formData,
    field: string,
    value: any
  ) => {
    setFormData(prev => {
      const parentObj = prev[parent] as Record<string, any>
      return {
        ...prev,
        [parent]: {
          ...parentObj,
          [field]: value,
        },
      }
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "basic":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Property Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Property Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
              />
            </div>
          </div>
        )

      case "ownership":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tokens">Owned Tokens</Label>
              <Input
                id="tokens"
                type="number"
                value={formData.ownership.tokens}
                onChange={(e) => handleNestedInputChange("ownership", "tokens", parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalTokens">Total Tokens</Label>
              <Input
                id="totalTokens"
                type="number"
                value={formData.ownership.totalTokens}
                onChange={(e) => handleNestedInputChange("ownership", "totalTokens", parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="percentage">Ownership Percentage</Label>
              <Input
                id="percentage"
                type="number"
                value={formData.ownership.percentage}
                onChange={(e) => handleNestedInputChange("ownership", "percentage", parseFloat(e.target.value))}
              />
            </div>
          </div>
        )

      case "performance":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="value">Current Value ($)</Label>
              <Input
                id="value"
                type="number"
                value={formData.performance.value}
                onChange={(e) => handleNestedInputChange("performance", "value", parseInt(e.target.value))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="appreciation">Appreciation</Label>
              <Input
                id="appreciation"
                value={formData.performance.appreciation}
                onChange={(e) => handleNestedInputChange("performance", "appreciation", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlyYield">Monthly Yield</Label>
              <Input
                id="monthlyYield"
                value={formData.performance.monthlyYield}
                onChange={(e) => handleNestedInputChange("performance", "monthlyYield", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastDistribution">Last Distribution Date</Label>
              <Input
                id="lastDistribution"
                type="date"
                value={formData.performance.lastDistribution.split("T")[0]}
                onChange={(e) => handleNestedInputChange("performance", "lastDistribution", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="nextDistribution">Next Distribution Date</Label>
              <Input
                id="nextDistribution"
                type="date"
                value={formData.performance.nextDistribution.split("T")[0]}
                onChange={(e) => handleNestedInputChange("performance", "nextDistribution", e.target.value)}
              />
            </div>
          </div>
        )

      case "images":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Property Image</Label>
              <div className="border-2 border-dashed rounded-lg p-6">
                <div className="flex flex-col items-center gap-4">
                  {formData.image && (
                    <div className="relative w-full h-48 rounded-lg overflow-hidden">
                      <img
                        src={formData.image}
                        alt={formData.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  )}
                  <Button variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </div>
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Recommended image size: 1200x800 pixels. Maximum file size: 5MB.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  const handleSaveProperty = () => {
    // In a real app, this would update the property in the database
    console.log("Saving property:", formData)
    setEditingProperty(null)
  }

  return (
    <>
      <div className="space-y-6">
        <div className="relative h-[320px] w-full rounded-xl overflow-hidden group">
          <div className="absolute inset-0">
            <NextImage
              src={coverImage}
              alt="Cover"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-background/20" />
          
          <Button 
            size="icon" 
            className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200" 
            variant="outline"
            onClick={() => setEditingCover(true)}
          >
            <Edit className="h-4 w-4" />
          </Button>

          <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <div className="relative h-32 w-32 rounded-full border-4 border-background overflow-hidden group/avatar">
              <NextImage
                src={profileImage}
                alt="Profile"
                fill
                className="object-cover"
                priority
              />
              <Button 
                size="icon" 
                className="absolute bottom-0 right-0 h-8 w-8 opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-200" 
                variant="outline"
                onClick={() => setEditingProfile(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-white">John Doe</h1>
              <p className="text-lg text-white/90">Senior Real Estate Investor</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-2 text-white/60">
                  <MapPin className="h-4 w-4" />
                  <span>San Francisco, CA</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Mail className="h-4 w-4" />
                  <span>john@example.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Total Investments</p>
              <p className="text-2xl font-bold">$2.4M</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Properties</p>
              <p className="text-2xl font-bold">24</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">ROI</p>
              <p className="text-2xl font-bold">18.5%</p>
            </div>
          </Card>
          <Card className="p-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Portfolio Value</p>
              <p className="text-2xl font-bold">$5.2M</p>
            </div>
          </Card>
        </div>

        <Tabs defaultValue="about" className="space-y-6">
          <TabsList className="bg-card/50 p-1">
            <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <User className="h-4 w-4 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger value="security" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger value="properties" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <Home className="h-4 w-4 mr-2" />
              My Properties
            </TabsTrigger>
            <TabsTrigger value="activity" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              <History className="h-4 w-4 mr-2" />
              Activity Log
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">About</h3>
              <div className="text-muted-foreground">
                About content will be implemented in the future.
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Security Settings</h3>
              <div className="text-muted-foreground">
                Security settings will be implemented in the future.
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <div className="space-y-6">
              {userProperties.map((property) => (
                <Card key={property.id} className="p-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                      <img
                        src={property.image}
                        alt={property.name}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <Link href={`/dashboard/properties/${property.id}`}>
                            <h4 className="text-lg font-semibold hover:text-primary transition-colors">
                              {property.name}
                            </h4>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary">{property.type}</Badge>
                            <p className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="h-4 w-4 mr-1" />
                              {property.location}
                            </p>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProperty(property)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Ownership</p>
                          <p className="font-semibold">{property.ownership.percentage}%</p>
                          <p className="text-xs text-muted-foreground">
                            {property.ownership.tokens} / {property.ownership.totalTokens} tokens
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Value</p>
                          <p className="font-semibold">${property.performance.value.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Yield</p>
                          <p className="font-semibold">{property.performance.monthlyYield}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Next Distribution</p>
                          <p className="font-semibold">{new Date(property.performance.nextDistribution).toLocaleDateString()}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          {property.performance.appreciation} Appreciation
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                          <Percent className="h-4 w-4 mr-1" />
                          {property.performance.monthlyYield} Monthly Yield
                        </Badge>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Activity Log</h3>
              <div className="text-muted-foreground">
                Activity log content will be implemented in the future.
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={editingCover} onOpenChange={setEditingCover}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Cover Image</DialogTitle>
          </DialogHeader>
          <ImageEditor
            imageUrl={coverImage}
            onSave={handleImageSave('cover')}
            onClose={() => setEditingCover(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={editingProfile} onOpenChange={setEditingProfile}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Profile Image</DialogTitle>
          </DialogHeader>
          <ImageEditor
            imageUrl={profileImage}
            onSave={handleImageSave('profile')}
            onClose={() => setEditingProfile(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingProperty} onOpenChange={() => setEditingProperty(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Property</DialogTitle>
          </DialogHeader>

          <div className="py-6">
            {/* Steps */}
            <div className="flex justify-between mb-8">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={cn(
                    "flex flex-col items-center gap-2 flex-1",
                    currentStep === step.id ? "text-primary" : "text-muted-foreground"
                  )}
                  role="button"
                  onClick={() => setCurrentStep(step.id)}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-full border-2 flex items-center justify-center",
                    currentStep === step.id ? "border-primary bg-primary/10" : "border-muted"
                  )}>
                    <step.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-medium">{step.name}</span>
                </div>
              ))}
            </div>

            {/* Step Content */}
            {renderStepContent()}
          </div>

          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = steps.findIndex(s => s.id === currentStep)
                if (currentIndex > 0) {
                  setCurrentStep(steps[currentIndex - 1].id)
                }
              }}
              disabled={currentStep === steps[0].id}
            >
              Previous
            </Button>
            {currentStep === steps[steps.length - 1].id ? (
              <Button onClick={handleSaveProperty}>
                Save Changes
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const currentIndex = steps.findIndex(s => s.id === currentStep)
                  if (currentIndex < steps.length - 1) {
                    setCurrentStep(steps[currentIndex + 1].id)
                  }
                }}
              >
                Next
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showCloseAccountDialog} onOpenChange={setShowCloseAccountDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove all your data from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCloseAccount}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Close Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}