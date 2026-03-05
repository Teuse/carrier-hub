import { useState } from "react";
import { WorkspaceApi } from "../api";
import type { AnomalyDto, AnomalyStatus } from "../api";

/* ====================================================== */

export function useAnomalies(fetchFn: () => Promise<AnomalyDto[]>) {
  const [anomalies, setAnomalies] = useState<AnomalyDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setIsLoading(true);
    setError(null);
    try {
      setAnomalies(await fetchFn());
    } catch {
      setError("Failed to load anomalies");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (anomalyId: number, status: AnomalyStatus) => {
    try {
      await WorkspaceApi.updateAnomaly(anomalyId, { status });
      await load();
    } catch {
      setError("Failed to update anomaly status");
    }
  };

  const updateNotes = async (anomalyId: number, notes: string) => {
    try {
      await WorkspaceApi.updateAnomaly(anomalyId, { notes });
      await load();
    } catch {
      setError("Failed to update anomaly notes");
    }
  };

  const updateFields = async (
    anomalyId: number,
    fields: { van?: string; pn?: string; kz?: string },
  ) => {
    try {
      await WorkspaceApi.updateAnomaly(anomalyId, fields);
      await load();
    } catch {
      setError("Failed to update anomaly");
    }
  };

  const remove = async (anomalyId: number) => {
    try {
      await WorkspaceApi.deleteAnomaly(anomalyId);
      await load();
    } catch {
      setError("Failed to delete anomaly");
    }
  };

  return { anomalies, isLoading, error, load, updateStatus, updateNotes, updateFields, remove };
}