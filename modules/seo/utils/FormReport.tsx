
import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@heroui/react"
import { Input } from "@heroui/react"

import { Card, CardContent } from "@/components/ui/card"
import {  Modal,  ModalContent,  ModalHeader,  ModalBody,  ModalFooter} from "@heroui/modal";
import { X, Upload } from "lucide-react"

// Exportamos la interfaz CompanyInfo
export interface CompanyInfo {
  logo: string | null
  name: string
  contactEmail: string
  contactPhone: string
  website: string
}

// Actualizamos la interfaz ReportFormProps para incluir trigger
export interface ReportFormProps {
  onSubmit: (companyInfo: CompanyInfo) => void
  isLoading: boolean
  trigger?: React.ReactNode
}

export default function ReportForm({ onSubmit, isLoading }: ReportFormProps) {
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    logo: null,
    name: "",
    contactEmail: "",
    contactPhone: "",
    website: "",
  })
  const [open, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (event.target?.result) {
          setCompanyInfo({
            ...companyInfo,
            logo: event.target.result as string,
          })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(companyInfo)
    setOpen(false)
  }

  const handleRemoveLogo = () => {
    setCompanyInfo({
      ...companyInfo,
      logo: null,
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }
  return (
    <>
      <Button
           className="fixed bottom-4 right-4 flex items-center gap-2 z-50 bg-green-500 hover:bg-green-600 text-white"
           color="primary"
        onClick={() => setOpen(true)}
      >
        Download PDF
      </Button>

      <Modal isOpen={open} onOpenChange={setOpen}>
        <ModalContent className="sm:max-w-[500px]">
          <ModalHeader>
            <h2 className="text-2xl font-bold text-center">Customize Your Report</h2>
          </ModalHeader>

          <ModalBody>
            <form onSubmit={handleSubmit} className="space-y-6 py-4">
              <div className="space-y-2">
                <label htmlFor="logo" className="text-base font-medium">
                  Company Logo
                </label>
                <div className="flex flex-col items-center justify-center gap-4">
                  {companyInfo.logo ? (
                    <div className="relative w-40 h-40 border rounded-md overflow-hidden">
                      <Image
                        src={companyInfo.logo || "/placeholder.svg"}
                        alt="Company logo"
                        fill
                        className="object-contain"
                      />
                      <Button
                        type="button"
                        variant="solid"
                        size="sm"
                        className="absolute top-2 right-2 h-6 w-6"
                        onClick={handleRemoveLogo}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Card className="w-full cursor-pointer hover:bg-muted/50 transition-colors">
                      <CardContent
                        className="flex flex-col items-center justify-center py-6"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground text-center">
                          Click to upload your logo
                          <br />
                          <span className="text-xs">SVG, PNG, JPG (max. 2MB)</span>
                        </p>
                      </CardContent>
                    </Card>
                  )}
                  <input
                    ref={fileInputRef}
                    id="logo"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="name" className="text-base font-medium">
                  Company Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={companyInfo.name}
                  onChange={handleChange}
                  placeholder="Enter your company name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="contactEmail" className="text-base font-medium">
                    Email
                  </label>
                  <Input
                    id="contactEmail"
                    name="contactEmail"
                    type="email"
                    value={companyInfo.contactEmail}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="contactPhone" className="text-base font-medium">
                    Phone
                  </label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    value={companyInfo.contactPhone}
                    onChange={handleChange}
                    placeholder="+1 (234) 567-8900"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="website" className="text-base font-medium">
                  Website
                </label>
                <Input
                  id="website"
                  name="website"
                  value={companyInfo.website}
                  onChange={handleChange}
                  placeholder="www.yourcompany.com"
                />
              </div>
            </form>
          </ModalBody>

          <ModalFooter className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="solid" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

