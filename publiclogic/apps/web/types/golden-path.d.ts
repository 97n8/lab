declare module "@publiclogic/golden-path" {
  export const SEED_TYPES: { type: string; label: string; placeholder: string }[];
  export const PIPELINE: string[];
  export const ASSET_TYPES: string[];
  export const DOCUMENT_FOLDERS: string[];
  export const CASESPACE_TABS: string[];
  export const GOVERNED_OBJECTS: string[];
  export function canAttach(kind: string): boolean;
  export function shortHash(input: string): string;
  // Compiled result is a plain object graph; typed loosely on purpose.
  export function compileSeed(
    seed: { type: string; value?: string },
    opts?: { timestamp?: string }
  ): {
    seed: { type: string; value: string };
    source_profile: Record<string, unknown>;
    asset_set: { id: string; types: { type: string; count: number; suggested: boolean }[] };
    document_set: { id: string; folders: { folder: string }[] };
    casespace: { id: string; tabs: string[]; source_profile_id: string };
  };
}
