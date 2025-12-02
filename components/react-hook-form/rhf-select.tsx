import { Controller, useFormContext } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Field, FieldError, FieldLabel } from "../ui/field";

interface RHFSelectProps {
  disabled?: boolean;
  name: string;
  label: string;
  placeholder?: string;
  options: { value: string; label: string }[];
}

function RHFSelect({
  disabled,
  name,
  label,
  placeholder,
  options,
}: RHFSelectProps) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={name}>{label}</FieldLabel>
          <Select
            disabled={disabled}
            value={field.value}
            onValueChange={field.onChange}
          >
            <SelectTrigger id={name} aria-invalid={fieldState.invalid}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}

export default RHFSelect;

