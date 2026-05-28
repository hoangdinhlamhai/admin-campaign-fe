import { createBrowserRouter, Navigate } from 'react-router'
import { App } from './app'
import { lazy } from 'react'
import { ProtectedRoute } from './components/auth/protected-route'

/* eslint-disable react-refresh/only-export-components */
const OverviewPage = lazy(() => import('./pages/overview'))
const CampaignsPage = lazy(() => import('./pages/campaigns'))
const CampaignCreatePage = lazy(() => import('./pages/campaign-create'))
const CampaignInstructionsPage = lazy(() => import('./pages/campaign-instructions'))
const CampaignAdvancedPage = lazy(() => import('./pages/campaign-advanced'))
const CampaignReviewPage = lazy(() => import('./pages/campaign-review'))
const CampaignEditPage = lazy(() => import('./pages/campaign-edit'))
const CampaignDetailPage = lazy(() => import('./pages/campaign-detail'))
const CategoriesPage = lazy(() => import('./pages/categories'))
const CategoryChildrenPage = lazy(() => import('./pages/category-children'))
const CategoryNewPage = lazy(() => import('./pages/category-new'))
const CategoryEditPage = lazy(() => import('./pages/category-edit'))
const UsersPage = lazy(() => import('./pages/users'))
const UserNewPage = lazy(() => import('./pages/user-new'))
const UserEditPage = lazy(() => import('./pages/user-edit'))
const AlertsPage = lazy(() => import('./pages/alerts'))
const SettingsPage = lazy(() => import('./pages/settings'))
const LoginPage = lazy(() => import('./pages/login'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <App />,
        children: [
          { index: true, element: <Navigate to="/overview" replace /> },
          { path: 'overview', element: <OverviewPage /> },
          { path: 'campaigns', element: <CampaignsPage /> },
          { path: 'campaigns/new', element: <CampaignCreatePage /> },
          { path: 'campaigns/new/instructions', element: <CampaignInstructionsPage /> },
          { path: 'campaigns/new/advanced', element: <CampaignAdvancedPage /> },
          { path: 'campaigns/new/review', element: <CampaignReviewPage /> },
          { path: 'campaigns/:id', element: <CampaignDetailPage /> },
          { path: 'campaigns/:id/edit', element: <CampaignEditPage /> },
          { path: 'campaigns/:id/edit/instructions', element: <CampaignInstructionsPage /> },
          { path: 'campaigns/:id/edit/advanced', element: <CampaignAdvancedPage /> },
          { path: 'campaigns/:id/edit/review', element: <CampaignReviewPage /> },
          { path: 'categories', element: <Navigate to="/categories/parents" replace /> },
          { path: 'categories/parents', element: <CategoriesPage /> },
          { path: 'categories/parents/new', element: <CategoryNewPage /> },
          { path: 'categories/parents/:id/edit', element: <CategoryEditPage /> },
          { path: 'categories/children', element: <CategoryChildrenPage /> },
          { path: 'categories/children/new', element: <CategoryNewPage /> },
          { path: 'categories/children/:id/edit', element: <CategoryEditPage /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'users/new', element: <UserNewPage /> },
          { path: 'users/:id/edit', element: <UserEditPage /> },
          { path: 'alerts', element: <AlertsPage /> },
          { path: 'settings', element: <SettingsPage /> },
        ],
      },
    ],
  },
])
