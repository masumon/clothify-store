"use client";

import { useState } from "react";

type Props = {
  orderId: string;
  currentStatus: string;
};

export default function OrderStatusSelect({ orderId, currentStatus }: Props) {
  const [status, setStatus] = useState(currentStatus);
  const [updating, setUpdating] = useState(false);

  const handleChange = async (value: string) => {
    try {
      setStatus(value);
      setUpdating(true);

      const response = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: value }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update status");
      }

      alert("Order status updated");
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to update status";
      alert(message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
      aria-label="Order Status"
      title="Order Status"
      value={status}
      disabled={updating}
      onChange={(e) => handleChange(e.target.value)}
      className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none"
    >
      <option value="Pending">Pending</option>
      <option value="Completed">Completed</option>
      <option value="Cancelled">Cancelled</option>
    </select>
  );
}
