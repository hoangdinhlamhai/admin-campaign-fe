import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Edit3, Maximize2, X } from "lucide-react";
import { Link } from "react-router";
import {
  generateInstructionHtml,
  getCampaignWizardBase,
  type CampaignCreateForm,
} from "@/lib/campaign-create-data";
import { DEFAULT_PREVIEW_DEVICE_ID, getPreviewDevice } from "@/lib/preview-devices";
import { DevicePreviewToggle } from "@/components/campaign-instructions/device-preview-toggle";
import { InstructionRenderer } from "@/components/campaign-instructions/instruction-renderer";

type CampaignGuidePreviewProps = {
  form: CampaignCreateForm;
  instructionHtml?: string;
};

export function CampaignGuidePreview({ form, instructionHtml }: CampaignGuidePreviewProps) {
  const html = instructionHtml && instructionHtml.trim() ? instructionHtml : generateInstructionHtml(form);
  const wizardBase = getCampaignWizardBase();
  const [fullscreen, setFullscreen] = useState(false);
  const [deviceId, setDeviceId] = useState(DEFAULT_PREVIEW_DEVICE_ID);
  const [fullscreenDeviceId, setFullscreenDeviceId] = useState(DEFAULT_PREVIEW_DEVICE_ID);
  const device = getPreviewDevice(deviceId);
  const fullscreenDevice = getPreviewDevice(fullscreenDeviceId);

  useEffect(() => {
    if (!fullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("keydown", handler);
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreen]);

  return (
    <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Xem trước hướng dẫn (Preview)</h3>
        <div className="flex flex-wrap gap-2">
          <DevicePreviewToggle selectedId={deviceId} onSelect={setDeviceId} />
          <Link
            to={`${wizardBase}/instructions`}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]"
          >
            <Edit3 className="size-4" />
            Chỉnh sửa
          </Link>
          <button
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.07] px-3 text-sm font-semibold text-zinc-100 transition hover:bg-white/[0.11]"
            onClick={() => setFullscreen(true)}
            type="button"
          >
            Xem fullscreen
            <Maximize2 className="size-4" />
          </button>
        </div>
      </div>

      <div className="flex justify-center">
        <div
          className="w-full"
          style={{
            maxWidth: device.width ? `${device.width}px` : "100%",
            transition: "max-width 200ms ease",
          }}
        >
          <InstructionRenderer
            html={html}
            className="rounded-2xl border border-white/10 bg-zinc-950/45 p-5 text-sm leading-7 text-zinc-200"
          />
        </div>
      </div>

      {fullscreen && typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-zinc-950/85 p-4 backdrop-blur-md sm:p-8"
            onClick={() => setFullscreen(false)}
            role="dialog"
            aria-modal="true"
          >
            <div
              className="relative flex h-full w-full max-w-6xl flex-col rounded-2xl border border-white/10 bg-zinc-900 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
                <h3 className="text-lg font-semibold text-white">Xem trước hướng dẫn — Fullscreen</h3>
                <div className="flex items-center gap-2">
                  <DevicePreviewToggle selectedId={fullscreenDeviceId} onSelect={setFullscreenDeviceId} />
                  <button
                    className="inline-flex size-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.07] text-zinc-200 transition hover:bg-white/[0.14]"
                    onClick={() => setFullscreen(false)}
                    type="button"
                    aria-label="Đóng"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto p-5 sm:p-8">
                <div className="flex justify-center">
                  <div
                    className="w-full"
                    style={{
                      maxWidth: fullscreenDevice.width ? `${fullscreenDevice.width}px` : "768px",
                      transition: "max-width 200ms ease",
                    }}
                  >
                    <InstructionRenderer
                      html={html}
                      className="rounded-2xl border border-white/10 bg-zinc-950/45 p-6 text-base leading-8 text-zinc-200"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </section>
  );
}
