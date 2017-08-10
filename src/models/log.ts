export interface Log {
  errors: string[];
  warnings: string[];
};

export const DEFAULT_LOG: Log = {
  errors: [],
  warnings: []
};
