import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '@/hooks/form-context';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function MultiSelectField({
  label,
  name,
  description,
  options,
  required,
}: {
  label: string;
  name: string;
  description?: string;
  options: {
    label: string;
    value: string;
  }[];
  required?: boolean;
}) {
  const field = useFieldContext<string[]>();
  const errors = useStore(field.store, (state) => state.meta.errors);
  
  // Ensure field.value is always an array
  const selectedValues = field.state.value || [];
  
  // Get available options (not yet selected)
  const availableOptions = options.filter(option => !selectedValues.includes(option.value));
  
  // Get selected options
  const selectedOptions = options.filter(option => selectedValues.includes(option.value));

  const handleSelect = (value: string) => {
    const newValues = [...selectedValues, value];
    field.handleChange(newValues);
    if (!field.state.meta.isTouched) field.handleBlur();
  };

  const handleDeselect = (value: string) => {
    const newValues = selectedValues.filter(v => v !== value);
    field.handleChange(newValues);
    if (!field.state.meta.isTouched) field.handleBlur();
  };

  return (
    <>
      {label && (
        <Label htmlFor={name} className="flex items-center gap-2">
          {label}
          {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      {description && (
        <p className="text-sm text-muted-foreground mb-2">{description}</p>
      )}
      
      <div className="w-full space-y-3">
        {/* Selected items */}
        {selectedOptions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-foreground">Selected:</p>
            <div className="flex flex-wrap gap-2">
              {selectedOptions.map((option) => (
                <div
                  key={option.value}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-md text-sm"
                >
                  <span>{option.label}</span>
                  <button
                    type="button"
                    onClick={() => handleDeselect(option.value)}
                    className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Available options */}
        {availableOptions.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm text-foreground">
              Available options:
            </p>
            <div className="flex flex-wrap gap-2">
              {availableOptions.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleSelect(option.value)}
                  className="text-sm"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        )}
        
        {/* No options available message */}
        {availableOptions.length === 0 && selectedOptions.length > 0 && (
          <p className="text-sm text-muted-foreground">
            All options have been selected.
          </p>
        )}
        
        {/* No options at all */}
        {options.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No options available.
          </p>
        )}
      </div>
      
      {/* Error display */}
      {(!field.form.state.isValid || field.state.meta.isTouched) && errors.length > 0 && (
        <p className="text-sm text-red-500 mt-1">
          {errors[0].message || errors[0]}
        </p>
      )}
    </>
  );
} 