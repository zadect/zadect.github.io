declare module 'topojson-client' {
  import type { FeatureCollection, Geometry, GeoJsonProperties } from 'geojson';

  export function feature(
    topology: unknown,
    object: unknown,
  ): FeatureCollection<Geometry, GeoJsonProperties>;
}
