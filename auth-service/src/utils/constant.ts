export const DATE_TIME_OFFSET = 0;
export type SortOrder = 'ASC' | 'DESC';
export const allowedSorts: Record<string, [string, SortOrder]> = {
  desc: ['updatedAt', 'DESC'],
  asc: ['updatedAt', 'ASC'],
};
export const DEFAULT_LIMIT = 10;