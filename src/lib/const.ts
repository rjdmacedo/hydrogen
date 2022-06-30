export const PAGINATION_SIZE = 8;
export const ATTR_LOADING_EAGER = 'eager';
export const DEFAULT_GRID_IMG_LOAD_EAGER_COUNT = 4;

export function getImageLoadingPriority(
  index: number,
  maxEagerLoadCount = DEFAULT_GRID_IMG_LOAD_EAGER_COUNT,
): 'eager' | undefined {
  return index < maxEagerLoadCount ? ATTR_LOADING_EAGER : undefined;
}
