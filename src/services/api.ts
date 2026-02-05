import axios from "axios";

const API_URL = "http://localhost:5000/api";
const API_BASE = "http://localhost:5000/api";

// Get auth token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// ================= AUTH =================
export const login = async (username: string, password: string) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Login failed");
  return data;
};

export const register = async (data: {
  username: string;
  phone: string;
  password: string;
}) => {
  console.log("📤 Sending registration request to:", `${API_URL}/auth/register`);
  console.log("📤 Request body:", JSON.stringify(data, null, 2));
  
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  
  const responseData = await res.json();
  console.log("📥 Registration response:", responseData);
  
  if (!res.ok) {
    throw new Error(responseData.message || "Registration failed");
  }
  return responseData;
};

export const getCurrentUser = async () => {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to get user");
  return res.json();
};

// ================= USERS (Customers) =================
export const getUsers = async () => {
  const res = await fetch(`${API_URL}/customers`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const getUserById = async (id: string) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch user");
  return res.json();
};

export const updateUser = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update user");
  return res.json();
};

export const deleteUser = async (id: string) => {
  const res = await fetch(`${API_URL}/users/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};

export const createUser = async (data: {
  username: string;
  name: string;
  email?: string;
  phone: string;
  password: string;
  address?: string;
  village?: string;
  taluka?: string;
  district?: string;
  role?: string;
  status?: string;
}) => {
  const res = await fetch(`${API_URL}/users`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Failed to create user");
  }
  return res.json();
};

// ================= MILK =================
export const getMilkEntries = async (filters?: { userId?: string; date?: string; startDate?: string; endDate?: string }) => {
  const params = new URLSearchParams();
  if (filters?.userId) params.append("userId", filters.userId);
  if (filters?.date) params.append("date", filters.date);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  
  const res = await fetch(`${API_URL}/milk?${params}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch milk entries");
  return res.json();
};

export const getMilkStats = async (userId?: string) => {
  const params = userId ? `?userId=${userId}` : "";
  const res = await fetch(`${API_URL}/milk/stats${params}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch milk stats");
  return res.json();
};

export const addMilk = async (data: {
  userId?: string;
  date?: Date | string;
  timeOfDay?: string;
  quantity: number;
  fat?: number;
  rate?: number;
  notes?: string;
}) => {
  const res = await fetch(`${API_URL}/milk`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add milk entry");
  return res.json();
};

export const updateMilk = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/milk/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update milk entry");
  return res.json();
};

export const deleteMilk = async (id: string) => {
  const res = await fetch(`${API_URL}/milk/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete milk entry");
  return res.json();
};

// ================= PAYMENTS =================
export const getPayments = async (filters?: { userId?: string; status?: string }) => {
  const params = new URLSearchParams();
  if (filters?.userId) params.append("userId", filters.userId);
  if (filters?.status) params.append("status", filters.status);
  
  const res = await fetch(`${API_URL}/payments?${params}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch payments");
  return res.json();
};

export const getPaymentStats = async (userId?: string) => {
  const params = userId ? `?userId=${userId}` : "";
  const res = await fetch(`${API_URL}/payments/stats${params}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch payment stats");
  return res.json();
};

export const addPayment = async (data: {
  userId?: string;
  milkEntryId?: string;
  amount: number;
  date?: Date;
  dueDate?: Date;
  mode?: string;
  reference?: string;
  notes?: string;
}) => {
  const res = await fetch(`${API_URL}/payments`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add payment");
  return res.json();
};

export const updatePaymentStatus = async (id: string, data: {
  status: string;
  paymentDate?: Date;
  mode?: string;
  reference?: string;
}) => {
  const res = await fetch(`${API_URL}/payments/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update payment");
  return res.json();
};

// ================= BUFFALOES =================
export const getBuffaloes = async (assignedTo?: string) => {
  const params = assignedTo ? `?assignedTo=${assignedTo}` : "";
  const res = await fetch(`${API_URL}/buffaloes${params}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch buffaloes");
  return res.json();
};

export const getBuffaloStats = async () => {
  const res = await fetch(`${API_URL}/buffaloes/stats`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch buffalo stats");
  return res.json();
};

export const addBuffalo = async (data: any) => {
  const res = await fetch(`${API_URL}/buffaloes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add buffalo");
  return res.json();
};

export const updateBuffalo = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/buffaloes/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update buffalo");
  return res.json();
};

export const deleteBuffalo = async (id: string) => {
  const res = await fetch(`${API_URL}/buffaloes/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete buffalo");
  return res.json();
};

// ================= EXPENSES =================
export const getExpenses = async (filters?: { category?: string; status?: string; startDate?: string; endDate?: string }) => {
  const params = new URLSearchParams();
  if (filters?.category) params.append("category", filters.category);
  if (filters?.status) params.append("status", filters.status);
  if (filters?.startDate) params.append("startDate", filters.startDate);
  if (filters?.endDate) params.append("endDate", filters.endDate);
  
  const res = await fetch(`${API_URL}/expenses?${params}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch expenses");
  return res.json();
};

export const getExpenseStats = async () => {
  const res = await fetch(`${API_URL}/expenses/stats`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch expense stats");
  return res.json();
};

export const addExpense = async (data: any) => {
  const res = await fetch(`${API_URL}/expenses`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add expense");
  return res.json();
};

export const updateExpense = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update expense");
  return res.json();
};

export const deleteExpense = async (id: string) => {
  const res = await fetch(`${API_URL}/expenses/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete expense");
  return res.json();
};

// ================= INVENTORY =================
export const getInventory = async (filters?: { category?: string; status?: string }) => {
  const params = new URLSearchParams();
  if (filters?.category) params.append("category", filters.category);
  if (filters?.status) params.append("status", filters.status);
  
  const res = await fetch(`${API_URL}/inventory?${params}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch inventory");
  return res.json();
};

export const getInventoryStats = async () => {
  const res = await fetch(`${API_URL}/inventory/stats`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch inventory stats");
  return res.json();
};

export const addInventoryItem = async (data: any) => {
  const res = await fetch(`${API_URL}/inventory`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add inventory item");
  return res.json();
};

export const updateInventoryItem = async (id: string, data: any) => {
  const res = await fetch(`${API_URL}/inventory/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update inventory item");
  return res.json();
};

export const deleteInventoryItem = async (id: string) => {
  const res = await fetch(`${API_URL}/inventory/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete inventory item");
  return res.json();
};

// ================= ORDERS =================
export const getOrdersByUser = async (userId: string) => {
  const res = await fetch(`${API_URL}/orders/user/${userId}`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
};

export const createOrder = async (data: any) => {
  const res = await fetch(`${API_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getAllOrders = async () => {
  const res = await fetch(`${API_URL}/orders`, {
    headers: getAuthHeader(),
  });
  return res.json();
};

export const approveOrder = async (orderId: string) => {
  const res = await fetch(`${API_URL}/orders/${orderId}/approve`, {
    method: "PATCH",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to approve order");
  return res.json();
};

export const cancelOrder = async (orderId: string) => {
  const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
    method: "PATCH",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to cancel order");
  return res.json();
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const res = await fetch(`${API_URL}/orders/${orderId}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify({ status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
};

// ================= SUBSCRIPTIONS =================
export const saveSubscription = async (data: any) => {
  const res = await fetch(`${API_URL}/subscriptions`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const getUserSubscription = async (userId: string) => {
  const res = await fetch(`${API_URL}/subscriptions/user/${userId}`, {
    headers: getAuthHeader(),
  });
  return res.json();
};

// ================= PRICES =================
export const getPrices = async () => {
  const res = await fetch(`${API_URL}/prices`, {
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to fetch prices");
  return res.json();
};

export const addPrice = async (data: { name: string; pricePerLiter: number; unit: string }) => {
  const res = await fetch(`${API_URL}/prices`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add price");
  return res.json();
};

export const updatePrice = async (id: string, data: { name?: string; pricePerLiter?: number; unit?: string }) => {
  const res = await fetch(`${API_URL}/prices/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...getAuthHeader() },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update price");
  return res.json();
};

export const deletePrice = async (id: string) => {
  const res = await fetch(`${API_URL}/prices/${id}`, {
    method: "DELETE",
    headers: getAuthHeader(),
  });
  if (!res.ok) throw new Error("Failed to delete price");
  return res.json();
};
