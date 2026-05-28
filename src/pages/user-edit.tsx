import { useParams } from 'react-router'
import { UserFormPage } from '@/components/user-management/user-form-page'

export default function UserEditPage() {
  const { id } = useParams<{ id: string }>()
  return <UserFormPage userId={id} />
}
