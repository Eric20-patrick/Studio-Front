import { BASE_URL, getAccessToken } from '@/services/api';

export async function downloadCompletedReport(params: {
  format: 'pdf' | 'xlsx';
  year?: number;
  month?: number;
  date?: string;
}): Promise<void> {
  const qs = new URLSearchParams();
  qs.set('format', params.format);
  if (params.date) qs.set('date', params.date);
  if (params.year != null) qs.set('year', String(params.year));
  if (params.month != null) qs.set('month', String(params.month));

  const token = getAccessToken();
  const res = await fetch(
    `${BASE_URL}/api/dashboard/reports/export?${qs.toString()}`,
    {
      method: 'GET',
      credentials: 'include',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    },
  );

  if (!res.ok) {
    let msg = `Erro ${res.status}`;
    try {
      const j = await res.json();
      msg = j?.message || msg;
    } catch {
      /* ignore */
    }
    throw new Error(msg);
  }

  const cd = res.headers.get('Content-Disposition');
  let filename = 'relatorio';
  if (cd) {
    const m = cd.match(/filename="([^"]+)"/);
    if (m) filename = m[1];
  }

  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
