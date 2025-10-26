import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { FolderOpen } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DataTable } from "@/components/data-table";
import { useToast } from "@/hooks/use-toast";
import { type Field, type PaginatedResponse, type Document } from "@shared/schema";

export default function DocumentList() {
  // All document lists come from /app/:module/:doctype pattern
  const [, params] = useRoute("/app/:module/:doctype");
  const module = params?.module || "";
  const doctype = params?.doctype || "";
  const [page, setPage] = useState(1);
  const { toast } = useToast();

  const { data: schema, isLoading: schemaLoading, error: schemaError } = useQuery<Field[]>({
    queryKey: [`/api/doctypes/${doctype}`],
    enabled: !!doctype,
  });

  const { data: docsResponse, isLoading: docsLoading, error: docsError } = useQuery<PaginatedResponse<Document>>({
    queryKey: [`/api/docs/${doctype}`, { page }],
    queryFn: async () => {
      const res = await fetch(`/api/docs/${doctype}?page=${page}&pageSize=20`, {
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error('Failed to fetch documents');
      }
      return await res.json();
    },
    enabled: !!doctype,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("DELETE", `/api/docs/${doctype}/${id}`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/docs/${doctype}`] });
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    },
  });

  if (schemaLoading || docsLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-sm text-muted-foreground">Loading {doctype}...</div>
        </div>
      </div>
    );
  }

  if (schemaError || docsError || !schema || !docsResponse) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Failed to load data</h3>
          <p className="text-sm text-muted-foreground">
            There was an error loading {doctype} data. Please try refreshing the page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-8 py-6">
        <h1 className="font-semibold text-2xl" data-testid="text-doctype-name">{doctype}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage and view all {doctype.toLowerCase()} records
        </p>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        <DataTable
          doctype={doctype}
          module={module}
          schema={schema}
          data={docsResponse.data}
          total={docsResponse.total}
          page={page}
          pageSize={docsResponse.pageSize}
          onPageChange={setPage}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      </div>
    </div>
  );
}
