function perimeter(radius) {
    return (
        2 * Math.PI * radius
    );
}

function arc_length(radius = 1, degree = 1) {
    return (
        degree * (
            perimeter(radius) / 360
        )
    );
}

export default Object.freeze({
    perimeter,
    arc_length
});