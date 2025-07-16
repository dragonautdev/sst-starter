import { useStore } from "@tanstack/react-form";
import { useFieldContext } from "@/hooks/form-context";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SelectField({
  id,
  label,
  name,
  placeholder,
  options,
  required,
}: {
  id: string;
  label: string;
  name: string;
  placeholder?: string;
  options: {
    label: string;
    value: string;
  }[];
  required?: boolean;
}) {
  const field = useFieldContext<string>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <>
      {label && (
        <Label htmlFor={name} className="flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="w-full">
        <Select
          defaultValue={field.state.value}
          onValueChange={field.handleChange}
          onOpenChange={() => {
            if (!field.state.meta.isTouched) field.handleBlur();
          }}
        >
          <SelectTrigger id={id} className="w-full">
            <SelectValue placeholder={placeholder || "Select an option"} />
          </SelectTrigger>
          <SelectContent className="w-full min-w-[8rem]">
            {options.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
