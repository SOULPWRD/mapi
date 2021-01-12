import record from "./record.js";
import pubsub from "./pubsub.js";

function canvas(spec) {
    const ps = pubsub();
    const context_type = spec.context_type;

    let root_element;
    const canvas_element = document.createElement("canvas");
    const canvas_ctx = canvas_element.getContext(context_type);
    
    // canvas dimensions
    let width;
    let height;

    let offset_top;
    let offset_bottom;
    let offset_left;
    let offset_right;

    function properties() {
        return record({
            offset_top,
            offset_bottom,
            offset_left,
            offset_right
        });
    }

    function context() {
        return canvas_ctx;
    }

    function position() {
        const canvas_rect = canvas_element.getBoundingClientRect;
        offset_top = canvas_rect.top;
        offset_bottom = canvas_rect.bottom;
        offset_left = canvas_rect.left;
        offset_right = canvas_rect.right;
    }

    function append(root_id) {
        root_element = document.getElementById(root_id);
        width = root_element.offsetWidth;
        height = root_element.offsetHeight;

        canvas_element.width = width;
        canvas_element.height = height;

        root_element.appendChild(canvas_element);
    }

    function mount(root_id) {
        append(root_id);
        position();
    }

    function unmount() {
        // remove listeners
        root_element.removeChild(canvas_element);
        ps.clear();
    }

    return Object.freeze({
        properties,
        mount,
        unmount,
        context,
        subscribe: ps.subscribe
    });
}

export default Object.freeze(canvas);