export type UserRole = "admin" | "employee";
export type UserStatus = "active" | "inactive" | "suspended";

export type Permission =
  | "campaigns.view"
  | "campaigns.create"
  | "campaigns.edit"
  | "campaigns.delete"
  | "categories.view"
  | "categories.create"
  | "categories.edit"
  | "categories.delete"
  | "users.view"
  | "users.manage"
  | "alerts.view"
  | "alerts.manage"
  | "reports.view";

export type PermissionGroup = {
  module: string;
  permissions: { key: Permission; label: string }[];
};

export type User = {
  id: string;
  name: string;
  email: string;
  phone: string;
  initials: string;
  role: UserRole;
  status: UserStatus;
  permissions: Permission[];
  createdAt: string;
  lastLoginAt: string | null;
  createdBy: string;
};

export const permissionGroups: PermissionGroup[] = [
  {
    module: "Chiến dịch",
    permissions: [
      { key: "campaigns.view", label: "Xem chiến dịch" },
      { key: "campaigns.create", label: "Tạo chiến dịch" },
      { key: "campaigns.edit", label: "Sửa chiến dịch" },
      { key: "campaigns.delete", label: "Xóa chiến dịch" },
    ],
  },
  {
    module: "Danh mục",
    permissions: [
      { key: "categories.view", label: "Xem danh mục" },
      { key: "categories.create", label: "Tạo danh mục" },
      { key: "categories.edit", label: "Sửa danh mục" },
      { key: "categories.delete", label: "Xóa danh mục" },
    ],
  },
  {
    module: "Người dùng",
    permissions: [
      { key: "users.view", label: "Xem người dùng" },
      { key: "users.manage", label: "Quản lý người dùng" },
    ],
  },
  {
    module: "Cảnh báo",
    permissions: [
      { key: "alerts.view", label: "Xem cảnh báo" },
      { key: "alerts.manage", label: "Quản lý cảnh báo" },
    ],
  },
  {
    module: "Báo cáo",
    permissions: [
      { key: "reports.view", label: "Xem báo cáo" },
    ],
  },
];

export const allPermissions: Permission[] = permissionGroups.flatMap((g) =>
  g.permissions.map((p) => p.key)
);

export const roleLabels: Record<UserRole, string> = {
  admin: "Admin",
  employee: "Nhân viên",
};

export const statusLabels: Record<UserStatus, string> = {
  active: "Hoạt động",
  inactive: "Ngừng hoạt động",
  suspended: "Bị khóa",
};

export const defaultUsers: User[] = [
  {
    id: "user-1",
    name: "Admin Senlyzer",
    email: "admin@senlyzer.io",
    phone: "0901234567",
    initials: "AS",
    role: "admin",
    status: "active",
    permissions: allPermissions,
    createdAt: "2026-01-01T00:00:00Z",
    lastLoginAt: "2026-05-26T08:00:00Z",
    createdBy: "system",
  },
  {
    id: "user-2",
    name: "Nguyễn Thị Mai",
    email: "mai.nguyen@senlyzer.io",
    phone: "0912345678",
    initials: "NM",
    role: "employee",
    status: "active",
    permissions: ["campaigns.view", "campaigns.create", "campaigns.edit", "categories.view", "alerts.view", "reports.view"],
    createdAt: "2026-02-15T09:00:00Z",
    lastLoginAt: "2026-05-26T07:30:00Z",
    createdBy: "user-1",
  },
  {
    id: "user-3",
    name: "Trần Văn Hùng",
    email: "hung.tran@senlyzer.io",
    phone: "0923456789",
    initials: "TH",
    role: "employee",
    status: "active",
    permissions: ["campaigns.view", "campaigns.create", "campaigns.edit", "campaigns.delete", "categories.view", "categories.create", "categories.edit", "alerts.view", "alerts.manage", "reports.view"],
    createdAt: "2026-03-01T10:00:00Z",
    lastLoginAt: "2026-05-25T17:00:00Z",
    createdBy: "user-1",
  },
  {
    id: "user-4",
    name: "Lê Hoàng Anh",
    email: "anh.le@senlyzer.io",
    phone: "0934567890",
    initials: "LA",
    role: "employee",
    status: "inactive",
    permissions: ["campaigns.view", "categories.view", "reports.view"],
    createdAt: "2026-03-20T14:00:00Z",
    lastLoginAt: "2026-04-10T09:00:00Z",
    createdBy: "user-1",
  },
  {
    id: "user-5",
    name: "Phạm Minh Tuấn",
    email: "tuan.pham@senlyzer.io",
    phone: "0945678901",
    initials: "PT",
    role: "employee",
    status: "suspended",
    permissions: ["campaigns.view", "campaigns.create"],
    createdAt: "2026-04-05T08:00:00Z",
    lastLoginAt: "2026-05-20T11:00:00Z",
    createdBy: "user-1",
  },
  {
    id: "user-6",
    name: "Võ Thị Lan",
    email: "lan.vo@senlyzer.io",
    phone: "0956789012",
    initials: "VL",
    role: "employee",
    status: "active",
    permissions: ["campaigns.view", "categories.view", "categories.create", "categories.edit", "categories.delete", "alerts.view", "reports.view"],
    createdAt: "2026-04-15T11:00:00Z",
    lastLoginAt: "2026-05-26T06:45:00Z",
    createdBy: "user-1",
  },
];
