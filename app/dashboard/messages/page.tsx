"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  MessageSquare,
  Search,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  ChevronRight,
  Building2,
  Coins,
  ArrowRight,
  Plus,
  Globe,
  Users,
  Lock,
  Eye,
  EyeOff
} from "lucide-react"
import { format } from "date-fns"

// Sample data - In a real app, this would come from an API
const initialMessages = [
  {
    id: 1,
    title: "Question about Monthly Returns",
    content: "I'd like to understand how the monthly returns are calculated for the Luxury Downtown Apartment project.",
    sender: {
      id: "user1",
      name: "John Smith",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"
    },
    property: {
      id: 1,
      name: "Luxury Downtown Apartment",
      image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60"
    },
    createdAt: "2024-03-21T10:30:00",
    status: "answered",
    visibility: "public",
    replies: [
      {
        id: 1,
        content: "Monthly returns are calculated based on rental income and property appreciation. We distribute dividends on the 1st of each month.",
        sender: {
          id: "admin1",
          name: "Property Manager",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60"
        },
        createdAt: "2024-03-21T11:15:00"
      }
    ]
  },
  {
    id: 2,
    title: "Construction Timeline Update Request",
    content: "Could you provide more details about the expected completion date for the Modern Office Complex?",
    sender: {
      id: "user2",
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=60"
    },
    property: {
      id: 2,
      name: "Modern Office Complex",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60"
    },
    createdAt: "2024-03-20T15:45:00",
    status: "pending",
    visibility: "investors",
    replies: []
  },
  {
    id: 3,
    title: "Private Investment Inquiry",
    content: "I'm interested in increasing my investment in the Waterfront Residence project. What are my options?",
    sender: {
      id: "user3",
      name: "Michael Chen",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=60"
    },
    property: {
      id: 3,
      name: "Waterfront Residence",
      image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60"
    },
    createdAt: "2024-03-19T09:15:00",
    status: "answered",
    visibility: "private",
    replies: [
      {
        id: 2,
        content: "We'd be happy to discuss your investment options. Currently, there are additional tokens available for purchase.",
        sender: {
          id: "admin1",
          name: "Investment Advisor",
          avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60"
        },
        createdAt: "2024-03-19T10:00:00"
      }
    ]
  }
]

const visibilityOptions = [
  { value: "public", label: "Public", icon: Globe },
  { value: "investors", label: "Investors Only", icon: Users },
  { value: "private", label: "Private", icon: Lock }
]

const properties = [
  {
    id: 1,
    name: "Luxury Downtown Apartment",
    image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 2,
    name: "Modern Office Complex",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&auto=format&fit=crop&q=60"
  },
  {
    id: 3,
    name: "Waterfront Residence",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&auto=format&fit=crop&q=60"
  }
]

