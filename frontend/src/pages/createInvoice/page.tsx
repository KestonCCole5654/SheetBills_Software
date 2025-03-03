"use client"

import React from 'react';
import { useState } from "react"
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { ArrowLeft, Check } from "lucide-react"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Tabs, TabsContent, TabsTrigger, TabsList } from "../../components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../components/ui/command"
import InvoiceModern from "../../components/invoice-templates/modern"
import InvoiceClassic from "../../components/invoice-templates/classic"
import InvoiceMinimal from "../../components/invoice-templates/minimal"

// Mock customers data
const customers = [
  { id: 1, name: "Acme Corp", email: "billing@acme.com" },
  { id: 2, name: "TechStart Inc", email: "accounts@techstart.com" },
  { id: 3, name: "Global Solutions", email: "finance@globalsolutions.com" },
  { id: 4, name: "Digital Ventures", email: "ap@digitalventures.com" },
  { id: 5, name: "InnovateTech", email: "payments@innovatetech.com" },
]

// Define proper types for the invoice data
interface InvoiceItem {
  description: string;
  quantity: number;
  price: number;
}

interface CustomerInfo {
  name: string;
  email: string;
  address: string;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  customer: CustomerInfo;
  items: InvoiceItem[];
  notes: string;
}

export default function CreateInvoice() {
  const navigate = useNavigate();
  const [selectedCustomer, setSelectedCustomer] = useState<(typeof customers)[0] | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: "",
    date: new Date().toISOString().split("T")[0],
    dueDate: "",
    customer: {
      name: "",
      email: "",
      address: "",
    },
    items: [
      {
        description: "",
        quantity: 1,
        price: 0,
      },
    ],
    notes: "",
  })

  const handleInputChange = (field: string, value: string) => {
    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      
      setInvoiceData((prev) => {
        if (parent === 'customer') {
          return {
            ...prev,
            customer: {
              ...prev.customer,
              [child]: value,
            },
          }
        }
        
        // Handle other nested objects if needed
        return prev;
      })
    } else {
      setInvoiceData((prev) => ({
        ...prev,
        [field]: value,
      }))
    }
  }

  const handleSaveAndSend = () => {
    setIsDialogOpen(true)
  }

  const handleConfirmSend = () => {
    if (selectedCustomer) {
      // Here you would implement the actual save and send functionality
      console.log("Sending invoice to:", selectedCustomer)
      setIsDialogOpen(false)
      navigate("/") // Navigate back to dashboard after sending
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            <Button variant="ghost" size="icon" className="mr-4" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-lg font-semibold">Create New Invoice</h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Invoice Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="invoiceNumber">Invoice Number</Label>
                    <Input
                      id="invoiceNumber"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                      placeholder="INV-001"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date">Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Customer Information</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Customer Name</Label>
                  <Input
                    id="customerName"
                    value={invoiceData.customer.name}
                    onChange={(e) => handleInputChange("customer.name", e.target.value)}
                    placeholder="Enter customer name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={invoiceData.customer.email}
                    onChange={(e) => handleInputChange("customer.email", e.target.value)}
                    placeholder="customer@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerAddress">Customer Address</Label>
                  <Textarea
                    id="customerAddress"
                    value={invoiceData.customer.address}
                    onChange={(e) => handleInputChange("customer.address", e.target.value)}
                    placeholder="Enter customer address"
                    rows={3}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Invoice Items</h2>
              <div className="space-y-4">
                {invoiceData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-4">
                    <div className="col-span-6">
                      <Label htmlFor={`item-${index}-description`}>Description</Label>
                      <Input
                        id={`item-${index}-description`}
                        value={item.description}
                        onChange={(e) =>
                          setInvoiceData((prev) => ({
                            ...prev,
                            items: prev.items.map((i, idx) =>
                              idx === index ? { ...i, description: e.target.value } : i,
                            ),
                          }))
                        }
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`item-${index}-quantity`}>Quantity</Label>
                      <Input
                        id={`item-${index}-quantity`}
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          setInvoiceData((prev) => ({
                            ...prev,
                            items: prev.items.map((i, idx) =>
                              idx === index ? { ...i, quantity: Number.parseInt(e.target.value) } : i,
                            ),
                          }))
                        }
                      />
                    </div>
                    <div className="col-span-3">
                      <Label htmlFor={`item-${index}-price`}>Price</Label>
                      <Input
                        id={`item-${index}-price`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.price}
                        onChange={(e) =>
                          setInvoiceData((prev) => ({
                            ...prev,
                            items: prev.items.map((i, idx) =>
                              idx === index ? { ...i, price: Number.parseFloat(e.target.value) } : i,
                            ),
                          }))
                        }
                      />
                    </div>
                  </div>
                ))}
                <Button
                  variant="outline"
                  onClick={() =>
                    setInvoiceData((prev) => ({
                      ...prev,
                      items: [...prev.items, { description: "", quantity: 1, price: 0 }],
                    }))
                  }
                >
                  Add Item
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold mb-4">Additional Notes</h2>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  value={invoiceData.notes}
                  onChange={(e) => handleInputChange("notes", e.target.value)}
                  placeholder="Add any additional notes"
                  rows={4}
                />
              </div>
            </Card>
          </div>

          {/* Preview Section */}
          <div className="space-y-6">
            <Card className="p-4 md:p-6">
              <Tabs defaultValue="modern" className="w-full">
                {/* Main Preview Area */}
                <div className="mb-6">
                  <div className="bg-white border rounded-lg overflow-auto max-h-[calc(100vh-300px)] md:max-h-[800px]">
                    <div className="min-w-[600px] md:min-w-full">
                      {" "}
                      {/* Minimum width for mobile scroll */}
                      <TabsContent value="modern">
                        <div className="p-4 md:p-6">
                          <InvoiceModern data={invoiceData} />
                        </div>
                      </TabsContent>
                      <TabsContent value="classic">
                        <div className="p-4 md:p-6">
                          <InvoiceClassic data={invoiceData} />
                        </div>
                      </TabsContent>
                      <TabsContent value="minimal">
                        <div className="p-4 md:p-6">
                          <InvoiceMinimal data={invoiceData} />
                        </div>
                      </TabsContent>
                    </div>
                  </div>
                </div>

                {/* Template Selection */}
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-600">Choose Template</h3>
                  </div>
                  <div className="relative">
                    <TabsList className="flex overflow-x-auto pb-4 gap-4 h-auto space-x-0">
                      <TabsTrigger value="modern" className="flex-none data-[state=active]:border-primary">
                        <div className="w-[200px] aspect-[3/4] rounded-lg border bg-white p-4 hover:border-primary transition-colors">
                          <div className="w-full h-full relative">
                            <div className="absolute inset-0 bg-white">
                              <div className="h-4 w-1/2 bg-primary/10 mb-2" />
                              <div className="space-y-1">
                                <div className="h-2 w-1/3 bg-gray-200" />
                                <div className="h-2 w-1/4 bg-gray-200" />
                              </div>
                              <div className="mt-4 pt-4 border-t">
                                <div className="grid grid-cols-4 gap-2">
                                  {[...Array(8)].map((_, i) => (
                                    <div key={i} className="h-2 bg-gray-100" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className="mt-2 block text-center text-sm">Modern</span>
                        </div>
                      </TabsTrigger>

                      <TabsTrigger value="classic" className="flex-none data-[state=active]:border-primary">
                        <div className="w-[200px] aspect-[3/4] rounded-lg border bg-white p-4 hover:border-primary transition-colors">
                          <div className="w-full h-full relative">
                            <div className="absolute inset-0 bg-white">
                              <div className="h-4 w-full bg-gray-100 mb-2" />
                              <div className="grid grid-cols-2 gap-2 p-2">
                                <div className="space-y-1">
                                  <div className="h-2 w-full bg-gray-200" />
                                  <div className="h-2 w-2/3 bg-gray-200" />
                                </div>
                                <div className="space-y-1">
                                  <div className="h-2 w-full bg-gray-200" />
                                  <div className="h-2 w-2/3 bg-gray-200" />
                                </div>
                              </div>
                              <div className="mt-4 border">
                                <div className="h-6 bg-gray-50 border-b" />
                                <div className="p-2 space-y-2">
                                  {[...Array(3)].map((_, i) => (
                                    <div key={i} className="h-2 bg-gray-100" />
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                          <span className="mt-2 block text-center text-sm">Classic</span>
                        </div>
                      </TabsTrigger>

                      <TabsTrigger value="minimal" className="flex-none data-[state=active]:border-primary">
                        <div className="w-[200px] aspect-[3/4] rounded-lg border bg-white p-4 hover:border-primary transition-colors">
                          <div className="w-full h-full relative">
                            <div className="absolute inset-0 bg-white">
                              <div className="flex justify-between items-start mb-4">
                                <div className="h-6 w-1/4 bg-gray-50" />
                                <div className="h-4 w-1/3 bg-gray-50" />
                              </div>
                              <div className="space-y-4">
                                <div className="h-2 w-1/2 bg-gray-100" />
                                <div className="h-2 w-1/3 bg-gray-100" />
                              </div>
                              <div className="mt-6 space-y-2">
                                {[...Array(4)].map((_, i) => (
                                  <div key={i} className="h-2 bg-gray-50" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <span className="mt-2 block text-center text-sm">Minimal</span>
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </div>
                </div>
              </Tabs>
            </Card>

            <div className="flex justify-end gap-4 sticky bottom-4 bg-gray-50 p-4 md:relative md:bg-transparent md:p-0">
              <Button variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={handleSaveAndSend}>Save & Send</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Send Invoice</DialogTitle>
                    <DialogDescription>Choose a customer to send this invoice to.</DialogDescription>
                  </DialogHeader>
                  <div className="flex flex-col gap-4">
                    <Command className="rounded-lg border shadow-md">
                      <CommandInput placeholder="Search customers..." />
                      <CommandList>
                        <CommandEmpty>No customer found.</CommandEmpty>
                        <CommandGroup className="max-h-60 overflow-auto">
                          {customers.map((customer) => (
                            <CommandItem
                              key={customer.id}
                              onSelect={() => setSelectedCustomer(customer)}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p>{customer.name}</p>
                                <p className="text-sm text-gray-500">{customer.email}</p>
                              </div>
                              {selectedCustomer?.id === customer.id && <Check className="h-4 w-4" />}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                    <Button onClick={handleConfirmSend} disabled={!selectedCustomer}>
                      Send Invoice
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}