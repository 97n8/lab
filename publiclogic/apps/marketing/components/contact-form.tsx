"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CheckCircle2 } from "lucide-react"

const CONTACT_EMAIL = "hello@publiclogic.org"

export function ContactForm() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = (formData.get("name") as string) || ""
    const email = (formData.get("email") as string) || ""
    const organization = (formData.get("organization") as string) || ""
    const message = (formData.get("message") as string) || ""

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      organization ? `Organization: ${organization}` : null,
      "",
      message,
    ]
      .filter((line) => line !== null)
      .join("\n")

    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      "Hello from the PublicLogic site",
    )}&body=${encodeURIComponent(body)}`

    setSent(true)
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-border bg-secondary/60 p-8 text-center">
        <div className="mb-4 flex justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
            <CheckCircle2 className="h-8 w-8 text-accent" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-primary">Your email app should be open</h3>
        <p className="mt-2 text-muted-foreground">
          We drafted a message to {CONTACT_EMAIL} with your details — send it whenever you&rsquo;re ready.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-6 sm:p-8">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="contactName">Name *</Label>
          <Input id="contactName" name="name" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Email *</Label>
          <Input id="contactEmail" name="email" type="email" required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactOrganization">Organization</Label>
          <Input id="contactOrganization" name="organization" placeholder="Town, company, or project" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactMessage">Message *</Label>
          <Textarea id="contactMessage" name="message" rows={5} required />
        </div>

        <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          Send message
        </Button>

        <p className="text-center text-xs leading-relaxed text-muted-foreground">
          This opens your email client with the message pre-filled. Prefer to write directly? Reach us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </form>
  )
}
