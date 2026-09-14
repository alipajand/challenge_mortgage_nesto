import { useMemo } from 'react';
import { getErrorMessage } from '@/api/client';
import { paths } from '@/app/paths';
import { ButtonLink } from '@/components/Button';
import { EmptyState, ErrorState } from '@/components/EmptyState';
import { FolderIcon } from '@/components/icons';
import { PageHeader } from '@/components/PageHeader';
import { getCompleteApplications } from '@/features/applications/applicant';
import {
  ApplicationsTable,
  ApplicationsTableSkeleton,
} from '@/features/applications/ApplicationsTable';
import { useApplications } from '@/features/applications/queries';
import { useProducts } from '@/features/products/queries';

export function ApplicationListPage() {
  const applicationsQuery = useApplications();
  const productsQuery = useProducts();

  const applications = useMemo(
    () => getCompleteApplications(applicationsQuery.data ?? []),
    [applicationsQuery.data],
  );

  const productsById = useMemo(
    () => new Map((productsQuery.data ?? []).map((product) => [product.id, product])),
    [productsQuery.data],
  );

  const count = applications.length;
  let content = <ApplicationsTableSkeleton />;

  if (applicationsQuery.data && count > 0) {
    content = <ApplicationsTable applications={applications} productsById={productsById} />;
  } else if (applicationsQuery.data) {
    content = (
      <EmptyState
        icon={<FolderIcon />}
        title="No applications yet"
        description="Applications show up here once the main applicant's name, email and phone number are saved."
        action={<ButtonLink to={paths.home}>Browse rates</ButtonLink>}
      />
    );
  } else if (applicationsQuery.isError) {
    content = (
      <ErrorState
        title="We couldn't load applications"
        message={getErrorMessage(applicationsQuery.error)}
        onRetry={() => void applicationsQuery.refetch()}
        isRetrying={applicationsQuery.isFetching}
      />
    );
  }

  return (
    <>
      <title>Applications · nesto</title>
      <PageHeader
        title="Applications"
        description="Review completed applications and keep applicant details up to date."
        meta={count > 0 && <span>{count === 1 ? '1 application' : `${count} applications`}</span>}
        actions={count > 0 && <ButtonLink to={paths.home}>New application</ButtonLink>}
      />
      {content}
    </>
  );
}
