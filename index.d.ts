declare namespace geolib {
  /* Readability aliases */
  type Elevation = number;
  type Latitude = number;
  type Longitude = number;
  type Meters = number;

  /* String units */
  type DistanceUnit = 'cm' | 'ft' | 'in' | 'km' | 'm' | 'mi' | 'mm' | 'sm' | 'yd';
  type ExactDirections = 'NNE' | 'NE' | 'ENE' | 'E' | 'ESE' | 'SE' | 'SSE' | 'S' | 'SSW' | 'SW' | 'WSW' | 'W' | 'WNW' | 'NW' | 'NNW' | 'N';
  type RoughDirections = 'N' | 'E' | 'S' | 'W';
  type SpeedUnit = 'km' | 'kmh' | 'mi' | 'mph';

  /*
   * GeoJSON IETF RFC 7946
   * http://geojson.org/
   */
  type Coordinates = [Longitude, Latitude] | [Longitude, Latitude, Elevation];
  type LineString = MultiPoint;
  type MultiPoint = Array<Point>;
  type MultiPolygons = Array<Polygon>;
  type Point = Coordinates | PointCombinations.All;
  type Polygon = MultiPoint;

  namespace PointCombinations {
    type All = CombinationA | CombinationB | CombinationC | CombinationD | CombinationE | CombinationF;

    interface ElevationProperties {
      alt?: Elevation;
      altitude?: Elevation;
      elev?: Elevation;
      elevation?: Elevation;
    }

    interface CombinationA extends ElevationProperties {
      lat: Latitude;
      lng: Longitude;
    }

    interface CombinationB extends ElevationProperties {
      lat: Latitude;
      lon: Longitude;
    }

    interface CombinationC extends ElevationProperties {
      lat: Latitude;
      longitude: Longitude;
    }

    interface CombinationD extends ElevationProperties {
      latitude: Latitude;
      lng: Longitude;
    }

    interface CombinationE extends ElevationProperties {
      latitude: Latitude;
      lon: Longitude;
    }

    interface CombinationF extends ElevationProperties {
      latitude: Latitude;
      longitude: Longitude;
    }
  }

  interface Bounds {
    maxElev: Elevation;
    maxLat: Latitude;
    maxLng: Longitude;
    minElev: Elevation;
    minLat: Latitude;
    minLng: Longitude;
  }

  interface CoordinatesObj {
    latitude: Latitude;
    longitude: Longitude;
  }

  interface DistanceIndexElement {
    distance: Meters;
    key: string;
  }

  interface Direction {
    exact: ExactDirections;
    rough: RoughDirections;
  }

  interface GeolibPrototype {
    /** Computes the destination point given an initial point, a distance and a bearing. */
    computeDestinationPoint(start: Point, distance?: number, bearing?: number, radius?: number): CoordinatesObj;
    /** Converts a distance from meters to "km", "mm", "cm", "mi", "ft", "in" or "yd". */
    convertUnit(unit: DistanceUnit, distance: Meters, round?: number): number;
    /** Converts a decimal coordinate value to sexagesimal format. */
    decimal2sexagesimal(decimal: number): string;
    /** Returns elevation of a given point. */
    elevation(point: Point): number;
    /** Finds the nearest coordinate to a reference coordinate. */
    findNearest(point: Point, points: MultiPoint, offset?: number, limit?: number): DistanceIndexElement;
    /**
     * Gets great circle bearing of two points.
     * See description of `getRhumbLineBearing` for more information.
     */
    getBearing(pointA: Point, pointB: Point): number;
    /** Gets the max and min, latitude, longitude, and elevation (if provided). */
    getBounds(points: MultiPoint): Bounds;
    /**
     * Computes the bounding coordinates of all points on the surface
     * of the earth less than or equal to the specified great circle
     * distance.
     */
    getBoundsOfDistance(point: Point, distance: Meters): [CoordinatesObj, CoordinatesObj];
    /** Calculates the center of the bounds of geo coordinates. */
    getCenter(points: MultiPoint): CoordinatesObj;
    /**
     * Calculates the center of the bounds of geo coordinates.
     *
     * On polygons like political borders (eg. states)
     * this may gives a closer result to human expectation, than `getCenter`,
     * because that function can be disturbed by uneven distribution of
     * point in different sides.
     * Imagine the US state Oklahoma: `getCenter` on that gives a southern
     * point, because the southern border contains a lot more nodes,
     * than the others.
     */
    getCenterOfBounds(points: MultiPoint): CoordinatesObj;
    /** Gets the compass direction from an origin coordinate to a destination coordinate. */
    getCompassDirection(pointA: Point, pointB: Point, bearingMode?: string): Direction;
    /**
     * Calculates geodetic distance between two points specified by latitude/longitude
     * using Vincenty inverse formula for ellipsoids.
     */
    getDistance(start: Point, end: Point, accuracy?: Meters, precision?: number): Meters;
    /**
     * Calculates the distance between two spots.
     * This method is more simple but also far more inaccurate.
     */
    getDistanceSimple(start: Point, end: Point, accuracy?: Meters): Meters;
    /** Returns elevation of a given point */
    getElev(point: Point): number;
    /**
     * Returns latitude of a given point, converted to decimal.
     * Set raw to true to avoid conversion.
     */
    getLat(point: Point, raw?: boolean): number;
    /**
     * Returns longitude of a given point, converted to decimal.
     * Set raw to true to avoid conversion.
     */
    getLon(point: Point, raw?: boolean): number;
    /** Calculates the length of a given path */
    getPathLength(points: LineString): Meters;
    /**
     * Gets rhumb line bearing of two points. Find out about the difference between rhumb line and
     * great circle bearing on Wikipedia. It's quite complicated. Rhumb line should be fine in most cases.
     */
    getRhumbLineBearing(pointA: Point, pointB: Point): number;
    /** Calculates the speed between to points within a given time span. */
    getSpeed(pointA: Point, pointB: Point, options?: { unit?: SpeedUnit; }): number;
    /** Checks whether a point is inside of a circle or not. */
    isPointInCircle(point: Point, center: Point, radius: Meters): boolean;
    /** Check if a point lies in line created by two other points */
    isPointInLine(point: Point, start: Point, end: Point): boolean;
    /**
     * Checks whether a point is inside of a polygon or not.
     * Note that the polygon coords must be in correct order!
     */
    isPointInside(point: Point, polygon: Polygon): boolean;
    /** Returns latitude of a given point, converted to decimal. */
    latitude(point: Point): number;
    /** Returns longitude of a given point, converted to decimal. */
    longitude(point: Point): number;
    /** Sorts an array of coords by distance from a reference coordinate */
    orderByDistance(point: Point, points: MultiPoint): Array<DistanceIndexElement>;
    /** Converts a sexagesimal coordinate to decimal format */
    sexagesimal2decimal(sexagesimal: string): number;
    /** Checks if a value is in decimal format or, if neccessary, converts to decimal */
    useDecimal(value: Point): number;
    useDecimal(value: MultiPoint): number;
    useDecimal(value: number): number;
    useDecimal(value: string): number;
  }

  interface GeolibStatic extends GeolibPrototype {
    readonly version: string;
    readonly radius: number;
    readonly minLat: number;
    readonly maxLat: number;
    readonly minLon: number;
    readonly maxLon: number;
    readonly sexagesimalPattern: RegExp;
    readonly measures: {
      readonly cm: number;
      readonly ft: number;
      readonly in: number;
      readonly km: number;
      readonly m: number;
      readonly mi: number;
      readonly mm: number;
      readonly sm: number;
      readonly yd: number;
    };
    extend(obj: any, overwrite?: boolean): void;
  }

  interface Number {
    toRad(): number;
    toDeg(): number;
  }
}

declare module 'geolib' {
  const lib: geolib.GeolibStatic;

  export = lib;
}
