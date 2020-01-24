import { id } from "../Util/fp/function";
import { uriToId } from "./uriUtils";
describe("uriToOptionID", function () {
    it("results in an error when given an invalid uri", function () {
        expect(uriToId().getOrElse(id) instanceof Error).toBe(true);
        expect(uriToId("").getOrElse(id) instanceof Error).toBe(true);
        expect(uriToId("notavaliduri").getOrElse(id) instanceof Error).toBe(true);
        expect(uriToId("not/a/valid/uri").getOrElse(id) instanceof Error).toBe(true);
    });
    it("returns an id for a valid uri", function () {
        expect(uriToId("/v2/people/123").getOrElse(id)).toBe("123");
        expect(uriToId("/v2/company/234").getOrElse(id)).toBe("234");
    });
});
//# sourceMappingURL=uriUtils.test.js.map