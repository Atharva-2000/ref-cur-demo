"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tag } from "lucide-react"
import type { RefCuratorProject, Feature } from "@/components/project-initialization-wizard"

interface ProjectDetailsViewProps {
  project: RefCuratorProject
  suggestedFeatures: Feature[]
  onContinue: () => void
}

// Define color mapping for competitor references
const referenceColors: Record<string, string> = {
  LegalZoom: "blue",
  DoNotPay: "green",
  Clio: "purple",
  CCD: "red",
  Competitor: "orange",
}

export function ProjectDetailsView({ project, suggestedFeatures, onContinue }: ProjectDetailsViewProps) {
  // Get reference color based on name
  const getReferenceColor = (title: string) => {
    const name = title.split(" ")[0]
    return referenceColors[name] || "gray"
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Project Details</h3>
              <Badge variant="outline" className="px-3 py-1">
                From Ref Curator
              </Badge>
            </div>

            <div className="grid gap-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Project Name</h4>
                <p className="text-base">{project.name}</p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Goals</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {project.goals.map((goal, index) => (
                    <li key={index} className="text-sm">
                      {goal}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">References</h4>
                <div className="space-y-2">
                  {project.references.map((reference) => (
                    <Collapsible key={reference.id} className="rounded-md border">
                      <div className="flex items-center justify-between p-3">
                        <CollapsibleTrigger className="flex items-center text-sm font-medium hover:underline">
                          {reference.title}
                        </CollapsibleTrigger>
                        <Badge
                          variant="outline"
                          className={`bg-${getReferenceColor(reference.title)}-100 text-${getReferenceColor(reference.title)}-800 border-${getReferenceColor(reference.title)}-300`}
                        >
                          <Tag className="mr-1 h-3 w-3" />
                          {reference.title.split(" ")[0]}
                        </Badge>
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
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Suggested Features</h3>
            <div className="space-y-3">
              {suggestedFeatures.map((feature) => (
                <div key={feature.id} className="rounded-md border p-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-medium">{feature.name}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                    <Badge
                      className={
                        feature.priority === "High"
                          ? "bg-red-100 text-red-800 border-red-300"
                          : feature.priority === "Medium"
                            ? "bg-yellow-100 text-yellow-800 border-yellow-300"
                            : "bg-green-100 text-green-800 border-green-300"
                      }
                    >
                      {feature.priority}
                    </Badge>
                  </div>
                  {feature.suggestedBySystem && (
                    <p className="mt-2 text-xs text-muted-foreground">Suggested based on project goals</p>
                  )}
                </div>
              ))}

              {suggestedFeatures.length === 0 && (
                <p className="text-center text-muted-foreground py-2">
                  No features suggested. Features will be created in the next step.
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" disabled>
          Back
        </Button>
        <Button onClick={onContinue}>Continue to Features</Button>
      </div>
    </div>
  )
}

