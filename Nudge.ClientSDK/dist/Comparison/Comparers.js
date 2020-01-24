export function reverseComparer(comparer) {
    return function (x, y) {
        var result = comparer(x, y);
        if (result === 0)
            return 0;
        if (result < 0)
            return 1;
        return -1;
    };
}
export var defaultComparerAscending = function (x, y) {
    if (x === y)
        return 0;
    if (x < y)
        return -1;
    return 1;
};
export var defaultComparerDescending = reverseComparer(defaultComparerAscending);
//# sourceMappingURL=Comparers.js.map