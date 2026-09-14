import { paths } from '@/app/paths';
import { ButtonLink } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { SearchIcon } from '@/components/icons';

export function NotFoundPage() {
  return (
    <>
      <title>Page not found · nesto</title>
      <EmptyState
        headingLevel="h1"
        icon={<SearchIcon />}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved."
        action={<ButtonLink to={paths.home}>Back to rates</ButtonLink>}
      />
    </>
  );
}
