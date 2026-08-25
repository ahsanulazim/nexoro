"use client";
import {
  createFormHook,
  createFormHookContexts,
} from "@tanstack/react-form-nextjs";
import TextField from "./TextField";
import SelectField from "./SelectField";
import SubmitButton from "./SubmitButton";
import SearchSelectField from "./SearchSelectField";
import NumberField from "./NumberField";
import PasswordField from "./PasswordField";
import UsernameField from "./UsernameField";
import EmailField from "./EmailField";

export const { useFieldContext, useFormContext, fieldContext, formContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    UsernameField,
    EmailField,
    TextField,
    PasswordField,
    SelectField,
    SearchSelectField,
    NumberField,
  },
  formComponents: {
    SubmitButton,
  },
  fieldContext,
  formContext,
});
