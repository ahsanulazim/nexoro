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

export const { useFieldContext, useFormContext, fieldContext, formContext } =
  createFormHookContexts();

export const { useAppForm } = createFormHook({
  fieldComponents: {
    TextField,
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
