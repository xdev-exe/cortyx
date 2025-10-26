import { useState } from "react";
import { Link } from "wouter";
import { Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
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
import { type Field, type Document } from "@shared/schema";

interface DataTableProps {
  doctype: string;
  module?: string;
  schema: Field[];
  data: Document[];
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onDelete?: (id: string) => void;
  onSelect?: (doc: Document) => void;
  isSelectable?: boolean;
}

export function DataTable({
  doctype,
  module,
  schema,
  data,
  total,
  page,
  pageSize,
  onPageChange,
  onDelete,
  onSelect,
  isSelectable = false,
}: DataTableProps) {
  const [searchTerm, setSearchTerm] = useState("");

  // Handle Neo4j integer objects {low: 0, high: 0}
  const normalizeValue = (value: any): any => {
    if (value && typeof value === 'object' && 'low' in value) {
      return value.low;
    }
    return value;
  };

  const listViewFields = schema.filter((field) => normalizeValue(field.in_list_view) === 1);
  const totalPages = Math.ceil(total / pageSize);

  const filteredData = data.filter((doc) => {
    if (!searchTerm) return true;
    return Object.values(doc).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

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
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <Input
          type="search"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
          data-testid="input-search"
        />
        {!isSelectable && (
          <Link href={module ? `/app/${module}/${doctype}/new` : `/app/${doctype}/new`}>
            <Button data-testid="button-new">New {doctype}</Button>
          </Link>
        )}
      </div>

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
              {!isSelectable && <TableHead className="w-24">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={listViewFields.length + (!isSelectable ? 1 : 0)}
                  className="text-center py-12 text-muted-foreground"
                >
                  No data found
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((doc, idx) => (
                <TableRow
                  key={doc.name || idx}
                  className={isSelectable ? "cursor-pointer" : ""}
                  onClick={() => isSelectable && onSelect?.(doc)}
                  data-testid={`row-document-${doc.name || idx}`}
                >
                  {listViewFields.map((field) => (
                    <TableCell key={field.fieldname} className="font-mono text-sm tabular-nums">
                      {!isSelectable && field.fieldname === listViewFields[0].fieldname ? (
                        <Link
                          href={module ? `/app/${module}/${doctype}/${doc.name}` : `/app/${doctype}/${doc.name}`}
                          className="text-primary hover:underline"
                          data-testid={`link-document-${doc.name}`}
                        >
                          {formatValue(doc[field.fieldname], field.fieldtype)}
                        </Link>
                      ) : (
                        formatValue(doc[field.fieldname], field.fieldtype)
                      )}
                    </TableCell>
                  ))}
                  {!isSelectable && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Link href={module ? `/app/${module}/${doctype}/${doc.name}/edit` : `/app/${doctype}/${doc.name}/edit`}>
                          <Button
                            size="icon"
                            variant="ghost"
                            data-testid={`button-edit-${doc.name}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </Link>
                        {onDelete && (
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onDelete(doc.name)}
                            data-testid={`button-delete-${doc.name}`}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            size="icon"
            variant="outline"
            disabled={page === 1}
            onClick={() => onPageChange(page - 1)}
            data-testid="button-prev-page"
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
            onClick={() => onPageChange(page + 1)}
            data-testid="button-next-page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
