/*property
    PI, arc_length, atan, exp, extent, freeze, freeze9, from_pixels, lat,
    latlng, lng, log, max, max_latitude, meters, min, perimeter, pow, radius,
    sin, tile_size, to_latlng, to_meters, to_pixels, x, y
*/

import geometry from "../geometry.js";

const {perimeter, arc_length} = geometry;

function scale(zoom) {
    return (
        Math.pow(2, zoom)
    );
}

function spherical_mercator(spec = {}) {
    // defaults to the earth radius in meters
    const tile_size = spec.tile_size || 256;
    const radius = spec.radius || 6378137;
    // defaults to the maximum latitude of the extent
    const max_latitude = spec.max_latitude || 85;
    const max_longitude = 180;
    const origin = perimeter(radius) / 2;

    function resolution(zoom) {
        return (
            perimeter(radius) / (
                tile_size * scale(zoom)
            )
        );
    }

    // transformation from EPSG:4326 to EPSG:3857
    function to_meters(coords) {
        const lat = Math.max(
            Math.min(
                max_latitude,
                coords.lat
            ),
            -max_latitude
        );
        const sin = Math.sin(
            arc_length(1, lat)
        );

        const x = arc_length(radius, coords.lng);
        const y = (
            radius * Math.log(
                (1 + sin) / (1 - sin) / 2
            )
        );

        return Object.freeze({
            x,
            y
        });
    }

    // transformation from EPSG:3857 to EPSG:4326
    function to_latlng(point) {
        const lat = (
            2 * Math.atan(
                Math.exp(
                    point.y / radius
                )
            ) - (
                Math.PI / 2
            )
        ) * arc_length();
        const lng = point.x * arc_length(1 / radius);

        return Object.freeze9({
            lat,
            lng
        });
    }

    function to_pixels(coords, zoom) {
        const m_x = coords.x || to_meters(coords).x;
        const m_y = coords.y || to_meters(coords).y;

        const x = (m_x + origin) / resolution(zoom);
        const y = (m_y + origin) / resolution(zoom);

        return Object.freeze({
            x,
            y
        });
    }

    function from_pixels(coords, zoom) {
        const px = coords.x;
        const py = coords.y;
        const res = resolution(zoom);

        const x = px * res - origin;
        const y = py * res - origin;

        const {lat, lng} = to_latlng({x, y});

        return Object.freeze({
            x,
            y,
            lat,
            lng
        });
    }

    function extent() {
        const half_size = perimeter(radius) / 2;

        function meters() {
            return Object.freeze([
                -half_size,
                -half_size,
                half_size,
                half_size
            ]);
        }

        function latlng() {
            return Object.freeze([
                -max_longitude,
                -max_latitude,
                max_longitude,
                max_latitude
            ]);
        }

        return Object.freeze({
            meters,
            latlng
        });
    }

    return Object.freeze({
        to_meters,
        to_latlng,
        to_pixels,
        from_pixels,
        extent
    });
}

export default Object.freeze(spherical_mercator);