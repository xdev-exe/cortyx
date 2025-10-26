import { useQuery, useMutation } from "@tanstack/react-query";
import { useRoute, useLocation } from "wouter";
import { FileQuestion } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { DynamicForm } from "@/components/dynamic-form";
import { useToast } from "@/hooks/use-toast";
import { type Field, type Document } from "@shared/schema";

export default function DocumentForm() {
  // Check for edit mode: /app/:module/:doctype/:id/edit
  const [matchedEdit, editParams] = useRoute("/app/:module/:doctype/:id/edit");
  // Check for new mode: /app/:module/:doctype/new
  const [matchedNew, newParams] = useRoute("/app/:module/:doctype/new");
  
  const doctype = matchedEdit ? editParams?.doctype || "" : newParams?.doctype || "";
  const id = matchedEdit ? editParams?.id : undefined;
  const isEdit = matchedEdit;
  
  const [, setLocation] = useLocation();
  const { toast } = useToast();

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
    enabled: isEdit && !!id,
  });

  const createMutation = useMutation({
    mutationFn: async (data: Record<string, any>) => {
      if (isEdit && id) {
        const res = await apiRequest("PUT", `/api/docs/${doctype}/${id}`, data);
        return await res.json();
      } else {
        const res = await apiRequest("POST", `/api/docs/${doctype}`, data);
        return await res.json();
      }
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/docs/${doctype}`] });
      toast({
        title: "Success",
        description: `Document ${isEdit ? "updated" : "created"} successfully`,
      });
      setLocation(`/app/${doctype}/${data.name}`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: `Failed to ${isEdit ? "update" : "create"} document`,
        variant: "destructive",
      });
    },
  });

  if (schemaLoading || (isEdit && docLoading)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <div className="text-sm text-muted-foreground">Loading form...</div>
        </div>
      </div>
    );
  }

  if (schemaError || (isEdit && docError) || !schema || (isEdit && !document)) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <FileQuestion className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold text-lg mb-2">Failed to load form</h3>
          <p className="text-sm text-muted-foreground">
            There was an error loading the form. Please try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-8 py-6">
        <h1 className="font-semibold text-2xl" data-testid="text-form-title">
          {isEdit ? `Edit ${doctype}` : `New ${doctype}`}
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          {isEdit ? `Update existing ${doctype.toLowerCase()}` : `Create a new ${doctype.toLowerCase()} record`}
        </p>
      </div>

      <div className="flex-1 overflow-auto px-8 py-6">
        <div className="max-w-4xl">
          <DynamicForm
            schema={schema}
            initialData={isEdit ? document : undefined}
            onSubmit={(data) => createMutation.mutate(data)}
            isLoading={createMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}
