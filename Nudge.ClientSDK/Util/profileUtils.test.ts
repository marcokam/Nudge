import { getProfileColour } from "./profileUtils";

const test = (input: string, expected: string) => it(`getProfileColor for ${input} returns ${expected}`, () => {
    const result = getProfileColour(input, true);
    expect(result).toEqual(expected);
});

test("ABC", "e65100");
test("DEF", "1b5e20");
test("XYZ", "1b5e20");
test("123", "ef5350");
test("JL", "ef5350");
test("Collin Sauve", "e65100");
