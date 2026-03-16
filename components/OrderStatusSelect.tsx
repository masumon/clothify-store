"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

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

      const { error } = await supabase
        .from("orders")
        .update({ status: value })
        .eq("id", orderId);

      if (error) throw error;

      alert("Order status updated");
    } catch (error: any) {
      alert(error.message || "Failed to update status");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <select
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
