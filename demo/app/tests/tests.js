var SearchView = require("nativescript-search-view").SearchView;
var searchView = new SearchView();

describe("greet function", function() {
    it("exists", function() {
        expect(searchView.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(searchView.greet()).toEqual("Hello, NS");
    });
});