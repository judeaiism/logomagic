'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, User, ChevronLeft, ChevronRight } from 'lucide-react'

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
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState(0)
  const [isDialogOpen, setIsDialogOpen] = useState(false) // New state for dialog visibility
  const [isPurchaseDialogOpen, setIsPurchaseDialogOpen] = useState(false) // New state for purchase dialog visibility
  const [userEmail, setUserEmail] = useState(''); // New state for user email
  const [userName, setUserName] = useState(''); // New state for user name
  const [isUserInfoDialogOpen, setIsUserInfoDialogOpen] = useState(false); // New state for user info dialog visibility

  const observerTarget = useRef(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLogo(e.target.files[0])
      nextStep(); // Move to the next step after logo upload
    }
  }

  const handleTargetImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setTargetImage(e.target.files[0])
      nextStep(); // Move to the next step after target image upload
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (logo && targetImage) {
        setIsDialogOpen(true) // Open the dialog when the button is clicked
    }
  }

  // Update handleDialogConfirm to open the user info dialog
  const handleDialogConfirm = async () => {
    setIsDialogOpen(false); // Close the initial dialog
    setIsUserInfoDialogOpen(true); // Open the user info dialog
  }

  // New function to handle user info dialog confirmation
  const handleUserInfoDialogConfirm = () => {
    // Check if both email and name are provided
    if (userEmail.trim() === '' || userName.trim() === '') {
      alert("Please fill in both your email address and name."); // Alert if fields are empty
      return; // Prevent closing the dialog
    }
    setIsUserInfoDialogOpen(false); // Close the user info dialog
    setIsPurchaseDialogOpen(true); // Open the purchase dialog
  }

  // New function to handle dialog cancellation
  const handleDialogCancel = () => {
    setIsDialogOpen(false) // Close the dialog
  }

  const loadMoreImages = useCallback(() => {
    setLoading(true)
    // Simulating an API call to load more images
    setTimeout(() => {
      const newImages = Array(10).fill(null).map((_, i) => 
        `/placeholder.svg?height=300&width=300&text=Image ${images.length + i + 1}`
      )
      setImages(prevImages => [...prevImages, ...newImages])
      setLoading(false)
    }, 1000)
  }, [images]) // Add images as a dependency

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreImages(); // Call loadMoreImages only when the observer detects intersection
        }
      },
      { threshold: 1 }
    );

    const currentObserverTarget = observerTarget.current;

    if (currentObserverTarget) {
      observer.observe(currentObserverTarget);
    }

    return () => {
      if (currentObserverTarget) {
        observer.unobserve(currentObserverTarget);
      }
    };
  }, [loading]); // Only depend on loading, not loadMoreImages

  const nextStep = () => {
    setStep((prevStep) => Math.min(prevStep + 1, 2))
  }

  const prevStep = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 0))
  }

  // New function to handle clicks outside the dialogs
  const handleClickOutside = (event: MouseEvent) => {
    const dialog1 = document.getElementById('initial-dialog');
    const dialog2 = document.getElementById('purchase-dialog');
    
    if (
      (dialog1 && !dialog1.contains(event.target as Node)) &&
      (dialog2 && !dialog2.contains(event.target as Node))
    ) {
      setIsDialogOpen(false);
      setIsPurchaseDialogOpen(false);
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200">
      <div className="p-4">
        <div className="max-w-6xl mx-auto mb-8 flex flex-col items-center justify-center">
          <div className="w-64 h-24 bg-primary rounded-lg flex items-center justify-center overflow-hidden">
            <Image
              src="/3dgifmaker93156.gif"
              alt="LogoMagic Pro"
              width={256}
              height={96}
              className="w-full h-full object-cover"
              priority // Added priority property
            />
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
                <div className={`p-4 rounded ${step === 0 ? 'bg-blue-100' : step === 1 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {step === 0 && (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="logo">Upload Your Logo</Label>
                      <Input id="logo" type="file" accept="image/*,video/*,.gif" onChange={handleLogoUpload} />
                    </div>
                  )}
                </div>
                <div className={`p-4 rounded ${step === 1 ? 'bg-blue-100' : step === 2 ? 'bg-green-100' : 'bg-yellow-100'}`}>
                  {step === 1 && (
                    <div className="grid w-full items-center gap-1.5">
                      <Label htmlFor="target-image">Upload Target Image</Label>
                      <Input id="target-image" type="file" onChange={handleTargetImageUpload} />
                    </div>
                  )}
                </div>
                <div className={`p-4 rounded ${step === 2 ? 'bg-blue-100' : step === 0 ? 'bg-green-100' : 'bg-yellow-100'}`}>
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
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={prevStep} disabled={step === 0} variant="outline">
                <ChevronLeft className="mr-2 h-4 w-4" /> Previous
              </Button>
              {/* Removed the Finish button from here */}
              {/* <Button onClick={nextStep} disabled={step === 2 || (step === 0 && !logo) || (step === 1 && !targetImage)}>
                {step === 2 ? 'Finish' : 'Next'} <ChevronRight className="ml-2 h-4 w-4" />
              </Button> */}
              {/* Leaving empty space */}
              <div className="w-16"></div> {/* Adjust width as needed */}
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
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'red' }}>Before</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <Image src="/before-4.jpg" alt="Before 4" width={640} height={360} className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'green' }}>After</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <Image src="/after-4.jpg" alt="After 4" width={640} height={360} className="w-full h-auto object-contain rounded-lg" />
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
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'red' }}>Before</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <Image src="/before-5.jpg" alt="Before 5" width={640} height={360} className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: 'green' }}>After</h3>
                  <div className="aspect-w-16 aspect-h-9">
                    <Image src="/after-5.jpg" alt="After 5" width={640} height={360} className="w-full h-auto object-contain rounded-lg" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12">
          {/* Removed the Inspiration Gallery section */}
          {/* <h2 className="text-2xl font-bold text-center mb-6">Inspiration Gallery</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((src, index) => (
              <div key={index} className="aspect-square">
                <Image src={src} alt={`Inspiration ${index + 1}`} width={300} height={300} className="w-full h-full object-cover rounded-lg" />
              </div>
            ))}
          </div>
          <div ref={observerTarget} className="h-10 flex items-center justify-center">
            {loading && <p>Loading more...</p>}
          </div> */}
        </div>
      </div>
      {isDialogOpen && ( // Render the initial dialog conditionally
        <div id="initial-dialog" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">This generation will cost 1 credit.</h2>
            <p>Are you ready to proceed?</p>
            <div className="flex justify-end mt-4">
              <Button onClick={handleDialogConfirm}>I am ready</Button>
            </div>
          </div>
        </div>
      )}

      {isUserInfoDialogOpen && ( // Render the user info dialog conditionally
        <div id="user-info-dialog" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">Please provide your information</h2>
            <div className="space-y-4">
              <Input 
                type="email" 
                placeholder="Email Address" 
                value={userEmail} 
                onChange={(e) => setUserEmail(e.target.value)} 
              />
              <Input 
                type="text" 
                placeholder="Your Name" 
                value={userName} 
                onChange={(e) => setUserName(e.target.value)} 
              />
            </div>
            <div className="flex justify-end mt-4">
              <Button onClick={handleUserInfoDialogConfirm}>Submit</Button>
            </div>
          </div>
        </div>
      )}

      {isPurchaseDialogOpen && ( // Render the purchase dialog conditionally
        <div id="purchase-dialog" className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 rounded shadow-lg">
            <h2 className="text-lg font-bold">Purchase Credits</h2>
            <div className="flex justify-center my-4">
              <Image src="/paypal.png" alt="PayPal" width={200} height={100} />
            </div>
            <Button 
              onClick={() => window.open('https://www.paypal.com/invoice/p/#INV2-FRRR-L3HH-M6YY-3UTP', '_blank')}
              className="w-full mt-4"
            >
              Buy Now
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}