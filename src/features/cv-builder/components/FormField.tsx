"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

interface FormFieldProps {
  label: string;
  type?: "text" | "email" | "tel" | "url" | "textarea";
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  rows?: number;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
  error,
  hint,
  rows = 3,
  className = "",
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onChange(e.target.value);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`field-${label.replace(/\s+/g, "-").toLowerCase()}`}>
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </Label>

      {type === "textarea" ? (
        <Textarea
          id={`field-${label.replace(/\s+/g, "-").toLowerCase()}`}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={rows}
          className={`${
            error ? "border-destructive focus-visible:ring-destructive" : ""
          } ${className}`}
          required={required}
        />
      ) : (
        <Input
          id={`field-${label.replace(/\s+/g, "-").toLowerCase()}`}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`${
            error ? "border-destructive focus-visible:ring-destructive" : ""
          } ${className}`}
          required={required}
        />
      )}

      {error && (
        <Alert variant="destructive" className="py-2">
          <ExclamationTriangleIcon className="h-4 w-4" />
          <AlertDescription className="text-sm">{error}</AlertDescription>
        </Alert>
      )}

      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
    </div>
  );
};
