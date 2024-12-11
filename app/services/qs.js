import { getListItem } from '#app/services/utils.js'

export default function ({ content }) {

    const lists = content.lists();



    // -------------------
    // Parsers
    // -------------------

    function string (value) {
        if (value) return value + ''
    }

    function integer (value) {
        value = parseInt(value);
        if (value && value > 0) return value;
    }

    function boolean (value) {
        if (value === 'true') return true;
        if (value === 'false') return false;
    }

    function empty (value) {
        if (value === '') return value;
    }

    function item (value, list) {
        value = integer(value);
        if (value && getListItem(lists[list], value)) return value;
    }

    function array (value, list) {
        const values = Array.isArray(value) ? value : [value];
        const valid = values.map(value => item(value, list)).filter(value => !!value);
        if (valid.length) return valid;
    }

    function uuid (value) {
        value = string(value);
        if (!value) return;
        if (/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)) return value;
    }

    function oneof (value, values) {
        if (values.includes(value)) return value;
    }



    // -------------------
    // Exports
    // -------------------

    return {
        string,
        integer,
        boolean,
        item,
        array,
        uuid,
        oneof,
        empty
    };

}