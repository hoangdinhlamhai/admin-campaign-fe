import { useState, useEffect, useCallback } from "react";
import {
  fetchCampaigns,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  publishCampaign,
  pauseCampaign,
  type CampaignApi,
  type CreateCampaignDto,
  type UpdateCampaignDto,
} from "@/lib/api/campaigns-api";
import type { Campaign } from "@/lib/campaign-ops-data";

function apiToCampaign(api: CampaignApi): Campaign {
  return {
    id: api.id,
    code: api.code,
    parentCategoryId: api.parentCategoryId,
    childCategoryId: api.childCategoryId,
    name: api.name,
    keyword: api.keyword,
    targetUrl: api.targetUrl,
    passCode: api.passCode ?? api.passCodeEncrypted ?? null,
    dailyUserTarget: api.dailyUserTarget,
    priority: api.priority,
    maxWrongAttempts: api.maxWrongAttempts,
    status: api.status,
    createdAt: api.createdAt,
    completedCount: api.completedCount ?? 0,
    missingCount: api.missingCount ?? 0,
    displayCount: api.displayCount ?? 0,
    wrongEntryCount: api.wrongEntryCount ?? 0,
    validEntryCount: api.validEntryCount ?? 0,
    assignedTo: api.assignedTo,
    assignedToName: api.assignedToName,
    isOwner: api.isOwner,
  };
}

async function loadCampaigns(
  date: string | undefined,
  setCampaigns: (c: Campaign[]) => void,
  setLoading: (v: boolean) => void,
  setError: (e: string | null) => void,
) {
  setLoading(true);
  setError(null);
  try {
    const res = await fetchCampaigns(date);
    const items = Array.isArray(res) ? res : (res.value ?? []);
    setCampaigns(items.map(apiToCampaign));
  } catch (e) {
    setError(e instanceof Error ? e.message : "Lỗi tải dữ liệu");
  } finally {
    setLoading(false);
  }
}

export function useCampaignsApi(date?: string) {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadCampaigns(date, setCampaigns, setLoading, setError);
  }, [date]);

  const refetch = useCallback(() => {
    loadCampaigns(date, setCampaigns, setLoading, setError);
  }, [date]);

  const addCampaign = useCallback(async (data: CreateCampaignDto) => {
    try {
      await createCampaign(data);
      await loadCampaigns(date, setCampaigns, setLoading, setError);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tạo chiến dịch");
      return false;
    }
  }, [date]);

  const updateCampaignById = useCallback(async (id: string, data: UpdateCampaignDto) => {
    try {
      await updateCampaign(id, data);
      await loadCampaigns(date, setCampaigns, setLoading, setError);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi cập nhật chiến dịch");
      return false;
    }
  }, [date]);

  const deleteCampaignById = useCallback(async (id: string) => {
    try {
      await deleteCampaign(id);
      await loadCampaigns(date, setCampaigns, setLoading, setError);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi xóa chiến dịch");
    }
  }, [date]);

  const publishCampaignById = useCallback(async (id: string) => {
    try {
      await publishCampaign(id);
      await loadCampaigns(date, setCampaigns, setLoading, setError);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi xuất bản chiến dịch");
      return false;
    }
  }, [date]);

  const pauseCampaignById = useCallback(async (id: string) => {
    try {
      await pauseCampaign(id);
      await loadCampaigns(date, setCampaigns, setLoading, setError);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lỗi tạm dừng chiến dịch");
      return false;
    }
  }, [date]);

  return {
    campaigns,
    loading,
    error,
    addCampaign,
    updateCampaign: updateCampaignById,
    deleteCampaign: deleteCampaignById,
    publishCampaign: publishCampaignById,
    pauseCampaign: pauseCampaignById,
    refetch,
  };
}
