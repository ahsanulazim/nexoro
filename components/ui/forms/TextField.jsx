import { useFieldContext } from "./CustomHookForm";

const TextField = ({ label, placeholder, type = "text", min, max }) => {
  const field = useFieldContext();

  const { errors, isTouched } = field.state.meta;

  return (
    <>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <input
        type={type}
        className="input w-full"
        placeholder={placeholder}
        name={field.name}
        min={min}
        max={max}
        value={field.state.value ?? ""}
        onBlur={field.handleBlur}
        onChange={(e) => field.handleChange(e.target.value)}
      />
      {isTouched && errors?.length > 0 && (
        <p className="text-error">{errors[0].message}</p>
      )}
    </>
  );
};

export default TextField;
