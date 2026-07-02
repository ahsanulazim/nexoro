import { useFieldContext } from "./CustomHookForm";
import Select from "react-select";

const SearchSelectField = ({ label, data, isLoading, isError }) => {
  const field = useFieldContext();

  const { isTouched, errors } = field.state.meta;
  const currentValue =
    data?.find((option) => option.value === field.state.value) || null;

  return (
    <>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <Select
        classNames={{
          control: (state) =>
            `!bg-base-100 !border !border-white/25 !rounded-md !p-0.5 `,
          menu: () => "!bg-base-100 !rounded-lg !border !border-base-300",
          option: ({ isFocused, isSelected }) =>
            `!cursor-pointer ${
              isSelected
                ? "!bg-primary !text-primary-content"
                : isFocused
                  ? "!bg-base-200"
                  : ""
            }`,
          singleValue: () => "!text-base-content",
          input: () => "!text-base-content",
        }}
        name={field.name}
        isSearchable
        value={currentValue}
        isLoading={isLoading}
        options={data}
        onChange={(option) => field.handleChange(option.value)}
        onBlur={field.handleBlur}
      />
      {isTouched && errors?.length > 0 && (
        <p className="text-error">{errors[0].message}</p>
      )}
    </>
  );
};

export default SearchSelectField;
