/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global fuzzy_equal */ 
/*global BEZIER */
/*global expect */
/*global assert */

module("TestException");

test("Empty Error", function () {
	expect(2);
	try {
		throw BEZIER.errors.error();
	}catch (e) {
		ok(!e.message);
		ok(!e.name); //would be strange but throwing an error when throwing an error seems backwards.
	}
});

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

test("TestAssertFalseNoMessage", function () {
	expect(1);
	try {
		assert(false);	
	} catch (e) {
		ok(!e.message);
	}
});

test("TestAssertFalsy", function (){
	expect(1);
	try {
		assert(null);	
	} catch (e) {
		ok(true, 'just making sure the exception happens');
	}
})

test("TestAssertionTrue", function () {
	expect(0);
	assert(true, "message");
	
});

test("TestAssertionTruthy", function () {
	expect(0);
	assert({}, "message");
	
});
