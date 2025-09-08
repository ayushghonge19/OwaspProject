"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { ChevronDown, ChevronRight, Shield, AlertTriangle, Info } from "lucide-react"

const OWASP_DETAILED = [
  {
    id: 1,
    name: "Broken Access Control",
    severity: "Critical",
    description: "Restrictions on what authenticated users are allowed to do are often not properly enforced.",
    examples: [
      "Accessing other users' accounts by modifying URL parameters",
      "Viewing or editing someone else's account data",
      "Acting as a user without being logged in",
      "Privilege escalation (acting as an admin when you're a user)",
    ],
    prevention: [
      "Implement proper access control mechanisms",
      "Deny by default, except for public resources",
      "Use server-side enforcement of access controls",
      "Log access control failures and alert admins when appropriate",
    ],
    impact:
      "Attackers can access unauthorized functionality and/or data, view sensitive files, modify other users' data, or change access rights.",
  },
  {
    id: 2,
    name: "Cryptographic Failures",
    severity: "High",
    description: "Failures related to cryptography which often leads to sensitive data exposure.",
    examples: [
      "Transmitting data in clear text (HTTP, SMTP, FTP)",
      "Using old or weak cryptographic algorithms",
      "Using default crypto keys or weak keys",
      "Not enforcing encryption (missing HTTP security headers)",
    ],
    prevention: [
      "Classify data and apply controls according to classification",
      "Don't store sensitive data unnecessarily",
      "Encrypt all data at rest and in transit",
      "Use strong, up-to-date cryptographic algorithms and keys",
    ],
    impact: "Sensitive data may be compromised without extra protection such as encryption at rest or in transit.",
  },
  {
    id: 3,
    name: "Injection",
    severity: "Critical",
    description: "Injection flaws occur when untrusted data is sent to an interpreter as part of a command or query.",
    examples: [
      "SQL injection in database queries",
      "NoSQL injection in NoSQL databases",
      "OS command injection",
      "LDAP injection",
    ],
    prevention: [
      "Use parameterized queries or prepared statements",
      "Validate input using positive server-side validation",
      "Escape special characters using specific syntax",
      "Use LIMIT and other SQL controls to prevent mass disclosure",
    ],
    impact:
      "Injection can result in data loss, corruption, or disclosure to unauthorized parties, loss of accountability, or denial of access.",
  },
  {
    id: 4,
    name: "Insecure Design",
    severity: "High",
    description:
      "A broad category representing different weaknesses, expressed as 'missing or ineffective control design.'",
    examples: [
      "Lack of business logic validation",
      "Missing rate limiting on sensitive operations",
      "Insecure password recovery mechanisms",
      "Accepting unsigned or unencrypted communications",
    ],
    prevention: [
      "Establish secure development lifecycle with security professionals",
      "Use threat modeling for critical authentication and access control",
      "Integrate security language and controls into user stories",
      "Write unit and integration tests to validate all critical flows",
    ],
    impact:
      "Insecure design cannot be fixed by a perfect implementation as the required security controls were never created.",
  },
  {
    id: 5,
    name: "Security Misconfiguration",
    severity: "High",
    description:
      "Security misconfiguration is commonly a result of insecure default configurations or incomplete configurations.",
    examples: [
      "Missing security hardening across application stack",
      "Improperly configured permissions on cloud services",
      "Default accounts and passwords still enabled",
      "Error handling reveals stack traces to users",
    ],
    prevention: [
      "Implement a repeatable hardening process",
      "Remove unused features, components, files, and documentation",
      "Review and update configurations with security notes and updates",
      "Use automated processes to verify configuration effectiveness",
    ],
    impact: "Such flaws frequently give attackers unauthorized access to system data or functionality.",
  },
  {
    id: 6,
    name: "Vulnerable and Outdated Components",
    severity: "Medium",
    description:
      "Components run with the same privileges as the application, so flaws in any component can result in serious impact.",
    examples: [
      "Using components with known vulnerabilities",
      "Not scanning for vulnerabilities regularly",
      "Not upgrading underlying platform and frameworks",
      "Not securing component configurations",
    ],
    prevention: [
      "Remove unused dependencies and features",
      "Continuously inventory client-side and server-side components",
      "Monitor sources for vulnerabilities in components",
      "Only obtain components from official sources over secure links",
    ],
    impact:
      "Component vulnerabilities can cause almost any type of risk possible, ranging from trivial to sophisticated malicious takeovers.",
  },
  {
    id: 7,
    name: "Identification and Authentication Failures",
    severity: "High",
    description:
      "Confirmation of the user's identity, authentication, and session management is critical to protect against authentication-related attacks.",
    examples: [
      "Permits brute force or automated attacks",
      "Permits default, weak, or well-known passwords",
      "Uses weak credential recovery processes",
      "Stores passwords using weak hashing methods",
    ],
    prevention: [
      "Implement multi-factor authentication",
      "Do not ship or deploy with default credentials",
      "Implement weak password checks",
      "Limit or delay failed login attempts",
    ],
    impact:
      "Attackers have access to hundreds of millions of valid username and password combinations for credential stuffing.",
  },
  {
    id: 8,
    name: "Software and Data Integrity Failures",
    severity: "High",
    description:
      "Software and data integrity failures relate to code and infrastructure that does not protect against integrity violations.",
    examples: [
      "Using libraries from untrusted sources",
      "Insecure CI/CD pipeline",
      "Auto-update functionality without integrity verification",
      "Serialized objects passed to untrusted sources",
    ],
    prevention: [
      "Use digital signatures to verify software integrity",
      "Ensure libraries are consuming trusted repositories",
      "Use software supply chain security tools",
      "Review code and configuration changes",
    ],
    impact: "Unauthorized code execution, malware installation, or complete system compromise.",
  },
  {
    id: 9,
    name: "Security Logging and Monitoring Failures",
    severity: "Medium",
    description:
      "Insufficient logging and monitoring, coupled with missing or ineffective integration with incident response.",
    examples: [
      "Auditable events not logged",
      "Warnings and errors generate no logs",
      "Logs only stored locally",
      "No real-time monitoring and alerting",
    ],
    prevention: [
      "Ensure all login and access control failures can be logged",
      "Ensure logs are generated in a format easily consumed by log management solutions",
      "Establish effective monitoring and alerting",
      "Establish or adopt an incident response and recovery plan",
    ],
    impact:
      "Without logging and monitoring, breaches cannot be detected, and attackers have more time to fully compromise systems.",
  },
  {
    id: 10,
    name: "Server-Side Request Forgery (SSRF)",
    severity: "High",
    description:
      "SSRF flaws occur whenever a web application is fetching a remote resource without validating the user-supplied URL.",
    examples: [
      "Accessing internal services through localhost",
      "Reading files using file:// protocol",
      "Accessing cloud metadata services",
      "Port scanning internal networks",
    ],
    prevention: [
      "Sanitize and validate all client-supplied input data",
      "Enforce URL schema, port, and destination with positive allow lists",
      "Do not send raw responses to clients",
      "Disable HTTP redirections and implement URL consistency checks",
    ],
    impact: "Successful SSRF attacks can lead to unauthorized actions or access to data within the organization.",
  },
]

