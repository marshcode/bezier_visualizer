/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global expect */
/*global fuzzy_equal */ 
/*global BEZIER */ 


module("Widgets - visualizer_3d");

function create_curve() {
	//temporary curve object.  Good enough for tests now, can be extended when needed.
	return {};
}

test("Empty Constructor", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	equal(viz3.get_num_points(), 100, "Assert number of render points is defaulty set to 100.");
});

test("Constructor", function () {
	
	var viz3 = BEZIER.widgets.visualizer_3d(50);
	equal(viz3.get_num_points(), 50, "Assert get_point equals constructor");
});

test("get set num points", function () {
	var viz3 = BEZIER.widgets.visualizer_3d(100);
	viz3.set_num_points(200);
	equal(viz3.get_num_points(), 200, "Assert that points were set correctly.");
	
});

test("get no curve", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	ok(!viz3.get_curve("curve1"), "empty curves return nothing");
});

test("clear no curve", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	ok(!viz3.get_curve("curve_one"), "no curve exists");
	viz3.clear_curve("curve_one");
	ok(!viz3.get_curve("curve_one"), "curve still does not exist.");
});

test("set_two_curves", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	var curve_one = create_curve(); 
	var curve_two = create_curve(); 
	
	viz3.set_curve("curve_one", curve_one);
	viz3.set_curve("curve_two", curve_two);
	
	ok(viz3.get_curve("curve_one") === curve_one);
	ok(viz3.get_curve("curve_two") === curve_two);
});

test("get_set_override_clear_curve", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	var curve_one = create_curve(); 
	var curve_one_prime = create_curve(); 
	
	ok(curve_one !== curve_one_prime, "pre-test, two curves do not equal each other.");
	viz3.set_curve("curve_one", curve_one);
	ok(curve_one === viz3.get_curve("curve_one"), "make sure it returns the exact same curve object");
	viz3.set_curve("curve_one", curve_one_prime);
	ok(curve_one_prime === viz3.get_curve("curve_one"), "make sure it returns the new curve object");
	viz3.clear_curve("curve_one");
	ok(!viz3.get_curve("curve_one"), "curve has been cleared");
});

test("set_two_curves_get_curve_names", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	var curve_one = create_curve(); 
	var curve_two = create_curve(); 
	
	viz3.set_curve("curve_a", curve_one);
	viz3.set_curve("curve_b", curve_two);
	
	var names = viz3.get_curve_names().sort();
	equal(names.length, 2);
	equal(names[0], "curve_a");
	equal(names[1], "curve_b");
});


test("get_set_override_clear_curve_names", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	var curve_one = create_curve(); 
	var curve_one_prime = create_curve(); 
	
	function assert_curve_name() {
		var the_list = viz3.get_curve_names();
		equal(the_list.length, 1);
		equal(the_list[0], "curve_one");
	}
	
	viz3.set_curve("curve_one", curve_one);
	assert_curve_name();
	viz3.set_curve("curve_one", curve_one_prime);
	assert_curve_name();
	viz3.clear_curve("curve_one");
	ok(viz3.get_curve_names().length === 0, "assert that the list is now empty.");
});

module("Widgets - visualizer_3d - rendering strategies");

test("render_solid_tube - basic - control points", function () {
	var curve = BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0,   0, 0),
											BEZIER.core.dim3(0,  10, 0),
											BEZIER.core.dim3(10, 10, 0),
											BEZIER.core.dim3(10, 0, 0)]);
	var radius = 2;
	
	var rendered = BEZIER.widgets.render_solid_tube(curve, radius);
	var cpm = rendered.control_points;
	equal(cpm.children.length, 4);
	
	function assert_control_mesh(mesh, x, y, z, radius) {
		equal(mesh.geometry.radius, radius);
		equal(mesh.position.x, x);
		equal(mesh.position.y, y);
		equal(mesh.position.z, z);
	}
	
	assert_control_mesh(cpm.children[0], 0, 0, 0, radius * 1.5);
	assert_control_mesh(cpm.children[1], 0, 10, 0, radius * 1.5);
	assert_control_mesh(cpm.children[2], 10, 10, 0, radius * 1.5);
	assert_control_mesh(cpm.children[3], 10, 0, 0, radius * 1.5);
	
	
});