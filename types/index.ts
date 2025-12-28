export type User = {
  _id: string;
  name: string;
  email: string;
  role: "user" | "admin" | "superAdmin";
  status: "active" | "blocked" | "deleted";
  currency?: "USD" | "JOD" | "SP";
  createdAt?: string;
  updatedAt?: string;
  image?: string;
  maxManagedUsers?: number;
  canSeeAllOrders?: boolean;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type UserListResponse = {
  users: User[];
  meta?: {
    page: number;
    rowsPerPage: number;
    total: number;
    totalPages: number;
  };
};

export type Product = {
  _id: string;
  name: string;
  image: string;
  category: string;
  price: string;
  description?: string;
  colors?: string[];
  sizes?: string[];
  status: "active" | "inactive" | "deleted";
  createdAt?: string;
  updatedAt?: string;
  visibleToUsers?: string[];
};

export type ProductListResponse = {
  products: Product[];
  meta?: {
    page: number;
    rowsPerPage: number;
    total: number;
    totalPages: number;
  };
};

export type OrderItem = {
  prod_id:
    | {
        _id: string;
        name: string;
        image?: string;
      }
    | string;
  count: number;
  size?: string;
  color?: string;
  price: number;
};

export type Order = {
  _id: string;
  user:
    | {
        _id: string;
        name: string;
        email: string;
      }
    | string;
  items: OrderItem[];
  address: string;
  shipping: number;
  total: number;
  discount?: number;
  notes?: string;
  phoneNumber: string;
  userName: string;
  status: "pending" | "paid" | "shipped" | "completed" | "cancelled";
  createdByAdmin?:
    | {
        _id: string;
        name: string;
        email: string;
      }
    | string;
  createdAt?: string;
  updatedAt?: string;
};

export type OrderListResponse = {
  orders: Order[];
  meta?: {
    page: number;
    rowsPerPage: number;
    total: number;
    totalPages: number;
  };
};
