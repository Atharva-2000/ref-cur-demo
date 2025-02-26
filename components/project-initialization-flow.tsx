"use client"

import { useEffect, useState } from "react"
import { CheckCircle2, Circle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"

type Step = {
  id: number
  title: string
  description: string
  completed: boolean
}

interface ProjectInitializationFlowProps {
  currentWizardStep: number
  onStepComplete?: (stepNumber: number) => void
}

export function ProjectInitializationFlow({ currentWizardStep, onStepComplete }: ProjectInitializationFlowProps) {
  const [steps, setSteps] = useState<Step[]>([
    {
      id: 1,
      title: "Create Project",
      description: "Store project with metadata (goals, references)",
      completed: false,
    },
    {
      id: 2,
      title: "Extract Details",
      description: "Extract key details and goals from project metadata",
      completed: false,
    },
    {
      id: 3,
      title: "Analyze References",
      description: "Analyze competitor references for insights",
      completed: false,
    },
    {
      id: 4,
      title: "Generate Features",
      description: "Create a list of features based on goals and references",
      completed: false,
    },
    {
      id: 5,
      title: "Break Down Flows",
      description: "Break references into detailed user flows",
      completed: false,
    },
    {
      id: 6,
      title: "Link Features to References",
      description: "Connect each feature and flow to relevant references",
      completed: false,
    },
    {
      id: 7,
      title: "Initialize Structure",
      description: "Set up project structure based on features and flows",
      completed: false,
    },
  ])

  const [currentStep, setCurrentStep] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  // Update steps based on wizard progress
  useEffect(() => {
    const updateSteps = () => {
      if (currentWizardStep === 1) {
        // Reset all steps when we're at step 1
        setSteps((prevSteps) => prevSteps.map((step) => ({ ...step, completed: false })))
        setCurrentStep(0)
        setProgress(0)
      } else if (currentWizardStep === 2) {
        // Mark step 1 as completed when we're at step 2
        setSteps((prevSteps) => prevSteps.map((step) => (step.id === 1 ? { ...step, completed: true } : step)))
        setCurrentStep(1)
        setProgress(14)
      } else if (currentWizardStep === 3) {
        // Mark steps 1-3 as completed when we're at step 3
        setSteps((prevSteps) => prevSteps.map((step) => (step.id <= 3 ? { ...step, completed: true } : step)))
        setCurrentStep(3)
        setProgress(42)
      } else if (currentWizardStep === 4) {
        // Mark steps 1-4 as completed when we're at step 4
        setSteps((prevSteps) => prevSteps.map((step) => (step.id <= 4 ? { ...step, completed: true } : step)))
        setCurrentStep(4)
        setProgress(57)
      } else if (currentWizardStep === 5) {
        // Mark steps 1-6 as completed when we're at step 5
        setSteps((prevSteps) => prevSteps.map((step) => (step.id <= 6 ? { ...step, completed: true } : step)))
        setCurrentStep(6)
        setProgress(85)
      }
    }

    updateSteps()
  }, [currentWizardStep]) // Remove 'steps' from the dependency array

  const startProcess = async () => {
    if (currentStep > 0) return

    setIsProcessing(true)
    setCurrentStep(1)

    // Simulate the initialization process
    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSteps((prevSteps) => prevSteps.map((step) => (step.id === i + 1 ? { ...step, completed: true } : step)))
      setCurrentStep(i + 2)
      setProgress(Math.round(((i + 1) / steps.length) * 100))
    }

    setIsProcessing(false)

    // Notify parent component that all steps are complete
    if (onStepComplete) {
      onStepComplete(7)
    }
  }

  const resetProcess = () => {
    setSteps(steps.map((step) => ({ ...step, completed: false })))
    setCurrentStep(0)
    setProgress(0)
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-6">
          <div className="mb-4">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between mt-1 text-xs text-muted-foreground">
              <span>0%</span>
              <span>Progress: {progress}%</span>
              <span>100%</span>
            </div>
          </div>

          <div className="flex overflow-x-auto pb-4 space-x-4">
            {steps.map((step) => (
              <div key={step.id} className="flex-none w-64">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 text-primary">
                    {step.completed ? <CheckCircle2 className="h-5 w-5" /> : <Circle className="h-5 w-5" />}
                  </div>
                  <div className="space-y-1">
                    <p className="font-medium">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Separator />

          <div className="flex justify-between">
            {currentStep === 0 ? (
              <Button onClick={startProcess} disabled={isProcessing || currentWizardStep > 1}>
                Start Initialization
              </Button>
            ) : currentStep > steps.length ? (
              <Button onClick={resetProcess}>Reset Process</Button>
            ) : (
              <Button disabled>
                Processing Step {currentStep} of {steps.length}...
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

