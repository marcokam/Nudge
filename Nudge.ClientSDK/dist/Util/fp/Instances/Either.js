export var URI = "Either";
var Left = /** @class */ (function () {
    function Left(left) {
        var _this = this;
        this.tag = "Left";
        this.map = function (f) {
            return _this;
        };
        this.ap = function (Eb) {
            return _this;
        };
        this.chain = function (f) {
            return _this;
        };
        this.getOrElse = function (f) {
            return f(_this.left);
        };
        this.fold = function (l, r) {
            return l(_this.left);
        };
        this.left = left;
    }
    return Left;
}());
export { Left };
export var left = function (e) { return new Left(e); };
var Right = /** @class */ (function () {
    function Right(right) {
        var _this = this;
        this.tag = "Right";
        this.map = function (f) {
            try {
                return new Right(f(_this.right));
            }
            catch (e) {
                return left(e);
            }
        };
        this.ap = function (eitherB) {
            return eitherB.map(_this.right);
        };
        this.chain = function (f) {
            return f(_this.right);
        };
        this.getOrElse = function (e) {
            return _this.right;
        };
        this.fold = function (l, r) {
            return r(_this.right);
        };
        this.right = right;
    }
    return Right;
}());
export { Right };
export var right = function (a) { return new Right(a); };
export var map = function (f) { return function (eitherA) { return eitherA.map(f); }; };
export var ap = function (eitherAToB) { return function (eitherA) { return eitherAToB.ap(eitherA); }; };
export var chain = function (f) { return function (eitherA) { return eitherA.chain(f); }; };
export var of = function (a) { return !(a instanceof Error) ? right(a) : left(a); };
export var either = {
    map: map,
    ap: ap,
    chain: chain,
    of: of,
};
export var tryCatch = function (f) {
    try {
        return either.of(f());
    }
    catch (e) {
        return left(e);
    }
};
//# sourceMappingURL=Either.js.map