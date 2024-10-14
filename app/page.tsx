'use client'

import { useState, useEffect, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Image as ImageIcon, Phone, Wand2, ChevronLeft, ChevronRight, User } from 'lucide-react'

const LoginIndicator = () => (
  <div className="w-2 h-2 bg-green-500 rounded-full absolute bottom-0 right-0"></div>
)

const Popover = ({ children, content }: { children: React.ReactNode, content: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative" ref={popoverRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
          <div className="py-1">{content}</div>
        </div>
      )}
    </div>
  )
}

export default function LogoMagicPro() {
  const [logo, setLogo] = useState<File | null>(null)
  const [targetImage, setTargetImage] = useState<File | null>(null)
  const [logoPlacement, setLogoPlacement] = useState('')
  const [desiredLogo, setDesiredLogo] = useState('')
  const [result, setResult] = useState<string | null>(null)
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)

  const observerTarget = useRef(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0])
    }
  }

  const handleTargetImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTargetImage(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (logo && targetImage) {
      setResult('Processing...')
      await new Promise(resolve => setTimeout(resolve, 2000))
      setResult('Logo added successfully!')
    }
  }

  const handleCreateLogo = () => {
    // Placeholder for AI logo creation logic
    console.log('Creating logo with AI...')
  }

  const handleCallPerson = () => {
    // Placeholder for calling a person
    console.log('Calling a design expert...')
  }

  const loadMoreImages = () => {
    setLoading(true)
    // Simulating an API call to load more images
    setTimeout(() => {
      const newImages = Array(10).fill(null).map((_, i) => 
        `/placeholder.svg?height=300&width=300&text=Image ${images.length + i + 1}`
      )
      setImages(prevImages => [...prevImages, ...newImages])
      setLoading(false)
    }, 1000)
  }

  useEffect(() => {
    loadMoreImages()

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreImages()
        }
      },
      { threshold: 1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current)
      }
    }
  }, [loading])

  const nextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 2))
  }

  const prevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 0))
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <header className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2 flex justify-between items-center">
          <h1 className="text-2xl font-bold">lll. LOGOMAGIC PRO</h1>
          <Popover
            content={
              <div className="p-2">
                <div className="text-sm font-medium">Logged in as User</div>
                <Button variant="ghost" className="w-full mt-2">Logout</Button>
              </div>
            }
          >
            <Button variant="ghost" className="relative">
              <User className="h-6 w-6" />
              <LoginIndicator />
            </Button>
          </Popover>
        </div>
      </header>

      <div className="p-4">
        <div className="max-w-6xl mx-auto mb-8 flex flex-col items-center justify-center">
          <div className="w-64 h-24 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
            <img src="/3dgifmaker93156.gif" alt="LogoMagic Pro" className="w-full h-full object-cover" />
          </div>
        </div>
      
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Add My Logo</CardTitle>
              <CardDescription>Follow the steps to add your logo to an image.</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {step === 0 && (
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="logo">Upload Your Logo</Label>
                    <Input id="logo" type="file" accept="image/*,video/*,.gif" onChange={handleLogoUpload} />
                  </div>
                )}
                {step === 1 && (
                  <div className="grid w-full items-center gap-1.5">
                    <Label htmlFor="target-image">Upload Target Image</Label>
                    <Input id="target-image" type="file" onChange={handleTargetImageUpload} />
                  </div>
                )}
                {step === 2 && (
                  <>
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="logo-placement">Logo Placement Description</Label>
                      <Textarea 
                        id="logo-placement" 
                        placeholder="Describe in detail how you want to add your logo (e.g., top-left corner, 20% opacity, 100px width)"
                        value={logoPlacement}
                        onChange={(e) => setLogoPlacement(e.target.value)}
                      />
                    </div>
                    <Button type="submit" disabled={!logo || !targetImage || !logoPlacement}>
                      <Upload className="mr-2 h-4 w-4" /> Add Logo
                    </Button>
                  </>
                )}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={prevStep} disabled={step === 0} variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              <Button onClick={nextStep} disabled={step === 2 || (step === 0 && !logo) || (step === 1 && !targetImage)}>
                {step === 2 ? 'Finish' : 'Next'} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>

        <div className="mt-8 max-w-6xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Before and After Comparison</CardTitle>
              <CardDescription>See the difference your logo makes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Before</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src="/before-1.jpg" alt="Before 1" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">After</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src="/after-1.jpg" alt="After 1" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before and After Comparison</CardTitle>
              <CardDescription>See the difference your logo makes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Before</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src="/before-2.jpg" alt="Before 2" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">After</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src="/after-2.jpg" alt="After 2" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before and After Comparison</CardTitle>
              <CardDescription>See the difference your logo makes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Before</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src="/before-3.jpg" alt="Before 3" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">After</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src="/after-3.jpg" alt="After 3" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before and After Comparison</CardTitle>
              <CardDescription>See the difference your logo makes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Before</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src="/before-4.jpg" alt="Before 4" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">After</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src="/after-4.jpg" alt="After 4" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Before and After Comparison</CardTitle>
              <CardDescription>See the difference your logo makes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">Before</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src="/before-5.jpg" alt="Before 5" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">After</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <img src="/after-5.jpg" alt="After 5" className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">Inspiration Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((src, index) => (
              <div key={index} className="aspect-square">
                <img src={src} alt={`Inspiration ${index + 1}`} className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
          <div ref={observerTarget} className="h-10 flex items-center justify-center">
            {loading && <p>Loading more...</p>}
          </div>
        </div>
      </div>
    </div>
  )
}