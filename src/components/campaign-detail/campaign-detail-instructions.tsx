import { useState } from "react";
import { DEFAULT_PREVIEW_DEVICE_ID, getPreviewDevice } from "@/lib/preview-devices";
import { DevicePreviewToggle } from "@/components/campaign-instructions/device-preview-toggle";
import { InstructionRenderer } from "@/components/campaign-instructions/instruction-renderer";

type Props = { html: string };

export function CampaignDetailInstructions({ html }: Props) {
  const [deviceId, setDeviceId] = useState(DEFAULT_PREVIEW_DEVICE_ID);
  const device = getPreviewDevice(deviceId);

  return (
    <section className="rounded-[1.1rem] border border-white/10 bg-zinc-900/58 p-4 shadow-2xl shadow-zinc-950/20 backdrop-blur-2xl sm:p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-lg font-semibold text-white">Hướng dẫn nhiệm vụ</h3>
        <DevicePreviewToggle selectedId={deviceId} onSelect={setDeviceId} />
      </div>

      <div className="flex justify-center">
        <div
          className="w-full"
          style={{
            maxWidth: device.width ? `${device.width}px` : "100%",
            transition: "max-width 200ms ease",
          }}
        >
          <div className="rounded-2xl border border-white/10 bg-zinc-950/45 p-5">
            {html ? (
              <InstructionRenderer html={html} className="text-sm leading-7 text-zinc-200" />
            ) : (
              <p className="py-8 text-center text-sm italic text-zinc-500">Chưa có hướng dẫn cho chiến dịch này.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
