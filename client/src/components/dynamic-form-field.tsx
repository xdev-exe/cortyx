import { useState } from "react";
import { Search } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { LinkFieldModal } from "./link-field-modal";
import { type Field, type Document } from "@shared/schema";
import { UseFormReturn } from "react-hook-form";

interface DynamicFormFieldProps {
  field: Field;
  form: UseFormReturn<any>;
}

export function DynamicFormField({ field, form }: DynamicFormFieldProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLinkSelect = (doc: Document) => {
    form.setValue(field.fieldname, doc.name);
  };

  switch (field.fieldtype) {
    case "Data":
      return (
        <FormField
          control={form.control}
          name={field.fieldname}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.label}
                {field.reqd === 1 && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  {...formField}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  data-testid={`input-${field.fieldname}`}
                />
              </FormControl>
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "Int":
    case "Float":
    case "Currency":
      return (
        <FormField
          control={form.control}
          name={field.fieldname}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.label}
                {field.reqd === 1 && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Input
                  {...formField}
                  type="number"
                  step={field.fieldtype === "Float" || field.fieldtype === "Currency" ? "0.01" : "1"}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  data-testid={`input-${field.fieldname}`}
                  onChange={(e) => formField.onChange(e.target.value ? Number(e.target.value) : "")}
                />
              </FormControl>
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "Text Editor":
      return (
        <FormField
          control={form.control}
          name={field.fieldname}
          render={({ field: formField }) => (
            <FormItem className="col-span-2">
              <FormLabel>
                {field.label}
                {field.reqd === 1 && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...formField}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  rows={6}
                  data-testid={`textarea-${field.fieldname}`}
                />
              </FormControl>
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "Select":
      const options = field.options?.split("\n").filter(Boolean) || [];
      return (
        <FormField
          control={form.control}
          name={field.fieldname}
          render={({ field: formField }) => (
            <FormItem>
              <FormLabel>
                {field.label}
                {field.reqd === 1 && <span className="text-destructive ml-1">*</span>}
              </FormLabel>
              <Select onValueChange={formField.onChange} value={formField.value}>
                <FormControl>
                  <SelectTrigger data-testid={`select-${field.fieldname}`}>
                    <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.description && (
                <p className="text-xs text-muted-foreground">{field.description}</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "Link":
      return (
        <>
          <FormField
            control={form.control}
            name={field.fieldname}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>
                  {field.label}
                  {field.reqd === 1 && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input
                      {...formField}
                      placeholder={`Select ${field.label.toLowerCase()}`}
                      readOnly
                      data-testid={`input-${field.fieldname}`}
                    />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setIsModalOpen(true)}
                    data-testid={`button-browse-${field.fieldname}`}
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
                {field.description && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          {field.options && (
            <LinkFieldModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              linkedDocType={field.options}
              onSelect={handleLinkSelect}
            />
          )}
        </>
      );

    case "Check":
      return (
        <FormField
          control={form.control}
          name={field.fieldname}
          render={({ field: formField }) => (
            <FormItem className="flex items-center gap-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                  data-testid={`checkbox-${field.fieldname}`}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="font-normal">
                  {field.label}
                  {field.reqd === 1 && <span className="text-destructive ml-1">*</span>}
                </FormLabel>
                {field.description && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      );

    default:
      return null;
  }
}
