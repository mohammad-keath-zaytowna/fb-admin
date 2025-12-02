import { Controller, useFormContext } from "react-hook-form";
import { Textarea } from "../ui/textarea";
import { Field, FieldError, FieldLabel } from "../ui/field";

interface RHFTextareaProps {
  disabled?: boolean;
  name: string;
  label: string;
  placeholder?: string;
  rows?: number;
}

function RHFTextarea({
  disabled,
  name,
  label,
  placeholder,
  rows = 4,
}: RHFTextareaProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Textarea
            {...field}
            disabled={disabled}
            id={name}
            placeholder={placeholder}
            rows={rows}
            aria-invalid={fieldState.invalid}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export default RHFTextarea;

