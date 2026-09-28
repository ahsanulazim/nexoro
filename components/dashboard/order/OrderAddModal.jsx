import { createOrder, getOrder, updateOrder } from "@/api/fetchOrder";
import { useAppForm } from "@/components/ui/forms/CustomHookForm";
import { useAuth } from "@/context/AuthProvider";
import { MyContext } from "@/context/MyProvider";
import { orderSchema } from "@/validator/orderValidator";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { toast } from "react-toastify";

const OrderAddModal = ({ ref, isEditing, orderId }) => {
  const { currentUser } = useAuth();

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
        clientId: isEditing ? orderData?.order?.clientId || "" : "",
        slug: isEditing
          ? orderData?.order?.service?.slug || orderData?.order?.service || ""
          : "",
        planId: isEditing ? orderData?.order?.planId || "" : "",
        serviceName: isEditing
          ? orderData?.order?.serviceName ||
            orderData?.order?.service?.title ||
            ""
          : "",
        servicePrice: isEditing
          ? orderData?.order?.servicePrice || orderData?.order?.price || 0
          : 0,
        payment: isEditing ? orderData?.order?.payment || "" : "",
        paymentMethod: isEditing ? orderData?.order?.paymentMethod || "" : "",
        discount: isEditing ? orderData?.order?.discount || 0 : 0,
        amount: isEditing ? orderData?.order?.amount || 0 : 0,
        deadline: isEditing
          ? orderData?.order?.deadline
            ? new Date(orderData.order.deadline).toISOString().split("T")[0]
            : ""
          : "",
        assignToSelf: false,
      },
      onSubmit: ({ value }) => {
        const isMember = currentUser?.user?.role === "member";
        const creatorName = isMember
          ? currentUser?.user?.name ||
            currentUser?.user?.displayName ||
            currentUser?.user?.email ||
            "Member"
          : currentUser?.user?.name || "Admin";
        const creatorRole = currentUser?.user?.role || "admin";
        const creatorId = currentUser?.user?._id || null;

        isEditing
          ? mutate({ ...value, orderId })
          : mutate({
              ...value,
              createdBy: creatorName,
              createdByRole: creatorRole,
              createdById: creatorId,
              assignToSelf: Boolean(value.assignToSelf),
              assignedTo: value.assignToSelf ? creatorId : null,
            });
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
                    data={[
                      { value: "custom", label: "Custom" },
                      ...services?.map((item) => ({
                        value: item.slug,
                        label: item.title,
                      })),
                    ]}
                    isError={servicesError}
                    isLoading={servicesLoading}
                  />
                )}
              />

              <Subscribe
                selector={(state) => state.values.slug}
                children={(currentSlug) =>
                  currentSlug === "custom" ? (
                    <>
                      <AppField
                        name="serviceName"
                        children={(field) => (
                          <field.TextField
                            label="Service Name"
                            placeholder="Service Name"
                          />
                        )}
                      />
                      <AppField
                        name="servicePrice"
                        children={(field) => (
                          <field.NumberField
                            label="Service Price"
                            placeholder="Service Price"
                          />
                        )}
                      />
                    </>
                  ) : (
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
                  )
                }
              />

              <AppField
                name="deadline"
                children={(field) => (
                  <field.TextField
                    label="Project Deadline"
                    type="date"
                    placeholder="Select deadline"
                  />
                )}
              />

              {!isEditing && currentUser?.user?.role === "member" && (
                <AppField
                  name="assignToSelf"
                  children={(field) => (
                    <div className="bg-base-200/50 p-3 rounded-box border border-base-content/10">
                      <label className="label cursor-pointer justify-between py-0">
                        <div className="flex flex-col">
                          <span className="label-text font-semibold text-sm">
                            Assign this order to me
                          </span>
                          <span className="text-[11px] text-base-content/60">
                            Automatically assign yourself as the project owner
                          </span>
                        </div>
                        <input
                          type="checkbox"
                          className="checkbox checkbox-primary checkbox-sm"
                          checked={Boolean(field.state.value)}
                          onChange={(e) => field.handleChange(e.target.checked)}
                        />
                      </label>
                    </div>
                  )}
                />
              )}

              {isEditing && (
                <div className="flex items-center justify-between p-3 bg-base-200/70 border border-base-content/10 rounded-box">
                  <div>
                    <span className="text-xs font-semibold uppercase tracking-wider opacity-60 block">
                      Order Status
                    </span>
                    <span className="text-[11px] opacity-70">
                      Automated based on tasks
                    </span>
                  </div>
                  <span
                    className={`badge font-semibold ${
                      orderData?.order?.status === "Completed"
                        ? "badge-success"
                        : orderData?.order?.status === "Processing"
                          ? "badge-warning"
                          : orderData?.order?.status === "Cancelled"
                            ? "badge-error"
                            : "badge-info"
                    }`}
                  >
                    {orderData?.order?.status || "Pending"}
                  </span>
                </div>
              )}

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
              <Subscribe
                selector={(state) => state.values.payment}
                children={(currentPayment) =>
                  currentPayment !== "Success" ? (
                    <AppField
                      name="amount"
                      children={(field) => <field.NumberField label="Amount" />}
                    />
                  ) : null
                }
              />

              <AppField
                name="paymentMethod"
                children={(field) => (
                  <field.SelectField
                    label="Select Payment Method"
                    data={[
                      { value: "Bank", label: "Bank" },
                      { value: "EPS", label: "EPS" },
                      { value: "Cash", label: "Cash" },
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
