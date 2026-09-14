import { useState } from 'react';
import { useParams } from 'react-router';
import { getErrorMessage, isNotFoundError } from '@/api/client';
import type { Applicant, Application } from '@/api/types';
import { paths } from '@/app/paths';
import { Alert } from '@/components/Alert';
import { ButtonLink } from '@/components/Button';
import { EmptyState, ErrorState } from '@/components/EmptyState';
import { SearchIcon } from '@/components/icons';
import { PageHeader } from '@/components/PageHeader';
import { useToast } from '@/components/Toast';
import { ApplicantForm } from '@/features/applications/ApplicantForm';
import {
  getApplicationReference,
  getMainApplicant,
  isApplicantComplete,
} from '@/features/applications/applicant';
import { useApplication, useUpdateApplication } from '@/features/applications/queries';
import { ProductCard } from '@/features/products/ProductCard';
import { useProducts } from '@/features/products/queries';
import { formatDate } from '@/lib/format';

export function ApplicationPage() {
  const { applicationId = '' } = useParams();

  return <ApplicationView key={applicationId} applicationId={applicationId} />;
}

function ApplicationView({ applicationId }: { applicationId: string }) {
  const applicationQuery = useApplication(applicationId);

  if (applicationQuery.data) {
    return <ApplicationDetails application={applicationQuery.data} />;
  }

  if (isNotFoundError(applicationQuery.error)) {
    return (
      <>
        <title>Application not found · nesto</title>
        <EmptyState
          headingLevel="h1"
          icon={<SearchIcon />}
          title="Application not found"
          description="This application doesn't exist or is no longer available."
          action={<ButtonLink to={paths.applications}>Back to applications</ButtonLink>}
        />
      </>
    );
  }

  if (applicationQuery.isError) {
    return (
      <ErrorState
        headingLevel="h1"
        title="We couldn't load this application"
        message={getErrorMessage(applicationQuery.error)}
        onRetry={() => void applicationQuery.refetch()}
        isRetrying={applicationQuery.isFetching}
      />
    );
  }

  return (
    <div className="skeleton-stack" aria-busy="true">
      <p role="status" className="visually-hidden">
        Loading application…
      </p>
      <div className="skeleton skeleton-row" />
      <div className="application-layout">
        <div className="skeleton skeleton-card application-form-section" />
        <div className="skeleton skeleton-card application-product-section" />
      </div>
    </div>
  );
}

function ApplicationDetails({ application }: { application: Application }) {
  const toast = useToast();
  const updateApplication = useUpdateApplication(application.id);

  const mainApplicant = getMainApplicant(application);
  const isComplete = isApplicantComplete(mainApplicant);
  const [wasCompleteOnArrival] = useState(isComplete);
  const title = isComplete ? 'Application details' : 'Complete your application';

  async function handleSubmit(applicant: Applicant) {
    await updateApplication.mutateAsync({
      applicants: [applicant, ...application.applicants.slice(1)],
    });
    toast.success({ title: isComplete ? 'Application updated' : 'Application saved' });
  }

  return (
    <>
      <title>{`${title} · nesto`}</title>
      <PageHeader
        backLink={
          wasCompleteOnArrival
            ? { to: paths.applications, label: 'Back to applications' }
            : { to: paths.home, label: 'Back to rates' }
        }
        eyebrow={wasCompleteOnArrival ? undefined : 'Step 2 of 2'}
        title={title}
        status={
          isComplete ? (
            <span className="badge badge-success">Complete</span>
          ) : (
            <span className="badge badge-warning">Incomplete</span>
          )
        }
        description={
          isComplete
            ? "Keep the main applicant's contact information up to date."
            : "Add the main applicant's contact information to finish your application."
        }
        meta={
          <>
            <span>Reference {getApplicationReference(application)}</span>
            <span>Created {formatDate(application.createdAt)}</span>
          </>
        }
      />

      <div className="application-layout">
        <section aria-labelledby="applicant-heading" className="application-form-section">
          <h2 id="applicant-heading" className="application-section-title">
            Main applicant information
          </h2>
          <div className="panel">
            <ApplicantForm
              defaultValues={mainApplicant}
              onSubmit={handleSubmit}
              submitLabel={isComplete ? 'Save changes' : 'Save applicant info'}
            />
          </div>

          {!wasCompleteOnArrival && isComplete && (
            <Alert
              tone="success"
              title="Your application is complete"
              action={
                <ButtonLink to={paths.applications} variant="secondary" size="sm">
                  View all applications
                </ButtonLink>
              }
            >
              You can come back to it anytime from the Applications page.
            </Alert>
          )}
        </section>

        <section aria-labelledby="product-heading" className="application-product-section">
          <h2 id="product-heading" className="application-section-title">
            Selected product
          </h2>
          <SelectedProduct productId={application.productId} />
        </section>
      </div>
    </>
  );
}

function SelectedProduct({ productId }: { productId: Application['productId'] }) {
  const productsQuery = useProducts();
  const product = productsQuery.data?.find((item) => item.id === productId);

  if (product) {
    return <ProductCard product={product} />;
  }

  if (productsQuery.isPending) {
    return <div className="skeleton skeleton-card" />;
  }

  if (productsQuery.isError) {
    return (
      <ErrorState
        headingLevel="h3"
        title="We couldn't load today's rates"
        message={getErrorMessage(productsQuery.error)}
        onRetry={() => void productsQuery.refetch()}
        isRetrying={productsQuery.isFetching}
      />
    );
  }

  return (
    <EmptyState headingLevel="h3" title="Details for this product aren't available right now." />
  );
}
