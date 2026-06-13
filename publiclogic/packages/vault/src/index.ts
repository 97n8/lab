export type VaultRecord = {
  id: string;
  source: string;
  summary: string;
  decision?: string;
  evidence: string[];
  createdAt: string;
};
