"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { GitCompare, Download, CheckCircle } from "lucide-react"

interface CodeComparisonProps {
  originalCode: string
  secureCode: string
  vulnerabilities: Array<{ type: string; line: number }>
}

interface CodeSection {
  startLine: number
  endLine: number
  lines: string[]
}

export function CodeComparison({ originalCode, secureCode, vulnerabilities }: CodeComparisonProps) {
  const originalLines = originalCode.split("\n")
  const secureLines = secureCode.split("\n")
  const vulnerableLines = new Set(vulnerabilities.map((v) => v.line - 1))

  // ... exportComparison function remains the same ...

  const getFocusedSections = (lines: string[], isSecure = false): string[] | CodeSection[] => {
    if (vulnerabilities.length === 0) {
      return lines.slice(0, Math.min(20, lines.length)) // Show first 20 lines if no vulnerabilities
    }

    const sections: CodeSection[] = []
    const contextLines = 3 // Show 3 lines before and after each vulnerability

    vulnerabilities.forEach((vuln) => {
      const vulnLine = vuln.line - 1 // Convert to 0-based index
      const startLine = Math.max(0, vulnLine - contextLines)
      const endLine = Math.min(lines.length - 1, vulnLine + contextLines)

      sections.push({
        startLine,
        endLine,
        lines: lines.slice(startLine, endLine + 1),
      })
    })

    return sections
  }

  const originalSections = getFocusedSections(originalLines)
  const secureSections = getFocusedSections(secureLines, true)

  // Helper function to check if sections are simple string arrays
  const isSimpleArray = (sections: any): sections is string[] => {
    return vulnerabilities.length === 0 || typeof sections[0] === 'string'
  }

  return (
    <Card className="gradient-border">
      <CardHeader>
        {/* ... header content remains the same ... */}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Original Code Panel */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="destructive">Original Code</Badge>
              <span className="text-sm text-muted-foreground">
                {vulnerabilities.length} issue{vulnerabilities.length !== 1 ? "s" : ""} found
              </span>
            </div>
            <div className="bg-muted/30 rounded-lg border max-h-96 overflow-y-auto">
              {vulnerabilities.length > 0 ? (
                <div className="text-sm">
                  {isSimpleArray(originalSections) ? (
                    // Show full code if no vulnerabilities
                    <pre className="p-4">
                      {originalSections.map((line, index) => (
                        <div
                          key={index}
                          className={`flex py-1 ${
                            vulnerableLines.has(index)
                              ? "bg-red-100 dark:bg-red-950/30 border-l-4 border-l-red-500 pl-2"
                              : "pl-6"
                          }`}
                        >
                          <span className="text-muted-foreground mr-4 select-none w-8 text-right font-mono">
                            {index + 1}
                          </span>
                          <code className="flex-1 font-mono">{line || " "}</code>
                        </div>
                      ))}
                    </pre>
                  ) : (
                    // Show focused sections around vulnerabilities
                    (originalSections as CodeSection[]).map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border-b border-muted last:border-b-0">
                        <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground">
                          Lines {section.startLine + 1}-{section.endLine + 1}
                        </div>
                        <pre className="p-4">
                          {section.lines.map((line, lineIndex) => {
                            const actualLineIndex = section.startLine + lineIndex
                            return (
                              <div
                                key={lineIndex}
                                className={`flex py-1 ${
                                  vulnerableLines.has(actualLineIndex)
                                    ? "bg-red-100 dark:bg-red-950/30 border-l-4 border-l-red-500 pl-2"
                                    : "pl-6"
                                }`}
                              >
                                <span className="text-muted-foreground mr-4 select-none w-8 text-right font-mono">
                                  {actualLineIndex + 1}
                                </span>
                                <code className="flex-1 font-mono">{line || " "}</code>
                              </div>
                            )
                          })}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-muted-foreground">No vulnerabilities found in the code</p>
                </div>
              )}
            </div>
          </div>

          {/* Secure Code Panel */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-green-600 text-white">Secure Code</Badge>
              <span className="text-sm text-muted-foreground">Issues resolved</span>
            </div>
            <div className="bg-muted/30 rounded-lg border max-h-96 overflow-y-auto">
              {vulnerabilities.length > 0 ? (
                <div className="text-sm">
                  {isSimpleArray(secureSections) ? (
                    // Show full secure code if no vulnerabilities were found
                    <pre className="p-4">
                      {secureSections.map((line, index) => (
                        <div key={index} className="flex py-1 pl-6">
                          <span className="text-muted-foreground mr-4 select-none w-8 text-right font-mono">
                            {index + 1}
                          </span>
                          <code className="flex-1 font-mono">{line || " "}</code>
                        </div>
                      ))}
                    </pre>
                  ) : (
                    // Show focused sections of secure code
                    (secureSections as CodeSection[]).map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border-b border-muted last:border-b-0">
                        <div className="bg-green-50 dark:bg-green-950/20 px-4 py-2 text-xs text-green-700 dark:text-green-300">
                          Secure Implementation: Lines {section.startLine + 1}-{section.endLine + 1}
                        </div>
                        <pre className="p-4">
                          {section.lines.map((line, lineIndex) => (
                            <div key={lineIndex} className="flex py-1 pl-6 bg-green-50/50 dark:bg-green-950/10">
                              <span className="text-muted-foreground mr-4 select-none w-8 text-right font-mono">
                                {section.startLine + lineIndex + 1}
                              </span>
                              <code className="flex-1 font-mono">{line || " "}</code>
                            </div>
                          ))}
                        </pre>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
                  <p className="text-muted-foreground">Code is already secure</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ... analysis summary remains the same ... */}
      </CardContent>
    </Card>
  )
}