import { RefreshCw } from "lucide-react";
import type { CampaignCategory } from "@/lib/campaign-categories-data";
import type { CampaignCreateForm } from "@/lib/campaign-create-data";
import type { UserApi } from "@/lib/api/users-api";
import type { AuthUser } from "@/lib/auth/auth-storage";

type CampaignBasicFormProps = {
  categories: CampaignCategory[];
  form: CampaignCreateForm;
  onChange: (form: CampaignCreateForm) => void;
  onGeneratePass: () => void;
  users: UserApi[];
  currentUser: AuthUser | null;
  isAdmin: boolean;
};

export function CampaignBasicForm({ categories, form, onChange, onGeneratePass, users, currentUser, isAdmin }: CampaignBasicFormProps) {
  return (
    <section className="glass-card p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-foreground">Thông tin cơ bản</h3>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="text-sm font-medium text-foreground">Danh mục <span className="text-rose-300">*</span></span>
          <select
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-border-strong"
            onChange={(event) => onChange({ ...form, categoryId: event.target.value })}
            value={form.categoryId}
          >
            <option value="">-- Chọn danh mục con --</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <div className="block">
          <span className="text-sm font-medium text-foreground">Trạng thái</span>
          <button
            className="mt-2 inline-flex h-11 items-center gap-3 rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground"
            onClick={() => onChange({ ...form, active: !form.active })}
            type="button"
          >
            <span className={`relative h-6 w-11 rounded-full transition ${form.active ? "bg-brand" : "bg-surface-2"}`}>
              <span className={`absolute top-1 size-4 rounded-full bg-white transition ${form.active ? "left-6" : "left-1"}`} />
            </span>
            {form.active ? "Hoạt động" : "Tạm dừng"}
          </button>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Người phụ trách</span>
          {isAdmin ? (
            <select
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-border-strong"
              value={form.assigneeId ?? ""}
              onChange={(e) => onChange({ ...form, assigneeId: e.target.value || null })}
            >
              <option value="">— Chưa phân công —</option>
              {users.filter(u => u.status === "active").map(u => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role === "admin" ? "Admin" : "NV"})
                </option>
              ))}
            </select>
          ) : (
            <select
              disabled
              className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition disabled:opacity-70"
              value={currentUser?.id ?? ""}
            >
              <option value={currentUser?.id ?? ""}>
                Bạn ({currentUser?.name ?? "—"})
              </option>
            </select>
          )}
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Tên chiến dịch <span className="text-rose-300">*</span></span>
          <input
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
            onChange={(event) => onChange({ ...form, name: event.target.value })}
            value={form.name}
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">URL đích (nếu có)</span>
          <input
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
            onChange={(event) => onChange({ ...form, url: event.target.value })}
            value={form.url}
          />
          <span className="mt-1 block text-xs text-muted-foreground">Trang đích mà user sẽ truy cập.</span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Keyword / Mục tiêu tìm kiếm <span className="text-rose-300">*</span></span>
          <input
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
            onChange={(event) => onChange({ ...form, keyword: event.target.value })}
            value={form.keyword}
          />
          <span className="mt-1 block text-xs text-muted-foreground">Từ khóa mà user sẽ tìm trên Google.</span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Số user cần chạy / ngày <span className="text-rose-300">*</span></span>
          <input
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 font-mono text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
            min={0}
            onChange={(event) => onChange({ ...form, dailyUsers: event.target.value })}
            type="number"
            value={form.dailyUsers}
          />
          <span className="mt-1 block text-xs text-muted-foreground">Số user cần hoàn thành mỗi ngày.</span>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Mật khẩu (Pass) <span className="text-rose-300">*</span></span>
          <div className="mt-2 flex gap-2">
            <input
              className="h-11 min-w-0 flex-1 rounded-xl border border-border bg-background px-3 font-mono text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
              onChange={(event) => onChange({ ...form, pass: event.target.value })}
              value={form.pass}
            />
            <button className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-border bg-surface-2 px-3 text-sm font-semibold text-foreground transition hover:bg-surface-2/80" onClick={onGeneratePass} type="button">
              <RefreshCw className="size-4" />
              Sinh
            </button>
          </div>
        </label>

        <label className="block">
          <span className="text-sm font-medium text-foreground">Ưu tiên hiển thị</span>
          <select
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-border-strong"
            onChange={(event) => onChange({ ...form, priority: event.target.value as CampaignCreateForm["priority"] })}
            value={form.priority}
          >
            <option value="low">Thấp</option>
            <option value="medium">Trung bình</option>
            <option value="high">Cao</option>
          </select>
        </label>

        <label className="block md:col-span-2">
          <span className="text-sm font-medium text-foreground">Số lần nhập sai tối đa cho 1 user <span className="text-rose-300">*</span></span>
          <input
            className="mt-2 h-11 w-full rounded-xl border border-border bg-background px-3 font-mono text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-border-strong"
            min={1}
            onChange={(event) => onChange({ ...form, maxWrongAttempts: event.target.value })}
            type="number"
            value={form.maxWrongAttempts}
          />
          <span className="mt-1 block text-xs text-muted-foreground">User nhập sai quá số lần này sẽ tự động chuyển sang chiến dịch khác.</span>
        </label>
      </div>
    </section>
  );
}
