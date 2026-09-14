import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import type { Application, CreateApplication, UpdateApplication } from '@/api/types';
import { config } from '@/config';
import { EMPTY_APPLICANT } from '@/features/applications/applicant';
import { buildApplication, products } from './fixtures';

export const mockDb = {
  products: structuredClone(products),
  applications: [] as Application[],
};

let idCounter = 0;

export function resetMockDb() {
  mockDb.products = structuredClone(products);
  mockDb.applications = [];
  idCounter = 0;
}

export const apiUrl = (path: string) => `${config.apiBaseUrl}${path}`;

export const notFoundResponse = () =>
  HttpResponse.json(
    { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' },
    { status: 500 },
  );

export const server = setupServer(
  http.get(apiUrl('/products'), () => HttpResponse.json(mockDb.products)),

  http.get(apiUrl('/applications'), () => HttpResponse.json(mockDb.applications)),

  http.get(apiUrl('/applications/:id'), ({ params }) => {
    const application = mockDb.applications.find((item) => item.id === params.id);
    return application ? HttpResponse.json(application) : notFoundResponse();
  }),

  http.post(apiUrl('/applications'), async ({ request }) => {
    const { productId } = (await request.json()) as CreateApplication;

    idCounter += 1;
    const application = buildApplication({
      id: `00000000-0000-4000-8000-${String(idCounter).padStart(12, '0')}`,
      productId,
      applicants: [{ ...EMPTY_APPLICANT }],
    });
    mockDb.applications.push(application);

    return HttpResponse.json(application, { status: 201 });
  }),

  http.put(apiUrl('/applications/:id'), async ({ params, request }) => {
    const index = mockDb.applications.findIndex((item) => item.id === params.id);
    const current = mockDb.applications[index];
    if (!current) return notFoundResponse();

    const updated = { ...current, ...((await request.json()) as UpdateApplication) };
    mockDb.applications[index] = updated;

    return HttpResponse.json(updated);
  }),
);
