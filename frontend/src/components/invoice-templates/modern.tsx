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

export default function InvoiceModern({ data }: InvoiceTemplateProps) {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <div className="font-sans">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-4xl font-bold text-primary mb-2">INVOICE</h1>
          <p className="text-gray-600">#{data.invoiceNumber || "INV-000"}</p>
        </div>
        <div className="text-right">
          <div className="font-medium">SheetBills Inc.</div>
          <div className="text-gray-600">123 Business Street</div>
          <div className="text-gray-600">City, State 12345</div>
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-8 mb-8">
        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">Date</div>
          <div className="font-medium">{data.date || "Not specified"}</div>
        </div>
        <div>
          <div className="text-sm font-medium text-gray-600 mb-1">Due Date</div>
          <div className="font-medium">{data.dueDate || "Not specified"}</div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="mb-8">
        <div className="text-sm font-medium text-gray-600 mb-2">Bill To</div>
        <div className="font-medium">{data.customer.name || "Customer Name"}</div>
        <div className="text-gray-600">{data.customer.email || "customer@example.com"}</div>
        <div className="text-gray-600 whitespace-pre-line">{data.customer.address || "Customer Address"}</div>
      </div>

      {/* Items */}
      <table className="w-full mb-8">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="text-left py-3 px-4">Description</th>
            <th className="text-right py-3 px-4">Qty</th>
            <th className="text-right py-3 px-4">Price</th>
            <th className="text-right py-3 px-4">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index} className="border-b border-gray-100">
              <td className="py-3 px-4">{item.description || "Item description"}</td>
              <td className="text-right py-3 px-4">{item.quantity}</td>
              <td className="text-right py-3 px-4">${item.price.toFixed(2)}</td>
              <td className="text-right py-3 px-4">${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2">
            <div className="text-gray-600">Subtotal</div>
            <div className="font-medium">${subtotal.toFixed(2)}</div>
          </div>
          <div className="flex justify-between py-2">
            <div className="text-gray-600">Tax (10%)</div>
            <div className="font-medium">${tax.toFixed(2)}</div>
          </div>
          <div className="flex justify-between py-2 border-t border-gray-200">
            <div className="text-lg font-medium">Total</div>
            <div className="text-lg font-bold">${total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="border-t border-gray-200 pt-4">
          <div className="text-sm font-medium text-gray-600 mb-2">Notes</div>
          <div className="text-gray-600 whitespace-pre-line">{data.notes}</div>
        </div>
      )}
    </div>
  )
}

