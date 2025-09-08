"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { TrendingUp, BarChart3 } from "lucide-react"
import type { AnalysisResult } from "@/lib/vulnerability-detector"

interface SecurityDashboardProps {
  analysisResults: AnalysisResult[]
}

export function SecurityDashboard({ analysisResults }: SecurityDashboardProps) {
  const totalVulnerabilities = analysisResults.reduce((sum, result) => sum + result.vulnerabilities.length, 0)
  const averageRiskScore =
    analysisResults.length > 0
      ? Math.round(analysisResults.reduce((sum, result) => sum + result.riskScore, 0) / analysisResults.length)
      : 0

  // Process severity data from all analysis results
  const severityData = analysisResults
    .flatMap((result) => result.vulnerabilities)
    .reduce(
      (acc, vuln) => {
        acc[vuln.severity] = (acc[vuln.severity] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  const pieData =
    Object.keys(severityData).length > 0
      ? Object.entries(severityData).map(([severity, count]) => ({
          name: severity,
          value: count,
          color:
            severity === "Critical"
              ? "#dc2626"
              : severity === "High"
                ? "#ea580c"
                : severity === "Medium"
                  ? "#ca8a04"
                  : "#65a30d",
        }))
      : []

  // Process vulnerability types data
  const typeData = analysisResults
    .flatMap((result) => result.vulnerabilities)
    .reduce(
      (acc, vuln) => {
        const type = vuln.type.split(":")[0].trim() // Get main category
        acc[type] = (acc[type] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

  const barData =
    Object.keys(typeData).length > 0
      ? Object.entries(typeData)
          .map(([type, count]) => ({
            type: type.replace(/([A-Z])/g, " $1").trim(),
            count,
          }))
          .sort((a, b) => b.count - a.count) // Sort by count descending
      : []

  return (
    <div className="space-y-6">
      <Card className="gradient-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <TrendingUp className="h-5 w-5 text-primary" />
            </div>
            Security Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
              <div className="text-2xl font-bold text-primary">{analysisResults.length}</div>
              <div className="text-sm text-foreground">Analyses Run</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{totalVulnerabilities}</div>
              <div className="text-sm text-foreground">Total Issues</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800">
              <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{averageRiskScore}</div>
              <div className="text-sm text-foreground">Avg Risk Score</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                {analysisResults.filter((r) => r.vulnerabilities.length === 0).length}
              </div>
              <div className="text-sm text-foreground">Clean Scans</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-semibold mb-4">Vulnerability Types</h4>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" fontSize={11} angle={-45} textAnchor="end" height={80} interval={0} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Bar dataKey="count" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex flex-col items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <BarChart3 className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground font-medium">No vulnerability data available</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Run code analysis to see vulnerability types</p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-4">Severity Distribution</h4>
              {pieData.length > 0 ? (
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      labelLine={false}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value, name) => [value, `${name} Severity`]} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-[250px] flex flex-col items-center justify-center bg-muted/30 rounded-lg border-2 border-dashed border-muted-foreground/20">
                  <TrendingUp className="h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground font-medium">No severity data available</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">
                    Run code analysis to see severity distribution
                  </p>
                </div>
              )}
            </div>
          </div>

          {analysisResults.length > 0 && (
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-3">Recent Analysis Summary</h4>
              <div className="space-y-2">
                {analysisResults.slice(-3).map((result, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {result.language} - {result.vulnerabilities.length} issues
                    </span>
                    <span
                      className={`font-medium ${
                        result.riskScore > 70
                          ? "text-red-600"
                          : result.riskScore > 40
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      Risk: {result.riskScore}/100
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
