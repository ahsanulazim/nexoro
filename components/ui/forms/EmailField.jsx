import { LuMail } from "react-icons/lu";
import { useFieldContext } from "./CustomHookForm";

const EmailField = ({ label, placeholder }) => {
  const field = useFieldContext();

  const { errors, isTouched } = field.state.meta;

  return (
    <>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <label htmlFor={field.name} className="input input-lg w-full">
        <LuMail className="size-4 opacity-50" />
        <input
          type="email"
          placeholder={placeholder}
          name={field.name}
          value={field.state.value ?? ""}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </label>
      {isTouched && errors?.length > 0 && (
        <p className="text-error">{errors[0].message}</p>
      )}
    </>
  );
};

export default EmailField;
