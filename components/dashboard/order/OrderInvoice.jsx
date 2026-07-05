const OrderInvoice = ({ orderData, ref }) => {
  return (
    <div ref={ref}>
      <header>
        <h1 className="text-center text-xl font-bold">Nexoro Solutions</h1>
        <h3>Inv No: {orderData.orderId}</h3>
      </header>
    </div>
  );
};

export default OrderInvoice;
