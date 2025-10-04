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
            arrays_in_front_of: this.addFront,
            arrays_behind: this.addBack,
            arrays_at: this.insertAt,
            arrays_range: this.range,
            arrays_delimited_to_array: this.delimitedToArray,
        };
    }

    emptyArray() {
        return [];
    }

    itemOf(args) {
        const array = Cast.toList(args.VALUE);
        const index = Cast.toNumber(args.INDEX) - 1;
        return array[index] || "";
    }

    itemNoOf(args) {
        const array = Cast.toList(args.ARRAY);
        const item = args.VALUE;
        return array.indexOf(item) + 1;
    }

    contains(args) {
        const array = Cast.toList(args.VALUE);
        const item = args.ARRAY;
        return array.includes(item);
    }

    length(args) {
        const array = Cast.toList(args.VALUE);
        return array.length;
    }

    addFront(args) {
        const array = Cast.toList(args.ARRAY);
        const item = args.ITEM;
        return [...array, item];
    }

    addBack(args) {
        const array = Cast.toList(args.ARRAY);
        const item = args.ITEM;
        return [item, ...array];
    }

    insertAt(args) {
        const array = Cast.toList(args.ARRAY);
        const index = Cast.toNumber(args.INDEX) - 1;
        const item = args.ITEM;
        const newArray = [...array];
        newArray.splice(index, 0, item);
        return newArray;
    }

    range(args) {
        const start = Cast.toNumber(args.START);
        const end = Cast.toNumber(args.END);
        const rangeArray = [];
        for (let i = start; i <= end; i++) {
            rangeArray.push(i);
        }
        return rangeArray;
    }

    delimitedToArray(args) {
        const text = Cast.toString(args.TEXT);
        const delimiter = Cast.toString(args.DELIM);
        return text.split(delimiter);
    }
}

module.exports = AmpModArraysBlocks;
