import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import {
  Search,
  Plus,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  RefreshCw,
  ArrowLeft,
  Trash2,
  Loader2,
} from "lucide-react";
import { useToast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { useAuth } from "./context/AuthContext";
import apiClient from "../utils/apiClient";

interface Sheet {
  id: string;
  name: string;
  url: string;
  isDefault: boolean;
  rowCount: number;
  lastSync: string;
  status: "active" | "error";
}

export default function IntegrationPage() {
  const { user, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useNavigate();
  const { toast } = useToast();
  const { refreshAuthToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSheet, setSelectedSheet] = useState<Sheet | null>(null);
  const [connectedSheets, setConnectedSheets] = useState<Sheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);

  const fetchConnectedSheets = async () => {
    setIsLoading(true);
    try {
      const data = await apiClient("/api/sheets", refreshAuthToken); // Pass refreshAuthToken
      setConnectedSheets(data.sheets);
    } catch (error) {
      console.error("Error fetching sheets:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load connected sheets.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Load connected sheets on component mount
  useEffect(() => {
    fetchConnectedSheets();
  }, []);

  const filteredSheets = connectedSheets.filter((sheet) =>
    sheet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSetDefault = async (sheet: Sheet) => {
    try {
      await apiClient(`/api/sheets/${sheet.id}/default`, refreshAuthToken, {
        method: "PATCH", // Pass options as the third argument
      });
  
      // Update the local state
      setConnectedSheets(
        connectedSheets.map((s) => ({
          ...s,
          isDefault: s.id === sheet.id,
        }))
      );
  
      toast({
        title: "Default Sheet Updated",
        description: "Your sheet has been set as the default. Go to invoices to see your data.",
        action: (
          <Button variant="outline" size="sm" onClick={() => router("/")}>
            View Invoices
          </Button>
        ),
      });
    } catch (error) {
      console.error("Error setting default sheet:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to set default sheet.",
        variant: "destructive",
      });
    }
  };

  const handleCreateInvoiceSheet = async () => {
    setIsCreatingSheet(true);
    try {
      const refreshToken = localStorage.getItem("refreshToken");
  
      const data = await apiClient("http://localhost:5000/api/spreadsheets", refreshAuthToken, {
        method: "POST", // Pass options as the third argument
        body: JSON.stringify({
          name: `SheetBills Invoice ${new Date().toLocaleDateString()}`,
          refreshToken: refreshToken || undefined,
        }),
      });
  
      // If the API returned a new token, update it in localStorage
      if (data.newToken) {
        localStorage.setItem("authToken", data.newToken);
      }
  
      // Add the new sheet to the connected sheets
      setConnectedSheets([data.spreadsheet, ...connectedSheets]);
  
      toast({
        title: "Sheet Created",
        description: "Your invoice sheet has been created successfully.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error creating invoice sheet:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create invoice sheet.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleDelete = (sheet: Sheet) => {
    setSelectedSheet(sheet);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSheet) return;
  
    try {
      await apiClient(`http://localhost:5000/api/sheets/${selectedSheet.id}`, refreshAuthToken, {
        method: "DELETE", // Pass options as the third argument
      });
  
      // Remove the deleted sheet from the local state
      setConnectedSheets(connectedSheets.filter((sheet) => sheet.id !== selectedSheet.id));
  
      toast({
        title: "Sheet Disconnected",
        description: "The sheet has been successfully disconnected from your account.",
        variant: "destructive",
      });
    } catch (error) {
      console.error("Error disconnecting sheet:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to disconnect sheet.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedSheet(null);
    }
  };

  const handleConnectSheet = async (url: string) => {
    try {
      const data = await apiClient("http://localhost:5000/api/sheets/connect", refreshAuthToken, {
        method: "POST", // Pass options as the third argument
        body: JSON.stringify({ url }),
      });
  
      // Add the new sheet to the local state
      setConnectedSheets([data.sheet, ...connectedSheets]);
  
      toast({
        title: "Sheet Connected",
        description: "Your Google Sheet has been successfully connected to SheetBills.",
      });
  
      return true;
    } catch (error) {
      console.error("Error connecting sheet:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to connect sheet.",
        variant: "destructive",
      });
      return false;
    }
  };


    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="">
                <div className="container mx-auto px-4">
                    <div className="flex items-center h-16">
                        <Button variant="ghost" size="icon" className="mr-4" onClick={() => router('/')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                        <h1 className="text-lg font-semibold">Google Sheets Integration</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                <Toaster />
                <div className="grid gap-8">
                    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <p className="text-sm text-gray-500">Manage your connected Google Sheets and sync settings</p>
                        <div className="flex gap-3">
                            {/* Refresh Button */}
                            <Button
                                variant="outline"
                                onClick={fetchConnectedSheets}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <RefreshCw className="mr-2 h-4 w-4" />
                                )}
                                Refresh
                            </Button>

                            {/* Create SheetBills Invoice Sheet Button */}
                            <Button
                                variant="secondary"
                                onClick={handleCreateInvoiceSheet}
                                disabled={isCreatingSheet}
                            >
                                {isCreatingSheet ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                                )}
                                Create Invoice Sheet
                            </Button>

                            {/* Connect Sheet Button */}
                            <ConnectSheetDialog onConnect={handleConnectSheet} />
                        </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Connected Sheets</CardTitle>
                                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{connectedSheets.length}</div>
                                <p className="text-xs text-muted-foreground">Active sheets in your account</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Total Records</CardTitle>
                                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {connectedSheets.reduce((acc, sheet) => acc + sheet.rowCount, 0)}
                                </div>
                                <p className="text-xs text-muted-foreground">Across all connected sheets</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">Default Sheet</CardTitle>
                                <FileSpreadsheet className="h-4 w-4 text-muted-foreground" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm font-medium truncate">
                                    {connectedSheets.find((sheet) => sheet.isDefault)?.name || "No default sheet"}
                                </div>
                                <p className="text-xs text-muted-foreground">Currently active sheet</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Connected Sheets Table */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Connected Sheets</CardTitle>
                            <CardDescription>Manage your connected Google Sheets and their sync status</CardDescription>
                            <div className="mt-4 relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type="search"
                                    placeholder="Search sheets..."
                                    className="pl-8 w-full md:max-w-sm"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            {isLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                                </div>
                            ) : connectedSheets.length === 0 ? (
                                <div className="text-center py-12">
                                    <FileSpreadsheet className="mx-auto h-12 w-12 text-gray-300" />
                                    <h3 className="mt-4 text-lg font-medium">No sheets connected</h3>
                                    <p className="mt-2 text-sm text-gray-500">
                                        Start by connecting an existing sheet or creating a new invoice sheet.
                                    </p>
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Sheet Name</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead>Records</TableHead>
                                            <TableHead>Last Synced</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredSheets.map((sheet) => (
                                            <TableRow key={sheet.id}>
                                                <TableCell>
                                                    <div>
                                                        <div className="font-medium flex items-center gap-2">
                                                            {sheet.name}
                                                            {sheet.isDefault && (
                                                                <Badge variant="secondary" className="ml-2">
                                                                    Default
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-muted-foreground truncate">{sheet.url}</div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {sheet.status === "active" ? (
                                                            <>
                                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                                <span className="text-sm">Synced</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <AlertCircle className="h-4 w-4 text-red-500" />
                                                                <span className="text-sm">Error</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{sheet.rowCount}</TableCell>
                                                <TableCell>
                                                    {new Date(sheet.lastSync).toLocaleDateString()} {new Date(sheet.lastSync).toLocaleTimeString()}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => handleSetDefault(sheet)}
                                                            disabled={sheet.isDefault}
                                                        >
                                                            Set as Default
                                                        </Button>
                                                        <Button
                                                            variant="outline"
                                                            size="icon"
                                                            className="h-8 w-8"
                                                            onClick={() => window.open(sheet.url, "_blank")}
                                                        >
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 text-destructive"
                                                            onClick={() => handleDelete(sheet)}
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>

                    {/* Delete Confirmation Dialog */}
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Disconnect Sheet</DialogTitle>
                                <DialogDescription>
                                    Are you sure you want to disconnect "{selectedSheet?.name}"? This action cannot be undone.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteConfirm}>
                                    Disconnect
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>


                </div>
            </div>
        </div>
    );
}

// Extracted component for the Connect Sheet dialog
function ConnectSheetDialog({ onConnect }: { onConnect: (url: string) => Promise<boolean> }) {
  const [sheetUrl, setSheetUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    if (!sheetUrl) return;

    setIsSubmitting(true);
    const success = await onConnect(sheetUrl);

    if (success) {
      setSheetUrl("");
      setOpen(false);
    }

    setIsSubmitting(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Plus className="mr-2 h-4 w-4" />
          Connect Sheet
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Connect Google Sheet</DialogTitle>
          <DialogDescription>
            Enter the URL of the Google Sheet you want to connect with SheetBills. Make sure you have edit access to the
            sheet.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Input
              id="sheet-url"
              placeholder="https://docs.google.com/spreadsheets/d/..."
              value={sheetUrl}
              onChange={(e) => setSheetUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={handleSubmit} disabled={isSubmitting || !sheetUrl}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              "Connect Sheet"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}