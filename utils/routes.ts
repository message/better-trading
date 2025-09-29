// Central place to define hash-based (or future) route hrefs used across the extension UI.
// Using an enum keeps references consistent and avoids scattering magic strings.
export enum RouteHash {
  Root = '#/',
  About = '#/about',
}

export const DEFAULT_ROUTE_ORDER: RouteHash[] = [RouteHash.Root, RouteHash.About];
