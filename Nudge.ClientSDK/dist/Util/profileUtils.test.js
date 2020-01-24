import { getProfileColour } from "./profileUtils";
var test = function (input, expected) { return it("getProfileColor for " + input + " returns " + expected, function () {
    var result = getProfileColour(input, true);
    expect(result).toEqual(expected);
}); };
test("ABC", "e65100");
test("DEF", "1b5e20");
test("XYZ", "1b5e20");
test("123", "ef5350");
test("JL", "ef5350");
test("Collin Sauve", "e65100");
//# sourceMappingURL=profileUtils.test.js.map