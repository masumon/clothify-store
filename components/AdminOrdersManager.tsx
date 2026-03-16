"use client";

import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import OrderStatusSelect from "@/components/OrderStatusSelect";
import type { Order } from "@/types";

type Props = {
  orders: Order[];
  activeRangeLabel: string;
};

const kanbanStatuses = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Completed",
  "Returned",
  "Cancelled",
] as const;

function parseCourier(deliveryMethod: string) {
  const match = deliveryMethod.match(/Courier:\s*([^|]+)/i);
  return match?.[1]?.trim() || "Unknown";
}

function parsePayment(deliveryMethod: string) {
  const match = deliveryMethod.match(/Payment:\s*([^|]+)/i);
  return match?.[1]?.trim() || "Unknown";
}

export default function AdminOrdersManager({ orders, activeRangeLabel }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [courierFilter, setCourierFilter] = useState("All");

  const courierOptions = useMemo(() => {
    return ["All", ...Array.from(new Set(orders.map((item) => parseCourier(item.delivery_method))))];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const query = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesQuery =
        query.length === 0 ||
        order.customer_name.toLowerCase().includes(query) ||
        order.phone.toLowerCase().includes(query) ||
        order.address.toLowerCase().includes(query) ||
        order.bkash_trx_id.toLowerCase().includes(query);

      const matchesStatus = statusFilter === "All" || order.status === statusFilter;
      const courier = parseCourier(order.delivery_method);
      const matchesCourier = courierFilter === "All" || courier === courierFilter;

      return matchesQuery && matchesStatus && matchesCourier;
    });
  }, [orders, search, statusFilter, courierFilter]);

  const courierReport = useMemo(() => {
    const report = new Map<string, { orders: number; amount: number }>();

    for (const order of filteredOrders) {
      const courier = parseCourier(order.delivery_method);
      const current = report.get(courier) || { orders: 0, amount: 0 };
      current.orders += 1;
      current.amount += Number(order.total_amount || 0);
      report.set(courier, current);
    }

    return Array.from(report.entries())
      .map(([courier, stats]) => ({ courier, ...stats }))
      .sort((a, b) => b.orders - a.orders);
  }, [filteredOrders]);

  const board = useMemo(() => {
    const nextBoard: Record<string, Order[]> = Object.fromEntries(
      kanbanStatuses.map((status) => [status, [] as Order[]])
    );

    for (const order of filteredOrders) {
      const key = kanbanStatuses.includes(order.status as (typeof kanbanStatuses)[number])
        ? order.status
        : "Pending";
      nextBoard[key].push(order);
    }

    return nextBoard;
  }, [filteredOrders]);

  const exportPdf = () => {
    const doc = new jsPDF({ orientation: "landscape" });
    const generatedAt = new Date().toLocaleString();

    doc.setFontSize(16);
    doc.text("Clothify Orders Report", 14, 14);
    doc.setFontSize(10);
    doc.text(`Range: ${activeRangeLabel}`, 14, 21);
    doc.text(`Generated: ${generatedAt}`, 14, 27);
    doc.text(`Filtered Orders: ${filteredOrders.length}`, 14, 33);

    autoTable(doc, {
      startY: 38,
      head: [["Customer", "Phone", "Courier", "Payment", "Amount", "Status", "TRX ID"]],
      body: filteredOrders.map((order) => [
        order.customer_name,
        order.phone,
        parseCourier(order.delivery_method),
        parsePayment(order.delivery_method),
        `৳${order.total_amount}`,
        order.status,
        order.bkash_trx_id,
      ]),
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [15, 118, 110],
      },
    });

    let currentY = (doc as jsPDF & { lastAutoTable?: { finalY?: number } }).lastAutoTable?.finalY || 48;
    currentY += 10;
    doc.setFontSize(12);
    doc.text("Courier-wise Summary", 14, currentY);

    autoTable(doc, {
      startY: currentY + 4,
      head: [["Courier", "Orders", "Amount"]],
      body: courierReport.map((item) => [item.courier, String(item.orders), `৳${item.amount}`]),
      styles: {
        fontSize: 9,
      },
      headStyles: {
        fillColor: [8, 145, 178],
      },
    });

    doc.save(`clothify-orders-${activeRangeLabel.toLowerCase().replace(/\s+/g, "-")}.pdf`);
  };

  return (
    <div>
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_220px_auto]">
          <input
            type="text"
            placeholder="Search by customer, phone, address, TRX"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />

          <select
            aria-label="Filter by status"
            title="Filter by status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          >
            <option value="All">All Status</option>
            {kanbanStatuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by courier"
            title="Filter by courier"
            value={courierFilter}
            onChange={(e) => setCourierFilter(e.target.value)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          >
            {courierOptions.map((courier) => (
              <option key={courier} value={courier}>
                {courier}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={exportPdf}
            className="rounded-xl bg-rose-600 px-5 py-3 font-semibold text-white transition hover:bg-rose-700"
          >
            Export PDF
          </button>
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-slate-900">Courier-wise Report</h2>
          <p className="text-sm font-medium text-slate-500">Filtered by current search and filters</p>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {courierReport.length === 0 ? (
            <p className="text-sm text-slate-500">No courier data for current filters.</p>
          ) : (
            courierReport.map((item) => (
              <div key={item.courier} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-bold text-slate-900">{item.courier}</p>
                <p className="mt-2 text-xs text-slate-500">Orders</p>
                <p className="text-xl font-extrabold text-slate-900">{item.orders}</p>
                <p className="mt-2 text-xs text-slate-500">Amount</p>
                <p className="text-lg font-bold text-teal-700">৳{item.amount}</p>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mb-8 overflow-x-auto">
        <div className="flex min-w-max gap-4">
          {kanbanStatuses.map((status) => (
            <div key={status} className="w-72 rounded-2xl border border-slate-200 bg-white p-3">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-bold text-slate-900">{status}</h3>
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-700">
                  {board[status].length}
                </span>
              </div>

              <div className="space-y-2">
                {board[status].slice(0, 8).map((order) => (
                  <div key={order.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-bold text-slate-900">{order.customer_name}</p>
                    <p className="mt-1 text-xs text-slate-600">৳{order.total_amount}</p>
                    <p className="mt-1 text-xs text-slate-500">{parseCourier(order.delivery_method)}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{order.delivery_method}</p>
                  </div>
                ))}
                {board[status].length === 0 ? (
                  <p className="text-xs text-slate-400">No orders</p>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_10px_28px_-22px_rgba(2,6,23,0.6)]">
        <table className="min-w-full">
          <thead className="bg-slate-50/90">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">Customer</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Address</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Courier</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Payment</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Amount</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Trx ID</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">Update</th>
            </tr>
          </thead>

          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-8 text-center text-sm text-slate-500">
                  No orders found for current filters.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.id} className="border-t border-slate-200 hover:bg-slate-50/70">
                  <td className="px-4 py-3">{order.customer_name}</td>
                  <td className="px-4 py-3">{order.phone}</td>
                  <td className="px-4 py-3">{order.address}</td>
                  <td className="px-4 py-3">{parseCourier(order.delivery_method)}</td>
                  <td className="px-4 py-3">{parsePayment(order.delivery_method)}</td>
                  <td className="px-4 py-3">৳{order.total_amount}</td>
                  <td className="px-4 py-3">{order.bkash_trx_id}</td>
                  <td className="px-4 py-3">{order.status}</td>
                  <td className="px-4 py-3">
                    <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
