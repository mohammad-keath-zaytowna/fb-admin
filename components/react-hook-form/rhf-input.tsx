import { Controller, useFormContext } from "react-hook-form";
import { Input } from "../ui/input";
import { Field, FieldError, FieldLabel } from "../ui/field";

interface RHFInputProps {
  disabled?: boolean;
  name: string;
  label: string;
  placeholder?: string;
  type?: "email" | "password" | "text" | "number";
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
      render={({ field, fieldState }) => {
        const value = type === "number" && field.value === undefined ? "" : field.value;
        const onChange = type === "number"
          ? (e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.value;
            field.onChange(val === "" ? 0 : Number(val));
          }
          : field.onChange;

        return (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={name}>{label}</FieldLabel>
            <Input
              {...field}
              value={value}
              onChange={onChange}
              disabled={disabled}
              id={name}
              type={type}
              placeholder={placeholder}
              aria-invalid={fieldState.invalid}
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        );
      }}
    />
  );
}

export default RHFInput;
