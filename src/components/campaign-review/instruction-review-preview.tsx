import { useState } from "react";
import { Link } from "react-router";
import { DEFAULT_PREVIEW_DEVICE_ID, getPreviewDevice } from "@/lib/preview-devices";
import { getCampaignWizardBase } from "@/lib/campaign-create-data";
import { DevicePreviewToggle } from "@/components/campaign-instructions/device-preview-toggle";
import { InstructionRenderer } from "@/components/campaign-instructions/instruction-renderer";
import { ReviewCard } from "./review-card";

type InstructionReviewPreviewProps = {
  content: string;
};

export function InstructionReviewPreview({ content }: InstructionReviewPreviewProps) {
  const [deviceId, setDeviceId] = useState(DEFAULT_PREVIEW_DEVICE_ID);
  const device = getPreviewDevice(deviceId);

  return (
    <ReviewCard
      action={<Link className="text-sm font-semibold text-emerald-200 hover:text-emerald-100" to={`${getCampaignWizardBase()}/instructions`}>Sửa</Link>}
      description="Preview readonly nội dung user sẽ nhìn thấy khi làm nhiệm vụ."
      title="Preview hướng dẫn user"
    >
      <div className="mb-4">
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
          <InstructionRenderer
            html={content}
            className="min-h-72 rounded-2xl border border-white/10 bg-zinc-950/45 p-5 text-sm leading-7 text-zinc-200"
          />
        </div>
      </div>
    </ReviewCard>
  );
}
