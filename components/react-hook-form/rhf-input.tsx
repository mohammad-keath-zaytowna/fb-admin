import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Field, FieldError, FieldLabel } from "../ui/field";

interface RHFInputProps {
  disabled?: boolean;
  name: string;
  label: string;
  placeholder?: string;
  type?: "email" | "password" | "text";
}

function RHFInput({
  disabled,
  name,
  label,
  placeholder,
  type = "text",
}: RHFInputProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Input
            {...field}
            disabled={disabled}
            id={name}
            type={type}
            placeholder={placeholder}
            aria-invalid={fieldState.invalid}
          />

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export default RHFInput;
