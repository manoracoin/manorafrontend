"use client"

import { useState, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Newspaper,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
  Calendar,
  Tag,
  Globe,
  Eye,
  EyeOff,
  ArrowUpRight,
  Info,
  Building2,
  Hammer,
  CheckCircle2,
  Clock,
  MapPin,
  Percent,
  Upload,
  Image as ImageIcon,
  X,
  FileText,
  Download,
  File
} from "lucide-react"

// Sample properties data
const properties = [
  {
    id: 1,
    name: "Luxury Downtown Apartment",
    location: "New York, NY",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
    progress: 65
  },
  {
    id: 2,
    name: "Modern Office Complex",
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    progress: 42
  },
  {
    id: 3,
    name: "Waterfront Residence",
    location: "Miami, FL",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
    progress: 78
  }
]

// Sample data - In a real app, this would come from an API
const initialNews = [
  {
    id: 1,
    propertyId: 1,
    title: "Foundation Work Completed Ahead of Schedule",
    content: "We're pleased to announce that the foundation work for the Luxury Downtown Apartment project has been completed two weeks ahead of schedule. The construction team has done an exceptional job, and we're now moving forward with the structural framework phase.",
    category: "construction",
    publishDate: "2024-03-21T10:00:00",
    status: "published",
    featured: true,
    progress: 65,
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60",
    milestone: "Foundation completion",
    documents: [
      { name: "Foundation Inspection Report.pdf", size: "2.4 MB", type: "application/pdf" },
      { name: "Structural Analysis.pdf", size: "1.8 MB", type: "application/pdf" }
    ]
  },
  {
    id: 2,
    propertyId: 2,
    title: "Building Permits Secured for Office Complex",
    content: "All necessary building permits have been secured for the Modern Office Complex development. This marks a significant milestone in our project timeline, allowing us to proceed with the initial construction phase.",
    category: "permits",
    publishDate: "2024-03-20T14:30:00",
    status: "published",
    featured: true,
    progress: 42,
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60",
    milestone: "Permit approval",
    documents: [
      { name: "Building Permit.pdf", size: "1.2 MB", type: "application/pdf" }
    ]
  },
  {
    id: 3,
    propertyId: 3,
    title: "Interior Finishing Phase Begins",
    content: "The Waterfront Residence project has entered the interior finishing phase. Our team of skilled craftsmen has begun installing high-end fixtures and finishes throughout the property.",
    category: "interiors",
    publishDate: "2024-03-19T09:15:00",
    status: "published",
    featured: false,
    progress: 78,
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60",
    milestone: "Interior work",
    documents: []
  }
]

const categories = [
  { value: "construction", label: "Construction Update" },
  { value: "permits", label: "Permits & Approvals" },
  { value: "interiors", label: "Interior Progress" },
  { value: "exteriors", label: "Exterior Progress" },
  { value: "infrastructure", label: "Infrastructure" },
  { value: "milestone", label: "Milestone Achievement" },
  { value: "delay", label: "Delay Notification" },
  { value: "completion", label: "Completion Update" }
]

