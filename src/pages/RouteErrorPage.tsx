import { useEffect } from 'react';
import { isRouteErrorResponse, useRouteError } from 'react-router';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { AlertCircleIcon } from '@/components/icons';
import { NotFoundPage } from './NotFoundPage';

export function RouteErrorPage() {
  const error = useRouteError();

  useEffect(() => {
    console.error(error);
  }, [error]);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <NotFoundPage />;
  }

  return (
    <div className="route-error">
      <title>Something went wrong · nesto</title>
      <EmptyState
        tone="error"
        headingLevel="h1"
        icon={<AlertCircleIcon />}
        title="Something went wrong"
        description="An unexpected error occurred. Reloading the page usually fixes it."
        action={<Button onClick={() => window.location.reload()}>Reload page</Button>}
      />
    </div>
  );
}
