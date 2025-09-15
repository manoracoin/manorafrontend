"use client"

import { useState, useMemo } from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { Badge } from "@/components/ui/badge"
import { Search, Building2, MapPin, DollarSign, BedDouble, Bath, Maximize, Percent, X, Eye, Upload, ImageIcon, Info, Calendar, Wallet, Target, Clock } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useI18n } from "@/components/i18n-provider"

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
    roi: "12%"
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
    roi: "15%"
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
    roi: "9%"
  }
]

const steps = [
  { id: "general" },
  { id: "investment" },
  { id: "token" },
  { id: "financial" },
  { id: "timeline" },
  { id: "owner" },
  { id: "documents" },
  { id: "qa" },
]

const propertyCategories = [
  "Residential",
  "Commercial",
  "Industrial",
  "Retail",
  "Mixed-Use",
  "Land"
]

const propertyTypes = {
  "Residential": [
    "Single Family Home",
    "Multi-Family",
    "Apartment",
    "Condominium",
    "Townhouse",
    "Villa"
  ],
  "Commercial": [
    "Office Building",
    "Business Park",
    "Medical Center",
    "Hotel",
    "Restaurant"
  ],
  "Industrial": [
    "Warehouse",
    "Manufacturing",
    "Distribution Center",
    "Research Facility",
    "Data Center"
  ],
  "Retail": [
    "Shopping Center",
    "Mall",
    "Street Retail",
    "Big Box Store",
    "Outlet Center"
  ],
  "Mixed-Use": [
    "Residential/Retail",
    "Office/Retail",
    "Live/Work",
    "Multi-Purpose"
  ],
  "Land": [
    "Development Site",
    "Agricultural",
    "Raw Land",
    "Entitled Land"
  ]
}

const propertyStatus = [
  "Pre-Construction",
  "Under Construction",
  "Completed",
  "Renovation",
  "Fully Leased",
  "Partially Leased",
  "Vacant"
]

const investmentTypes = [
  "Equity",
  "Debt",
  "Mezzanine",
  "Preferred Equity",
  "Joint Venture"
]

const distributionFrequencies = [
  "Monthly",
  "Quarterly",
  "Semi-Annually",
  "Annually"
]

const operatingExpenseTypes = [
  "Property Management",
  "Property Tax",
  "Insurance",
  "Utilities",
  "Maintenance",
  "Repairs",
  "Marketing",
  "Administrative",
  "Legal & Professional",
  "Other"
]

const revenueTypes = [
  "Rental Income",
  "Parking Income",
  "Storage Income",
  "Pet Rent",
  "Utility Reimbursements",
  "Late Fees",
  "Other Income"
]

