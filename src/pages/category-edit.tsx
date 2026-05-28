import { useParams, useLocation } from 'react-router'
import { CategoryFormPage } from '@/components/campaign-categories/category-form-page'

export default function CategoryEditPage() {
  const { id } = useParams<{ id: string }>()
  const { pathname } = useLocation()
  const mode = pathname.includes('/children') ? 'child' : 'parent'
  return <CategoryFormPage categoryId={id} mode={mode} />
}
