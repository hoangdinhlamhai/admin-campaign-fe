import { useParams } from 'react-router'
import { CreateCampaignPage } from '@/components/campaign-create/create-campaign-page'

export default function CampaignEditPage() {
  const { id } = useParams<{ id: string }>()
  return <CreateCampaignPage campaignId={id} />
}
