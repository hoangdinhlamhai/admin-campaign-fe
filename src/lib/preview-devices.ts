export type PreviewDevice = {
  id: string;
  label: string;
  width: number | null;
  icon: "monitor" | "smartphone";
};

export const PREVIEW_DEVICES: PreviewDevice[] = [
  { id: "pc", label: "PC", width: null, icon: "monitor" },
  { id: "iphone-se", label: "iPhone SE", width: 375, icon: "smartphone" },
  { id: "iphone-13", label: "iPhone 13/14", width: 390, icon: "smartphone" },
  { id: "iphone-pm", label: "iPhone Pro Max", width: 430, icon: "smartphone" },
  { id: "android", label: "Android", width: 360, icon: "smartphone" },
];

export const DEFAULT_PREVIEW_DEVICE_ID = "pc";

export function getPreviewDevice(id: string): PreviewDevice {
  return PREVIEW_DEVICES.find((d) => d.id === id) ?? PREVIEW_DEVICES[0];
}
