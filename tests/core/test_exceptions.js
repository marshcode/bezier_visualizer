/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global fuzzy_equal */ 
/*global BEZIER */
/*global expect */
/*global assert */

module("TestException");

test("Testerror", function () {
	expect(2);
	try {
		throw BEZIER.errors.error("type1", "message");
	}catch (e) {
		equal(e.message, "message");
		equal(e.name,    "type1");
	}
});

test("Testillegalargumentexception", function () {
	expect(2);
	try {
		throw BEZIER.errors.illegal_argument_error("message");
	}catch (e) {
		equal(e.message, "message");
		equal(e.name, "IllegalArgumentError");
	}
});

test("TestAssertionFalse", function () {
	expect(2);
	try {
		assert(false, "message");	
	} catch (e) {
		equal(e.message, "message");
		equal(e.name, "AssertionError");
	}
	
	
});

test("TestAssertionTrue", function () {
	expect(0);
	assert(true, "message");
	
});