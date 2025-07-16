import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "@/hooks/form-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function TextField({
  label,
  name,
  type,
  placeholder,
  disabled,
  required,
}: {
  label: string;
  name: string;
  type: "text" | "email" | "password" | "tel" | "url" | "search" | "date";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <>
      {label && <Label htmlFor={name} className="flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>}
      <div>
        <Input
          required={required}
          placeholder={placeholder}
          defaultValue={field.state.value}
          type={type}
          onChange={(e) => field.handleChange(e.target.value)}
          onBlur={field.handleBlur}
          disabled={disabled}
          
        />
        {(!field.form.state.isValid || field.state.meta.isTouched) &&
          errors.length > 0 && (
            <p className="text-sm text-red-500 mt-1">
              {errors[0].message || errors[0]}
            </p>
          )}
      </div>
    </>
  );
}
