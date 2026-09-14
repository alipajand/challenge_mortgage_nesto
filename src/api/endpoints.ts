import { request } from './client';
import type { Application, CreateApplication, Product, UpdateApplication } from './types';

export function getProducts(signal?: AbortSignal): Promise<Product[]> {
  return request<Product[]>('/products', { signal });
}

const applicationPath = (id: string) => `/applications/${encodeURIComponent(id)}`;

function withApplicants(application: Application): Application {
  return {
    ...application,
    applicants: Array.isArray(application.applicants) ? application.applicants : [],
  };
}

export async function getApplications(signal?: AbortSignal): Promise<Application[]> {
  const applications = await request<Application[]>('/applications', { signal });
  return applications.map(withApplicants);
}

export async function getApplication(id: string, signal?: AbortSignal): Promise<Application> {
  return withApplicants(await request<Application>(applicationPath(id), { signal }));
}

export async function createApplication(payload: CreateApplication): Promise<Application> {
  return withApplicants(
    await request<Application>('/applications', { method: 'POST', body: payload }),
  );
}

export async function updateApplication(
  id: string,
  payload: UpdateApplication,
): Promise<Application> {
  return withApplicants(
    await request<Application>(applicationPath(id), { method: 'PUT', body: payload }),
  );
}
