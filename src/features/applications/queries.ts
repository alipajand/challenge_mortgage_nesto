import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createApplication,
  getApplication,
  getApplications,
  updateApplication,
} from '@/api/endpoints';
import type { Application, UpdateApplication } from '@/api/types';

const listKey = ['applications', 'list'];
const detailKey = (id: string) => ['applications', 'detail', id];

export function useApplications() {
  return useQuery({
    queryKey: listKey,
    queryFn: ({ signal }) => getApplications(signal),
  });
}

export function useApplication(id: string) {
  return useQuery({
    queryKey: detailKey(id),
    queryFn: ({ signal }) => getApplication(id, signal),
  });
}

function useSyncApplicationCache() {
  const queryClient = useQueryClient();

  return (application: Application) => {
    queryClient.setQueryData(detailKey(application.id), application);
    void queryClient.invalidateQueries({ queryKey: listKey });
  };
}

export function useCreateApplication() {
  const syncCache = useSyncApplicationCache();
  return useMutation({ mutationFn: createApplication, onSuccess: syncCache });
}

export function useUpdateApplication(id: string) {
  const syncCache = useSyncApplicationCache();
  return useMutation({
    mutationFn: (payload: UpdateApplication) => updateApplication(id, payload),
    onSuccess: syncCache,
  });
}
