import { ProjectInitializationWizard } from "@/components/project-initialization-wizard"

// This would be the current project in a real implementation
const currentProject = {
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
}

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-6 md:p-12">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">CCD Project Initialization demo</h1>
          <p className="text-muted-foreground">
            Initialize projects by extracting details from Ref Curator references and breaking them down into features
            and user flows.
          </p>
        </div>

        {/* Pass the current project to the wizard */}
        <ProjectInitializationWizard currentProject={currentProject} />
      </div>
    </main>
  )
}

