import { useFormContext } from "./CustomHookForm";

const SubmitButton = ({ label, isPending }) => {
  const form = useFormContext();

  return (
    <form.Subscribe selector={(state) => state.isSubmitting}>
      {(isSubmitting) => (
        <button
          className={`btn ${isSubmitting || isPending ? "" : "btn-nexoro-primary"}`}
          type="submit"
          disabled={isSubmitting || isPending}
        >
          {isSubmitting || isPending ? (
            <span className="loading loading-spinner"></span>
          ) : (
            label
          )}
        </button>
      )}
    </form.Subscribe>
  );
};

export default SubmitButton;
