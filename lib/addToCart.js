import { sendGTMEvent } from "@next/third-parties/google";

export default function addToCart(product) {
  sendGTMEvent({
    event: "add_to_cart",
    ecommerce: {
      currency: "USD",
      value: product.price * product.quantity,
      items: [
        {
          item_id: product.id,
          item_name: product.name,
          item_category: product.category,
          price: product.price,
          quantity: product.quantity,
        },
      ],
    },
  });
}
