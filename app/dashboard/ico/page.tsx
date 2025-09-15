"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Coins,
  DollarSign,
  Calendar,
  Users,
  Shield,
  Lock,
  AlertCircle,
  ChevronRight,
  Info,
  CheckCircle2,
  Settings,
  Clock,
  HelpCircle,
  Plus,
  Edit,
  Trash2,
  Star,
  X,
  Image as ImageIcon,
  Upload,
  Expand,
  ExternalLink
} from "lucide-react"
import { cn } from "@/lib/utils"

const steps = [
  {
    id: "token",
    name: "Token Details",
    icon: Coins,
    description: "Configure your token's basic information"
  },
  {
    id: "sale",
    name: "Sale Configuration",
    icon: DollarSign,
    description: "Set up your token sale parameters"
  },
  {
    id: "vesting",
    name: "Vesting & Distribution",
    icon: Lock,
    description: "Configure token vesting and distribution"
  },
  {
    id: "compliance",
    name: "Compliance",
    icon: Shield,
    description: "Set up KYC/AML and whitelist requirements"
  },
  {
    id: "highlights",
    name: "Highlights",
    icon: Star,
    description: "Add key investment highlights"
  },
  {
    id: "gallery",
    name: "Gallery",
    icon: ImageIcon,
    description: "Add project images"
  },
  {
    id: "faq",
    name: "FAQ",
    icon: HelpCircle,
    description: "Manage frequently asked questions"
  }
]

const predefinedHighlights = [
  "Strong team with proven track record",
  "Innovative technology solution",
  "Large market opportunity",
  "Strategic partnerships",
  "Clear roadmap and milestones",
  "Token utility and ecosystem",
  "Community-driven development",
  "Transparent governance model",
  "Sustainable tokenomics",
  "Regular updates and communication"
]

const vestingOptions = [
  {
    id: "linear",
    name: "Linear Vesting",
    description: "Tokens are released gradually over time"
  },
  {
    id: "cliff",
    name: "Cliff Vesting",
    description: "Tokens are released after a specific period"
  },
  {
    id: "milestone",
    name: "Milestone-based",
    description: "Tokens are released upon reaching specific milestones"
  }
]

const distributionCategories = [
  "Public Sale",
  "Private Sale",
  "Team",
  "Advisors",
  "Marketing",
  "Development",
  "Reserve"
]

