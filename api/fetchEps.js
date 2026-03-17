//Initialize Payment Request API
export const fetchPaymentRequest = async ({ slug, plan, ...customer }) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE}/payment/eps/get-token`,
      { method: "post" },
    );
    const data = await res.json();
    const token = data.token;

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
