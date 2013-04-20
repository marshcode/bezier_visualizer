/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global fuzzy_equal */ 
/*global BEZIER */
/*global expect */

module("TestDim3");

test("Testerror", function () {
	expect(2);
	try {
		throw BEZIER.errors.error("type1", "message");
	}catch (e) {
		equal(e.message, "message");
		equal(e.type,    "type1");
	}
});

test("Testillegalargumentexception", function () {
	expect(2);
	try {
		throw BEZIER.errors.illegalargumenterror("message");
	}catch (e) {
		equal(e.message, "message");
		equal(e.type, "illegalargumenterror");
	}
});