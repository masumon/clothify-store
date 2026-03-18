import assert from "node:assert/strict";
import test from "node:test";
import { handleCreateOrder } from "@/lib/api/orders";
import { getSupabaseAdminClient } from "@/lib/supabase-admin";

type MockState = {
  products: Array<{
    id: string;
    name: string;
    price: number;
    stock_quantity: number;
    is_published: boolean;
  }>;
  createdAt: string;
  orderCount: number;
  nextOrderId: string;
  duplicateTrxIds: Set<string>;
  insertedOrders: Array<Record<string, unknown>>;
  orderItems: Array<Record<string, unknown>>;
  stockUpdates: Array<{ id: string; stock_quantity: number }>;
};

class MockSelectBuilder {
  private filters = new Map<string, unknown>();

  constructor(
    private readonly table: string,
    private readonly columns: string,
    private readonly options: Record<string, unknown> | undefined,
    private readonly state: MockState
  ) {}

  eq(field: string, value: unknown) {
    this.filters.set(`eq:${field}`, value);
    return this;
  }

  in(field: string, values: unknown[]) {
    this.filters.set(`in:${field}`, values);
    return Promise.resolve(this.executeMany());
  }

  limit(value: number) {
    this.filters.set("limit", value);
    return Promise.resolve(this.executeMany());
  }

  gte(field: string, value: unknown) {
    this.filters.set(`gte:${field}`, value);
    return this;
  }

  lt(field: string, value: unknown) {
    this.filters.set(`lt:${field}`, value);
    return Promise.resolve(this.executeMany());
  }

  single() {
    return Promise.resolve(this.executeSingle());
  }

  private executeMany() {
    if (this.table === "products") {
      const ids = (this.filters.get("in:id") as string[] | undefined) || [];
      const data = this.state.products.filter((product) => ids.includes(product.id));
      return { data, error: null };
    }

    if (this.table === "orders" && this.columns === "id") {
      if (this.options?.head) {
        return { data: null, error: null, count: this.state.orderCount };
      }

      const trxId = this.filters.get("eq:bkash_trx_id");
      const data =
        typeof trxId === "string" && this.state.duplicateTrxIds.has(trxId)
          ? [{ id: "existing-order" }]
          : [];
      return { data, error: null };
    }

    return { data: [], error: null, count: 0 };
  }

  private executeSingle() {
    if (this.table === "orders" && this.columns === "created_at") {
      return {
        data: { created_at: this.state.createdAt },
        error: null,
      };
    }

    return { data: null, error: null };
  }
}

class MockInsertBuilder {
  private shouldReturnId = false;

  constructor(
    private readonly table: string,
    private readonly rows: Array<Record<string, unknown>>,
    private readonly state: MockState
  ) {}

  select(columns: string) {
    this.shouldReturnId = columns === "id";
    return this;
  }

  single() {
    if (this.table === "orders") {
      this.state.insertedOrders.push(...this.rows);
      return Promise.resolve({
        data: this.shouldReturnId ? { id: this.state.nextOrderId } : null,
        error: null,
      });
    }

    return Promise.resolve({ data: null, error: null });
  }

  then<TResult1 = unknown, TResult2 = never>(
    onfulfilled?: ((value: { data: unknown; error: null }) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
  ) {
    let payload: { data: unknown; error: null } = { data: null, error: null };

    if (this.table === "order_items") {
      this.state.orderItems.push(...this.rows);
      payload = { data: this.rows, error: null };
    }

    return Promise.resolve(payload).then(onfulfilled ?? undefined, onrejected ?? undefined);
  }
}

class MockUpdateBuilder {
  constructor(
    private readonly table: string,
    private readonly values: Record<string, unknown>,
    private readonly state: MockState
  ) {}

