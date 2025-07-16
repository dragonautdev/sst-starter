import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "@/hooks/form-context";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function NumberField({
  label,
  name,
  placeholder,
  required,
}: {
  label: string;
  name: string;
  placeholder?: string;
  required?: boolean;
}) {
  const field = useFieldContext<number>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <>
      {label && <Label htmlFor={name} className="flex items-center gap-2">
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>}
      <div>
        <Input
          placeholder={placeholder}
          defaultValue={field.state.value}
          type="number"
          required={required}
          onChange={(e) => field.handleChange(Number(e.target.value))}
          onBlur={field.handleBlur}
        />
        {(!field.form.state.isValid || field.state.meta.isTouched) && errors.length > 0 && (
          <p className="text-sm text-red-500 mt-1">{errors[0].message || errors[0]}</p>
        )}
      </div>
    </>
  );
}
