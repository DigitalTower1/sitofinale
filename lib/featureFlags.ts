export const featureFlags = {
  ENABLE_3D: true,
  ENABLE_BLOOM: true,
  ENABLE_SSR_REFL: true
} as const;

export type FeatureFlag = keyof typeof featureFlags;

export function isFeatureEnabled(flag: FeatureFlag) {
  return featureFlags[flag];
}
