import { useStore } from '@tanstack/react-form';
import { useFieldContext } from '@/hooks/form-context';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

export default function CheckboxField({ label, name, required }: { label: string | React.ReactNode; name: string; required?: boolean }) {
  const field = useFieldContext<boolean>();
  const errors = useStore(field.store, (state) => state.meta.errors);

  return (
    <>
      <div className='flex items-center space-x-2'>
        <Checkbox
          id={name}
          checked={field.state.value}
          required={required}
          onCheckedChange={(checked) => field.handleChange(checked === 'indeterminate' ? false : checked)}
        />
        {label && (
          <Label htmlFor={name} className='flex items-center gap-2'>
            {required && <span className='text-red-500'>*</span>}
            {label}
            
          </Label>
        )}
        
      </div>
      {(!field.form.state.isValid || field.state.meta.isTouched) && errors.length > 0 && (
          <p className='text-sm text-red-500 mt-1'>{errors[0].message || errors[0]}</p>
        )}
    </>
  );
}
