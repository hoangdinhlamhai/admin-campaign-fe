import { useLocation } from 'react-router'
import { CategoryFormPage } from '@/components/campaign-categories/category-form-page'

export default function CategoryNewPage() {
  const { pathname } = useLocation()
  const mode = pathname.includes('/children') ? 'child' : 'parent'
  return <CategoryFormPage mode={mode} />
}
