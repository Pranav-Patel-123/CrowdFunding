"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ethers } from "ethers"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { CalendarIcon, ChevronRight, ExternalLink, FileText, Globe, Loader2, Twitter } from "lucide-react"
import { format } from "date-fns"

import { useStateContext } from "@/context"
import { checkIfImage } from "../../../utils"
import { Button } from "../../../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../../../components/ui/form"
import { Input } from "../../../components/ui/input"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { Calendar } from "../../../components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "../../../components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "../../../components/ui/alert"
import { AlertCircle } from "lucide-react"

// Create schema for form validation
const campaignSchema = z.object({
  title: z
    .string()
    .min(5, { message: "Campaign name must be at least 5 characters" })
    .max(100, { message: "Campaign name must be less than 100 characters" }),
  description: z.string().min(20, { message: "Description must be at least 20 characters" }),
  target: z
    .string()
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, { message: "Target must be a positive number" }),
  deadline: z.date().refine((date) => date > new Date(), { message: "Deadline must be in the future" }),
  image: z.string().url({ message: "Please enter a valid URL" }),
  category: z.string().min(1, { message: "Please select a category" }),
  website: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  twitter: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  linkedin: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
  documentLink: z.string().url({ message: "Please enter a valid URL" }).optional().or(z.literal("")),
})

export default function CreateCampaign() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("basic")
  const [imageError, setImageError] = useState("")
  const [submitError, setSubmitError] = useState("")
  const { createCampaign, getCategories } = useStateContext()
  const [categories, setCategories] = useState([])

  // Initialize form with react-hook-form and zod validation
  const form = useForm({
    resolver: zodResolver(campaignSchema),
    defaultValues: {
      title: "",
      description: "",
      target: "",
      deadline: undefined,
      image: "",
      category: "",
      website: "",
      twitter: "",
      linkedin: "",
      documentLink: "",
    },
  })

  // Get categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const fetchedCategories = await getCategories()
        setCategories(fetchedCategories)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }

    fetchCategories()
  }, [getCategories])

  // Handle form submission
  const onSubmit = async (data) => {
    setSubmitError("")
    setImageError("")

    // Validate image URL
    try {
      setIsLoading(true)

      // Check if image URL is valid
      const isValidImage = await new Promise((resolve) => checkIfImage(data.image, resolve))
      if (!isValidImage) {
        setImageError("The provided image URL is invalid or inaccessible")
        setIsLoading(false)
        return
      }

      // Create campaign on-chain
      const campaignId = await createCampaign({
        ...data,
        target: ethers.utils.parseUnits(data.target, 18),
        deadline: data.deadline.toISOString().split("T")[0],
      })

      console.log("New campaign created with ID:", campaignId)
      router.push("/")
    } catch (error) {
      console.error("Error creating campaign:", error)
      setSubmitError(error?.message || "Failed to create campaign. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Navigate between form tabs
  const navigateToTab = (tab) => {
    // Only navigate if current tab is valid
    if (tab === "social") {
      const basicFields = ["title", "description", "target", "deadline", "image", "category"]
      const isBasicValid = basicFields.every((field) => !form.formState.errors[field])

      if (isBasicValid) {
        setActiveTab(tab)
      } else {
        // Trigger validation to show errors
        form.trigger(basicFields)
      }
    } else {
      setActiveTab(tab)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Card className="bg-gray-800/80 border-gray-700 shadow-xl">
          <CardHeader className="border-b border-gray-700 bg-gray-800/50">
            <CardTitle className="text-2xl font-bold text-white">Launch Your Campaign</CardTitle>
            <CardDescription className="text-gray-300">
              Fill in the details below to create your fundraising campaign
            </CardDescription>
          </CardHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <div className="px-6 pt-6">
                  <TabsList className="grid grid-cols-2 bg-gray-700/50">
                    <TabsTrigger value="basic" className="data-[state=active]:bg-purple-600">
                      Basic Information
                    </TabsTrigger>
                    <TabsTrigger value="social" className="data-[state=active]:bg-purple-600">
                      Social & Documents
                    </TabsTrigger>
                  </TabsList>
                </div>

                <CardContent className="p-6">
                  {submitError && (
                    <Alert variant="destructive" className="mb-6 bg-red-900/20 border-red-800 text-red-200">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}

                  <TabsContent value="basic" className="space-y-6 mt-0">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Campaign Name *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter a catchy name for your campaign"
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Description *</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell your story and explain why people should support your campaign"
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white min-h-32 resize-y"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Minimum 20 characters. Be detailed and compelling.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="target"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white">Funding Goal (ETH) *</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                min="0.01"
                                placeholder="e.g., 0.75"
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deadline"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel className="text-white">End Date *</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant="outline"
                                    className={`w-full bg-gray-700 border-gray-600 text-white ${!field.value ? "text-gray-400" : ""}`}
                                  >
                                    {field.value ? format(field.value, "PPP") : <span>Select a date</span>}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0 bg-gray-800 border-gray-700" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date() || date < new Date("1900-01-01")}
                                  initialFocus
                                  className="bg-gray-800 text-white"
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription className="text-gray-400">
                              Campaign end date must be in the future
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Campaign Image URL *</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="https://example.com/image.jpg"
                              {...field}
                              className="bg-gray-700 border-gray-600 text-white"
                            />
                          </FormControl>
                          <FormDescription className="text-gray-400">
                            Provide a URL to an image that represents your campaign
                          </FormDescription>
                          {imageError && <p className="text-red-400 text-sm mt-1">{imageError}</p>}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white">Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-gray-800 border-gray-700 text-white">
                              {categories.length === 0 ? (
                                <SelectItem value="loading" disabled>
                                  Loading categories...
                                </SelectItem>
                              ) : (
                                categories.map((category, index) => (
                                  <SelectItem key={index} value={category}>
                                    {category}
                                  </SelectItem>
                                ))
                              )}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        onClick={() => navigateToTab("social")}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        Next Step
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-6 mt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white flex items-center gap-2">
                              <Globe className="h-4 w-4" />
                              Website URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://your-website.com"
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="twitter"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white flex items-center gap-2">
                              <Twitter className="h-4 w-4" />
                              Twitter URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://twitter.com/username"
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="linkedin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white flex items-center gap-2">
                              <ExternalLink className="h-4 w-4" />
                              LinkedIn URL
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://linkedin.com/in/username"
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="documentLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-white flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Document Link (PDF)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="https://example.com/document.pdf"
                                {...field}
                                className="bg-gray-700 border-gray-600 text-white"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-between">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setActiveTab("basic")}
                        className="border-gray-600 text-white hover:bg-gray-700"
                      >
                        Back
                      </Button>

                      <Button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          "Create Campaign"
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </CardContent>
              </Tabs>
            </form>
          </Form>

          <CardFooter className="border-t border-gray-700 bg-gray-800/50 px-6 py-4">
            <p className="text-gray-400 text-sm">
              * Required fields. All campaigns are subject to review before being published.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
