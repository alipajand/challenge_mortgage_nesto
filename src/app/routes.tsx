import type { RouteObject } from 'react-router';
import { AppLayout } from '@/components/AppLayout';
import { ApplicationPage } from '@/pages/ApplicationPage';
import { ApplicationListPage } from '@/pages/ApplicationListPage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { ProductsPage } from '@/pages/ProductsPage';
import { RouteErrorPage } from '@/pages/RouteErrorPage';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      {
        errorElement: <RouteErrorPage />,
        children: [
          { index: true, element: <ProductsPage /> },
          { path: 'applications', element: <ApplicationListPage /> },
          { path: 'applications/:applicationId', element: <ApplicationPage /> },
          { path: '*', element: <NotFoundPage /> },
        ],
      },
    ],
  },
];
