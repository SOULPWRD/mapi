function load_image(callback, src) {
    const img = new Image();
    
    img.onerror = function (error) {
        callback(undefined, error);
    };

    img.onload = function () {
        callback(img);
    };
}