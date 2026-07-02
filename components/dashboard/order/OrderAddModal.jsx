import { createOrder, getOrder, updateOrder } from "@/api/fetchOrder";
import { useAppForm } from "@/components/ui/forms/CustomHookForm";
import { MyContext } from "@/context/MyProvider";
import { orderSchema } from "@/validator/orderValidator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "react-toastify";

const OrderAddModal = ({ ref, isEditing, orderId }) => {
  const { data: orderData, isLoading: orderLoading } = useQuery({
    queryKey: ["order", orderId],
    queryFn: getOrder,
    enabled: !!orderId,
  });

  const {
    clientData,
    clientDataLoading,
    clientDataError,
    services,
    servicesLoading,
    servicesError,
  } = useContext(MyContext);

  const { AppField, AppForm, Subscribe, SubmitButton, handleSubmit, reset } =
    useAppForm({
      defaultValues: {
        clientId: isEditing ? orderData?.order?.clientId : "",
        slug: isEditing ? orderData?.order?.service?.slug : "",
        planId: isEditing ? orderData?.order?.planId : "",
        status: isEditing ? orderData?.order?.status : "",
        payment: isEditing ? orderData?.order?.payment : "",
        paymentMethod: isEditing ? orderData?.order?.paymentMethod : "",
        discount: isEditing ? orderData?.order?.discount : 0,
        amount: isEditing ? orderData?.order?.amount : 0,
      },
      onSubmit: ({ value }) => {
        isEditing ? mutate({ ...value, orderId }) : mutate(value);
      },
      validators: {
        onSubmit: orderSchema,
      },
    });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: isEditing ? updateOrder : createOrder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success(isEditing ? "Order Updated" : "Order Added");
      reset();
      ref.current.close();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <dialog ref={ref} className="modal" data-lenis-ignore>
      <div className="modal-box">
        <AppForm>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleSubmit();
            }}
          >
            <fieldset className="fieldset">
              <h2 className="text-xl font-semibold">
                {isEditing ? "Edit Order" : "Add Order"}
              </h2>
              <AppField
                name="clientId"
                children={(field) => (
                  <field.SearchSelectField
                    label="Select Client"
                    data={clientData?.map((item) => ({
                      value: item._id,
                      label: item.name,
                    }))}
                    isError={clientDataError}
                    isLoading={clientDataLoading}
                  />
                )}
              />
              <AppField
                name="slug"
                children={(field) => (
                  <field.SearchSelectField
                    label="Select Service"
                    data={services.map((item) => ({
                      value: item.slug,
                      label: item.title,
                    }))}
                    isError={servicesError}
                    isLoading={servicesLoading}
                  />
                )}
              />

              <Subscribe
                selector={(state) => state.values.slug}
                children={(currentSlug) => (
                  <AppField
                    name="planId"
                    children={(field) => {
                      const selectedServicePlans = services?.find(
                        (service) => service.slug === currentSlug,
                      )?.plans;

                      // ডাটাবেজের (id -> _id) এবং (planName -> name) ফরম্যাট করা
                      const formattedPlans =
                        selectedServicePlans?.map((plan) => ({
                          value: plan.id,
                          label: `${plan.planName} - $${plan.price}`,
                        })) || [];

                      return (
                        <field.SelectField
                          data={formattedPlans}
                          label="Select Plan"
                          isError={servicesError}
                          isLoading={servicesLoading}
                        />
                      );
                    }}
                  />
                )}
              />

              <AppField
                name="status"
                children={(field) => (
                  <field.SelectField
                    label="Select Status"
                    data={[
                      { value: "Pending", label: "Pending" },
                      { value: "Processing", label: "Processing" },
                      { value: "Completed", label: "Completed" },
                      { value: "Cancelled", label: "Cancelled" },
                    ]}
                  />
                )}
              />

              <AppField
                name="discount"
                children={(field) => <field.NumberField label="Discount" />}
              />

              <AppField
                name="payment"
                children={(field) => (
                  <field.SelectField
                    label="Select Payment"
                    data={[
                      { value: "Success", label: "Paid" },
                      { value: "Partial", label: "Partial" },
                      { value: "Pending", label: "Pending" },
                      { value: "Failed", label: "Failed" },
                    ]}
                  />
                )}
              />
              <AppField
                name="amount"
                children={(field) => <field.NumberField label="Amount" />}
              />

              <AppField
                name="paymentMethod"
                children={(field) => (
                  <field.SelectField
                    label="Select Payment Method"
                    data={[
                      { value: "bank", label: "Bank" },
                      { value: "bkash", label: "Bkash" },
                      { value: "nagad", label: "Nagad" },
                      { value: "rocket", label: "Rocket" },
                      { value: "upay", label: "Upay" },
                      { value: "cash", label: "Cash" },
                    ]}
                  />
                )}
              />
              <div className="modal-action">
                <SubmitButton
                  isPending={isPending}
                  label={isEditing ? "Edit Order" : "Add Order"}
                />
                <button
                  type="button"
                  className="btn btn-error"
                  onClick={() => {
                    ref.current.close();
                    reset();
                  }}
                >
                  Close
                </button>
              </div>
            </fieldset>
          </form>
        </AppForm>
      </div>
    </dialog>
  );
};

export default OrderAddModal;
