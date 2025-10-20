import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { type Field, type PaginatedResponse, type Document } from "@shared/schema";

interface LinkFieldModalProps {
  isOpen: boolean;
  onClose: () => void;
  linkedDocType: string;
  onSelect: (doc: Document) => void;
}

export function LinkFieldModal({
  isOpen,
  onClose,
  linkedDocType,
  onSelect,
}: LinkFieldModalProps) {
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const { data: schema } = useQuery<Field[]>({
    queryKey: [`/api/doctypes/${linkedDocType}`],
    enabled: isOpen && !!linkedDocType,
  });

  const { data: docsResponse } = useQuery<PaginatedResponse<Document>>({
    queryKey: [`/api/docs/${linkedDocType}`, { page, search: searchTerm }],
    queryFn: async () => {
      const res = await fetch(`/api/docs/${linkedDocType}?page=${page}&pageSize=20`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error('Failed to fetch documents');
      }
      return await res.json();
    },
    enabled: isOpen && !!linkedDocType,
  });

  const listViewFields = schema?.filter((field) => field.in_list_view === 1) || [];
  
  const filteredData = useMemo(() => {
    if (!docsResponse?.data) return [];
    if (!searchTerm) return docsResponse.data;
    
    return docsResponse.data.filter((doc) => {
      return Object.values(doc).some((value) =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [docsResponse?.data, searchTerm]);

  const totalPages = docsResponse ? Math.ceil(docsResponse.total / docsResponse.pageSize) : 1;

  const handleSelect = (doc: Document) => {
    onSelect(doc);
    setSearchTerm("");
    setPage(1);
    onClose();
  };

  const formatValue = (value: any, fieldtype?: string) => {
    if (value === null || value === undefined) return "-";
    if (fieldtype === "Currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(value));
    }
    if (fieldtype === "Float") {
      return Number(value).toFixed(2);
    }
    return String(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setSearchTerm("");
        setPage(1);
        onClose();
      }
    }}>
      <DialogContent className="max-w-5xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex flex-row items-center justify-between border-b border-border pb-4">
          <DialogTitle className="text-xl font-semibold">
            Select {linkedDocType}
          </DialogTitle>
          <Button
            size="icon"
            variant="ghost"
            onClick={onClose}
            data-testid="button-close-modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="py-4">
          <Input
            type="search"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
            }}
            className="max-w-sm"
            data-testid="input-modal-search"
          />
        </div>

        <div className="flex-1 overflow-auto">
          {!schema || !docsResponse ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <div className="text-sm text-muted-foreground">Loading...</div>
              </div>
            </div>
          ) : (
            <>
              <div className="border border-border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50 hover:bg-muted/50">
                      {listViewFields.map((field) => (
                        <TableHead
                          key={field.fieldname}
                          className="text-xs uppercase font-semibold tracking-wide"
                        >
                          {field.label}
                        </TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? (
                      <TableRow>
                        <TableCell
                          colSpan={listViewFields.length}
                          className="text-center py-12 text-muted-foreground"
                        >
                          No data found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredData.map((doc, idx) => (
                        <TableRow
                          key={doc.name || idx}
                          className="cursor-pointer hover-elevate"
                          onClick={() => handleSelect(doc)}
                          data-testid={`row-select-${doc.name || idx}`}
                        >
                          {listViewFields.map((field) => (
                            <TableCell key={field.fieldname} className="font-mono text-sm tabular-nums">
                              {formatValue(doc[field.fieldname], field.fieldtype)}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    data-testid="button-modal-prev-page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm text-muted-foreground px-4">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    disabled={page === totalPages}
                    onClick={() => setPage(p => p + 1)}
                    data-testid="button-modal-next-page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
