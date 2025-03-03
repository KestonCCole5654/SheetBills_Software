import { useEffect, useState } from "react";
import { Search, Trash2, Edit, Eye, MoreVertical, FileSpreadsheet, AlertCircle } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Define interface for invoice data based on the transformed backend response
interface Invoice {
  id: string;
  date: string;
  status: "Paid" | "Pending" | string;
  amount: number;
  customer: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  // State to store fetched invoices and loading/error states
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [spreadsheets, setSpreadsheets] = useState<any[]>([]);
  const [selectedSpreadsheetId, setSelectedSpreadsheetId] = useState<string | null>(null);

  // Create a new spreadsheet
  const createNewSheetBill = async (event: React.MouseEvent<HTMLButtonElement>, name?: string) => {
    event.preventDefault();
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/sheets/spreadsheets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || `SheetBills Invoice ${new Date().toLocaleDateString()}`,
        }),
     
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create SheetBills spreadsheet");
      }

      const newSheet = await response.json();
      setSpreadsheets((prev) => [...prev, newSheet]);
      setSelectedSpreadsheetId(newSheet.spreadsheetId);
    } catch (err) {
      // Handle the 'unknown' type error
      if (err instanceof Error) {
        console.error("Error creating SheetBills:", err);
        setError(err.message || "Failed to create SheetBills spreadsheet. Please try again.");
      } else {
        console.error("An unknown error occurred:", err);
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  

  // Fetch available spreadsheets
  const fetchSpreadsheets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("http://localhost:5000/api/sheets/spreadsheets", {
      
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch spreadsheets");
      }

      const data = await response.json();
      setSpreadsheets(data.spreadsheets);

      // Select the first spreadsheet if none is selected
      if (data.spreadsheets.length > 0 && !selectedSpreadsheetId) {
        setSelectedSpreadsheetId(data.spreadsheets[0].id);
      }
    } catch (err) {
      // Handle the 'unknown' type error
      if (err instanceof Error) {
        console.error("Error fetching spreadsheets:", err);
        setError(err.message || "Failed to fetch spreadsheets. Please try again.");
      } else {
        console.error("An unknown error occurred:", err);
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  // Fetch invoices from a specific spreadsheet
  const fetchInvoices = async (spreadsheetId: string) => {
    setIsLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const response = await fetch(`http://localhost:5000/api/sheets/data/${spreadsheetId}`, {
       
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch data");
      }

      const formattedData = await response.json();
      setInvoices(formattedData);

      // Add minimum loading time of 2.5 seconds
      const elapsedTime = Date.now() - startTime;
      const remainingDelay = Math.max(0, 2500 - elapsedTime);
      await new Promise((resolve) => setTimeout(resolve, remainingDelay));
    } catch (err) {
      // Handle the 'unknown' type error
      if (err instanceof Error) {
        console.error("Error fetching invoices:", err);
        setError(err.message || "Failed to fetch invoices");
      } else {
        console.error("An unknown error occurred:", err);
        setError("An unknown error occurred. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };


  useEffect(() => {
    fetchSpreadsheets();
  }, []);

  useEffect(() => {
    if (selectedSpreadsheetId) {
      fetchInvoices(selectedSpreadsheetId);
    }
  }, [selectedSpreadsheetId]);

  // Calculate statistics
  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((inv) => inv.status === "Paid").length;
  const pendingInvoices = invoices.filter((inv) => inv.status === "Pending").length;
  const totalAmount = invoices.reduce((sum, inv) => sum + inv.amount, 0);

  // Render empty or error state
  const renderEmptyOrError = () => {
    if (error) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-16 w-16 text-yellow-500 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Failed to Load Invoices</h3>
          <p className="text-gray-500 mb-4 max-w-md">{error}</p>
          <Button onClick={(e) => createNewSheetBill(e)} className="bg-green-600 hover:bg-green-700">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Create SheetBills Spreadsheet
          </Button>
        </div>
      );
    }

    if (!isLoading && invoices.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <FileSpreadsheet className="h-16 w-16 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Invoices Found</h3>
          <p className="text-gray-500 mb-4 max-w-md">
            Get started by creating your first SheetBills spreadsheet to manage your invoices.
          </p>
          <Button onClick={(e) => createNewSheetBill(e)} className="bg-green-600 hover:bg-green-700">
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Create SheetBills Spreadsheet
          </Button>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold mb-2">
          Welcome Back <span className="ml-1 text-green-700">{user?.name}</span>
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          SheetBills Your Easy To Use Invoice Platform, Integrating Google Sheets To Better Manage And Understand Your
          Invoices
        </p>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-gray-600 text-sm mb-2">Invoices Generated</h3>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold">{totalInvoices}</p>
          )}
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-gray-600 text-sm mb-2">Paid Invoice</h3>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold">{paidInvoices}</p>
          )}
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-gray-600 text-sm mb-2">Pending Invoice</h3>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold">{pendingInvoices}</p>
          )}
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-gray-600 text-sm mb-2">Invoices Total</h3>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold">${totalAmount.toLocaleString()}</p>
          )}
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="text-gray-600 text-sm mb-2">Customers</h3>
          {isLoading ? (
            <div className="h-8 w-16 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="text-2xl font-bold">{invoices.length}</p>
          )}
        </div>
      </div>

      {/* Invoices Section */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Invoices</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
            <Input type="search" placeholder="Search Invoices" className="pl-8 w-full md:w-[250px]" />
          </div>
          <Button size="icon" className="h-10 w-10" onClick={() => navigate("/createInvoices/page")}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-plus"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            <span className="sr-only">Create Invoice</span>
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="border rounded-md overflow-hidden">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="w-4 h-4 rounded-full bg-green-600 animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 rounded-full bg-green-600 animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-4 h-4 rounded-full bg-green-600 animate-bounce"></div>
            </div>
            <p className="text-gray-500">Fetching invoices from Google Sheets...</p>
          </div>
        ) : error || invoices.length === 0 ? (
          renderEmptyOrError()
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <div className="flex items-start gap-2">
                      <div className="h-5 w-5 mt-0.5">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                          <polyline points="14 2 14 8 20 8" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium">Invoice {invoice.id}</p>
                        <p className="text-xs text-gray-500">{invoice.date}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{invoice.customer}</div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${invoice.status === "Paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {invoice.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    ${invoice.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {/* Desktop actions - hidden on mobile */}
                      <div className="hidden md:flex gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Mobile dropdown menu */}
                      <div className="md:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  )
}

