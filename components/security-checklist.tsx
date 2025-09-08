"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckSquare, Download, RefreshCw } from "lucide-react"

interface ChecklistItem {
  id: string
  category: string
  item: string
  priority: "High" | "Medium" | "Low"
  completed: boolean
}

export function SecurityChecklist() {
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    // Authentication & Authorization
    {
      id: "1",
      category: "Authentication",
      item: "Implement strong password policies (min 12 chars, complexity)",
      priority: "High",
      completed: false,
    },
    {
      id: "2",
      category: "Authentication",
      item: "Enable multi-factor authentication (MFA)",
      priority: "High",
      completed: false,
    },
    {
      id: "3",
      category: "Authentication",
      item: "Implement account lockout after failed attempts",
      priority: "High",
      completed: false,
    },
    {
      id: "4",
      category: "Authorization",
      item: "Implement role-based access control (RBAC)",
      priority: "High",
      completed: false,
    },
    {
      id: "5",
      category: "Authorization",
      item: "Apply principle of least privilege",
      priority: "High",
      completed: false,
    },

    // Input Validation & Injection Prevention
    {
      id: "6",
      category: "Input Validation",
      item: "Sanitize and validate all user inputs",
      priority: "High",
      completed: false,
    },
    {
      id: "7",
      category: "Input Validation",
      item: "Use parameterized queries/prepared statements",
      priority: "High",
      completed: false,
    },
    {
      id: "8",
      category: "Input Validation",
      item: "Implement CSRF protection tokens",
      priority: "High",
      completed: false,
    },
    {
      id: "9",
      category: "Input Validation",
      item: "Validate file uploads (type, size, content)",
      priority: "Medium",
      completed: false,
    },

    // Data Protection & Encryption
    {
      id: "10",
      category: "Data Protection",
      item: "Encrypt sensitive data at rest (AES-256)",
      priority: "High",
      completed: false,
    },
    {
      id: "11",
      category: "Data Protection",
      item: "Use HTTPS/TLS 1.3 for all communications",
      priority: "High",
      completed: false,
    },
    {
      id: "12",
      category: "Data Protection",
      item: "Implement proper session management",
      priority: "High",
      completed: false,
    },
    {
      id: "13",
      category: "Data Protection",
      item: "Hash passwords with bcrypt/Argon2",
      priority: "High",
      completed: false,
    },

    // Security Headers & Configuration
    {
      id: "14",
      category: "Security Headers",
      item: "Set Content Security Policy (CSP)",
      priority: "High",
      completed: false,
    },
    {
      id: "15",
      category: "Security Headers",
      item: "Enable X-Frame-Options header",
      priority: "Medium",
      completed: false,
    },
    {
      id: "16",
      category: "Security Headers",
      item: "Set X-Content-Type-Options: nosniff",
      priority: "Medium",
      completed: false,
    },
    {
      id: "17",
      category: "Security Headers",
      item: "Configure HSTS (HTTP Strict Transport Security)",
      priority: "High",
      completed: false,
    },

    // Error Handling & Logging
    {
      id: "18",
      category: "Error Handling",
      item: "Implement secure error handling (no sensitive info)",
      priority: "Medium",
      completed: false,
    },
    {
      id: "19",
      category: "Logging",
      item: "Log security events and authentication attempts",
      priority: "Medium",
      completed: false,
    },
    {
      id: "20",
      category: "Logging",
      item: "Implement log monitoring and alerting",
      priority: "Medium",
      completed: false,
    },

    // Configuration & Maintenance
    {
      id: "21",
      category: "Configuration",
      item: "Remove default credentials and accounts",
      priority: "High",
      completed: false,
    },
    {
      id: "22",
      category: "Configuration",
      item: "Disable unnecessary services and ports",
      priority: "Medium",
      completed: false,
    },
    {
      id: "23",
      category: "Configuration",
      item: "Configure secure cookie settings",
      priority: "High",
      completed: false,
    },
    {
      id: "24",
      category: "Updates",
      item: "Keep all dependencies and frameworks updated",
      priority: "High",
      completed: false,
    },
    {
      id: "25",
      category: "Updates",
      item: "Implement automated security scanning",
      priority: "Medium",
      completed: false,
    },

    // Additional Security Measures
    { id: "26", category: "API Security", item: "Implement API rate limiting", priority: "Medium", completed: false },
    {
      id: "27",
      category: "API Security",
      item: "Use API authentication tokens (JWT)",
      priority: "High",
      completed: false,
    },
    {
      id: "28",
      category: "Backup & Recovery",
      item: "Implement secure backup procedures",
      priority: "Medium",
      completed: false,
    },
    { id: "29", category: "Monitoring", item: "Set up intrusion detection system", priority: "Low", completed: false },
    {
      id: "30",
      category: "Testing",
      item: "Perform regular security penetration testing",
      priority: "Medium",
      completed: false,
    },
  ])

  const toggleItem = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)))
  }

  const resetChecklist = () => {
    setChecklist((prev) => prev.map((item) => ({ ...item, completed: false })))
  }

  const exportChecklist = () => {
    const checklistData = {
      timestamp: new Date().toISOString(),
      totalItems: checklist.length,
      completedItems: checklist.filter((item) => item.completed).length,
      checklist: checklist,
    }

    const blob = new Blob([JSON.stringify(checklistData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `security-checklist-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const completedCount = checklist.filter((item) => item.completed).length
  const completionPercentage = Math.round((completedCount / checklist.length) * 100)

  const groupedChecklist = checklist.reduce(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = []
      acc[item.category].push(item)
      return acc
    },
    {} as Record<string, ChecklistItem[]>,
  )

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-600 text-white"
      case "Medium":
        return "bg-orange-500 text-white"
      case "Low":
        return "bg-green-600 text-white"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <Card className="gradient-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <CheckSquare className="h-5 w-5 text-primary" />
            </div>
            Comprehensive Security Checklist
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={resetChecklist}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button variant="outline" size="sm" onClick={exportChecklist}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        <div className="space-y-3 mt-4">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
              <div
                className={`h-3 rounded-full transition-all duration-500 ${
                  completionPercentage >= 80
                    ? "bg-green-500"
                    : completionPercentage >= 50
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <span className="text-sm font-medium min-w-[80px]">
              {completedCount}/{checklist.length} ({completionPercentage}%)
            </span>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center p-2 bg-red-50 dark:bg-red-950/20 rounded">
              <div className="font-semibold text-red-600">
                {checklist.filter((item) => item.priority === "High" && !item.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">High Priority Left</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 dark:bg-yellow-950/20 rounded">
              <div className="font-semibold text-yellow-600">
                {checklist.filter((item) => item.priority === "Medium" && !item.completed).length}
              </div>
              <div className="text-xs text-muted-foreground">Medium Priority Left</div>
            </div>
            <div className="text-center p-2 bg-green-50 dark:bg-green-950/20 rounded">
              <div className="font-semibold text-green-600">{completedCount}</div>
              <div className="text-xs text-muted-foreground">Completed</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(groupedChecklist).map(([category, items]) => (
          <div key={category} className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg text-primary">{category}</h4>
              <Badge variant="outline" className="text-xs">
                {items.filter((item) => item.completed).length}/{items.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-200 ${
                    item.completed
                      ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                      : "bg-background hover:bg-muted/50 border border-muted"
                  }`}
                >
                  <Checkbox
                    id={item.id}
                    checked={item.completed}
                    onCheckedChange={() => toggleItem(item.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <label
                      htmlFor={item.id}
                      className={`text-sm cursor-pointer block ${
                        item.completed ? "line-through text-muted-foreground" : "text-foreground"
                      }`}
                    >
                      {item.item}
                    </label>
                  </div>
                  <Badge className={`${getPriorityColor(item.priority)} text-xs shrink-0`}>{item.priority}</Badge>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