export default function ICOPage() {
  const [currentStep, setCurrentStep] = useState("token")
  const [showFaqDialog, setShowFaqDialog] = useState(false)
  const [showHighlightDialog, setShowHighlightDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [editingFaq, setEditingFaq] = useState<number | null>(null)
  const [newHighlight, setNewHighlight] = useState("")
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([
    "Strong team with proven track record",
    "Innovative technology solution",
    "Large market opportunity"
  ])
  const [customHighlights, setCustomHighlights] = useState<string[]>([
    "First-mover advantage in the market",
    "Patent-pending technology"
  ])
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [images, setImages] = useState([
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=800&auto=format&fit=crop&q=60",
    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&auto=format&fit=crop&q=60"
  ])
  const [faqFormData, setFaqFormData] = useState({
    question: "",
    answer: ""
  })
  const [faqs, setFaqs] = useState([
    {
      id: 1,
      question: "What is the minimum investment amount?",
      answer: "The minimum investment amount varies depending on the ICO phase. During the public sale, it is typically set at $100 USD equivalent."
    },
    {
      id: 2,
      question: "How long is the vesting period?",
      answer: "The vesting period is designed to ensure long-term project stability. Tokens are typically vested over 12 months with a 3-month cliff period."
    },
    {
      id: 3,
      question: "What cryptocurrencies are accepted?",
      answer: "We accept various cryptocurrencies including ETH, USDT, and USDC. The exact list of accepted currencies will be finalized before the sale starts."
    }
  ])

  const [formData, setFormData] = useState({
    // Token Details
    name: "",
    symbol: "",
    totalSupply: "",
    decimals: "18",
    description: "",

    // Sale Configuration
    tokenPrice: "",
    softCap: "",
    hardCap: "",
    minContribution: "",
    maxContribution: "",
    startDate: "",
    endDate: "",
    acceptedCurrency: "USD",

    // Vesting & Distribution
    vestingType: "linear",
    vestingDuration: "",
    vestingCliff: "",
    distribution: {} as Record<string, string>,

    // Compliance
    kycRequired: false,
    whitelistRequired: false,
    maxParticipants: "",
    restrictedCountries: [] as string[]
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleDistributionChange = (category: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      distribution: {
        ...prev.distribution,
        [category]: value
      }
    }))
  }

  const handleAddFaq = () => {
    setEditingFaq(null)
    setFaqFormData({ question: "", answer: "" })
    setShowFaqDialog(true)
  }

  const handleEditFaq = (faq: typeof faqs[0]) => {
    setEditingFaq(faq.id)
    setFaqFormData({ question: faq.question, answer: faq.answer })
    setShowFaqDialog(true)
  }

  const handleDeleteFaq = (id: number) => {
    setFaqs(prev => prev.filter(faq => faq.id !== id))
  }

  const handleSaveFaq = () => {
    if (editingFaq) {
      setFaqs(prev => prev.map(faq => 
        faq.id === editingFaq 
          ? { ...faq, ...faqFormData }
          : faq
      ))
    } else {
      setFaqs(prev => [...prev, {
        id: Math.max(0, ...prev.map(f => f.id)) + 1,
        ...faqFormData
      }])
    }
    setShowFaqDialog(false)
    setFaqFormData({ question: "", answer: "" })
  }

  const handleToggleHighlight = (highlight: string) => {
    setSelectedHighlights(prev => 
      prev.includes(highlight)
        ? prev.filter(h => h !== highlight)
        : [...prev, highlight]
    )
  }

  const handleAddCustomHighlight = () => {
    if (newHighlight.trim()) {
      setCustomHighlights(prev => [...prev, newHighlight.trim()])
      setNewHighlight("")
      setShowHighlightDialog(false)
    }
  }

  const handleRemoveCustomHighlight = (highlight: string) => {
    setCustomHighlights(prev => prev.filter(h => h !== highlight))
  }

  const handleAddImage = (url: string) => {
    if (url.trim()) {
      setImages(prev => [...prev, url.trim()])
      setShowImageDialog(false)
    }
  }

  const handleRemoveImage = (url: string) => {
    setImages(prev => prev.filter(img => img !== url))
  }

  const handleDeploy = () => {
    // In a real app, this would trigger the smart contract deployment
    console.log("Deploying ICO with configuration:", formData)
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "token":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Token Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="e.g., RealFund Token"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="symbol">Token Symbol</Label>
                <Input
                  id="symbol"
                  value={formData.symbol}
                  onChange={(e) => handleInputChange("symbol", e.target.value)}
                  placeholder="e.g., RFT"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalSupply">Total Supply</Label>
              <Input
                id="totalSupply"
                type="number"
                value={formData.totalSupply}
                onChange={(e) => handleInputChange("totalSupply", e.target.value)}
                placeholder="Enter total token supply"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="decimals">Decimals</Label>
              <Select
                value={formData.decimals}
                onValueChange={(value) => handleInputChange("decimals", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select decimals" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="18">18 (Standard)</SelectItem>
                  <SelectItem value="6">6</SelectItem>
                  <SelectItem value="8">8</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Token Description</Label>
              <textarea
                id="description"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe your token and its purpose"
              />
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Token details cannot be changed after deployment. Please review carefully.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "sale":
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="tokenPrice">Token Price (USD)</Label>
                <Input
                  id="tokenPrice"
                  type="number"
                  value={formData.tokenPrice}
                  onChange={(e) => handleInputChange("tokenPrice", e.target.value)}
                  placeholder="Enter token price"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="acceptedCurrency">Accepted Currency</Label>
                <Select
                  value={formData.acceptedCurrency}
                  onValueChange={(value) => handleInputChange("acceptedCurrency", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD</SelectItem>
                    <SelectItem value="ETH">ETH</SelectItem>
                    <SelectItem value="USDT">USDT</SelectItem>
                    <SelectItem value="USDC">USDC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="softCap">Soft Cap</Label>
                <Input
                  id="softCap"
                  type="number"
                  value={formData.softCap}
                  onChange={(e) => handleInputChange("softCap", e.target.value)}
                  placeholder="Minimum amount to raise"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="hardCap">Hard Cap</Label>
                <Input
                  id="hardCap"
                  type="number"
                  value={formData.hardCap}
                  onChange={(e) => handleInputChange("hardCap", e.target.value)}
                  placeholder="Maximum amount to raise"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="minContribution">Minimum Contribution</Label>
                <Input
                  id="minContribution"
                  type="number"
                  value={formData.minContribution}
                  onChange={(e) => handleInputChange("minContribution", e.target.value)}
                  placeholder="Minimum investment amount"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxContribution">Maximum Contribution</Label>
                <Input
                  id="maxContribution"
                  type="number"
                  value={formData.maxContribution}
                  onChange={(e) => handleInputChange("maxContribution", e.target.value)}
                  placeholder="Maximum investment amount"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="datetime-local"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="datetime-local"
                  value={formData.endDate}
                  onChange={(e) => handleInputChange("endDate", e.target.value)}
                />
              </div>
            </div>
          </div>
        )

      case "vesting":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>Vesting Type</Label>
              <div className="grid grid-cols-3 gap-4">
                {vestingOptions.map((option) => (
                  <Card
                    key={option.id}
                    className={cn(
                      "p-4 cursor-pointer hover:border-primary transition-colors",
                      formData.vestingType === option.id && "border-primary bg-primary/5"
                    )}
                    onClick={() => handleInputChange("vestingType", option.id)}
                  >
                    <h4 className="font-medium">{option.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">
                      {option.description}
                    </p>
                  </Card>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="vestingDuration">Vesting Duration (months)</Label>
                <Input
                  id="vestingDuration"
                  type="number"
                  value={formData.vestingDuration}
                  onChange={(e) => handleInputChange("vestingDuration", e.target.value)}
                  placeholder="Enter vesting duration"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vestingCliff">Cliff Period (months)</Label>
                <Input
                  id="vestingCliff"
                  type="number"
                  value={formData.vestingCliff}
                  onChange={(e) => handleInputChange("vestingCliff", e.target.value)}
                  placeholder="Enter cliff period"
                />
              </div>
            </div>

            <div className="space-y-4">
              <Label>Token Distribution</Label>
              <div className="space-y-4">
                {distributionCategories.map((category) => (
                  <div key={category} className="grid grid-cols-2 gap-4 items-center">
                    <Label>{category}</Label>
                    <Input
                      type="number"
                      value={formData.distribution[category] || ""}
                      onChange={(e) => handleDistributionChange(category, e.target.value)}
                      placeholder="Enter percentage"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Total distribution percentage must equal 100%.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "compliance":
        return (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h4 className="font-medium">KYC Verification</h4>
                  <p className="text-sm text-muted-foreground">
                    Require investors to complete KYC verification
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.kycRequired}
                  onChange={(e) => handleInputChange("kycRequired", e.target.checked)}
                  className="h-6 w-6"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium">Whitelist</h4>
                  <p className="text-sm text-muted-foreground">
                    Enable whitelist for token sale participants
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={formData.whitelistRequired}
                  onChange={(e) => handleInputChange("whitelistRequired", e.target.checked)}
                  className="h-6 w-6"
                />
              </div>
            </Card>

            <div className="space-y-2">
              <Label htmlFor="maxParticipants">Maximum Participants</Label>
              <Input
                id="maxParticipants"
                type="number"
                value={formData.maxParticipants}
                onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                placeholder="Enter maximum number of participants"
              />
            </div>

            <div className="space-y-2">
              <Label>Restricted Countries</Label>
              <Select
                value={formData.restrictedCountries[0]}
                onValueChange={(value) => handleInputChange("restrictedCountries", [value])}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select restricted countries" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us">United States</SelectItem>
                  <SelectItem value="cn">China</SelectItem>
                  <SelectItem value="ir">Iran</SelectItem>
                  <SelectItem value="kp">North Korea</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Ensure compliance with local regulations in your jurisdiction.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "highlights":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Investment Highlights</h3>
              <Button onClick={() => setShowHighlightDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Custom Highlight
              </Button>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-medium">Predefined Highlights</h4>
                <div className="grid grid-cols-2 gap-4">
                  {predefinedHighlights.map((highlight) => (
                    <div
                      key={highlight}
                      className={cn(
                        "p-4 rounded-lg border cursor-pointer transition-colors",
                        selectedHighlights.includes(highlight)
                          ? "border-primary bg-primary/5"
                          : "hover:border-primary/50"
                      )}
                      onClick={() => handleToggleHighlight(highlight)}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "mt-1 w-4 h-4 rounded-full border flex items-center justify-center flex-shrink-0",
                          selectedHighlights.includes(highlight)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-muted-foreground"
                        )}>
                          {selectedHighlights.includes(highlight) && (
                            <CheckCircle2 className="h-3 w-3" />
                          )}
                        </div>
                        <span className="text-sm">{highlight}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {customHighlights.length > 0 && (
                <div className="space-y-4">
                  <h4 className="font-medium">Custom Highlights</h4>
                  <div className="space-y-2">
                    {customHighlights.map((highlight) => (
                      <div
                        key={highlight}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <span>{highlight}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveCustomHighlight(highlight)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Select key highlights that best represent your project&apos;s value proposition and competitive advantages.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "gallery":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Project Gallery</h3>
              <Button onClick={() => setShowImageDialog(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Image
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {images.map((image, index) => (
                <div key={index} className="group relative aspect-video rounded-lg overflow-hidden border">
                  <img
                    src={image}
                    alt={`Project image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => setSelectedImage(image)}
                    >
                      <Expand className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => handleRemoveImage(image)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Add high-quality images that showcase your project. Recommended size: 1200x800 pixels.
              </AlertDescription>
            </Alert>
          </div>
        )

      case "faq":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Frequently Asked Questions</h3>
              <Button onClick={handleAddFaq}>
                <Plus className="h-4 w-4 mr-2" />
                Add Question
              </Button>
            </div>

            <div className="space-y-4">
              {faqs.map((faq) => (
                <Card key={faq.id} className="p-6">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1 space-y-2">
                      <h4 className="font-medium">{faq.question}</h4>
                      <p className="text-sm text-muted-foreground">{faq.answer}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleEditFaq(faq)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteFaq(faq.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {faqs.length === 0 && (
                <div className="text-center py-12">
                  <HelpCircle className="h-12 w-12 mx-auto text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-medium">No FAQs Added</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Add some frequently asked questions to help your investors
                  </p>
                  <Button onClick={handleAddFaq} className="mt-4">
                    <Plus className="h-4 w-4 mr-2" />
                    Add First Question
                  </Button>
                </div>
              )}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                FAQs help potential investors understand your ICO better. Make sure to cover important topics like investment process, token utility, and vesting schedule.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Create ICO</h2>
          <p className="text-muted-foreground">
            Launch your Initial Coin Offering with customizable parameters
          </p>
        </div>
        <Button onClick={handleDeploy}>
          <Coins className="mr-2 h-4 w-4" />
          Deploy ICO
        </Button>
      </div>

      <div className="flex gap-12">
        {/* Steps */}
        <Card className="w-64 p-4">
          <div className="space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.id}
                className={cn(
                  "flex gap-4 p-3 rounded-lg cursor-pointer transition-colors",
                  currentStep === step.id
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-secondary/80"
                )}
                onClick={() => setCurrentStep(step.id)}
              >
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center",
                  currentStep === step.id
                    ? "bg-primary/20"
                    : "bg-secondary"
                )}>
                  <step.icon className="w-4 h-4" />
                </div>
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">{step.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Content */}
        <Card className="flex-1 p-6">
          {renderStepContent()}
        </Card>
      </div>

      {/* FAQ Dialog */}
      <Dialog open={showFaqDialog} onOpenChange={setShowFaqDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingFaq ? "Edit FAQ" : "Add FAQ"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={faqFormData.question}
                onChange={(e) => setFaqFormData(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Enter the question"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <textarea
                id="answer"
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={faqFormData.answer}
                onChange={(e) => setFaqFormData(prev => ({ ...prev, answer: e.target.value }))}
                placeholder="Enter the answer"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFaqDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveFaq}>
              {editingFaq ? "Save Changes" : "Add FAQ"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Custom Highlight Dialog */}
      <Dialog open={showHighlightDialog} onOpenChange={setShowHighlightDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Custom Highlight</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="highlight">Highlight</Label>
              <Input
                id="highlight"
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder="Enter custom highlight"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowHighlightDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddCustomHighlight}>
              Add Highlight
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Image Dialog */}
      <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Image</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                placeholder="Enter image URL"
                onChange={(e) => handleAddImage(e.target.value)}
              />
            </div>

            <div className="flex items-center">
              <div className="flex-1 border-t border-border" />
              <span className="px-3 text-sm text-muted-foreground">or</span>
              <div className="flex-1 border-t border-border" />
            </div>

            <div className="border-2 border-dashed rounded-lg p-6">
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 bg-secondary/50 rounded-full">
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">Click to upload</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    PNG, JPG or GIF (max. 5MB)
                  </p>
                </div>
                <Button variant="outline" className="w-full">
                  Choose File
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowImageDialog(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowImageDialog(false)}>
              Add Image
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Image Preview</DialogTitle>
          </DialogHeader>

          {selectedImage && (
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={selectedImage}
                alt="Preview"
                className="w-full h-full object-contain"
              />
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedImage(null)}>
              Close
            </Button>
            <Button asChild>
              <a href={selectedImage!} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-2" />
                Open Original
              </a>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}