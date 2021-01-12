/*property
    create, forEach, freeze, keys
*/

// a record type is a special object type
// it does not inherit from any prototype 
function record(data = {}) {
    const record_object = Object.create(null);
    Object.keys(data).forEach(
        function (key) {
            record_object[key] = data[key];
        }
    );
    return record_object;
}

export default Object.freeze(record);