import { useEffect, useState } from "react";
import type { Cliente } from "../components/types/cliente.types";
import api from "../services/api";

interface UseClientesArgs {
  busca: string;
  status?: string;
  segmentos?: string[];
  origens?: string[];
  minGasto?: string;
  maxGasto?: string;
  minTicket?: string;
  maxTicket?: string;
  ordenacao?: string;
  page: number;
  limit: number;
}

export function useClientes({ 
  busca, status, segmentos, origens, 
  minGasto, maxGasto, minTicket, maxTicket, 
  ordenacao, page, limit 
}: UseClientesArgs) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const appendParams = (p: URLSearchParams) => {
      if (busca) p.append("busca", busca);
      if (status) p.append("status", status);
      if (segmentos && segmentos.length > 0) {
        segmentos.forEach(s => p.append("segmentos", s));
      }
      if (origens && origens.length > 0) {
        origens.forEach(o => p.append("origens", o));
      }
      if (minGasto) p.append("min_gasto", minGasto);
      if (maxGasto) p.append("max_gasto", maxGasto);
      if (minTicket) p.append("min_ticket", minTicket);
      if (maxTicket) p.append("max_ticket", maxTicket);
    };

    const params = new URLSearchParams();
    appendParams(params);
    if (ordenacao) params.append("ordenacao", ordenacao);
    params.append("page", String(page));
    params.append("limit", String(limit));

    const countParams = new URLSearchParams();
    appendParams(countParams);

    Promise.all([
      api.get(`/clientes/?${params.toString()}`).then((r) => r.data),
      api.get(`/clientes/count?${countParams.toString()}`).then((r) => r.data),
    ])
      .then(([clientesJson, countJson]) => {
        setClientes(clientesJson);
        setTotal(countJson.total ?? 0);
      })
      .catch((err) => {
        setClientes([]);
        setError(err.message ?? String(err));
      })
      .finally(() => setLoading(false));
  }, [
    busca, status, 
    segmentos ? segmentos.join(",") : "", 
    origens ? origens.join(",") : "", 
    minGasto, maxGasto, minTicket, maxTicket, 
    ordenacao, page, limit
  ]);

  return { clientes, total, loading, error };
}
