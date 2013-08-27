/*global module */ 
/*global test */ 
/*global BEZIER */ 
/*global equal */ 
/*global ok */ 
/*global expect */ 

function create_curve_storage() {
	return {};
}

test("updated - no curve", function () {
	expect(0);
	var curve_storage = BEZIER.storage.curve_storage();
	curve_storage.on(curve_storage.UPDATED_EVENT, function () {
		
		ok(false, "event should not fire if curve does not exist");
	});
	
	curve_storage.updated("whatever");
	
});

test("updated", function () {
	expect(1);
	var curve_storage = BEZIER.storage.curve_storage();
	
	var curve_one = create_curve_storage(); 
	curve_storage.set_curve("curve_one", curve_one);

	curve_storage.on(curve_storage.UPDATED_EVENT, function (curve_name) {
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
	
	curve_storage.on("cleared", function(model){
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

	
	curve_storage.once("changed", function (curve_name) {
		ok(curve_name === "curve_one");
	});
	curve_storage.set_curve("curve_one", curve_one);
	
	curve_storage.once("changed", function (curve_name) {
		ok(curve_name === "curve_two");
	});
	curve_storage.set_curve("curve_two", curve_two);
	
	//currently no good way to check the rendered objects
	//just make sure everything passes
	ok(curve_storage.has_curve("curve_one")); 
	ok(curve_storage.has_curve("curve_two"));
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
	
	curve_storage.once("cleared", function (curve_name){
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