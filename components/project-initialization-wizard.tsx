"use client"

import { useState } from "react"
import { ProjectSelectionForm } from "@/components/project-selection-form"
import { FeatureMatrixBuilder } from "@/components/feature-matrix-builder"
import { UserFlowBuilder } from "@/components/user-flow-builder"
import { ProjectSummary } from "@/components/project-summary"
import { Card, CardContent } from "@/components/ui/card"
import { Toaster } from "@/components/ui/toaster"
import { ProjectInitializationFlow } from "@/components/project-initialization-flow"
import { ProjectDetailsView } from "@/components/project-details-view"

// Define types for our project data
export type RefCuratorProject = {
  id: string
  name: string
  goals: string[]
  references: Reference[]
}

export type Reference = {
  id: string
  title: string
  description: string
  url?: string
  insights?: string[]
}

export type Feature = {
  id: string
  name: string
  description: string
  priority: "High" | "Medium" | "Low"
  suggestedBySystem?: boolean
  linkedReferences?: string[] // IDs of linked references
}

export type UserFlow = {
  id: string
  name: string
  description: string
  featureId: string
  references: Reference[]
}

interface ProjectInitializationWizardProps {
  // If currentProject is provided, we're initializing from inside Ref Curator
  currentProject?: RefCuratorProject
}

