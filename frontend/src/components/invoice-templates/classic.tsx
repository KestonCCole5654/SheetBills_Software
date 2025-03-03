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

export default function InvoiceClassic({ data }: InvoiceTemplateProps) {
  const subtotal = data.items.reduce((sum, item) => sum + item.quantity * item.price, 0)
  const tax = subtotal * 0.1 // 10% tax
  const total = subtotal + tax

  return (
    <div className="font-serif">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">INVOICE</h1>
        <p className="text-gray-600">#{data.invoiceNumber || "INV-000"}</p>
      </div>

      {/* Company & Customer Info */}
      <div className="flex justify-between mb-8">
        <div>
          <div className="font-bold mb-2">From:</div>
          <div className="text-gray-800">SheetBills Inc.</div>
          <div className="text-gray-600">123 Business Street</div>
          <div className="text-gray-600">City, State 12345</div>
        </div>
        <div className="text-right">
          <div className="font-bold mb-2">To:</div>
          <div className="text-gray-800">{data.customer.name || "Customer Name"}</div>
          <div className="text-gray-600">{data.customer.email || "customer@example.com"}</div>
          <div className="text-gray-600 whitespace-pre-line">{data.customer.address || "Customer Address"}</div>
        </div>
      </div>

      {/* Dates */}
      <div className="flex justify-between mb-8 text-sm">
        <div>
          <span className="font-bold">Invoice Date: </span>
          <span>{data.date || "Not specified"}</span>
        </div>
        <div>
          <span className="font-bold">Due Date: </span>
          <span>{data.dueDate || "Not specified"}</span>
        </div>
      </div>

      {/* Items */}
      <table className="w-full mb-8">
        <thead>
          <tr className="bg-gray-100">
            <th className="text-left p-3 border">Description</th>
            <th className="text-right p-3 border">Qty</th>
            <th className="text-right p-3 border">Price</th>
            <th className="text-right p-3 border">Amount</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((item, index) => (
            <tr key={index}>
              <td className="p-3 border">{item.description || "Item description"}</td>
              <td className="text-right p-3 border">{item.quantity}</td>
              <td className="text-right p-3 border">${item.price.toFixed(2)}</td>
              <td className="text-right p-3 border">${(item.quantity * item.price).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-8">
        <div className="w-64">
          <div className="flex justify-between py-2 border-b">
            <div>Subtotal</div>
            <div className="font-medium">${subtotal.toFixed(2)}</div>
          </div>
          <div className="flex justify-between py-2 border-b">
            <div>Tax (10%)</div>
            <div className="font-medium">${tax.toFixed(2)}</div>
          </div>
          <div className="flex justify-between py-2 text-lg font-bold">
            <div>Total</div>
            <div>${total.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {data.notes && (
        <div className="border-t pt-4">
          <div className="font-bold mb-2">Notes:</div>
          <div className="text-gray-600 whitespace-pre-line">{data.notes}</div>
        </div>
      )}
    </div>
  )
}

