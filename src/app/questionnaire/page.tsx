"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

const formSchema = z.object({
  childName: z.string().min(2, {
    message: "Child's name must be at least 2 characters.",
  }),
  childAge: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) < 18, {
    message: "Age must be a valid number between 0 and 18.",
  }),
  language: z.string({
    message: "Please select a preferred language.",
  }),
  concerns: z.string().min(10, {
    message: "Please describe your concerns in at least 10 characters.",
  }),
})

export default function QuestionnairePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      childName: "",
      childAge: "",
      concerns: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      // In a real app, send to backend here
      const response = await fetch("https://autism-backend-prod.onrender.com/api/assessments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          child_name: values.childName,
          child_age: Number(values.childAge),
          language: values.language,
          parent_concerns: values.concerns,
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        router.push(`/assessment/${data.id}`)
      } else {
        console.error("Failed to create assessment")
        router.push(`/assessment/1`)
      }
    } catch (error) {
      console.error(error)
      router.push(`/assessment/1`)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-0 max-w-2xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2 border-primary/20 shadow-lg">
          <CardHeader className="space-y-1 bg-primary/5 pb-8">
            <CardTitle className="text-3xl font-bold text-primary">Let's Understand Your Child</CardTitle>
            <CardDescription className="text-lg">
              Please provide some basic information to help our AI personalize the assessment experience.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="childName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Child's Name</FormLabel>
                      <FormControl>
                        <Input placeholder="E.g., Aryan" className="h-12 text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="childAge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Child's Age (in years)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="E.g., 3" className="h-12 text-lg" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">Preferred Language</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 text-lg">
                            <SelectValue placeholder="Select a language" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                          <SelectItem value="te">Telugu (తెలుగు)</SelectItem>
                          <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                          <SelectItem value="kn">Kannada (ಕನ್ನಡ)</SelectItem>
                          <SelectItem value="ml">Malayalam (മലയാളം)</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Our AI will interact with your child in this language.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="concerns"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold">What are your main concerns?</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="E.g., Doesn't make eye contact, delayed speech, avoids playing with others..."
                          className="min-h-[120px] text-base resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full h-14 text-lg font-bold rounded-xl"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Starting Assessment..." : "Start AI Assessment Session"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
