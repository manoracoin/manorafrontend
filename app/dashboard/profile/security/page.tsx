"use client"

import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, History, Link as LinkIcon, Settings } from "lucide-react"

export default function SecurityPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Security</h2>

      <div className="grid grid-cols-12 gap-6">
        <Tabs defaultValue="general" className="col-span-12 grid grid-cols-12 gap-6">
          <Card className="col-span-12 md:col-span-3 p-2">
            <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
              <TabsTrigger 
                value="general" 
                className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Settings className="h-4 w-4 mr-2" />
                General
              </TabsTrigger>
              <TabsTrigger 
                value="active-sessions" 
                className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Shield className="h-4 w-4 mr-2" />
                Active Sessions
              </TabsTrigger>
              <TabsTrigger 
                value="login-history" 
                className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <History className="h-4 w-4 mr-2" />
                Login History
              </TabsTrigger>
              <TabsTrigger 
                value="connections" 
                className="w-full justify-start data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <LinkIcon className="h-4 w-4 mr-2" />
                Connections
              </TabsTrigger>
            </TabsList>
          </Card>

          <div className="col-span-12 md:col-span-9 space-y-6">
            <TabsContent value="general" className="mt-0">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">General Security Settings</h3>
              </Card>
            </TabsContent>

            <TabsContent value="active-sessions" className="mt-0">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Active Sessions</h3>
              </Card>
            </TabsContent>

            <TabsContent value="login-history" className="mt-0">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Login History</h3>
              </Card>
            </TabsContent>

            <TabsContent value="connections" className="mt-0">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Connected Applications</h3>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  )
}