interface OWASPReferenceProps {
  className?: string
}

export function OWASPReference({ className }: OWASPReferenceProps) {
  const [expandedItems, setExpandedItems] = useState<number[]>([])

  const toggleExpanded = (id: number) => {
    setExpandedItems((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-orange-500 text-white"
      case "medium":
        return "bg-yellow-600 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <div className={className}>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            OWASP Top 10 (2021)
          </CardTitle>
          <CardDescription>Most critical web application security risks with detailed explanations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {OWASP_DETAILED.map((item) => (
              <Collapsible key={item.id} open={expandedItems.includes(item.id)}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start p-3 h-auto hover:bg-accent/50"
                    onClick={() => toggleExpanded(item.id)}
                  >
                    <div className="flex items-start gap-3 w-full">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
                        {item.id}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm leading-tight">{item.name}</h4>
                          <Badge className={getSeverityColor(item.severity)} variant="secondary">
                            {item.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">{item.description}</p>
                      </div>
                      {expandedItems.includes(item.id) ? (
                        <ChevronDown className="h-4 w-4 flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 flex-shrink-0" />
                      )}
                    </div>
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="px-3 pb-3">
                  <div className="ml-9 space-y-4 text-sm">
                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        Impact
                      </h5>
                      <p className="text-muted-foreground">{item.impact}</p>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2">Common Examples</h5>
                      <ul className="space-y-1 text-muted-foreground">
                        {item.examples.map((example, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-primary mt-1">•</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <h5 className="font-medium mb-2 flex items-center gap-1">
                        <Info className="h-3 w-3" />
                        Prevention
                      </h5>
                      <ul className="space-y-1 text-muted-foreground">
                        {item.prevention.map((prevention, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-green-600 mt-1">✓</span>
                            <span>{prevention}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
