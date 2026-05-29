import { useState } from "react";
import { Modal } from "@/components/common/modal";
import { UserPicker } from "@/components/common/user-picker";
import { assignCampaign } from "@/lib/api/campaigns-api";

type Props = {
  campaignId: string;
  campaignName: string;
  currentAssigneeId: string | null;
  onClose: () => void;
  onSuccess: () => void;
};

export function AssigneeReassignModal({
  campaignId,
  campaignName,
  currentAssigneeId,
  onClose,
  onSuccess,
}: Props) {
  const [selected, setSelected] = useState<string | null>(currentAssigneeId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setLoading(true);
    setError("");
    try {
      await assignCampaign(campaignId, selected);
      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Không thể đổi người phụ trách");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      onClose={loading ? () => {} : onClose}
      title="Đổi người phụ trách"
      footer={
        <>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="h-10 rounded-xl border border-border bg-surface-2 px-4 text-sm font-semibold text-foreground transition hover:bg-surface disabled:opacity-50"
          >
            Huỷ
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={loading}
            className="h-10 rounded-xl bg-brand px-4 text-sm font-bold text-brand-foreground transition hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Đang lưu..." : "Lưu"}
          </button>
        </>
      }
    >
      <p className="mb-3 text-sm text-muted-foreground">
        Chiến dịch: <span className="font-semibold text-foreground">{campaignName}</span>
      </p>
      <UserPicker value={selected} onChange={setSelected} includeUnassigned disabled={loading} />
      {error && <p className="mt-3 text-sm text-rose-400">{error}</p>}
    </Modal>
  );
}