  eq(field: string, value: unknown) {
    if (this.table === "products" && field === "id") {
      this.state.stockUpdates.push({
        id: String(value),
        stock_quantity: Number(this.values.stock_quantity || 0),
      });
    }

    return Promise.resolve({ data: null, error: null });
  }
}

function createMockSupabase(overrides: Partial<MockState> = {}) {
  const state: MockState = {
    products: [],
    createdAt: "2026-03-18T05:10:00.000Z",
    orderCount: 0,
    nextOrderId: "ord-1001",
    duplicateTrxIds: new Set<string>(),
    insertedOrders: [],
    orderItems: [],
    stockUpdates: [],
    ...overrides,
  };

  const client = {
    from(table: string) {
      return {
        select(columns: string, options?: Record<string, unknown>) {
          return new MockSelectBuilder(table, columns, options, state);
        },
        insert(rows: Array<Record<string, unknown>>) {
          return new MockInsertBuilder(table, rows, state);
        },
        update(values: Record<string, unknown>) {
          return new MockUpdateBuilder(table, values, state);
        },
      };
    },
  };

  return {
    state,
    client: client as unknown as ReturnType<typeof getSupabaseAdminClient>,
  };
}

function createOrderRequest(totalAmount: number) {
  return new Request("http://localhost/api/orders", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-forwarded-for": "198.51.100.20",
    },
    body: JSON.stringify({
      customer_name: "Rahim Uddin",
      phone: "01712345678",
      address: "Sylhet Sadar, Sylhet",
      delivery_method: "Home Delivery",
      courier_name: "Pathao",
      payment_method: "Cash on Delivery",
      total_amount: totalAmount,
      bkash_trx_id: "",
      items: [
        {
          product_id: "prod-1",
          quantity: 2,
          selected_size: "L",
        },
      ],
      website: "",
      client_started_at: 1_000_000,
    }),
  });
}

test("orders route rejects client amount mismatch", async () => {
  const { client, state } = createMockSupabase({
    products: [
      {
        id: "prod-1",
        name: "Premium Panjabi",
        price: 800,
        stock_quantity: 6,
        is_published: true,
      },
    ],
  });

  const response = await handleCreateOrder(createOrderRequest(999), {
    getSupabaseClient: () => client,
    now: () => 1_005_000,
    consumeRateLimit: async () => ({
      allowed: true,
      current: 1,
      remaining: 7,
      retryAfterMs: 0,
      limit: 8,
      storeMode: "memory",
    }),
  });

  assert.equal(response.status, 409);
  assert.deepEqual(await response.json(), {
    error: "Order amount mismatch. Please refresh cart and try again.",
    expected_total: 1600,
  });
  assert.equal(state.insertedOrders.length, 0);
});

test("orders route creates order, saves items, updates stock, and returns invoice", async () => {
  const notifications: Array<Record<string, unknown>> = [];
  const { client, state } = createMockSupabase({
    products: [
      {
        id: "prod-1",
        name: "Premium Panjabi",
        price: 800,
        stock_quantity: 6,
        is_published: true,
      },
    ],
    createdAt: "2026-03-18T05:10:00.000Z",
    orderCount: 3,
    nextOrderId: "ord-1001",
  });

  const response = await handleCreateOrder(createOrderRequest(1600), {
    getSupabaseClient: () => client,
    now: () => 1_005_000,
    sendNotification: async (payload) => {
      notifications.push(payload as unknown as Record<string, unknown>);
    },
    consumeRateLimit: async () => ({
      allowed: true,
      current: 1,
      remaining: 7,
      retryAfterMs: 0,
      limit: 8,
      storeMode: "memory",
    }),
  });

  assert.equal(response.status, 201);
  assert.deepEqual(await response.json(), {
    id: "ord-1001",
    created_at: "2026-03-18T05:10:00.000Z",
    invoice_number: "INV-20260318-0004",
  });
  assert.equal(state.insertedOrders.length, 1);
  assert.equal(state.orderItems.length, 1);
  assert.deepEqual(state.stockUpdates, [{ id: "prod-1", stock_quantity: 4 }]);
  assert.equal(notifications.length, 1);
});
