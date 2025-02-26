"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Link, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { Feature, UserFlow, Reference } from "@/components/project-initialization-wizard"

interface UserFlowBuilderProps {
  features: Feature[]
  userFlows: UserFlow[]
  references: Reference[]
  onUserFlowsUpdate: (userFlows: UserFlow[]) => void
  onNext: () => void
  onBack: () => void
}

export function UserFlowBuilder({
  features,
  userFlows,
  references,
  onUserFlowsUpdate,
  onNext,
  onBack,
}: UserFlowBuilderProps) {
  const [selectedFeatureId, setSelectedFeatureId] = useState<string | null>(features.length > 0 ? features[0].id : null)

  const [openReferenceDialog, setOpenReferenceDialog] = useState(false)
  const [currentUserFlowId, setCurrentUserFlowId] = useState<string | null>(null)

  // Get user flows for the selected feature
  const filteredUserFlows = userFlows.filter((flow) => flow.featureId === selectedFeatureId)

  // Function to add a new user flow
  const handleAddUserFlow = () => {
    if (!selectedFeatureId) return

    const newUserFlow: UserFlow = {
      id: `flow-${Date.now()}`,
      name: "",
      description: "",
      featureId: selectedFeatureId,
      references: [],
    }

    onUserFlowsUpdate([...userFlows, newUserFlow])
  }

  // Function to remove a user flow
  const handleRemoveUserFlow = (id: string) => {
    onUserFlowsUpdate(userFlows.filter((flow) => flow.id !== id))
  }

  // Function to update a user flow
  const handleUpdateUserFlow = (id: string, field: keyof UserFlow, value: any) => {
    onUserFlowsUpdate(userFlows.map((flow) => (flow.id === id ? { ...flow, [field]: value } : flow)))
  }

  // Function to open reference dialog for a user flow
  const handleOpenReferenceDialog = (userFlowId: string) => {
    setCurrentUserFlowId(userFlowId)
    setOpenReferenceDialog(true)
  }

  // Function to attach a reference to a user flow
  const handleAttachReference = (reference: Reference) => {
    if (!currentUserFlowId) return

    const userFlow = userFlows.find((flow) => flow.id === currentUserFlowId)
    if (!userFlow) return

    // Check if reference is already attached
    if (userFlow.references.some((ref) => ref.id === reference.id)) {
      toast({
        title: "Reference already attached",
        description: "This reference is already attached to this user flow",
        variant: "destructive",
      })
      return
    }

    // Add reference to user flow
    handleUpdateUserFlow(currentUserFlowId, "references", [...userFlow.references, reference])

    setOpenReferenceDialog(false)
  }

  // Function to remove a reference from a user flow
  const handleRemoveReference = (userFlowId: string, referenceId: string) => {
    const userFlow = userFlows.find((flow) => flow.id === userFlowId)
    if (!userFlow) return

    handleUpdateUserFlow(
      userFlowId,
      "references",
      userFlow.references.filter((ref) => ref.id !== referenceId),
    )
  }

  // Function to handle next step
  const handleNext = () => {
    // Validate user flows
    const validUserFlows = userFlows.filter((flow) => flow.name.trim() !== "" && flow.description.trim() !== "")

    if (validUserFlows.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one user flow with name and description",
        variant: "destructive",
      })
      return
    }

    // Check if each user flow has at least one reference
    const userFlowsWithoutReferences = validUserFlows.filter((flow) => flow.references.length === 0)

    if (userFlowsWithoutReferences.length > 0) {
      toast({
        title: "Warning",
        description:
          "Some user flows don't have any references attached. Each flow should have at least one reference.",
        variant: "destructive",
      })
      return
    }

    // Update user flows to only include valid ones
    if (validUserFlows.length !== userFlows.length) {
      onUserFlowsUpdate(validUserFlows)
    }

    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="feature-select">Select Feature</Label>
          <Select value={selectedFeatureId || ""} onValueChange={setSelectedFeatureId}>
            <SelectTrigger id="feature-select">
              <SelectValue placeholder="Select a feature" />
            </SelectTrigger>
            <SelectContent>
              {features.map((feature) => (
                <SelectItem key={feature.id} value={feature.id}>
                  {feature.name} ({feature.priority})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedFeatureId && (
          <div className="space-y-4">
            <div className="rounded-md border p-4">
              <h3 className="text-lg font-medium">
                User Flows for {features.find((f) => f.id === selectedFeatureId)?.name}
              </h3>

              <div className="mt-4 space-y-4">
                {filteredUserFlows.length > 0 ? (
                  filteredUserFlows.map((userFlow) => (
                    <div key={userFlow.id} className="rounded-md border p-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1 flex-1">
                          <Label htmlFor={`flow-name-${userFlow.id}`}>User Flow Name</Label>
                          <Input
                            id={`flow-name-${userFlow.id}`}
                            value={userFlow.name}
                            onChange={(e) => handleUpdateUserFlow(userFlow.id, "name", e.target.value)}
                            placeholder="e.g., Create Task"
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveUserFlow(userFlow.id)}
                          className="ml-2"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="mt-4 space-y-1">
                        <Label htmlFor={`flow-description-${userFlow.id}`}>Description</Label>
                        <Textarea
                          id={`flow-description-${userFlow.id}`}
                          value={userFlow.description}
                          onChange={(e) => handleUpdateUserFlow(userFlow.id, "description", e.target.value)}
                          placeholder="Describe the user flow..."
                        />
                      </div>

                      <div className="mt-4">
                        <div className="flex items-center justify-between">
                          <Label>References</Label>
                          <Button variant="outline" size="sm" onClick={() => handleOpenReferenceDialog(userFlow.id)}>
                            <Link className="mr-2 h-4 w-4" />
                            Attach Reference
                          </Button>
                        </div>

                        <div className="mt-2 space-y-2">
                          {userFlow.references.length > 0 ? (
                            userFlow.references.map((reference) => (
                              <Collapsible key={reference.id} className="rounded-md border">
                                <div className="flex items-center justify-between p-3">
                                  <CollapsibleTrigger className="flex items-center text-sm font-medium hover:underline">
                                    {reference.title}
                                  </CollapsibleTrigger>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleRemoveReference(userFlow.id, reference.id)
                                    }}
                                  >
                                    <X className="h-4 w-4" />
                                  </Button>
                                </div>
                                <CollapsibleContent className="border-t p-3">
                                  <p className="text-sm">{reference.description}</p>
                                  {reference.insights && reference.insights.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-sm font-medium">Key Insights:</p>
                                      <ul className="list-disc pl-5 text-sm">
                                        {reference.insights.map((insight, i) => (
                                          <li key={i}>{insight}</li>
                                        ))}
                                      </ul>
                                    </div>
                                  )}
                                </CollapsibleContent>
                              </Collapsible>
                            ))
                          ) : (
                            <p className="text-sm text-muted-foreground">
                              No references attached. Click "Attach Reference" to add one.
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No user flows added yet. Click "Add User Flow" to create one.
                  </p>
                )}

                <Button variant="outline" size="sm" onClick={handleAddUserFlow}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add User Flow
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Continue to Summary</Button>
      </div>

      <Dialog open={openReferenceDialog} onOpenChange={setOpenReferenceDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Attach Reference</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-4">
              {references.length > 0 ? (
                references.map((reference) => (
                  <Card
                    key={reference.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleAttachReference(reference)}
                  >
                    <CardContent className="p-4">
                      <h4 className="font-medium">{reference.title}</h4>
                      <p className="text-sm text-muted-foreground">{reference.description}</p>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground">No references available.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

