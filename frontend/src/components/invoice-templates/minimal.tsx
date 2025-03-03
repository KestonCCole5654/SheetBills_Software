interface InvoiceData {
  invoiceNumber: string
  date: string
  dueDate: string
  customer: {
    name: string
    email: string
    address: string
  }
  items: Array<{
    description: string
    quantity: number
    price: number
  }>
  notes: string
}

interface InvoiceTemplateProps {
  data: InvoiceData
}

export default function InvoiceMinimal({ data }: InvoiceTemplateProps) {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-12">
        <div>
          <h1 className="text-2xl font-light mb-1">INVOICE</h1>
          <p className="text-sm text-gray-600">#{data.invoiceNumber || "INV-000"}</p>
        </div>
        <div className="text-right text-sm">
          <div>SheetBills Inc.</div>
          <div className="text-gray-600">123 Business Street</div>
          <div className="text-gray-600">City, State 12345</div>
        </div>
      </div>

      {/* Customer Info & Dates */}
      <div className="grid grid-cols-2 gap-12 mb-12">
        <div>
          <div className="text-xs uppercase text-gray-600 mb-2">Bill To</div>
          <div>{data.customer.name || "Customer Name"}</div>
          <div className="text-gray-600">{data.customer.email || "customer@example.com"}</div>
          <div className="text-gray-600 whitespace-pre-line">{data.customer.address || "Customer Address"}</div>
        </div>
        <div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs uppercase text-gray-600 mb-2">Date</div>
              <div>{data.date || "Not specified"}</div>
            </div>
            <div>
              <div className="text-xs uppercase text-gray-600 mb-2">Due Date</div>
              <div>{data.dueDate || "Not specified"}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      <table className="w-full mb-12">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-normal text-gray-600">Description</th>
            <th className="text-right py-2 font-normal text-gray-600">Qty</th>
            <th className="text-right py-2 font-normal text-gray-600">Price</th>
            <th className="text-right py-2 font-normal text-gray-600">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-4">{item.description || "Item description"}</td>
              <td className="text-right py-4">{item.quantity}</td>
              <td className="text-right py-4">${item.price.toFixed(2)}</td>
              <td className="text-right py-4">${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-12">
        <div className="w-64">
          <div className="flex justify-between py-2 text-sm">
            <div className="text-gray-600">Subtotal</div>
            <div>${subtotal.toFixed(2)}</div>
          </div>
          <div className="flex justify-between py-2 text-sm">
            <div className="text-gray-600">Tax (10%)</div>
            <div>${tax.toFixed(2)}</div>
          </div>
          <div className="flex justify-between py-2 border-t">
            <div>Total</div>
            <div className="font-medium">${total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="text-sm">
          <div className="text-xs uppercase text-gray-600 mb-2">Notes</div>
          <div className="text-gray-600 whitespace-pre-line">{data.notes}</div>
        </div>
      )}
    </div>
  )
}

