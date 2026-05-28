export type CampaignCreateForm = {
  categoryId: string;
  active: boolean;
  name: string;
  url: string;
  keyword: string;
  dailyUsers: string;
  pass: string;
  priority: "low" | "medium" | "high";
  maxWrongAttempts: string;
  assigneeId: string | null;
};

export const defaultCampaignCreateForm: CampaignCreateForm = {
  categoryId: "",
  active: true,
  name: "",
  url: "",
  keyword: "",
  dailyUsers: "",
  pass: "",
  priority: "medium",
  maxWrongAttempts: "3",
  assigneeId: null,
};

export const campaignBasicDraftStorageKey = "senlyzer-campaign-basic-draft";
export const campaignInstructionDraftStorageKey = "senlyzer-campaign-instruction-draft";
export const campaignAdvancedSettingsStorageKey = "senlyzer-campaign-advanced-settings";
export const campaignEditingIdStorageKey = "senlyzer-campaign-editing-id";

export function getEditingCampaignId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(campaignEditingIdStorageKey);
}

export function getCampaignWizardBase(): string {
  const id = getEditingCampaignId();
  return id ? `/campaigns/${id}/edit` : "/campaigns/new";
}

export const campaignCreateSteps = [
  {
    id: 1,
    title: "Thông tin cơ bản",
    description: "Thiết lập thông tin chung",
  },
  {
    id: 2,
    title: "Hướng dẫn nhiệm vụ",
    description: "Nội dung và cách thực hiện",
  },
  {
    id: 3,
    title: "Cài đặt nâng cao",
    description: "Quy tắc & Tự động hóa",
  },
  {
    id: 4,
    title: "Xem trước & Xác nhận",
    description: "Kiểm tra và tạo chiến dịch",
  },
];

export const defaultInstructionHtml = `
  <h2 style="text-align: center; color: rgb(252, 211, 211);">LÀM THEO HƯỚNG DẪN ĐỂ LẤY PASS XÁC MINH DANH TÍNH</h2>
  <p>✅ Vào GOOGLE.COM.VN</p>
  <p>✅ Copy hoặc Gõ từ khóa: <strong data-instruction-keyword="true">dây chuyền bạc nữ</strong></p>
  <p>✅ Tìm từ trên xuống sẽ thấy trang như hình bên dưới</p>
  <p style="text-align: center; color: rgb(113, 113, 122); font-style: italic;">Thêm ảnh minh họa vào đây</p>
  <p>✅ Di chuyển xuống dưới website phần lấy mã <strong style="color: rgb(252, 211, 211);">4 số cuối như hình</strong></p>
  <p style="text-align: center; color: rgb(113, 113, 122); font-style: italic;">Thêm ảnh pass vào đây</p>
`;

export function generateInstructionHtml(form: CampaignCreateForm): string {
  const keyword = form.keyword || "từ khóa chiến dịch";
  return `
  <h2 style="text-align: center; color: rgb(252, 211, 211);">LÀM THEO HƯỚNG DẪN ĐỂ LẤY PASS XÁC MINH DANH TÍNH</h2>
  <p>✅ Vào GOOGLE.COM.VN</p>
  <p>✅ Copy hoặc Gõ từ khóa: <strong data-instruction-keyword="true">${keyword}</strong></p>
  <p>✅ Tìm từ trên xuống sẽ thấy trang như hình bên dưới</p>
  <p style="text-align: center; color: rgb(113, 113, 122); font-style: italic;">Thêm ảnh minh họa vào đây</p>
  <p>✅ Di chuyển xuống dưới website phần lấy mã <strong style="color: rgb(252, 211, 211);">4 số cuối như hình</strong></p>
  <p style="text-align: center; color: rgb(113, 113, 122); font-style: italic;">Thêm ảnh pass vào đây</p>
`;
}

export function replaceKeywordInHtml(html: string, newKeyword: string, oldKeyword?: string): string {
  if (typeof document === "undefined" || !html) return html;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  const replacement = newKeyword || "từ khóa chiến dịch";

  const marked = wrapper.querySelectorAll<HTMLElement>("[data-instruction-keyword]");
  if (marked.length > 0) {
    marked.forEach((node) => {
      node.textContent = replacement;
    });
    return wrapper.innerHTML;
  }

  if (oldKeyword && oldKeyword.trim()) {
    const candidates = wrapper.querySelectorAll<HTMLElement>("strong, b");
    let matched = false;
    candidates.forEach((node) => {
      if ((node.textContent ?? "").trim() === oldKeyword.trim()) {
        node.textContent = replacement;
        node.setAttribute("data-instruction-keyword", "true");
        matched = true;
      }
    });
    if (matched) return wrapper.innerHTML;
  }

  return html;
}

export type CampaignAdvancedSettings = {
  notifyLowUsers: boolean;
  lowUsersThreshold: string;
  notifyCampaignPaused: boolean;
  autoReactivateNextDay: boolean;
  limitWrongPass: boolean;
  maxWrongPassAttempts: string;
  pauseOnNoValidEntry: boolean;
  noValidEntryDisplays: string;
};

export const defaultAdvancedSettings: CampaignAdvancedSettings = {
  notifyLowUsers: true,
  lowUsersThreshold: "5",
  notifyCampaignPaused: true,
  autoReactivateNextDay: true,
  limitWrongPass: true,
  maxWrongPassAttempts: "3",
  pauseOnNoValidEntry: true,
  noValidEntryDisplays: "5",
};