export default function MessagesPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [selectedMessage, setSelectedMessage] = useState<typeof initialMessages[0] | null>(null)
  const [showReplyDialog, setShowReplyDialog] = useState(false)
  const [showNewMessageDialog, setShowNewMessageDialog] = useState(false)
  const [replyContent, setReplyContent] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedVisibility, setSelectedVisibility] = useState("all")
  const [newMessageData, setNewMessageData] = useState({
    title: "",
    content: "",
    propertyId: "",
    visibility: "public"
  })

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = selectedStatus === "all" || message.status === selectedStatus
    const matchesVisibility = selectedVisibility === "all" || message.visibility === selectedVisibility

    return matchesSearch && matchesStatus && matchesVisibility
  })

  const handleSendReply = () => {
    if (!selectedMessage || !replyContent.trim()) return

    const newReply = {
      id: Math.max(0, ...selectedMessage.replies.map(r => r.id)) + 1,
      content: replyContent,
      sender: {
        id: "admin1",
        name: "Property Manager",
        avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60"
      },
      createdAt: new Date().toISOString()
    }

    setMessages(prev => prev.map(message =>
      message.id === selectedMessage.id
        ? {
            ...message,
            status: "answered",
            replies: [...message.replies, newReply]
          }
        : message
    ))

    setShowReplyDialog(false)
    setReplyContent("")
  }

  const handleSendNewMessage = () => {
    const selectedProperty = properties.find(p => p.id.toString() === newMessageData.propertyId)
    if (!selectedProperty) return
    const newMessage = {
      id: Math.max(0, ...messages.map(m => m.id)) + 1,
      ...newMessageData,
      sender: {
        id: "user1",
        name: "John Smith",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&auto=format&fit=crop&q=60"
      },
      property: selectedProperty,
      createdAt: new Date().toISOString(),
      status: "pending",
      replies: []
    }

    setMessages(prev => [newMessage, ...prev])
    setShowNewMessageDialog(false)
    setNewMessageData({
      title: "",
      content: "",
      propertyId: "",
      visibility: "public"
    })
  }

  const toggleVisibility = (messageId: number) => {
    setMessages(prev => prev.map(message =>
      message.id === messageId
        ? {
            ...message,
            visibility: message.visibility === "public" 
              ? "private" 
              : message.visibility === "private"
              ? "investors"
              : "public"
          }
        : message
    ))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Messages</h2>
          <p className="text-muted-foreground">
            Manage communication with investors
          </p>
        </div>
        <Button onClick={() => setShowNewMessageDialog(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search messages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>

          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="answered">Answered</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedVisibility} onValueChange={setSelectedVisibility}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Visibility</SelectItem>
              <SelectItem value="public">Public</SelectItem>
              <SelectItem value="investors">Investors Only</SelectItem>
              <SelectItem value="private">Private</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <div className="space-y-4">
        {filteredMessages.map((message) => (
          <Card key={message.id} className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={message.sender.avatar} />
                    <AvatarFallback>{message.sender.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{message.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{message.sender.name}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{format(new Date(message.createdAt), "MMM d, yyyy 'at' h:mm a")}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={
                    message.visibility === "public" ? "bg-green-500/10 text-green-500" :
                    message.visibility === "investors" ? "bg-blue-500/10 text-blue-500" :
                    "bg-orange-500/10 text-orange-500"
                  }>
                    {message.visibility === "public" && <Globe className="h-3 w-3 mr-1" />}
                    {message.visibility === "investors" && <Users className="h-3 w-3 mr-1" />}
                    {message.visibility === "private" && <Lock className="h-3 w-3 mr-1" />}
                    {message.visibility.charAt(0).toUpperCase() + message.visibility.slice(1)}
                  </Badge>
                  <Badge variant="secondary" className={
                    message.status === "answered" ? "bg-green-500/10 text-green-500" : "bg-blue-500/10 text-blue-500"
                  }>
                    {message.status === "answered" ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <AlertCircle className="h-3 w-3 mr-1" />
                    )}
                    {message.status === "answered" ? "Answered" : "Pending"}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => toggleVisibility(message.id)}
                  >
                    {message.visibility === "public" ? (
                      <Globe className="h-4 w-4" />
                    ) : message.visibility === "investors" ? (
                      <Users className="h-4 w-4" />
                    ) : (
                      <Lock className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{message.property.name}</span>
              </div>

              <p className="text-muted-foreground">{message.content}</p>

              {message.replies.length > 0 && (
                <div className="space-y-4 mt-6 pl-6 border-l">
                  {message.replies.map((reply) => (
                    <div key={reply.id} className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={reply.sender.avatar} />
                          <AvatarFallback>{reply.sender.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{reply.sender.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(reply.createdAt), "MMM d, yyyy 'at' h:mm a")}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">{reply.content}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedMessage(message)
                    setShowReplyDialog(true)
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Reply
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Reply Dialog */}
      <Dialog open={showReplyDialog} onOpenChange={setShowReplyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to Message</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {selectedMessage && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Original Message</h4>
                <div className="p-4 rounded-lg bg-secondary/50">
                  <p className="text-sm font-medium">{selectedMessage.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{selectedMessage.content}</p>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Your Reply</h4>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type your reply..."
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowReplyDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendReply} disabled={!replyContent.trim()}>
              <Send className="h-4 w-4 mr-2" />
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Message Dialog */}
      <Dialog open={showNewMessageDialog} onOpenChange={setShowNewMessageDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Message</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Property</h4>
              <Select
                value={newMessageData.propertyId}
                onValueChange={(value) => setNewMessageData(prev => ({ ...prev, propertyId: value }))}
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
                placeholder="Enter message title"
                value={newMessageData.title}
                onChange={(e) => setNewMessageData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Message</h4>
              <textarea
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Type your message..."
                value={newMessageData.content}
                onChange={(e) => setNewMessageData(prev => ({ ...prev, content: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <h4 className="text-sm font-medium">Visibility</h4>
              <Select
                value={newMessageData.visibility}
                onValueChange={(value) => setNewMessageData(prev => ({ ...prev, visibility: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select visibility" />
                </SelectTrigger>
                <SelectContent>
                  {visibilityOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <option.icon className="h-4 w-4 mr-2" />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewMessageDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendNewMessage}
              disabled={!newMessageData.title || !newMessageData.content || !newMessageData.propertyId}
            >
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}