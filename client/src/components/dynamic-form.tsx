import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { DynamicFormField } from "./dynamic-form-field";
import { type Field } from "@shared/schema";

interface DynamicFormProps {
  schema: Field[];
  initialData?: Record<string, any>;
  onSubmit: (data: Record<string, any>) => void;
  isLoading?: boolean;
}

export function DynamicForm({ schema, initialData, onSubmit, isLoading }: DynamicFormProps) {
  const zodSchema = z.object(
    schema.reduce((acc, field) => {
      let fieldSchema: z.ZodTypeAny;

      switch (field.fieldtype) {
        case "Data":
        case "Text Editor":
        case "Select":
        case "Link":
          fieldSchema = z.string();
          if (field.reqd === 1) {
            fieldSchema = fieldSchema.min(1, `${field.label} is required`);
          } else {
            fieldSchema = fieldSchema.optional().or(z.literal(""));
          }
          break;

        case "Int":
          fieldSchema = z.preprocess(
            (val) => {
              if (val === "" || val === null || val === undefined) return undefined;
              const num = Number(val);
              return isNaN(num) ? undefined : Math.floor(num);
            },
            field.reqd === 1 
              ? z.number({ required_error: `${field.label} is required` })
              : z.number().optional()
          );
          break;

        case "Float":
        case "Currency":
          fieldSchema = z.preprocess(
            (val) => {
              if (val === "" || val === null || val === undefined) return undefined;
              const num = Number(val);
              return isNaN(num) ? undefined : num;
            },
            field.reqd === 1 
              ? z.number({ required_error: `${field.label} is required` })
              : z.number().optional()
          );
          break;

        case "Check":
          fieldSchema = z.boolean();
          if (field.reqd === 1) {
            fieldSchema = fieldSchema.refine((val) => val === true, {
              message: `${field.label} must be checked`,
            });
          }
          break;

        default:
          fieldSchema = z.any().optional();
      }

      acc[field.fieldname] = fieldSchema;
      return acc;
    }, {} as Record<string, z.ZodTypeAny>)
  );

  const defaultValues = schema.reduce((acc, field) => {
    if (initialData && field.fieldname in initialData) {
      acc[field.fieldname] = initialData[field.fieldname];
    } else {
      switch (field.fieldtype) {
        case "Check":
          acc[field.fieldname] = false;
          break;
        case "Int":
        case "Float":
        case "Currency":
          acc[field.fieldname] = "";
          break;
        default:
          acc[field.fieldname] = "";
      }
    }
    return acc;
  }, {} as Record<string, any>);

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
  });

  const handleSubmit = (data: Record<string, any>) => {
    const payload = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === "" || value === null || value === undefined) {
        acc[key] = null;
      } else {
        acc[key] = value;
      }
      return acc;
    }, {} as Record<string, any>);
    
    onSubmit(payload);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schema.map((field) => (
            <DynamicFormField key={field.fieldname} field={field} form={form} />
          ))}
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => window.history.back()}
            data-testid="button-cancel"
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading} data-testid="button-save">
            {isLoading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
