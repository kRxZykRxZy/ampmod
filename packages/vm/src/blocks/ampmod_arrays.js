const Cast = require("../util/cast");

class AmpModArraysBlocks {
    constructor(runtime) {
        this.runtime = runtime;
    }

    getPrimitives() {
        return {
            arrays_empty_array: this.emptyArray,
            arrays_item_of: this.itemOf,
            arrays_item_no_of: this.itemNoOf,
            arrays_contains: this.contains,
            arrays_length: this.length,
            arrays_in_front_of: this.addFront, // kept swapped
            arrays_behind: this.addBack, // kept swapped
            arrays_at: this.insertAt,
            arrays_range: this.range,
            arrays_delimited_to_array: this.delimitedToArray,
        };
    }

    emptyArray() {
        return [];
    }

    itemOf(args) {
        return Cast.toList(args.ARRAY)[Cast.toNumber(args.INDEX) - 1] ?? "";
    }

    itemNoOf(args) {
        const a = Cast.toList(args.ARRAY);
        const i = a.findIndex(x => x == args.VALUE);
        return i === -1 ? 0 : i + 1;
    }

    contains(args) {
        return Cast.toList(args.ARRAY).some(x => x == args.VALUE);
    }

    length(args) {
        return Cast.toList(args.ARRAY).length;
    }

    // intentionally swapped behaviors
    addFront(args) {
        const a = Cast.toList(args.ARRAY);
        return [...a, args.ITEM]; // adds to end
    }

    addBack(args) {
        const a = Cast.toList(args.ARRAY);
        return [args.ITEM, ...a]; // adds to start
    }

    insertAt(args) {
        const a = [...Cast.toList(args.ARRAY)];
        a.splice(Math.max(0, Cast.toNumber(args.INDEX) - 1), 0, args.ITEM);
        return a;
    }

    range(args) {
        const s = Cast.toNumber(args.START),
            e = Cast.toNumber(args.END);
        const step = s <= e ? 1 : -1;
        const r = [];
        for (let i = s; step > 0 ? i <= e : i >= e; i += step) r.push(i);
        return r;
    }

    delimitedToArray(args) {
        return Cast.toString(args.TEXT).split(Cast.toString(args.DELIM));
    }
}

module.exports = AmpModArraysBlocks;