export function ProjectInitializationWizard({ currentProject }: ProjectInitializationWizardProps) {
  // State for the current step
  const [currentStep, setCurrentStep] = useState<number>(2)

  // State for the project data
  const [selectedProject, setSelectedProject] = useState<RefCuratorProject | null>(currentProject || null)
  const [features, setFeatures] = useState<Feature[]>(generateSuggestedFeatures(currentProject))
  const [userFlows, setUserFlows] = useState<UserFlow[]>([])

  // Add after the other state declarations
  const [initializationProgress, setInitializationProgress] = useState<number>(0)

  // Mock data for Ref Curator projects
  const mockProjects: RefCuratorProject[] = [
    {
      id: "1",
      name: "Let's Solve It",
      goals: [
        "Reduce legal dispute resolution time/cost by 70% using AI.",
        "Achieve 95% accuracy in document analysis.",
        "Provide 24/7 access to legal assistance.",
      ],
      references: [
        {
          id: "ref1",
          title: "LegalZoom Analysis",
          description: "Review of LegalZoom's document automation",
          insights: ["Strong document templates", "Weak personalization", "Limited AI capabilities"],
        },
        {
          id: "ref2",
          title: "DoNotPay Review",
          description: "Analysis of DoNotPay's chatbot functionality",
          insights: ["Simple user interface", "Limited to basic legal issues", "Chatbot has knowledge gaps"],
        },
        {
          id: "ref3",
          title: "Clio Evaluation",
          description: "Evaluation of Clio's analytics features",
          insights: ["Comprehensive case tracking", "Poor document analysis", "Lacks AI-powered insights"],
        },
      ],
    },
    {
      id: "2",
      name: "Client Portal Redesign",
      goals: [
        "Improve client onboarding experience",
        "Streamline document sharing",
        "Add real-time collaboration tools",
      ],
      references: [
        {
          id: "ref4",
          title: "Competitor portal analysis",
          description: "Review of top 5 competitor client portals",
          insights: [
            "Most offer single sign-on",
            "Document versioning is standard",
            "Real-time chat is becoming common",
          ],
        },
      ],
    },
  ]

  // Function to generate suggested features based on project goals
  function generateSuggestedFeatures(project: RefCuratorProject | undefined): Feature[] {
    if (!project) return []

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
      project.goals.some((goal) => goal.toLowerCase().includes("dispute") || goal.toLowerCase().includes("resolution"))
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

    return features
  }

  // Function to handle project selection
  const handleProjectSelect = (project: RefCuratorProject) => {
    setSelectedProject(project)

    // Generate suggested features based on the selected project
    setFeatures(generateSuggestedFeatures(project))

    // Move to the next step
    setCurrentStep(3)
  }

  // Function to handle feature updates
  const handleFeaturesUpdate = (updatedFeatures: Feature[]) => {
    setFeatures(updatedFeatures)
  }

  // Function to handle user flow updates
  const handleUserFlowsUpdate = (updatedUserFlows: UserFlow[]) => {
    setUserFlows(updatedUserFlows)
  }

  // Function to handle step navigation
  const handleNextStep = () => {
    setCurrentStep(currentStep + 1)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  // Add with the other handler functions
  const handleInitializationStepComplete = (stepNumber: number) => {
    setInitializationProgress(stepNumber)
    // If all steps are complete, move to the next wizard step
    if (stepNumber >= 7) {
      setTimeout(() => {
        setCurrentStep(currentStep + 1)
      }, 1000)
    }
  }

  // Render the appropriate step
  const renderStep = () => {
    switch (currentStep) {
      case 2:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Step 1: Initialize CCD Project</h2>
              <div className="grid gap-8 md:grid-cols-1">
                {currentProject ? (
                  // If we have a current project, show the project details view
                  <ProjectDetailsView
                    project={currentProject}
                    suggestedFeatures={features}
                    onContinue={handleNextStep}
                  />
                ) : (
                  // Otherwise, show the project selection form
                  <ProjectSelectionForm projects={mockProjects} onProjectSelect={handleProjectSelect} />
                )}
                {/* <div className="mt-4">
                  <h3 className="text-lg font-medium mb-3">Initialization Progress</h3>
                  <ProjectInitializationFlow
                    currentWizardStep={currentStep}
                    onStepComplete={handleInitializationStepComplete}
                  />
                </div> */}
              </div>
            </CardContent>
          </Card>
        )
      case 3:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Step 2: Break Down into Features</h2>
              <FeatureMatrixBuilder
                features={features}
                onFeaturesUpdate={handleFeaturesUpdate}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            </CardContent>
          </Card>
        )
      case 4:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Step 3: Define User Flows per Feature</h2>
              <UserFlowBuilder
                features={features}
                userFlows={userFlows}
                references={selectedProject?.references || []}
                onUserFlowsUpdate={handleUserFlowsUpdate}
                onNext={handleNextStep}
                onBack={handlePrevStep}
              />
            </CardContent>
          </Card>
        )
      case 5:
        return (
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-xl font-semibold mb-4">Step 4: Finalize & Generate Project</h2>
              <ProjectSummary
                project={selectedProject}
                features={features}
                userFlows={userFlows}
                onBack={handlePrevStep}
              />
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  // Render the wizard
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-center space-x-4 mb-12">
        <div className="relative">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${currentStep >= 2 ? "bg-primary text-primary-foreground" : "border border-input bg-background"}`}
          >
            1
          </div>
          <div className="absolute -bottom-6 text-xs text-center w-20" style={{ left: "-5px" }}>
            Initialize
          </div>
        </div>
        <div className={`h-0.5 w-12 ${currentStep >= 3 ? "bg-primary" : "bg-border"}`} />
        <div className="relative">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${currentStep >= 3 ? "bg-primary text-primary-foreground" : "border border-input bg-background"}`}
          >
            2
          </div>
          <div className="absolute -bottom-6 text-xs text-center w-20" style={{ left: "-5px" }}>
            Features
          </div>
        </div>
        <div className={`h-0.5 w-12 ${currentStep >= 4 ? "bg-primary" : "bg-border"}`} />
        <div className="relative">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${currentStep >= 4 ? "bg-primary text-primary-foreground" : "border border-input bg-background"}`}
          >
            3
          </div>
          <div className="absolute -bottom-6 text-xs text-center w-20" style={{ left: "-5px" }}>
            User Flows
          </div>
        </div>
        <div className={`h-0.5 w-12 ${currentStep >= 5 ? "bg-primary" : "bg-border"}`} />
        <div className="relative">
          <div
            className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${currentStep >= 5 ? "bg-primary text-primary-foreground" : "border border-input bg-background"}`}
          >
            4
          </div>
          <div className="absolute -bottom-6 text-xs text-center w-20" style={{ left: "-5px" }}>
            Finalize
          </div>
        </div>
      </div>

      {renderStep()}
      <Toaster />
    </div>
  )
}

