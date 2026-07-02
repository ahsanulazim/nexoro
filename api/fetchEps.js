import api from "@/axios/axiosInstance";

//Initialize Payment Request API
export const fetchPaymentRequest = async ({ slug, plan, ...customer }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/payment/eps/get-token`,
      { method: "post" },
    );
    const data = await res.json();
    const token = data.token;

    localStorage.setItem("epsToken", token);

    const epsRes = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/payment/eps/initialize-payment`,
      {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          slug,
          plan,
          customer,
        }),
      },
    );
    const epsData = await epsRes.json();
    return epsData;
  } catch (error) {
    console.error("Error fetching payment request:", error);
    throw error;
  }
};

//verify payment status
export const confirmOrder = async ({ merchantTransactionId, token, uid }) => {
  const slug = JSON.parse(localStorage.getItem("orderData"))?.slug;
  const planId = JSON.parse(localStorage.getItem("orderData"))?.plan;

  const res = await api.get("/payment/eps/confirm-order", {
    params: {
      uid,
      slug,
      planId,
      merchantTransactionId,
    },
    headers: {
      Authorization: `Bearer ${token}`, // token stored earlier
    },
  });

  return res.data;
};
