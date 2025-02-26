"use client"
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import type { Feature } from "@/components/project-initialization-wizard"

interface FeatureMatrixBuilderProps {
  features: Feature[]
  onFeaturesUpdate: (features: Feature[]) => void
  onNext: () => void
  onBack: () => void
}

export function FeatureMatrixBuilder({ features, onFeaturesUpdate, onNext, onBack }: FeatureMatrixBuilderProps) {
  // Function to add a new feature
  const handleAddFeature = () => {
    const newFeature: Feature = {
      id: `feature-${Date.now()}`,
      name: "",
      description: "",
      priority: "Medium",
    }

    onFeaturesUpdate([...features, newFeature])
  }

  // Function to remove a feature
  const handleRemoveFeature = (id: string) => {
    onFeaturesUpdate(features.filter((feature) => feature.id !== id))
  }

  // Function to update a feature
  const handleUpdateFeature = (id: string, field: keyof Feature, value: string) => {
    onFeaturesUpdate(features.map((feature) => (feature.id === id ? { ...feature, [field]: value } : feature)))
  }

  // Function to handle next step
  const handleNext = () => {
    // Validate features
    const validFeatures = features.filter((feature) => feature.name.trim() !== "" && feature.description.trim() !== "")

    if (validFeatures.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one feature with name and description",
        variant: "destructive",
      })
      return
    }

    // Update features to only include valid ones
    if (validFeatures.length !== features.length) {
      onFeaturesUpdate(validFeatures)
    }

    onNext()
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {features.map((feature) => (
          <div key={feature.id} className={`rounded-md border p-4 ${feature.suggestedBySystem ? "bg-muted/50" : ""}`}>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <Label htmlFor={`feature-name-${feature.id}`}>Feature Name</Label>
                <Input
                  id={`feature-name-${feature.id}`}
                  value={feature.name}
                  onChange={(e) => handleUpdateFeature(feature.id, "name", e.target.value)}
                  placeholder="e.g., Task Management"
                />
              </div>
              <div className="ml-4 space-y-1">
                <Label htmlFor={`feature-priority-${feature.id}`}>Priority</Label>
                <Select
                  value={feature.priority}
                  onValueChange={(value) =>
                    handleUpdateFeature(feature.id, "priority", value as "High" | "Medium" | "Low")
                  }
                >
                  <SelectTrigger id={`feature-priority-${feature.id}`} className="w-[120px]">
                    <SelectValue placeholder="Priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" size="icon" onClick={() => handleRemoveFeature(feature.id)} className="ml-2">
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 space-y-1">
              <Label htmlFor={`feature-description-${feature.id}`}>Description</Label>
              <Textarea
                id={`feature-description-${feature.id}`}
                value={feature.description}
                onChange={(e) => handleUpdateFeature(feature.id, "description", e.target.value)}
                placeholder="Describe the feature..."
              />
            </div>
            {feature.suggestedBySystem && (
              <p className="mt-2 text-xs text-muted-foreground">This feature was suggested based on project goals.</p>
            )}
          </div>
        ))}

        <Button variant="outline" size="sm" className="mt-2" onClick={handleAddFeature}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Feature
        </Button>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleNext}>Continue to User Flows</Button>
      </div>
    </div>
  )
}

