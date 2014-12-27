/*global module */ 
/*global test */ 
/*global BEZIER */ 
/*global equal */ 
/*global ok */ 
/*global expect */ 

module("BezierCurve - CurveStorage");

function create_curve_storage() {
	return {};
}

test("updated - no curve", function () {
	expect(0);
	var curve_storage = BEZIER.storage.curve_storage();
	curve_storage.on(curve_storage.EVENT_UPDATED, function () {
		
		ok(false, "event should not fire if curve does not exist");
	});
	
	curve_storage.updated("whatever");
	
});

test("updated and added", function () {
	expect(2);
	var curve_storage = BEZIER.storage.curve_storage();
	
	
	curve_storage.once(curve_storage.EVENT_ADDED, function (curve_name) {
		equal(curve_name, "curve_one");
	});
	
	var curve_one = create_curve_storage(); 
	curve_storage.set_curve("curve_one", curve_one);

	curve_storage.once(curve_storage.EVENT_UPDATED, function (curve_name) {
		equal(curve_name, "curve_one");
	});
	curve_storage.updated("curve_one");
	
	
});


test("has no curve", function () {
	var curve_storage = BEZIER.storage.curve_storage();
	ok(!curve_storage.has_curve("curve1"), "empty curves return nothing");
});

test("clear no curve", function () {
	
	expect(2);
	
	var curve_storage = BEZIER.storage.curve_storage();
	
	curve_storage.on(curve_storage.EVENT_CLEARED, function(model){
		ok(false, "test failed, this should not be called");
	});
	
	ok(!curve_storage.has_curve("curve_one"), "no curve exists");
	curve_storage.clear_curve("curve_one");
	ok(!curve_storage.has_curve("curve_one"), "curve still does not exist.");
});

test("set_two_curves", function () {
	var curve_storage = BEZIER.storage.curve_storage();
	var curve_one = create_curve_storage(); 
	var curve_two = create_curve_storage(); 
	expect(4);

	
	curve_storage.once(curve_storage.EVENT_ADDED, function (curve_name) {
		ok(curve_name === "curve_one");
	});
	curve_storage.set_curve("curve_one", curve_one);
	
	curve_storage.once(curve_storage.EVENT_ADDED, function (curve_name) {
		ok(curve_name === "curve_two");
	});
	curve_storage.set_curve("curve_two", curve_two);
	
	//currently no good way to check the rendered objects
	//just make sure everything passes
	ok(curve_storage.has_curve("curve_one")); 
	ok(curve_storage.has_curve("curve_two"));
});

test("get_no_curve", function () {
	var curve_storage = BEZIER.storage.curve_storage();
	expect(1);
	ok(!curve_storage.get_curve("no_there"), "no curve should return null");

});

test("get_set_override_clear_curve", function () {
	var curve_storage = BEZIER.storage.curve_storage();
	var curve_one = create_curve_storage(); 
	var curve_one_prime = create_curve_storage(); 
	
	expect(7);
	
	ok(curve_one !== curve_one_prime, "pre-test, two curves do not equal each other.");
	curve_storage.set_curve("curve_one", curve_one);
	ok(curve_storage.has_curve("curve_one"), "make sure it returns the exact same curve object");
	ok(curve_storage.get_curve("curve_one") === curve_one);
	curve_storage.set_curve("curve_one", curve_one_prime);
	ok(curve_storage.has_curve("curve_one"), "make sure it returns the new curve object");
	ok(curve_storage.get_curve("curve_one") === curve_one_prime);
	
	curve_storage.once(curve_storage.EVENT_CLEARED, function (curve_name){
		ok(curve_name === "curve_one");
	})
	
	curve_storage.clear_curve("curve_one");
	ok(!curve_storage.has_curve("curve_one"), "curve has been cleared");
});

test("set_two_curves_get_curve_names", function () {
	var curve_storage = BEZIER.storage.curve_storage();
	var curve_one = create_curve_storage(); 
	var curve_two = create_curve_storage(); 
	
	curve_storage.set_curve("curve_a", curve_one);
	curve_storage.set_curve("curve_b", curve_two);
	
	var names = curve_storage.get_curve_names().sort();
	equal(names.length, 2);
	equal(names[0], "curve_a");
	equal(names[1], "curve_b");
});


test("get_set_override_clear_curve_names", function () {
	var curve_storage = BEZIER.storage.curve_storage();
	var curve_one = create_curve_storage(); 
	var curve_one_prime = create_curve_storage(); 
	
	function assert_curve_name() {
		var the_list = curve_storage.get_curve_names();
		equal(the_list.length, 1);
		equal(the_list[0], "curve_one");
	}
	
	curve_storage.set_curve("curve_one", curve_one);
	assert_curve_name();
	curve_storage.set_curve("curve_one", curve_one_prime);
	assert_curve_name();
	curve_storage.clear_curve("curve_one");
	ok(curve_storage.get_curve_names().length === 0, "assert that the list is now empty.");
});

test("get_all_curves", function () {
	var curve_one = create_curve_storage();
	var curve_two = create_curve_storage();
	var curve_storage = BEZIER.storage.curve_storage();

	var curves = curve_storage.get_all_curves();
	equal(_.keys(curves).length, 0);

	curve_storage.set_curve("curve_one", curve_one);

	var curves = curve_storage.get_all_curves();
	equal(_.keys(curves).length, 1);
	ok(curves["curve_one"] === curve_one);

	curve_storage.set_curve("curve_two", curve_two);

	var curves = curve_storage.get_all_curves();
	equal(_.keys(curves).length, 2);
	ok(curves["curve_one"] === curve_one);
	ok(curves["curve_two"] === curve_two);
});

test("clear_all_curves", function () {
	var curve_one = create_curve_storage();
	var curve_two = create_curve_storage();
	var curve_storage = BEZIER.storage.curve_storage();

	curve_storage.set_curve("curve_one", curve_one);
	curve_storage.set_curve("curve_two", curve_two);

	curve_storage.on(curve_storage.EVENT_CLEARED, function(curve_name){
		ok(curve_name == "curve_one" || curve_name == "curve_two")
	});

	expect(3);

	curve_storage.clear_all_curves();
	equal(curve_storage.get_curve_names().length, 0);
});