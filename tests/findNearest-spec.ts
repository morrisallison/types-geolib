import assert = require('assert');
import geolib = require('geolib');

// San Francisco
const point: geolib.Point = { lng: -122.419416, lat: 37.774929, elevation: 16 };
const points: geolib.MultiPoint = [
  // New York City
  [-74.005941, 40.712784],
  // Los Angeles
  { lon: -118.244375, latitude: 34.045771 },
];

describe('geolib', function () {
  describe('findNearest', function () {
    it('finds the nearest point', function () {
      const {key} = geolib.findNearest(point, points);

      assert.equal(typeof key, 'string');
      assert.equal(key, '1');
    });
  });
});
