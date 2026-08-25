import { useFieldContext } from "./CustomHookForm";
import { LuUser } from "react-icons/lu";

const UsernameField = ({ label, placeholder }) => {
  const field = useFieldContext();
  const { isTouched, errors } = field.state.meta;

  return (
    <>
      <label htmlFor={field.name} className="label text-sm">
        {label}
      </label>
      <label className="input input-lg w-full">
        <LuUser className="size-4 opacity-50" />
        <input
          type="text"
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

export default UsernameField;
