import React, { useState } from "react";
import { hmacHex } from "./utils/hmac";

const initialProducts = [
  { id: 1, name: "T-shirt", price: 20.0, inventory: 5 },
  { id: 2, name: "Coffee Mug", price: 12.0, inventory: 2 },
  { id: 3, name: "Sticker", price: 2.0, inventory: 0 }
];

export default function App() {
  const [products, setProducts] = useState(initialProducts);
  const [activity, setActivity] = useState("Actions and results will appear here.");

  async function handlePurchase(productId) {
    setActivity(`Preparing purchase for product ${productId}...`);
    const product = products.find((p) => p.id === productId);
    if (!product) {
      setActivity("Product not found");
      return;
    }

    const payload = JSON.stringify({ productId, qty: 1 });
    const secret = "dev-secret";
    let token;
    try {
      token = await hmacHex(secret, payload);
    } catch (err) {
      setActivity("Failed to compute token: " + err.message);
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, qty: 1, paymentToken: token })
      });
      const data = await res.json();

      if (res.status === 201) {
        setActivity(`Order created (id=${data.order.id}) for product ${productId}`);

        product.inventory -= 1;
        setProducts(products);
      } else {
        setActivity("Purchase failed: " + JSON.stringify(data));
      }
    } catch (err) {
      setActivity("Network error: " + err.message);
    }
  }

  return (
    <div className="mx-auto max-w-4xl py-8">
      <h2 className="text-xl font-medium mb-4">Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="bg-white border rounded-lg p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-lg font-semibold">{p.name}</h4>
                <div className="text-sm text-gray-500">${p.price.toFixed(2)}</div>
              </div>
              <div className="text-xs text-gray-500">ID: {p.id}</div>
            </div>

            <p className="mt-3 text-sm text-gray-600">
              Inventory: <span>{p.inventory}</span>
            </p>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-500">{p.inventory > 0 ? "In stock" : "Out of stock"}</div>
              <button
                onClick={() => handlePurchase(p.id)}
                disabled={p.inventory <= 0}
                className="px-4 py-2 rounded bg-brand text-white hover:bg-teal-600 disabled:opacity-60"
              >
                Buy 1
              </button>
            </div>
          </div>
        ))}
      </div>

      <section className="mt-8">
        <h3 className="text-lg font-medium mb-2">Activity</h3>
        <div className="min-h-[56px] bg-white border rounded p-3 text-sm text-gray-700">{activity}</div>
      </section>
    </div>
  );
}