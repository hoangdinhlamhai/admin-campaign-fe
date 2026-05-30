import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { fetchFullCampaign, deleteCampaign, publishCampaign, pauseCampaign } from "@/lib/api/campaigns-api";
import { useAuth } from "@/lib/auth/auth-context";
import { AdminShell } from "@/components/campaign-ops/admin-shell";
import { Toast } from "@/components/campaign-ops/toast";
import { CampaignDetailHeader } from "./campaign-detail-header";
import { CampaignDetailStats } from "./campaign-detail-stats";
import { CampaignDetailInfo } from "./campaign-detail-info";
import { CampaignDetailSettings } from "./campaign-detail-settings";
import { CampaignDetailInstructions } from "./campaign-detail-instructions";
import { AssigneeReassignModal } from "./assignee-reassign-modal";

type FullCampaign = Awaited<ReturnType<typeof fetchFullCampaign>>;

export function CampaignDetailPage() {
  const { id = "" } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [data, setData] = useState<FullCampaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [reassignOpen, setReassignOpen] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2200);
  };

  const refetch = () => {
    setLoading(true);
    fetchFullCampaign(id)
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Lỗi tải chiến dịch"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!id) return;
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleEdit = () => navigate(`/campaigns/${id}/edit`);

  const handlePublish = async () => {
    try {
      await publishCampaign(id);
      showToast("Đã xuất bản chiến dịch.");
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi xuất bản");
    }
  };

  const handlePause = async () => {
    try {
      await pauseCampaign(id);
      showToast("Đã tạm dừng chiến dịch.");
      refetch();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi tạm dừng");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Xác nhận xóa chiến dịch này?")) return;
    try {
      await deleteCampaign(id);
      showToast("Đã xóa chiến dịch.");
      window.setTimeout(() => navigate("/campaigns"), 500);
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi xóa");
    }
  };

  return (
    <div>
      <AdminShell activeLabel="Chiến dịch">
        {loading ? (
          <div className="rounded-xl border border-border bg-surface px-4 py-12 text-center text-sm text-muted-foreground">
            Đang tải dữ liệu chiến dịch...
          </div>
        ) : error ? (
          <div className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-4 py-3 text-sm text-rose-300">
            {error}
          </div>
        ) : data ? (
          <div className="space-y-5 pb-8">
            <CampaignDetailHeader
              campaign={data}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onPause={handlePause}
              onPublish={handlePublish}
              onReassignClick={() => setReassignOpen(true)}
              isAdmin={isAdmin}
            />
            <CampaignDetailStats campaignId={id} dailyTarget={data.dailyUserTarget} createdAt={data.createdAt} />
            <div className="grid gap-5 xl:grid-cols-2">
              <CampaignDetailInfo campaign={data} />
              <CampaignDetailSettings settings={data.settings} />
            </div>
            <CampaignDetailInstructions html={data.instructions?.contentHtml ?? ""} />
          </div>
        ) : null}
      </AdminShell>
      <Toast message={toast} />
      {reassignOpen && data && (
        <AssigneeReassignModal
          campaignId={data.id}
          campaignName={data.name}
          currentAssigneeId={data.assignedTo}
          onClose={() => setReassignOpen(false)}
          onSuccess={() => {
            setReassignOpen(false);
            refetch();
          }}
        />
      )}
    </div>
  );
}
