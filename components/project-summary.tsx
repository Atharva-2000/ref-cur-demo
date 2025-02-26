"use client"

import { useState } from "react"
import { FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import type { Feature, RefCuratorProject, UserFlow } from "@/components/project-initialization-wizard"

interface ProjectSummaryProps {
  project: RefCuratorProject | null
  features: Feature[]
  userFlows: UserFlow[]
  onBack: () => void
}

export function ProjectSummary({ project, features, userFlows, onBack }: ProjectSummaryProps) {
  const [activeTab, setActiveTab] = useState("details")

  // Function to generate documentation
  const handleGenerateDocumentation = () => {
    // In a real app, this would generate a PDF or Markdown file
    toast({
      title: "Documentation Generated",
      description: "Project documentation has been generated and is ready for download.",
    })
  }

  // Function to save project
  const handleSaveProject = () => {
    // In a real app, this would save the project to the CCD workspace
    toast({
      title: "Project Saved",
      description: "Project has been saved to the CCD workspace.",
    })
  }

  if (!project) {
    return (
      <div className="text-center p-6">
        <p className="text-muted-foreground">No project data available.</p>
        <Button variant="outline" onClick={onBack} className="mt-4">
          Back
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="flows">User Flows</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium">Project Details</h3>
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Project Name:</div>
                  <div className="col-span-2">{project.name}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Total Goals:</div>
                  <div className="col-span-2">{project.goals.length}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Total References:</div>
                  <div className="col-span-2">{project.references.length}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Total Features:</div>
                  <div className="col-span-2">{features.length}</div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="font-medium">Total User Flows:</div>
                  <div className="col-span-2">{userFlows.length}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium">Project Goals</h3>
              <div className="mt-4">
                <ul className="list-disc pl-5 space-y-2">
                  {project.goals.map((goal, index) => (
                    <li key={index}>{goal}</li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium">Features</h3>
              <div className="mt-4 space-y-4">
                {features.map((feature) => (
                  <div key={feature.id} className="rounded-md border p-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{feature.name}</h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          feature.priority === "High"
                            ? "bg-red-100 text-red-800"
                            : feature.priority === "Medium"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-green-100 text-green-800"
                        }`}
                      >
                        {feature.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        User Flows: {userFlows.filter((flow) => flow.featureId === feature.id).length}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flows" className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-medium">User Flows</h3>
              <div className="mt-4 space-y-4">
                {features.map((feature) => {
                  const featureFlows = userFlows.filter((flow) => flow.featureId === feature.id)
                  if (featureFlows.length === 0) return null

                  return (
                    <div key={feature.id} className="space-y-2">
                      <h4 className="font-medium">{feature.name}</h4>
                      <div className="pl-4 space-y-3">
                        {featureFlows.map((flow) => (
                          <div key={flow.id} className="rounded-md border p-3">
                            <h5 className="font-medium">{flow.name}</h5>
                            <p className="mt-1 text-sm text-muted-foreground">{flow.description}</p>

                            {flow.references.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium">References:</p>
                                <ul className="list-disc pl-5 text-xs text-muted-foreground">
                                  {flow.references.map((ref) => (
                                    <li key={ref.id}>{ref.title}</li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <div className="space-x-2">
          <Button variant="outline" onClick={handleGenerateDocumentation}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Documentation
          </Button>
          <Button onClick={handleSaveProject}>Save to CCD Workspace</Button>
        </div>
      </div>
    </div>
  )
}

