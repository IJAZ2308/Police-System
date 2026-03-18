import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "@workspace/api-client-react";
import { getAuthHeaders } from "./use-auth";

// --- DASHBOARD ---
export function useDashboardStatsQuery() {
  return api.useGetDashboardStats({
    request: { headers: getAuthHeaders() },
    query: { enabled: !!getAuthHeaders() }
  });
}

// --- CRIME ---
export function usePredictCrimeQuery() {
  return api.usePredictCrime({
    request: { headers: getAuthHeaders() },
    query: { enabled: !!getAuthHeaders() }
  });
}

export function useCrimeStatsQuery() {
  return api.useGetCrimeStats({
    request: { headers: getAuthHeaders() },
    query: { enabled: !!getAuthHeaders() }
  });
}

// --- REPORTS ---
export function useReportsQuery(params?: api.ListReportsParams) {
  return api.useListReports(params, {
    request: { headers: getAuthHeaders() },
    query: { enabled: !!getAuthHeaders() }
  });
}

export function useCreateReportMutation() {
  const qc = useQueryClient();
  return api.useCreateReport({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: api.getListReportsQueryKey() })
    }
  });
}

export function useUpdateReportMutation() {
  const qc = useQueryClient();
  return api.useUpdateReport({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: api.getListReportsQueryKey() })
    }
  });
}

// --- ALERTS ---
export function useAlertsQuery() {
  return api.useListAlerts({
    request: { headers: getAuthHeaders() },
    query: { enabled: !!getAuthHeaders(), refetchInterval: 5000 } // Mock realtime
  });
}

export function useSendAlertMutation() {
  const qc = useQueryClient();
  return api.useSendAlert({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: api.getListAlertsQueryKey() })
    }
  });
}

export function useResolveAlertMutation() {
  const qc = useQueryClient();
  return api.useResolveAlert({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: api.getListAlertsQueryKey() })
    }
  });
}

// --- FIR ---
export function useFirsQuery() {
  return api.useListFirs({
    request: { headers: getAuthHeaders() },
    query: { enabled: !!getAuthHeaders() }
  });
}

export function useGenerateFirMutation() {
  const qc = useQueryClient();
  return api.useGenerateFir({
    request: { headers: getAuthHeaders() },
    mutation: {
      onSuccess: () => qc.invalidateQueries({ queryKey: api.getListFirsQueryKey() })
    }
  });
}

// --- FACE RECOGNITION ---
export function useMatchFaceMutation() {
  return api.useMatchFace({
    request: { headers: getAuthHeaders() }
  });
}

// --- OFFICERS ---
export function useOfficersQuery() {
  return api.useListOfficers({
    request: { headers: getAuthHeaders() },
    query: { enabled: !!getAuthHeaders() }
  });
}

export function useOfficerActivityQuery() {
  return api.useGetOfficerActivity({
    request: { headers: getAuthHeaders() },
    query: { enabled: !!getAuthHeaders() }
  });
}

// --- CASES ---
export function useCasesQuery() {
  return api.useListCases({
    request: { headers: getAuthHeaders() },
    query: { enabled: !!getAuthHeaders() }
  });
}

// --- CHATBOT ---
export function useChatbotMutation() {
  return api.useSendChatMessage({
    request: { headers: getAuthHeaders() }
  });
}

// --- PATROL ---
export function usePatrolRoutesQuery() {
  return api.useGetPatrolRoutes({
    request: { headers: getAuthHeaders() },
    query: { enabled: !!getAuthHeaders() }
  });
}
