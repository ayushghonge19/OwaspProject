"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Switch } from "@/components/ui/switch"
import {
  Shield,
  Code,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Sparkles,
  Zap,
  BarChart3,
  GitCompare,
  CheckSquare,
} from "lucide-react"
import { analyzeCode, type AnalysisResult } from "@/lib/vulnerability-detector"
import { OWASPReference } from "@/components/owasp-reference"
import { SecurityDashboard } from "@/components/security-dashboard"
import { CodeComparison } from "@/components/code-comparison"
import { SecurityChecklist } from "@/components/security-checklist"

export default function OWASPAnalyzer() {
  const [code, setCode] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null)
  const [analysisHistory, setAnalysisHistory] = useState<AnalysisResult[]>([])
  const [realTimeAnalysis, setRealTimeAnalysis] = useState(false)
  const [activeTab, setActiveTab] = useState("analyzer")

  const handleCodeChange = (value: string) => {
    setCode(value)

    if (realTimeAnalysis && value.trim()) {
      // Debounce real-time analysis
      const timeoutId = setTimeout(() => {
        const results = analyzeCode(value)
        setAnalysisResults(results)
      }, 1000)

      return () => clearTimeout(timeoutId)
    }
  }

  const handleAnalyzeCode = async () => {
    if (!code.trim()) return

    setIsAnalyzing(true)

    // Simulate processing time for better UX
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Use the real vulnerability detection engine
    const results = analyzeCode(code)
    setAnalysisResults(results)

    setAnalysisHistory((prev) => [...prev, results])
    setIsAnalyzing(false)
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-600 text-white vulnerability-glow"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen security-gradient">
      <header className="border-b glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 animate-fade-in">
            <div className="relative">
              <Shield className="h-10 w-10 text-primary animate-pulse-glow" />
              <Sparkles className="h-4 w-4 text-secondary absolute -top-1 -right-1" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                OWASP Security Analyzer Weapon
              </h1>
              <p className="text-muted-foreground text-lg">
                Advanced AI-powered security analysis with comprehensive vulnerability detection and remediation
              </p>
            </div>
          </div>

          <div className="mt-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5 h-12">
                <TabsTrigger value="analyzer" className="text-sm">
                  <Shield className="h-4 w-4 mr-2" />
                  Analyzer
                </TabsTrigger>
                <TabsTrigger value="dashboard" className="text-sm">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </TabsTrigger>
                <TabsTrigger value="comparison" className="text-sm">
                  <GitCompare className="h-4 w-4 mr-2" />
                  Comparison
                </TabsTrigger>
                <TabsTrigger value="checklist" className="text-sm">
                  <CheckSquare className="h-4 w-4 mr-2" />
                  Checklist
                </TabsTrigger>
                <TabsTrigger value="reference" className="text-sm">
                  <Info className="h-4 w-4 mr-2" />
                  Reference
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="analyzer" className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="gradient-border animate-slide-up">
                  <div className="relative z-10">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-3 text-2xl">
                            <div className="p-2 rounded-lg bg-primary/10">
                              <Code className="h-6 w-6 text-primary" />
                            </div>
                            Code Input
                          </CardTitle>
                          <CardDescription className="text-base">
                            Paste your code below to analyze for OWASP Top 10 vulnerabilities with our advanced
                            detection engine
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Switch id="real-time" checked={realTimeAnalysis} onCheckedChange={setRealTimeAnalysis} />
                          <label htmlFor="real-time" className="text-sm font-medium">
                            Real-time Analysis
                          </label>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="relative">
                        <Textarea
                          placeholder="Paste your code here (JavaScript, Python, PHP, HTML, CSS, Java, C/C++, etc.)..."
                          value={code}
                          onChange={(e) => handleCodeChange(e.target.value)}
                          className="min-h-[350px] font-mono text-sm border-2 focus:border-primary/50 transition-all duration-300 resize-none"
                        />
                        {code && (
                          <div className="absolute bottom-3 right-3 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
                            {code.split("\n").length} lines
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={handleAnalyzeCode}
                        disabled={!code.trim() || isAnalyzing}
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-300 transform hover:scale-[1.02]"
                      >
                        {isAnalyzing ? (
                          <div className="flex items-center gap-2">
                            <Zap className="h-5 w-5 animate-spin" />
                            Analyzing Security...
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <Shield className="h-5 w-5" />
                            Analyze Code for Vulnerabilities
                          </div>
                        )}
                      </Button>
                    </CardContent>
                  </div>
                </Card>

                {/* ... existing analysis results code ... */}
                {analysisResults && (
                  <Card className="animate-fade-in">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        <div className="p-2 rounded-lg bg-secondary/10">
                          <AlertTriangle className="h-6 w-6 text-secondary" />
                        </div>
                        Analysis Results
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-4 mt-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <span className="text-sm font-medium text-muted-foreground">Risk Score:</span>
                          <Badge
                            className={`text-sm px-3 py-1 ${
                              analysisResults.riskScore > 70
                                ? "bg-destructive text-destructive-foreground vulnerability-glow"
                                : analysisResults.riskScore > 40
                                  ? "bg-orange-500 text-white"
                                  : "bg-green-500 text-white secure-glow"
                            }`}
                          >
                            {analysisResults.riskScore}/100
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <span className="text-sm font-medium text-muted-foreground">Language:</span>
                          <Badge variant="outline" className="text-sm px-3 py-1">
                            {analysisResults.language}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <span className="text-sm font-medium text-muted-foreground">Issues Found:</span>
                          <Badge variant="outline" className="text-sm px-3 py-1">
                            {analysisResults.vulnerabilities.length}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="vulnerabilities" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 h-12">
                          <TabsTrigger value="vulnerabilities" className="text-base">
                            <XCircle className="h-4 w-4 mr-2" />
                            Vulnerabilities
                          </TabsTrigger>
                          <TabsTrigger value="secure-code" className="text-base">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Secure Code
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="vulnerabilities" className="space-y-6 mt-6">
                          {analysisResults.vulnerabilities.length === 0 ? (
                            <Alert className="border-l-4 border-l-green-500 secure-glow animate-fade-in">
                              <CheckCircle className="h-5 w-5 text-green-600" />
                              <AlertDescription>
                                <div className="space-y-3">
                                  <strong className="text-green-700 text-lg">🎉 No vulnerabilities detected!</strong>
                                  <p className="text-base">
                                    Your code appears to follow security best practices for the patterns we checked.
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Note: This analysis covers common OWASP Top 10 patterns. Consider additional
                                    security testing for comprehensive coverage.
                                  </p>
                                </div>
                              </AlertDescription>
                            </Alert>
                          ) : (
                            <div className="space-y-4">
                              {analysisResults.vulnerabilities.map((vuln, index) => (
                                <Alert
                                  key={index}
                                  className="border-l-4 border-l-destructive vulnerability-glow animate-slide-up"
                                  style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                  <XCircle className="h-5 w-5" />
                                  <AlertDescription>
                                    <div className="space-y-4">
                                      <div className="flex items-center gap-3 flex-wrap">
                                        <strong className="text-lg">{vuln.type}</strong>
                                        <Badge className={`${getSeverityColor(vuln.severity)} text-sm px-3 py-1`}>
                                          {vuln.severity}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded">
                                          Line {vuln.line}
                                        </span>
                                      </div>
                                      <p className="text-base leading-relaxed">{vuln.description}</p>
                                      <div className="bg-muted/70 p-4 rounded-lg border-l-4 border-l-destructive">
                                        <strong className="text-sm font-semibold text-destructive">
                                          Vulnerable Code:
                                        </strong>
                                        <pre className="text-sm font-mono mt-2 text-foreground">{vuln.codeSnippet}</pre>
                                      </div>
                                      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border-l-4 border-l-blue-500">
                                        <strong className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                          💡 Recommendation:
                                        </strong>
                                        <p className="text-sm mt-2 leading-relaxed">{vuln.recommendation}</p>
                                      </div>
                                    </div>
                                  </AlertDescription>
                                </Alert>
                              ))}
                            </div>
                          )}
                        </TabsContent>

                        <TabsContent value="secure-code" className="mt-6">
                          <Card className="secure-glow">
                            <CardHeader>
                              <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/30">
                                  <CheckCircle className="h-6 w-6 text-green-600" />
                                </div>
                                Secure Code Implementation
                              </CardTitle>
                              <CardDescription className="text-base">
                                {analysisResults.vulnerabilities.length > 0
                                  ? `✅ Fixed ${analysisResults.vulnerabilities.length} vulnerability${analysisResults.vulnerabilities.length > 1 ? "ies" : ""} with secure implementations`
                                  : "🎯 Your code follows security best practices!"}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="relative">
                                <pre className="bg-muted/70 p-6 rounded-lg overflow-x-auto text-sm max-h-96 overflow-y-auto border">
                                  <code className="text-foreground leading-relaxed">{analysisResults.secureCode}</code>
                                </pre>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="absolute top-3 right-3 bg-background/90 hover:bg-background transition-all duration-200"
                                  onClick={() => navigator.clipboard.writeText(analysisResults.secureCode)}
                                >
                                  <Code className="h-4 w-4 mr-2" />
                                  Copy Code
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-8">
                <div className="animate-slide-up" style={{ animationDelay: "0.2s" }}>
                  <OWASPReference />
                </div>

                {/* ... existing sidebar content ... */}
                <Card className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      How It Works
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm flex items-center justify-center font-bold flex-shrink-0">
                        1
                      </div>
                      <p className="text-sm leading-relaxed">Paste your code in the input area</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm flex items-center justify-center font-bold flex-shrink-0">
                        2
                      </div>
                      <p className="text-sm leading-relaxed">Our AI engine analyzes for OWASP Top 10 vulnerabilities</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-secondary text-primary-foreground text-sm flex items-center justify-center font-bold flex-shrink-0">
                        3
                      </div>
                      <p className="text-sm leading-relaxed">Get detailed reports and secure code suggestions</p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-slide-up" style={{ animationDelay: "0.4s" }}>
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <Info className="h-5 w-5 text-secondary" />
                      Supported Languages
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 my-4">
                      {["JavaScript", "Python", "PHP", "Java", "C/C++", "HTML", "CSS", "General"].map((lang, index) => (
                        <Badge
                          key={lang}
                          variant="outline"
                          className="justify-center py-2 hover:bg-primary/10 transition-colors cursor-default animate-fade-in"
                          style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground text-xs leading-relaxed">
                      🚀 Enhanced language detection with specific vulnerability patterns for each language.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboard" className="space-y-8">
            <SecurityDashboard analysisResults={analysisHistory} />
          </TabsContent>

          <TabsContent value="comparison" className="space-y-8">
            {analysisResults ? (
              <CodeComparison
                originalCode={code}
                secureCode={analysisResults.secureCode}
                vulnerabilities={analysisResults.vulnerabilities}
              />
            ) : (
              <Card>
                <CardContent className="text-center py-12">
                  <GitCompare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No Analysis Available</h3>
                  <p className="text-muted-foreground">
                    Run a code analysis first to see the comparison between original and secure code.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="checklist" className="space-y-8">
            <SecurityChecklist />
          </TabsContent>

          <TabsContent value="reference" className="space-y-8">
            <OWASPReference />
            {activeTab === "reference" && (
              <>
                <Card className="animate-fade-in gradient-border">
                  <CardHeader>
                    <CardTitle className="text-3xl flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                      Acknowledgments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 rounded-xl border-l-4 border-l-primary">
                        <p className="text-lg leading-relaxed mb-4">
                          We are sincerely grateful to{" "}
                          <strong className="text-primary text-xl">Dr. Priscilla D. Moyya Ma'am</strong> for her
                          invaluable guidance during our Internet and Web Programming course. Her expertise and support
                          provided the essential foundation for this project's success.
                        </p>
                      </div>

                      <div className="mt-8">
                        <h3 className="text-xl font-semibold mb-6 text-center">Project Team</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 p-4 rounded-xl border-2 border-secondary/20 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-secondary">Ayush Ghonge</div>
                            <div className="text-sm text-muted-foreground mt-1">Tech</div>
                          </div>
                          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 p-4 rounded-xl border-2 border-secondary/20 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-secondary">Vraj Shah</div>
                            <div className="text-sm text-muted-foreground mt-1">Tech</div>
                          </div>
                          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-xl border-2 border-primary/20 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-primary">Harshit</div>
                            <div className="text-sm text-muted-foreground mt-1">Tech</div>
                          </div>
                          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 p-4 rounded-xl border-2 border-secondary/20 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-secondary">Arnav</div>
                            <div className="text-sm text-muted-foreground mt-1">Tech</div>
                          </div>
                          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 p-4 rounded-xl border-2 border-primary/20 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-primary">Priyanshu</div>
                            <div className="text-sm text-muted-foreground mt-1">Tech</div>
                          </div>
                          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 p-4 rounded-xl border-2 border-secondary/20 text-center transform hover:scale-105 transition-all duration-300">
                            <div className="text-xl font-semibold text-secondary">Jeet</div>
                            <div className="text-sm text-muted-foreground mt-1">Tech</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 text-center">
                        <p className="text-lg leading-relaxed text-muted-foreground bg-muted/30 p-4 rounded-lg">
                          This project is presented for academic purposes to demonstrate our understanding of critical
                          web application security principles.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="animate-fade-in gradient-border" style={{ animationDelay: "0.2s" }}>
                  <CardHeader>
                    <CardTitle className="text-3xl flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-secondary/20 to-primary/20">
                        <Info className="h-8 w-8 text-secondary" />
                      </div>
                      References
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <div className="bg-gradient-to-r from-secondary/5 to-primary/5 p-6 rounded-xl">
                        <p className="text-lg leading-relaxed mb-6">
                          Our research and understanding of web application vulnerabilities were significantly informed
                          by the following academic resources:
                        </p>

                        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg border-l-4 border-l-secondary shadow-lg">
                          <div className="flex items-start gap-4">
                            <div className="w-2 h-2 bg-secondary rounded-full mt-3 flex-shrink-0"></div>
                            <div>
                              <p className="text-base font-medium leading-relaxed text-foreground">
                                <strong>Nedeljković, N., Vugdelija, N., & Kojić, N.</strong>
                                <em className="text-secondary">
                                  {" "}
                                  "Use of 'OWASP TOP 10' in Web Application Security."
                                </em>
                              </p>
                              <p className="text-sm text-muted-foreground mt-2">
                                This comprehensive paper served as our primary resource for understanding modern web
                                application security vulnerabilities and implementing effective detection mechanisms.
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 bg-primary/5 p-4 rounded-lg border border-primary/20">
                          <p className="text-sm text-muted-foreground text-center">
                            📚 Additional resources from OWASP Foundation and security research communities contributed
                            to our comprehensive understanding.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
