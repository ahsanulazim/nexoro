"use client";

import { useState } from "react";
import { LuEye, LuEyeOff } from "react-icons/lu";

const PasswordInput = ({ label, name, placeholder, onChange, value }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <label className="label" htmlFor={name}>
        {label}
      </label>
      <label className="input w-full flex items-center">
        <input
          type={visible ? "text" : "password"}
          name={name}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={onChange}
          required
          className="flex-1"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          className="ml-2"
        >
          {visible ? (
            <LuEyeOff className="size-5 opacity-70" />
          ) : (
            <LuEye className="size-5 opacity-50" />
          )}
        </button>
      </label>
    </div>
  );
};

export default PasswordInput;
