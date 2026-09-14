import { useNavigate } from 'react-router';
import { getErrorMessage } from '@/api/client';
import type { Product } from '@/api/types';
import { paths } from '@/app/paths';
import { ErrorState } from '@/components/EmptyState';
import { PageHeader } from '@/components/PageHeader';
import { useToast } from '@/components/Toast';
import { useCreateApplication } from '@/features/applications/queries';
import { BestProducts, BestProductsSkeleton } from '@/features/products/BestProducts';
import { useProducts } from '@/features/products/queries';

export function ProductsPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const productsQuery = useProducts();
  const createApplication = useCreateApplication();

  function handleSelect(product: Product) {
    if (createApplication.isPending) return;

    createApplication.mutate(
      { productId: product.id },
      {
        onSuccess: (application) => navigate(paths.application(application.id)),
        onError: (error) =>
          toast.error({
            title: "We couldn't start your application",
            description: getErrorMessage(error),
          }),
      },
    );
  }

  let content = <BestProductsSkeleton />;

  if (productsQuery.data) {
    content = (
      <BestProducts
        products={productsQuery.data}
        onSelect={handleSelect}
        selectingProductId={
          createApplication.isPending ? createApplication.variables.productId : undefined
        }
      />
    );
  } else if (productsQuery.isError) {
    content = (
      <ErrorState
        title="We couldn't load today's rates"
        message={getErrorMessage(productsQuery.error)}
        onRetry={() => void productsQuery.refetch()}
        isRetrying={productsQuery.isFetching}
      />
    );
  }

  return (
    <>
      <title>Best mortgage rates · nesto</title>
      <PageHeader
        align="center"
        title="Get the lowest rate on your first try"
        description="Compare today's best fixed and variable mortgage rates, then pick the one that suits you to start your application."
      />
      {content}
    </>
  );
}
