export type CampaignCategory = {
  id: string;
  name: string;
  website: string;
  initials: string;
  slug: string;
  description: string;
  parentId: string | null;
  count: number;
  dailyUsers: number;
  completedToday: number;
  missingToday: number;
  status: "active" | "paused";
  createdAt: string;
};

export const campaignCategories: CampaignCategory[] = [
  {
    id: "category-electronics",
    name: "Caraluna",
    website: "caraluna.com",
    initials: "CL",
    slug: "can-dien-tu",
    description: "",
    parentId: null,
    count: 5,
    dailyUsers: 25,
    completedToday: 18,
    missingToday: 7,
    status: "active",
    createdAt: "2026-05-22",
  },
  {
    id: "category-caraluna",
    name: "Luna Silver",
    website: "lunasilver.com",
    initials: "LS",
    slug: "caraluna",
    description: "Nhóm chiến dịch Caraluna đang chạy theo ngày.",
    parentId: null,
    count: 5,
    dailyUsers: 25,
    completedToday: 25,
    missingToday: 0,
    status: "active",
    createdAt: "2026-05-20",
  },
  {
    id: "category-real-estate",
    name: "Luna Fashion",
    website: "lunafashion.com",
    initials: "LF",
    slug: "du-an-bds",
    description: "",
    parentId: null,
    count: 5,
    dailyUsers: 25,
    completedToday: 10,
    missingToday: 15,
    status: "active",
    createdAt: "2026-05-18",
  },
  {
    id: "category-compressor",
    name: "Soul Match",
    website: "soulmatch.com",
    initials: "SM",
    slug: "may-nen-khi-truc-vit",
    description: "",
    parentId: null,
    count: 5,
    dailyUsers: 25,
    completedToday: 20,
    missingToday: 5,
    status: "active",
    createdAt: "2026-05-17",
  },
  {
    id: "category-sao-viet",
    name: "Astro AI",
    website: "astroai.com",
    initials: "AI",
    slug: "astro-ai",
    description: "",
    parentId: null,
    count: 5,
    dailyUsers: 25,
    completedToday: 10,
    missingToday: 15,
    status: "paused",
    createdAt: "2026-05-16",
  },
  {
    id: "category-telecom",
    name: "thietbivienthong",
    website: "thietbivienthong.com",
    initials: "TV",
    slug: "thietbivienthong",
    description: "",
    parentId: null,
    count: 6,
    dailyUsers: 25,
    completedToday: 20,
    missingToday: 5,
    status: "active",
    createdAt: "2026-05-15",
  },
  {
    id: "category-child-chain",
    name: "Dây chuyền bạc",
    website: "caraluna.com/day-chuyen",
    initials: "DC",
    slug: "day-chuyen-bac",
    description: "Chiến dịch dây chuyền bạc nữ",
    parentId: "category-electronics",
    count: 2,
    dailyUsers: 10,
    completedToday: 8,
    missingToday: 2,
    status: "active",
    createdAt: "2026-05-23",
  },
  {
    id: "category-child-ring",
    name: "Nhẫn bạc nữ",
    website: "caraluna.com/nhan-bac",
    initials: "NB",
    slug: "nhan-bac-nu",
    description: "Chiến dịch nhẫn bạc nữ cao cấp",
    parentId: "category-electronics",
    count: 3,
    dailyUsers: 8,
    completedToday: 6,
    missingToday: 2,
    status: "active",
    createdAt: "2026-05-24",
  },
  {
    id: "category-child-bracelet",
    name: "Lắc tay bạc",
    website: "lunasilver.com/lac-tay",
    initials: "LT",
    slug: "lac-tay-bac",
    description: "Chiến dịch lắc tay bạc Luna Silver",
    parentId: "category-caraluna",
    count: 2,
    dailyUsers: 12,
    completedToday: 10,
    missingToday: 2,
    status: "active",
    createdAt: "2026-05-21",
  },
  {
    id: "category-child-earring",
    name: "Bông tai bạc",
    website: "lunasilver.com/bong-tai",
    initials: "BT",
    slug: "bong-tai-bac",
    description: "Chiến dịch bông tai bạc Luna Silver",
    parentId: "category-caraluna",
    count: 1,
    dailyUsers: 5,
    completedToday: 5,
    missingToday: 0,
    status: "active",
    createdAt: "2026-05-22",
  },
  {
    id: "category-child-dress",
    name: "Váy dạ hội",
    website: "lunafashion.com/vay",
    initials: "VD",
    slug: "vay-da-hoi",
    description: "Chiến dịch váy dạ hội Luna Fashion",
    parentId: "category-real-estate",
    count: 3,
    dailyUsers: 15,
    completedToday: 7,
    missingToday: 8,
    status: "active",
    createdAt: "2026-05-19",
  },
];

export function createCategorySlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}
