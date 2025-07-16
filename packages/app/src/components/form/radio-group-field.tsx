import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '@/hooks/form-context';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export default function RadioGroupField({
  label,
  name,
  options,
  defaultValue,
  required,
}: {
  label?: string;
  name: string;
  defaultValue?: string;
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
        <Label htmlFor={name} className='flex items-center gap-2'>
          {label}
          {required && <span className='text-red-500'>*</span>}
        </Label>
      )}
      <RadioGroup defaultValue={defaultValue} onValueChange={field.handleChange}>
        {options.map((option, index) => (
          <div key={index} className='flex items-center gap-2'>
            <RadioGroupItem value={option.value} id={option.value} />
            <Label htmlFor={option.value}>{option.label}</Label>
          </div>
        ))}
        {(!field.form.state.isValid || field.state.meta.isTouched) && errors.length > 0 && (
          <p className='text-sm text-red-500 mt-1'>{errors[0].message || errors[0]}</p>
        )}
      </RadioGroup>
    </>
  );
}
