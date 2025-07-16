import { useFormContext } from "@/hooks/form-context"
import { LoadingButton, type LoadingButtonProps } from "../custom/loading-button"

export default function SubmitButton(props: LoadingButtonProps
) {
  const form = useFormContext()

  return (
    <form.Subscribe selector={(state) => [state.isSubmitting, state.canSubmit]}>
      {([isSubmitting, canSubmit]) => <LoadingButton {...props} disabled={isSubmitting || !canSubmit || props.disabled} type="submit" loading={isSubmitting} />}
    </form.Subscribe>
  )
}