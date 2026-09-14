import type { Application, Product } from '@/api/types';
import { paths } from '@/app/paths';
import { ButtonLink } from '@/components/Button';
import { formatDate, formatRate } from '@/lib/format';
import { getFullName, getMainApplicant } from './applicant';

type ApplicationsTableProps = {
  applications: readonly Application[];
  productsById: ReadonlyMap<number, Product>;
};

export function ApplicationsTable({ applications, productsById }: ApplicationsTableProps) {
  return (
    <div className="applications-table-wrapper">
      <table className="applications-table">
        <caption className="visually-hidden">Completed applications</caption>
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Phone</th>
            <th scope="col">Product</th>
            <th scope="col">Created</th>
            <th scope="col">
              <span className="visually-hidden">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {applications.map((application) => {
            const applicant = getMainApplicant(application);
            if (!applicant) return null;

            const fullName = getFullName(applicant);
            const product =
              application.productId == null ? undefined : productsById.get(application.productId);

            return (
              <tr key={application.id}>
                <th scope="row">{fullName}</th>
                <td>
                  <span className="cell-label" aria-hidden="true">
                    Email
                  </span>
                  <span className="cell-email">{applicant.email}</span>
                </td>
                <td>
                  <span className="cell-label" aria-hidden="true">
                    Phone
                  </span>
                  <span className="nowrap">{applicant.phone}</span>
                </td>
                <td>
                  <span className="cell-label" aria-hidden="true">
                    Product
                  </span>
                  {product ? (
                    <span className="cell-product">
                      <span>{product.name}</span>
                      <span className="cell-rate">{formatRate(product.bestRate)}</span>
                    </span>
                  ) : (
                    <span className="muted">Unknown product</span>
                  )}
                </td>
                <td>
                  <span className="cell-label" aria-hidden="true">
                    Created
                  </span>
                  <span className="nowrap">{formatDate(application.createdAt)}</span>
                </td>
                <td className="cell-actions">
                  <ButtonLink to={paths.application(application.id)} variant="secondary" size="sm">
                    Edit
                    <span className="visually-hidden">: {fullName}</span>
                  </ButtonLink>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ApplicationsTableSkeleton() {
  return (
    <div className="skeleton-stack" aria-busy="true">
      <p role="status" className="visually-hidden">
        Loading applications…
      </p>
      <div className="skeleton skeleton-row" />
      <div className="skeleton skeleton-row" />
      <div className="skeleton skeleton-row" />
    </div>
  );
}
