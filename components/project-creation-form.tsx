"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

export function ProjectCreationForm() {
  const [projectName, setProjectName] = useState("")
  const [goals, setGoals] = useState<string[]>([""])
  const [references, setReferences] = useState<string[]>([""])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddGoal = () => {
    setGoals([...goals, ""])
  }

  const handleRemoveGoal = (index: number) => {
    const newGoals = [...goals]
    newGoals.splice(index, 1)
    setGoals(newGoals)
  }

  const handleGoalChange = (index: number, value: string) => {
    const newGoals = [...goals]
    newGoals[index] = value
    setGoals(newGoals)
  }

  const handleAddReference = () => {
    setReferences([...references, ""])
  }

  const handleRemoveReference = (index: number) => {
    const newReferences = [...references]
    newReferences.splice(index, 1)
    setReferences(newReferences)
  }

  const handleReferenceChange = (index: number, value: string) => {
    const newReferences = [...references]
    newReferences[index] = value
    setReferences(newReferences)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    if (!projectName.trim()) {
      toast({
        title: "Error",
        description: "Project name is required",
        variant: "destructive",
      })
      return
    }

    const filteredGoals = goals.filter((goal) => goal.trim() !== "")
    const filteredReferences = references.filter((ref) => ref.trim() !== "")

    if (filteredGoals.length === 0) {
      toast({
        title: "Error",
        description: "At least one goal is required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call to create project
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Success message
      toast({
        title: "Project Created",
        description: "Your project has been created successfully in Ref Curator",
      })

      // Reset form
      setProjectName("")
      setGoals([""])
      setReferences([""])
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="project-name">Project Name</Label>
            <Input
              id="project-name"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <Label>Project Goals</Label>
            {goals.map((goal, index) => (
              <div key={`goal-${index}`} className="flex gap-2">
                <Textarea
                  placeholder={`Goal ${index + 1} (e.g., "Outperform CCD's task management")`}
                  value={goal}
                  onChange={(e) => handleGoalChange(index, e.target.value)}
                  className="min-h-[80px]"
                />
                {goals.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveGoal(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleAddGoal}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Goal
            </Button>
          </div>

          <div className="space-y-3">
            <Label>Competitor References</Label>
            {references.map((reference, index) => (
              <div key={`reference-${index}`} className="flex gap-2">
                <Textarea
                  placeholder={`Reference ${index + 1} (e.g., "CCD's dashboard limitations")`}
                  value={reference}
                  onChange={(e) => handleReferenceChange(index, e.target.value)}
                  className="min-h-[80px]"
                />
                {references.length > 1 && (
                  <Button type="button" variant="outline" size="icon" onClick={() => handleRemoveReference(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button type="button" variant="outline" size="sm" className="mt-2" onClick={handleAddReference}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Reference
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating Project..." : "Create Project in Ref Curator"}
          </Button>
        </form>
      </CardContent>
      <Toaster />
    </Card>
  )
}

