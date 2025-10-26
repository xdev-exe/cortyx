import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Pencil, FileQuestion } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type Field, type Document } from "@shared/schema";

export default function DocumentDetail() {
  // All document details come from /app/:module/:doctype/:id pattern
  const [, params] = useRoute("/app/:module/:doctype/:id");
  const doctype = params?.doctype || "";
  const id = params?.id || "";

  const { data: schema, isLoading: schemaLoading, error: schemaError } = useQuery<Field[]>({
    queryKey: [`/api/doctypes/${doctype}`],
    enabled: !!doctype,
  });

  const { data: document, isLoading: docLoading, error: docError } = useQuery<Document>({
    queryKey: [`/api/docs/${doctype}/${id}`],
    queryFn: async () => {
      const res = await fetch(`/api/docs/${doctype}/${id}`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error('Document not found');
      }
      return await res.json();
    },
    enabled: !!doctype && !!id,
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
    if (fieldtype === "Check") {
      return value ? "Yes" : "No";
    }
    return String(value);
  };

  if (schemaLoading || docLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-sm text-muted-foreground">Loading document...</div>
        </div>
      </div>
    );
  }

  if (schemaError || docError || !schema || !document) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Document not found</h3>
          <p className="text-sm text-muted-foreground">
            The requested document could not be found or you don't have permission to view it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-8 py-6 flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-2xl" data-testid="text-document-name">
            {document.name}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">{doctype}</p>
        </div>
        <Link href={`/app/${doctype}/${id}/edit`}>
          <Button data-testid="button-edit">
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        <Card className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {schema.map((field) => (
              <div key={field.fieldname} className={field.fieldtype === "Text Editor" ? "md:col-span-2" : ""}>
                <dt className="text-sm font-medium text-muted-foreground mb-1">
                  {field.label}
                </dt>
                <dd className="text-base" data-testid={`text-${field.fieldname}`}>
                  {field.fieldtype === "Link" && document[field.fieldname] ? (
                    <Link
                      href={`/app/${field.options}/${document[field.fieldname]}`}
                      className="text-primary hover:underline"
                      data-testid={`link-${field.fieldname}`}
                    >
                      {formatValue(document[field.fieldname], field.fieldtype)}
                    </Link>
                  ) : (
                    formatValue(document[field.fieldname], field.fieldtype)
                  )}
                </dd>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
