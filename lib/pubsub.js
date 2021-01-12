/*property
    add, clear, create, delete, emit, forEach, freeze, push, subscribe
*/

function pubsub() {
    let subscribers_pool = Object.create(null);
    let timers_pool = [];

    function subscribe(event_name, subscriber) {
        if (subscribers_pool[event_name] === undefined) {
            subscribers_pool[event_name] = new Set();
        }

        subscribers_pool[event_name].add(subscriber);

        return function unsubscribe() {
            subscribers_pool[event_name].delete(subscriber);
        };
    }

    function publish(event_name, value) {
        if (subscribers_pool[event_name] === undefined) {
            return;
        }

        subscribers_pool[event_name].forEach(
            function (subscriber) {
                const timer_id = setTimeout(
                    function () {
                        try {
                            subscriber(value);
                        } catch (error) {
                            setTimeout(
                                function throw_exception() {
                                    throw error;
                                },
                                0
                            );
                        }
                    },
                    0
                );

                timers_pool.push(timer_id);
            }
        );
    }

    // reset listeners and timers pools
    // clear all timers
    function clear() {
        subscribers_pool = Object.create(null);
        timers_pool.forEach(
            function (timer_id) {
                clearTimeout(timer_id);
            }
        );
        timers_pool = [];
    }

    return Object.freeze({
        subscribe,
        publish,
        clear
    });
}

export default Object.freeze(pubsub);