export default function NewsPage() {
  const [news, setNews] = useState(initialNews)
  const [showNewsDialog, setShowNewsDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [editingNews, setEditingNews] = useState<typeof initialNews[0] | null>(null)
  const [deletingNews, setDeletingNews] = useState<typeof initialNews[0] | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<string>("all")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedDocuments, setSelectedDocuments] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const documentInputRef = useRef<HTMLInputElement>(null)
  const [newsFormData, setNewsFormData] = useState({
    propertyId: "",
    title: "",
    content: "",
    category: "",
    image: "",
    featured: false,
    milestone: "",
    progress: "",
    documents: [] as { name: string; size: string; type: string }[]
  })

  const filteredNews = selectedProperty === "all" 
    ? news 
    : news.filter(item => item.propertyId === parseInt(selectedProperty))

  const handleAddNews = () => {
    setEditingNews(null)
    setSelectedImage(null)
    setSelectedDocuments([])
    setNewsFormData({
      propertyId: "",
      title: "",
      content: "",
      category: "",
      image: "",
      featured: false,
      milestone: "",
      progress: "",
      documents: []
    })
    setShowNewsDialog(true)
  }

  const handleEditNews = (item: typeof initialNews[0]) => {
    setEditingNews(item)
    setSelectedImage(item.image)
    setNewsFormData({
      propertyId: item.propertyId.toString(),
      title: item.title,
      content: item.content,
      category: item.category,
      image: item.image,
      featured: item.featured,
      milestone: item.milestone,
      progress: item.progress.toString(),
      documents: item.documents
    })
    setShowNewsDialog(true)
  }

  const handleDeleteNews = (item: typeof initialNews[0]) => {
    setDeletingNews(item)
    setShowDeleteDialog(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, this would upload to a server and get a URL back
      // For now, we'll use a local URL
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        setSelectedImage(imageUrl)
        setNewsFormData(prev => ({ ...prev, image: imageUrl }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDocumentUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    setSelectedDocuments(prev => [...prev, ...files])
    setNewsFormData(prev => ({
      ...prev,
      documents: [
        ...prev.documents,
        ...files.map(file => ({
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          type: file.type
        }))
      ]
    }))
  }

  const handleRemoveDocument = (index: number) => {
    setSelectedDocuments(prev => prev.filter((_, i) => i !== index))
    setNewsFormData(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }))
  }

  const handleRemoveImage = () => {
    setSelectedImage(null)
    setNewsFormData(prev => ({ ...prev, image: "" }))
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSaveNews = () => {
    if (!selectedImage) {
      return // Prevent saving without an image
    }

    if (editingNews) {
      setNews(prev => prev.map(item => 
        item.id === editingNews.id 
          ? { 
              ...item, 
              ...newsFormData,
              propertyId: parseInt(newsFormData.propertyId),
              progress: parseInt(newsFormData.progress),
              status: "published",
              publishDate: new Date().toISOString(),
              image: selectedImage
            }
          : item
      ))
    } else {
      setNews(prev => [...prev, {
        id: Math.max(0, ...prev.map(n => n.id)) + 1,
        ...newsFormData,
        propertyId: parseInt(newsFormData.propertyId),
        progress: parseInt(newsFormData.progress),
        status: "published",
        publishDate: new Date().toISOString(),
        image: selectedImage
      }])
    }
    setShowNewsDialog(false)
    setEditingNews(null)
    setSelectedImage(null)
    setSelectedDocuments([])
    setNewsFormData({
      propertyId: "",
      title: "",
      content: "",
      category: "",
      image: "",
      featured: false,
      milestone: "",
      progress: "",
      documents: []
    })
  }

  const handleConfirmDelete = () => {
    if (deletingNews) {
      setNews(prev => prev.filter(item => item.id !== deletingNews.id))
    }
    setShowDeleteDialog(false)
    setDeletingNews(null)
  }

  const toggleFeatured = (id: number) => {
    setNews(prev => prev.map(item =>
      item.id === id ? { ...item, featured: !item.featured } : item
    ))
  }

  const toggleStatus = (id: number) => {
    setNews(prev => prev.map(item =>
      item.id === id ? { 
        ...item, 
        status: item.status === "published" ? "draft" : "published",
        publishDate: item.status === "draft" ? new Date().toISOString() : item.publishDate
      } : item
    ))
  }

  const getPropertyDetails = (propertyId: number) => {
    return properties.find(p => p.id === propertyId)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Construction Updates</h2>
          <p className="text-muted-foreground">
            Manage property construction progress and updates
          </p>
        </div>
        <Button onClick={handleAddNews}>
          <Plus className="h-4 w-4 mr-2" />
          Add Update
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <Select value={selectedProperty} onValueChange={setSelectedProperty}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Filter by property" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              {properties.map(property => (
                <SelectItem key={property.id} value={property.id.toString()}>
                  {property.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredNews.map((item) => {
          const property = getPropertyDetails(item.propertyId)
          return (
            <Card key={item.id} className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="relative w-full md:w-48 h-32 rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Building2 className="h-4 w-4" />
                        <span>{property?.name}</span>
                        <MapPin className="h-4 w-4 ml-2" />
                        <span>{property?.location}</span>
                      </div>
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">
                          {categories.find(c => c.value === item.category)?.label}
                        </Badge>
                        <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">
                          <Percent className="h-3 w-3 mr-1" />
                          {item.progress}% Complete
                        </Badge>
                        {item.milestone && (
                          <Badge variant="secondary" className="bg-green-500/10 text-green-500">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {item.milestone}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleStatus(item.id)}
                      >
                        {item.status === "published" ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleFeatured(item.id)}
                      >
                        {item.featured ? (
                          <Globe className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Globe className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditNews(item)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteNews(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <p className="text-muted-foreground">{item.content}</p>

                  {item.documents.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Attached Documents</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {item.documents.map((doc, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 rounded-lg border bg-card/50"
                          >
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-blue-500" />
                              <div>
                                <p className="text-sm font-medium">{doc.name}</p>
                                <p className="text-xs text-muted-foreground">{doc.size}</p>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(item.publishDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{new Date(item.publishDate).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Add/Edit News Dialog */}
      <Dialog open={showNewsDialog} onOpenChange={setShowNewsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingNews ? "Edit Update" : "Add Construction Update"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Property</h4>
              <Select
                value={newsFormData.propertyId}
                onValueChange={(value) => setNewsFormData(prev => ({ ...prev, propertyId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property" />
                </SelectTrigger>
                <SelectContent>
                  {properties.map(property => (
                    <SelectItem key={property.id} value={property.id.toString()}>
                      {property.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Title</h4>
              <Input
                placeholder="Enter update title"
                value={newsFormData.title}
                onChange={(e) => setNewsFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Content</h4>
              <Textarea
                placeholder="Enter update details"
                value={newsFormData.content}
                onChange={(e) => setNewsFormData(prev => ({ ...prev, content: e.target.value }))}
                className="min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Category</h4>
                <Select
                  value={newsFormData.category}
                  onValueChange={(value) => setNewsFormData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Progress (%)</h4>
                <Input
                  type="number"
                  placeholder="Enter progress percentage"
                  value={newsFormData.progress}
                  onChange={(e) => setNewsFormData(prev => ({ ...prev, progress: e.target.value }))}
                  min="0"
                  max="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Milestone (optional)</h4>
              <Input
                placeholder="Enter milestone achieved"
                value={newsFormData.milestone}
                onChange={(e) => setNewsFormData(prev => ({ ...prev, milestone: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Image</h4>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              
              {selectedImage ? (
                <div className="relative">
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-background/80 hover:bg-background/90"
                    onClick={handleRemoveImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div 
                  className="border-2 border-dashed rounded-lg p-6 cursor-pointer hover:bg-secondary/50 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="p-2 rounded-full bg-secondary">
                      <ImageIcon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-medium">Click to upload image</p>
                      <p className="text-xs text-muted-foreground">
                        PNG, JPG or GIF (max. 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Documents</h4>
              <input
                type="file"
                ref={documentInputRef}
                accept=".pdf,.doc,.docx,.xls,.xlsx"
                onChange={handleDocumentUpload}
                className="hidden"
                multiple
              />
              
              <div className="space-y-2">
                {newsFormData.documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded-lg border bg-card/50"
                  >
                    <div className="flex items-center gap-2">
                      <File className="h-4 w-4 text-blue-500" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.size}</p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveDocument(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => documentInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Documents
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Supported formats: PDF, DOC, DOCX, XLS, XLSX (max. 10MB per file)
              </p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="featured"
                checked={newsFormData.featured}
                onChange={(e) => setNewsFormData(prev => ({ ...prev, featured: e.target.checked }))}
                className="h-4 w-4"
              />
              <label htmlFor="featured" className="text-sm font-medium">
                Feature this update
              </label>
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                Featured updates will be displayed prominently to property investors.
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewsDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveNews} disabled={!selectedImage}>
              {editingNews ? "Save Changes" : "Add Update"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the update.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}