"use client"

import { useState } from "react"
import { Search, Plus, Trash2, Edit, Tag, AlertTriangle, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { RefCuratorProject, Feature, Reference } from "@/components/project-initialization-wizard"

interface ProjectSelectionFormProps {
  projects: RefCuratorProject[]
  onProjectSelect: (project: RefCuratorProject) => void
}

// Define color mapping for competitor references
const referenceColors: Record<string, string> = {
  LegalZoom: "blue",
  DoNotPay: "green",
  Clio: "purple",
  CCD: "red",
  Competitor: "orange",
}

export function ProjectSelectionForm({ projects, onProjectSelect }: ProjectSelectionFormProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [editedProject, setEditedProject] = useState<RefCuratorProject | null>(null)
  const [suggestedFeatures, setSuggestedFeatures] = useState<Feature[]>([])

  // Filter projects based on search term
  const filteredProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

  // Handle project selection
  const handleSelectProject = (projectId: string) => {
    setSelectedProjectId(projectId)
    const project = projects.find((p) => p.id === projectId)

    if (project) {
      // Create a copy of the project for editing
      setEditedProject({ ...project })

      // Generate suggested features based on project goals
      const features: Feature[] = []

      if (project.goals.some((goal) => goal.toLowerCase().includes("ai") || goal.toLowerCase().includes("analysis"))) {
        features.push({
          id: `feature-${Date.now()}-1`,
          name: "AI Document Analyzer",
          description: "Analyze legal documents using AI",
          priority: "High",
          suggestedBySystem: true,
        })
      }

      if (
        project.goals.some(
          (goal) => goal.toLowerCase().includes("dispute") || goal.toLowerCase().includes("resolution"),
        )
      ) {
        features.push({
          id: `feature-${Date.now()}-2`,
          name: "Dispute Resolution Engine",
          description: "Automated dispute resolution system",
          priority: "High",
          suggestedBySystem: true,
        })
      }

      if (project.goals.some((goal) => goal.toLowerCase().includes("accuracy"))) {
        features.push({
          id: `feature-${Date.now()}-3`,
          name: "Accuracy Verification System",
          description: "Verify the accuracy of AI-generated results",
          priority: "Medium",
          suggestedBySystem: true,
        })
      }

      setSuggestedFeatures(features)

      // Open the review modal
      setIsReviewModalOpen(true)
    }
  }

  // Handle adding a new goal
  const handleAddGoal = () => {
    if (editedProject) {
      setEditedProject({
        ...editedProject,
        goals: [...editedProject.goals, ""],
      })
    }
  }

  // Handle updating a goal
  const handleUpdateGoal = (index: number, value: string) => {
    if (editedProject) {
      const updatedGoals = [...editedProject.goals]
      updatedGoals[index] = value
      setEditedProject({
        ...editedProject,
        goals: updatedGoals,
      })
    }
  }

  // Handle removing a goal
  const handleRemoveGoal = (index: number) => {
    if (editedProject) {
      const updatedGoals = [...editedProject.goals]
      updatedGoals.splice(index, 1)
      setEditedProject({
        ...editedProject,
        goals: updatedGoals,
      })
    }
  }

  // Handle adding a new feature
  const handleAddFeature = () => {
    const newFeature: Feature = {
      id: `feature-${Date.now()}`,
      name: "",
      description: "",
      priority: "Medium",
    }

    setSuggestedFeatures([...suggestedFeatures, newFeature])
  }

  // Handle updating a feature
  const handleUpdateFeature = (id: string, field: keyof Feature, value: any) => {
    setSuggestedFeatures(
      suggestedFeatures.map((feature) => (feature.id === id ? { ...feature, [field]: value } : feature)),
    )
  }

  // Handle removing a feature
  const handleRemoveFeature = (id: string) => {
    setSuggestedFeatures(suggestedFeatures.filter((feature) => feature.id !== id))
  }

  // Handle moving a feature up or down in the list
  const handleMoveFeature = (id: string, direction: "up" | "down") => {
    const index = suggestedFeatures.findIndex((feature) => feature.id === id)
    if (index === -1) return

    const newFeatures = [...suggestedFeatures]

    if (direction === "up" && index > 0) {
      // Swap with the previous item
      ;[newFeatures[index], newFeatures[index - 1]] = [newFeatures[index - 1], newFeatures[index]]
    } else if (direction === "down" && index < newFeatures.length - 1) {
      // Swap with the next item
      ;[newFeatures[index], newFeatures[index + 1]] = [newFeatures[index + 1], newFeatures[index]]
    }

    setSuggestedFeatures(newFeatures)
  }

  // Handle saving the project
  const handleSaveProject = () => {
    if (!editedProject) return

    // Validate project
    if (editedProject.goals.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one goal is required",
        variant: "destructive",
      })
      return
    }

    if (editedProject.references.length === 0) {
      toast({
        title: "Validation Error",
        description: "At least one reference is required",
        variant: "destructive",
      })
      return
    }

    // Validate features
    const invalidFeatures = suggestedFeatures.filter((feature) => !feature.name || !feature.description)

    if (invalidFeatures.length > 0) {
      toast({
        title: "Validation Error",
        description: "All features must have a name and description",
        variant: "destructive",
      })
      return
    }

    // Close the modal
    setIsReviewModalOpen(false)

    // Call the onProjectSelect callback with the edited project
    onProjectSelect(editedProject)

    toast({
      title: "Project Initialized",
      description: "CCD project has been initialized successfully",
    })
  }

  // Get reference color based on name
  const getReferenceColor = (reference: Reference) => {
    const name = reference.title.split(" ")[0]
    return referenceColors[name] || "gray"
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Link to Ref Curator Project</h3>
          <Button variant="outline" size="sm">
            <Plus className="mr-2 h-4 w-4" />
            New Project
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Ref Curator projects..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="rounded-md border">
          <RadioGroup value={selectedProjectId || ""} onValueChange={setSelectedProjectId}>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <div key={project.id} className="space-y-2 p-4">
                  {index > 0 && <Separator />}
                  <div className="flex items-start space-x-3 pt-2">
                    <RadioGroupItem value={project.id} id={project.id} className="mt-1" />
                    <div className="grid gap-1.5 flex-1">
                      <Label htmlFor={project.id} className="text-base font-medium">
                        {project.name}
                      </Label>
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium">Goals:</p>
                        <ul className="list-disc pl-5">
                          {project.goals.slice(0, 2).map((goal, i) => (
                            <li key={i}>{goal}</li>
                          ))}
                          {project.goals.length > 2 && (
                            <li className="text-muted-foreground">+{project.goals.length - 2} more goals</li>
                          )}
                        </ul>
                        <div className="mt-2">
                          <p className="font-medium mb-1">References:</p>
                          <div className="flex flex-wrap gap-1">
                            {project.references.map((ref) => (
                              <Badge key={ref.id} variant="outline" className="text-xs">
                                {ref.title}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => handleSelectProject(project.id)}>
                      Select
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center text-muted-foreground">
                No projects found. Try a different search term.
              </div>
            )}
          </RadioGroup>
        </div>
      </div>

      {/* Review & Edit Modal */}
      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Review & Edit Project Details</DialogTitle>
          </DialogHeader>

          {editedProject && (
            <div className="grid gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  value={editedProject.name}
                  onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Project Goals</Label>
                  <Button variant="outline" size="sm" onClick={handleAddGoal}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Goal
                  </Button>
                </div>

                <div className="space-y-2 rounded-md border p-4">
                  {editedProject.goals.map((goal, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Textarea
                        value={goal}
                        onChange={(e) => handleUpdateGoal(index, e.target.value)}
                        className="min-h-[60px]"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveGoal(index)}
                        disabled={editedProject.goals.length <= 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Competitor References</Label>
                <div className="rounded-md border p-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex w-full items-center justify-between">
                      <span className="text-sm font-medium">{editedProject.references.length} References</span>
                      <Button variant="ghost" size="sm">
                        <span className="sr-only">Toggle</span>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-2 space-y-2">
                      {editedProject.references.map((reference) => (
                        <div key={reference.id} className="rounded-md border p-3">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-medium">{reference.title}</h4>
                              <p className="text-xs text-muted-foreground">{reference.description}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge
                                variant="outline"
                                className={`bg-${getReferenceColor(reference)}-100 text-${getReferenceColor(reference)}-800 border-${getReferenceColor(reference)}-300`}
                              >
                                <Tag className="mr-1 h-3 w-3" />
                                {reference.title.split(" ")[0]}
                              </Badge>
                            </div>
                          </div>
                          {reference.insights && reference.insights.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium">Key Insights:</p>
                              <ul className="list-disc pl-5 text-xs text-muted-foreground">
                                {reference.insights.map((insight, i) => (
                                  <li key={i}>{insight}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Suggested Features</Label>
                  <Button variant="outline" size="sm" onClick={handleAddFeature}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Feature
                  </Button>
                </div>

                <div className="space-y-3 rounded-md border p-4">
                  {suggestedFeatures.map((feature) => (
                    <div key={feature.id} className="rounded-md border p-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
                            <Input
                              value={feature.name}
                              onChange={(e) => handleUpdateFeature(feature.id, "name", e.target.value)}
                              placeholder="Feature name"
                              className="h-8"
                            />
                            <Select
                              value={feature.priority}
                              onValueChange={(value) =>
                                handleUpdateFeature(feature.id, "priority", value as "High" | "Medium" | "Low")
                              }
                            >
                              <SelectTrigger className="w-[100px] h-8">
                                <SelectValue placeholder="Priority" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="High">High</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Textarea
                            value={feature.description}
                            onChange={(e) => handleUpdateFeature(feature.id, "description", e.target.value)}
                            placeholder="Feature description"
                            className="min-h-[60px]"
                          />

                          {/* Reference linking */}
                          <div className="flex flex-wrap gap-1">
                            {editedProject.references.map((reference) => (
                              <Badge
                                key={reference.id}
                                variant="outline"
                                className={`bg-${getReferenceColor(reference)}-100 text-${getReferenceColor(reference)}-800 border-${getReferenceColor(reference)}-300 cursor-pointer hover:bg-${getReferenceColor(reference)}-200`}
                                onClick={() => {
                                  // In a real app, this would link the reference to the feature
                                  toast({
                                    title: "Reference Linked",
                                    description: `Linked "${reference.title}" to "${feature.name}"`,
                                  })
                                }}
                              >
                                <Tag className="mr-1 h-3 w-3" />
                                {reference.title.split(" ")[0]}
                              </Badge>
                            ))}
                          </div>

                          {feature.suggestedBySystem && (
                            <p className="text-xs text-muted-foreground">Suggested based on project goals</p>
                          )}

                          {!feature.name && (
                            <div className="flex items-center text-amber-500 text-xs">
                              <AlertTriangle className="h-3 w-3 mr-1" />
                              Feature name is required
                            </div>
                          )}
                        </div>

                        <div className="flex flex-col gap-1 ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveFeature(feature.id, "up")}
                            disabled={suggestedFeatures.indexOf(feature) === 0}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-up"
                            >
                              <path d="m18 15-6-6-6 6" />
                            </svg>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleMoveFeature(feature.id, "down")}
                            disabled={suggestedFeatures.indexOf(feature) === suggestedFeatures.length - 1}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="lucide lucide-chevron-down"
                            >
                              <path d="m6 9 6 6 6-6" />
                            </svg>
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveFeature(feature.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {suggestedFeatures.length === 0 && (
                    <p className="text-center text-muted-foreground py-2">
                      No features suggested. Click "Add Feature" to create one.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <div className="flex justify-between">
              <Button variant="outline" disabled>
                Back
              </Button>
              <Button onClick={handleSaveProject}>Save Project</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