export default function PropertiesPage() {
  const { t } = useI18n()
  const [searchTerm, setSearchTerm] = useState("")
  const [propertyType, setPropertyType] = useState("all")
  const [sortBy, setSortBy] = useState("featured")
  const [priceRange, setPriceRange] = useState("all")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [currentStep, setCurrentStep] = useState("general")
  const [showPreview, setShowPreview] = useState(false)

  const getStepLabel = (id: string) => {
    switch (id) {
      case "general": return t('properties.steps.general')
      case "investment": return t('properties.steps.investment')
      case "token": return t('properties.steps.token')
      case "financial": return t('properties.steps.financial')
      case "timeline": return t('properties.steps.timeline')
      case "owner": return t('properties.steps.owner')
      case "documents": return t('properties.steps.documents')
      case "qa": return t('properties.steps.qa')
      default: return id
    }
  }

  // Form state
  const [formData, setFormData] = useState({
    // General Info
    title: "",
    category: "",
    type: "",
    status: "",
    description: "",
    address: "",
    city: "",
    state: "",
    country: "",
    zipCode: "",
    totalArea: "",
    yearBuilt: "",
    stories: "",
    parkingSpaces: "",
    mainImage: "",
    additionalImages: [] as string[],
    amenities: [] as string[],
    features: [] as string[],
    
    // Investment Details
    investmentType: "",
    totalInvestment: "",
    minInvestment: "",
    maxInvestment: "",
    pricePerToken: "",
    totalTokens: "",
    targetIRR: "",
    targetCocReturn: "",
    projectedGrossYield: "",
    projectedNetYield: "",
    investmentTerm: "",
    holdingPeriod: "",
    distributionFrequency: "",
    expectedExitDate: "",
    investmentHighlights: "",
    investmentStrategy: "",
    riskFactors: "",

    // Financial Information
    purchasePrice: "",
    acquisitionCosts: "",
    renovationCosts: "",
    totalProjectCost: "",
    currentValue: "",
    estimatedValue: "",
    valuationDate: "",
    capRate: "",
    occupancyRate: "",
    noi: "",
    grossRent: "",
    operatingExpenses: "",
    debtAmount: "",
    equityAmount: "",
    loanTerms: "",
    interestRate: "",
    amortizationPeriod: "",
    debtServiceCoverage: "",
    propertyTaxes: "",
    insurance: "",
    utilities: "",
    maintenance: "",
    propertyManagement: "",
    revenueAssumptions: "",
    expenseAssumptions: "",
    appreciationAssumptions: "",
    exitStrategy: "",
    sensitivityAnalysis: "",
    comparables: "",
    marketAnalysis: ""
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const filteredProperties = useMemo(() => {
    return properties
      .filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            property.location.toLowerCase().includes(searchTerm.toLowerCase())
        
        const matchesType = propertyType === "all" || property.type === propertyType
        
        const matchesPriceRange = (() => {
          if (priceRange === "all") return true
          const price = property.price
          switch (priceRange) {
            case "0-1m": return price < 1000000
            case "1m-5m": return price >= 1000000 && price < 5000000
            case "5m-10m": return price >= 5000000 && price < 10000000
            case "10m+": return price >= 10000000
            default: return true
          }
        })()

        return matchesSearch && matchesType && matchesPriceRange
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "price-asc":
            return a.price - b.price
          case "price-desc":
            return b.price - a.price
          case "featured":
            return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
          default:
            return 0
        }
      })
  }, [searchTerm, propertyType, priceRange, sortBy])

  const handleStepChange = (step: string) => {
    setCurrentStep(step)
  }

  const handleClose = () => {
    setShowAddDialog(false)
    setCurrentStep("general")
    setShowPreview(false)
    setFormData({
      // General Info
      title: "",
      category: "",
      type: "",
      status: "",
      description: "",
      address: "",
      city: "",
      state: "",
      country: "",
      zipCode: "",
      totalArea: "",
      yearBuilt: "",
      stories: "",
      parkingSpaces: "",
      mainImage: "",
      additionalImages: [],
      amenities: [],
      features: [],
      
      // Investment Details
      investmentType: "",
      totalInvestment: "",
      minInvestment: "",
      maxInvestment: "",
      pricePerToken: "",
      totalTokens: "",
      targetIRR: "",
      targetCocReturn: "",
      projectedGrossYield: "",
      projectedNetYield: "",
      investmentTerm: "",
      holdingPeriod: "",
      distributionFrequency: "",
      expectedExitDate: "",
      investmentHighlights: "",
      investmentStrategy: "",
      riskFactors: "",

      // Financial Information
      purchasePrice: "",
      acquisitionCosts: "",
      renovationCosts: "",
      totalProjectCost: "",
      currentValue: "",
      estimatedValue: "",
      valuationDate: "",
      capRate: "",
      occupancyRate: "",
      noi: "",
      grossRent: "",
      operatingExpenses: "",
      debtAmount: "",
      equityAmount: "",
      loanTerms: "",
      interestRate: "",
      amortizationPeriod: "",
      debtServiceCoverage: "",
      propertyTaxes: "",
      insurance: "",
      utilities: "",
      maintenance: "",
      propertyManagement: "",
      revenueAssumptions: "",
      expenseAssumptions: "",
      appreciationAssumptions: "",
      exitStrategy: "",
      sensitivityAnalysis: "",
      comparables: "",
      marketAnalysis: ""
    })
  }

  const renderStepContent = () => {
    switch (currentStep) {
      case "general":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.basicInfo')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">{t('properties.form.title')}</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder={t('properties.form.titlePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">{t('properties.form.category')}</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('properties.form.selectCategory')} />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {t(`properties.category.${category}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="type">{t('properties.form.type')}</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleInputChange("type", value)}
                      disabled={!formData.category}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('properties.form.selectType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {formData.category && propertyTypes[formData.category as keyof typeof propertyTypes].map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(`properties.type.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">{t('properties.form.status')}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => handleInputChange("status", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('properties.form.selectStatus')} />
                      </SelectTrigger>
                      <SelectContent>
                        {propertyStatus.map((status) => (
                          <SelectItem key={status} value={status}>
                            {t(`properties.status.${status}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">{t('properties.form.description')}</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder={t('properties.form.descriptionPlaceholder')}
                  className="h-32"
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.location')}</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">{t('properties.form.address')}</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      placeholder={t('properties.form.addressPlaceholder')}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">{t('properties.form.city')}</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        placeholder={t('properties.form.cityPlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">{t('properties.form.state')}</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange("state", e.target.value)}
                        placeholder={t('properties.form.statePlaceholder')}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="country">{t('properties.form.country')}</Label>
                      <Input
                        id="country"
                        value={formData.country}
                        onChange={(e) => handleInputChange("country", e.target.value)}
                        placeholder={t('properties.form.countryPlaceholder')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">{t('properties.form.zip')}</Label>
                      <Input
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        placeholder={t('properties.form.zipPlaceholder')}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.details')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalArea">{t('properties.form.totalArea')}</Label>
                    <Input
                      id="totalArea"
                      type="number"
                      value={formData.totalArea}
                      onChange={(e) => handleInputChange("totalArea", e.target.value)}
                      placeholder={t('properties.form.totalAreaPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearBuilt">{t('properties.form.yearBuilt')}</Label>
                    <Input
                      id="yearBuilt"
                      type="number"
                      value={formData.yearBuilt}
                      onChange={(e) => handleInputChange("yearBuilt", e.target.value)}
                      placeholder={t('properties.form.yearBuiltPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stories">{t('properties.form.stories')}</Label>
                    <Input
                      id="stories"
                      type="number"
                      value={formData.stories}
                      onChange={(e) => handleInputChange("stories", e.target.value)}
                      placeholder={t('properties.form.storiesPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="parkingSpaces">{t('properties.form.parkingSpaces')}</Label>
                    <Input
                      id="parkingSpaces"
                      type="number"
                      value={formData.parkingSpaces}
                      onChange={(e) => handleInputChange("parkingSpaces", e.target.value)}
                      placeholder={t('properties.form.parkingSpacesPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.images')}</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t('properties.form.mainImage')}</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{t('properties.form.uploadDrop')}</p>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('properties.form.uploadImage')}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t('properties.form.additionalImages')}</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center gap-2">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{t('properties.form.uploadUpTo10')}</p>
                      <Button variant="outline" size="sm">
                        <Upload className="h-4 w-4 mr-2" />
                        {t('properties.form.uploadImages')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      
      case "investment":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.investmentStructure')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="investmentType">{t('properties.form.investmentType')}</Label>
                    <Select
                      value={formData.investmentType}
                      onValueChange={(value) => handleInputChange("investmentType", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('properties.form.selectInvestmentType')} />
                      </SelectTrigger>
                      <SelectContent>
                        {investmentTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {t(`properties.investmentType.${type}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="distributionFrequency">{t('properties.form.distributionFrequency')}</Label>
                    <Select
                      value={formData.distributionFrequency}
                      onValueChange={(value) => handleInputChange("distributionFrequency", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('properties.form.selectFrequency')} />
                      </SelectTrigger>
                      <SelectContent>
                        {distributionFrequencies.map((frequency) => (
                          <SelectItem key={frequency} value={frequency}>
                            {t(`properties.frequency.${frequency}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.investmentDetails')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="totalInvestment">{t('properties.form.totalInvestment')}</Label>
                    <Input
                      id="totalInvestment"
                      type="number"
                      value={formData.totalInvestment}
                      onChange={(e) => handleInputChange("totalInvestment", e.target.value)}
                      placeholder={t('properties.form.totalInvestmentPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minInvestment">{t('properties.form.minInvestment')}</Label>
                    <Input
                      id="minInvestment"
                      type="number"
                      value={formData.minInvestment}
                      onChange={(e) => handleInputChange("minInvestment", e.target.value)}
                      placeholder={t('properties.form.minInvestmentPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxInvestment">{t('properties.form.maxInvestment')}</Label>
                    <Input
                      id="maxInvestment"
                      type="number"
                      value={formData.maxInvestment}
                      onChange={(e) => handleInputChange("maxInvestment", e.target.value)}
                      placeholder={t('properties.form.maxInvestmentPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pricePerToken">{t('properties.form.pricePerToken')}</Label>
                    <Input
                      id="pricePerToken"
                      type="number"
                      value={formData.pricePerToken}
                      onChange={(e) => handleInputChange("pricePerToken", e.target.value)}
                      placeholder={t('properties.form.pricePerTokenPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalTokens">{t('properties.form.totalTokens')}</Label>
                    <Input
                      id="totalTokens"
                      type="number"
                      value={formData.totalTokens}
                      onChange={(e) => handleInputChange("totalTokens", e.target.value)}
                      placeholder={t('properties.form.totalTokensPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.returnsTimeline')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="targetIRR">{t('properties.form.targetIRR')}</Label>
                    <Input
                      id="targetIRR"
                      type="number"
                      value={formData.targetIRR}
                      onChange={(e) => handleInputChange("targetIRR", e.target.value)}
                      placeholder={t('properties.form.targetIRRPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="targetCocReturn">{t('properties.form.targetCocReturn')}</Label>
                    <Input
                      id="targetCocReturn"
                      type="number"
                      value={formData.targetCocReturn}
                      onChange={(e) => handleInputChange("targetCocReturn", e.target.value)}
                      placeholder={t('properties.form.targetCocReturnPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectedGrossYield">{t('properties.form.projectedGrossYield')}</Label>
                    <Input
                      id="projectedGrossYield"
                      type="number"
                      value={formData.projectedGrossYield}
                      onChange={(e) => handleInputChange("projectedGrossYield", e.target.value)}
                      placeholder={t('properties.form.projectedGrossYieldPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="projectedNetYield">{t('properties.form.projectedNetYield')}</Label>
                    <Input
                      id="projectedNetYield"
                      type="number"
                      value={formData.projectedNetYield}
                      onChange={(e) => handleInputChange("projectedNetYield", e.target.value)}
                      placeholder={t('properties.form.projectedNetYieldPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="investmentTerm">{t('properties.form.investmentTerm')}</Label>
                    <Input
                      id="investmentTerm"
                      type="number"
                      value={formData.investmentTerm}
                      onChange={(e) => handleInputChange("investmentTerm", e.target.value)}
                      placeholder={t('properties.form.investmentTermPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="holdingPeriod">{t('properties.form.holdingPeriod')}</Label>
                    <Input
                      id="holdingPeriod"
                      type="number"
                      value={formData.holdingPeriod}
                      onChange={(e) => handleInputChange("holdingPeriod", e.target.value)}
                      placeholder={t('properties.form.holdingPeriodPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expectedExitDate">{t('properties.form.expectedExitDate')}</Label>
                    <Input
                      id="expectedExitDate"
                      type="date"
                      value={formData.expectedExitDate}
                      onChange={(e) => handleInputChange("expectedExitDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="investmentHighlights">{t('properties.form.investmentHighlights')}</Label>
                  <Textarea
                    id="investmentHighlights"
                    value={formData.investmentHighlights}
                    onChange={(e) => handleInputChange("investmentHighlights", e.target.value)}
                    placeholder={t('properties.form.investmentHighlightsPlaceholder')}
                    className="h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="investmentStrategy">{t('properties.form.investmentStrategy')}</Label>
                  <Textarea
                    id="investmentStrategy"
                    value={formData.investmentStrategy}
                    onChange={(e) => handleInputChange("investmentStrategy", e.target.value)}
                    placeholder={t('properties.form.investmentStrategyPlaceholder')}
                    className="h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="riskFactors">{t('properties.form.riskFactors')}</Label>
                  <Textarea
                    id="riskFactors"
                    value={formData.riskFactors}
                    onChange={(e) => handleInputChange("riskFactors", e.target.value)}
                    placeholder={t('properties.form.riskFactorsPlaceholder')}
                    className="h-32"
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {t('properties.form.notice1')}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )
      
      case "financial":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.acquisitionValuation')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="purchasePrice">{t('properties.form.purchasePrice')}</Label>
                    <Input
                      id="purchasePrice"
                      type="number"
                      value={formData.purchasePrice}
                      onChange={(e) => handleInputChange("purchasePrice", e.target.value)}
                      placeholder={t('properties.form.purchasePricePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="acquisitionCosts">{t('properties.form.acquisitionCosts')}</Label>
                    <Input
                      id="acquisitionCosts"
                      type="number"
                      value={formData.acquisitionCosts}
                      onChange={(e) => handleInputChange("acquisitionCosts", e.target.value)}
                      placeholder={t('properties.form.acquisitionCostsPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="renovationCosts">{t('properties.form.renovationCosts')}</Label>
                    <Input
                      id="renovationCosts"
                      type="number"
                      value={formData.renovationCosts}
                      onChange={(e) => handleInputChange("renovationCosts", e.target.value)}
                      placeholder={t('properties.form.renovationCostsPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totalProjectCost">{t('properties.form.totalProjectCost')}</Label>
                    <Input
                      id="totalProjectCost"
                      type="number"
                      value={formData.totalProjectCost}
                      onChange={(e) => handleInputChange("totalProjectCost", e.target.value)}
                      placeholder={t('properties.form.totalProjectCostPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentValue">{t('properties.form.currentValue')}</Label>
                    <Input
                      id="currentValue"
                      type="number"
                      value={formData.currentValue}
                      onChange={(e) => handleInputChange("currentValue", e.target.value)}
                      placeholder={t('properties.form.currentValuePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedValue">{t('properties.form.estimatedValue')}</Label>
                    <Input
                      id="estimatedValue"
                      type="number"
                      value={formData.estimatedValue}
                      onChange={(e) => handleInputChange("estimatedValue", e.target.value)}
                      placeholder={t('properties.form.estimatedValuePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valuationDate">{t('properties.form.valuationDate')}</Label>
                    <Input
                      id="valuationDate"
                      type="date"
                      value={formData.valuationDate}
                      onChange={(e) => handleInputChange("valuationDate", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.financialMetrics')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="capRate">{t('properties.form.capRate')}</Label>
                    <Input
                      id="capRate"
                      type="number"
                      value={formData.capRate}
                      onChange={(e) => handleInputChange("capRate", e.target.value)}
                      placeholder={t('properties.form.capRatePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="occupancyRate">{t('properties.form.occupancyRate')}</Label>
                    <Input
                      id="occupancyRate"
                      type="number"
                      value={formData.occupancyRate}
                      onChange={(e) => handleInputChange("occupancyRate", e.target.value)}
                      placeholder={t('properties.form.occupancyRatePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="noi">{t('properties.form.noi')}</Label>
                    <Input
                      id="noi"
                      type="number"
                      value={formData.noi}
                      onChange={(e) => handleInputChange("noi", e.target.value)}
                      placeholder={t('properties.form.noiPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="grossRent">{t('properties.form.grossRent')}</Label>
                    <Input
                      id="grossRent"
                      type="number"
                      value={formData.grossRent}
                      onChange={(e) => handleInputChange("grossRent", e.target.value)}
                      placeholder={t('properties.form.grossRentPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.debtEquity')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="debtAmount">{t('properties.form.debtAmount')}</Label>
                    <Input
                      id="debtAmount"
                      type="number"
                      value={formData.debtAmount}
                      onChange={(e) => handleInputChange("debtAmount", e.target.value)}
                      placeholder={t('properties.form.debtAmountPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="equityAmount">{t('properties.form.equityAmount')}</Label>
                    <Input
                      id="equityAmount"
                      type="number"
                      value={formData.equityAmount}
                      onChange={(e) => handleInputChange("equityAmount", e.target.value)}
                      placeholder={t('properties.form.equityAmountPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="loanTerms">{t('properties.form.loanTerms')}</Label>
                    <Input
                      id="loanTerms"
                      value={formData.loanTerms}
                      onChange={(e) => handleInputChange("loanTerms", e.target.value)}
                      placeholder={t('properties.form.loanTermsPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="interestRate">{t('properties.form.interestRate')}</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      value={formData.interestRate}
                      onChange={(e) => handleInputChange("interestRate", e.target.value)}
                      placeholder={t('properties.form.interestRatePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="amortizationPeriod">{t('properties.form.amortizationPeriod')}</Label>
                    <Input
                      id="amortizationPeriod"
                      type="number"
                      value={formData.amortizationPeriod}
                      onChange={(e) => handleInputChange("amortizationPeriod", e.target.value)}
                      placeholder={t('properties.form.amortizationPeriodPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="debtServiceCoverage">{t('properties.form.debtServiceCoverage')}</Label>
                    <Input
                      id="debtServiceCoverage"
                      type="number"
                      value={formData.debtServiceCoverage}
                      onChange={(e) => handleInputChange("debtServiceCoverage", e.target.value)}
                      placeholder={t('properties.form.debtServiceCoveragePlaceholder')}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">{t('properties.form.operatingExpenses')}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="propertyTaxes">{t('properties.form.propertyTaxes')}</Label>
                    <Input
                      id="propertyTaxes"
                      type="number"
                      value={formData.propertyTaxes}
                      onChange={(e) => handleInputChange("propertyTaxes", e.target.value)}
                      placeholder={t('properties.form.propertyTaxesPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="insurance">{t('properties.form.insurance')}</Label>
                    <Input
                      id="insurance"
                      type="number"
                      value={formData.insurance}
                      onChange={(e) => handleInputChange("insurance", e.target.value)}
                      placeholder={t('properties.form.insurancePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="utilities">{t('properties.form.utilities')}</Label>
                    <Input
                      id="utilities"
                      type="number"
                      value={formData.utilities}
                      onChange={(e) => handleInputChange("utilities", e.target.value)}
                      placeholder={t('properties.form.utilitiesPlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maintenance">{t('properties.form.maintenance')}</Label>
                    <Input
                      id="maintenance"
                      type="number"
                      value={formData.maintenance}
                      onChange={(e) => handleInputChange("maintenance", e.target.value)}
                      placeholder={t('properties.form.maintenancePlaceholder')}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="propertyManagement">{t('properties.form.propertyManagement')}</Label>
                    <Input
                      id="propertyManagement"
                      type="number"
                      value={formData.propertyManagement}
                      onChange={(e) => handleInputChange("propertyManagement", e.target.value)}
                      placeholder={t('properties.form.propertyManagementPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="revenueAssumptions">{t('properties.form.revenueAssumptions')}</Label>
                  <Textarea
                    id="revenueAssumptions"
                    value={formData.revenueAssumptions}
                    onChange={(e) => handleInputChange("revenueAssumptions", e.target.value)}
                    placeholder={t('properties.form.revenueAssumptionsPlaceholder')}
                    className="h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expenseAssumptions">{t('properties.form.expenseAssumptions')}</Label>
                  <Textarea
                    id="expenseAssumptions"
                    value={formData.expenseAssumptions}
                    onChange={(e) => handleInputChange("expenseAssumptions", e.target.value)}
                    placeholder={t('properties.form.expenseAssumptionsPlaceholder')}
                    className="h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appreciationAssumptions">{t('properties.form.appreciationAssumptions')}</Label>
                  <Textarea
                    id="appreciationAssumptions"
                    value={formData.appreciationAssumptions}
                    onChange={(e) => handleInputChange("appreciationAssumptions", e.target.value)}
                    placeholder={t('properties.form.appreciationAssumptionsPlaceholder')}
                    className="h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="exitStrategy">{t('properties.form.exitStrategy')}</Label>
                  <Textarea
                    id="exitStrategy"
                    value={formData.exitStrategy}
                    onChange={(e) => handleInputChange("exitStrategy", e.target.value)}
                    placeholder={t('properties.form.exitStrategyPlaceholder')}
                    className="h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sensitivityAnalysis">{t('properties.form.sensitivityAnalysis')}</Label>
                  <Textarea
                    id="sensitivityAnalysis"
                    value={formData.sensitivityAnalysis}
                    onChange={(e) => handleInputChange("sensitivityAnalysis", e.target.value)}
                    placeholder={t('properties.form.sensitivityAnalysisPlaceholder')}
                    className="h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="comparables">{t('properties.form.comparables')}</Label>
                  <Textarea
                    id="comparables"
                    value={formData.comparables}
                    onChange={(e) => handleInputChange("comparables", e.target.value)}
                    placeholder={t('properties.form.comparablesPlaceholder')}
                    className="h-32"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="marketAnalysis">{t('properties.form.marketAnalysis')}</Label>
                  <Textarea
                    id="marketAnalysis"
                    value={formData.marketAnalysis}
                    onChange={(e) => handleInputChange("marketAnalysis", e.target.value)}
                    placeholder={t('properties.form.marketAnalysisPlaceholder')}
                    className="h-32"
                  />
                </div>
              </div>

              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  {t('properties.form.notice2')}
                </AlertDescription>
              </Alert>
            </div>
          </div>
        )
      
      default:
        return (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            {t('properties.form.stepContentPending', { step: getStepLabel(currentStep) })}
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">{t('properties.title')}</h2>
        <Button onClick={() => setShowAddDialog(true)}>
          <Building2 className="mr-2 h-4 w-4" />
          {t('properties.addProperty')}
        </Button>
      </div>

      <Card className="p-4">
        <div className="grid gap-4 grid-cols-1 md:grid-cols-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('properties.search')}
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={propertyType} onValueChange={setPropertyType}>
            <SelectTrigger>
              <SelectValue placeholder={t('properties.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('properties.allTypes')}</SelectItem>
              <SelectItem value="Apartment">Apartment</SelectItem>
              <SelectItem value="House">House</SelectItem>
              <SelectItem value="Commercial">Commercial</SelectItem>
              <SelectItem value="Industrial">Industrial</SelectItem>
              <SelectItem value="Retail">Retail</SelectItem>
            </SelectContent>
          </Select>

          <Select value={priceRange} onValueChange={setPriceRange}>
            <SelectTrigger>
              <SelectValue placeholder={t('properties.priceRange')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('properties.allPrices')}</SelectItem>
              <SelectItem value="0-1m">{t('properties.filters.under1m')}</SelectItem>
              <SelectItem value="1m-5m">{t('properties.filters.1to5m')}</SelectItem>
              <SelectItem value="5m-10m">{t('properties.filters.5to10m')}</SelectItem>
              <SelectItem value="10m+">{t('properties.filters.over10m')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder={t('properties.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="featured">{t('properties.featured')}</SelectItem>
              <SelectItem value="price-asc">{t('properties.priceAsc')}</SelectItem>
              <SelectItem value="price-desc">{t('properties.priceDesc')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden">
            <div className="grid gap-4 grid-cols-1 md:grid-cols-[300px,1fr,200px]">
              <div className="relative h-[200px] md:h-full">
                <img
                  src={property.image}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                {property.featured && (
                  <Badge className="absolute top-2 right-2 bg-primary">
                    {t('properties.featured')}
                  </Badge>
                )}
                <Badge 
                  className={cn(
                    "absolute top-2 left-2",
                    property.status === "For Sale" 
                      ? "bg-green-500" 
                      : "bg-blue-500"
                  )}
                >
                  {t(`properties.status.${property.status}`)}
                </Badge>
              </div>

              <div className="p-4 space-y-4">
                <div>
                  <div className="flex gap-2 mb-2">
                    <Badge variant="secondary">{t('properties.investmentType.Equity')}</Badge>
                    <Badge variant="secondary">{t('properties.investmentType.Mezzanine')}</Badge>
                  </div>
                  <Link href={`/dashboard/properties/${property.id}`}>
                    <h3 className="text-xl font-semibold mb-2 hover:text-primary transition-colors">
                      {property.title}
                    </h3>
                  </Link>
                  <p className="text-muted-foreground flex items-center">
                    <MapPin className="h-4 w-4 mr-1" />
                    {property.location}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('properties.card.estimatedTotalRoi')}</p>
                    <p className="font-semibold flex items-center">
                      <Percent className="h-4 w-4 mr-1" />
                      {property.roi}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('properties.card.estimatedDuration')}</p>
                    <p className="font-semibold">{property.duration}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('properties.card.area')}</p>
                    <p className="font-semibold flex items-center">
                      <Maximize className="h-4 w-4 mr-1" />
                      {new Intl.NumberFormat('en-US').format(property.sqft)} {t('properties.card.squareFeet')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 md:border-l">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('properties.raised')}</p>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-primary rounded-full h-2" 
                        style={{ width: `${property.progress}%` }}
                      />
                    </div>
                    <p className="text-sm font-medium mt-1">{property.progress}%</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t('properties.target')}</p>
                    <p className="text-xl font-bold">
                      €{new Intl.NumberFormat('en-US').format(property.price)}
                    </p>
                  </div>

                  <Button className="w-full">{t('properties.investNow')}</Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Add Property Dialog */}
      <Dialog open={showAddDialog} onOpenChange={handleClose}>
        <DialogContent className="max-w-full h-screen max-h-screen p-0 gap-0">
          <div className="h-full flex flex-col">
            {/* Header */}
            <DialogHeader className="px-6 py-4 border-b">
              <div className="flex items-center justify-between">
                <DialogTitle>{t('properties.dialog.addNew')}</DialogTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
                    <Eye className="h-4 w-4 mr-2" />
                    {showPreview ? t('properties.dialog.hidePreview') : t('properties.dialog.preview')}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={handleClose}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </DialogHeader>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col md:flex-row gap-4 md:gap-8">
                {/* Steps Navigation */}
                <div className="hidden md:block w-48 border-r p-4 overflow-y-auto">
                  <div className="space-y-1">
                    {steps.map((step) => (
                      <Button
                        key={step.id}
                        variant={currentStep === step.id ? "secondary" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => handleStepChange(step.id)}
                      >
                        {getStepLabel(step.id)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Step Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {renderStepContent()}
                </div>

                {/* Preview Panel */}
                {showPreview && (
                  <div className="hidden md:block w-96 border-l p-4 overflow-y-auto">
                    <h3 className="font-semibold mb-4">{t('properties.dialog.preview')}</h3>
                    <div className="space-y-4">
                      <Card className="overflow-hidden">
                        {formData.mainImage ? (
                          <img
                            src={formData.mainImage}
                            alt={formData.title}
                            className="w-full h-48 object-cover"
                          />
                        ) : (
                          <div className="w-full h-48 bg-secondary/50 flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                        )}
                        <div className="p-4">
                          <h4 className="font-semibold">{formData.title || t('properties.preview.propertyTitle')}</h4>
                          <p className="text-sm text-muted-foreground flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {formData.city && formData.state ? `${formData.city}, ${formData.state}` : t('properties.preview.location')}
                          </p>
                          <div className="flex gap-2 mt-2">
                            {formData.category && (
                              <Badge variant="secondary">{formData.category}</Badge>
                            )}
                            {formData.type && (
                              <Badge variant="secondary">{formData.type}</Badge>
                            )}
                          </div>
                          {formData.description && (
                            <p className="text-sm text-muted-foreground mt-4 line-clamp-3">
                              {formData.description}
                            </p>
                          )}
                          {formData.totalInvestment && (
                            <div className="mt-4 pt-4 border-t">
                              <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">{t('properties.preview.totalInvestment')}</span>
                                <span className="font-medium">${Number(formData.totalInvestment).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-muted-foreground">{t('properties.preview.targetIRR')}</span>
                                <span className="font-medium">{formData.targetIRR}%</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <DialogFooter className="p-6 border-t">
              <div className="flex justify-between w-full">
                <Button
                  variant="outline"
                  onClick={() => {
                    const currentIndex = steps.findIndex(s => s.id === currentStep)
                    if (currentIndex > 0) {
                      handleStepChange(steps[currentIndex - 1].id)
                    }
                  }}
                  disabled={currentStep === steps[0].id}
                >
                  {t('properties.dialog.previous')}
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleClose}>
                    {t('properties.dialog.cancel')}
                  </Button>
                  {currentStep === steps[steps.length - 1].id ? (
                    <Button>
                      {t('properties.dialog.create')}
                    </Button>
                  ) : (
                    <Button
                      onClick={() => {
                        const currentIndex = steps.findIndex(s => s.id === currentStep)
                        if (currentIndex < steps.length - 1) {
                          handleStepChange(steps[currentIndex + 1].id)
                        }
                      }}
                    >
                      {t('properties.dialog.next')}
                    </Button>
                  )}
                </div>
              </div>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}