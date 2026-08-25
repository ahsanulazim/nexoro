import { useState } from "react";
import { useFieldContext } from "./CustomHookForm";
import { LuEye, LuEyeClosed, LuKey } from "react-icons/lu";

const PasswordField = ({ label, placeholder }) => {
  const [isHidden, setIsHidden] = useState(true);

  const field = useFieldContext();
  const { isTouched, errors } = field.state.meta;

  return (
    <>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <label htmlFor={field.name} className="input input-lg w-full">
        <LuKey className="size-4 opacity-50" />
        <input
          type={isHidden ? "password" : "text"}
          placeholder={placeholder}
          name={field.name}
          value={field.state.value ?? ""}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
        />
        <button
          className="cursor-pointer"
          type="button"
          onClick={() => setIsHidden(!isHidden)}
        >
          {isHidden ? <LuEye /> : <LuEyeClosed />}
        </button>
      </label>
      {isTouched && errors?.length > 0 && (
        <p className="text-error">{errors[0].message}</p>
      )}
    </>
  );
};

export default PasswordField;
