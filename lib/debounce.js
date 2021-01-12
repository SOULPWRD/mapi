function debounce(callback, delay = 0) {
    let timer_id;

    function debounced_callback(...args) {
        if (timer_id) {
            clearTimeout(timer_id);
        }

        timer_id = setTimeout(
            function () {
                callback(...args);
            },
            delay
        );

        return function stop() {
            clearTimeout(timer_id);
            timer_id = undefined;
        };
    }

    return debounced_callback;
}