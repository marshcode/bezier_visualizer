/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global expect */
/*global throws */
/*global fuzzy_equal */ 
/*global BEZIER */ 


module("Widgets - visualizer_3d");

function create_curve() {
	//Real curve object.  Now required since the visualizer is trying to render the gemetries
	return BEZIER.core.bezier_curve_3( [BEZIER.core.dim3(0, 0, 0), BEZIER.core.dim3(1, 1, 1)] );
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

test("has no curve", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	ok(!viz3.has_curve("curve1"), "empty curves return nothing");
});

test("clear no curve", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	ok(!viz3.has_curve("curve_one"), "no curve exists");
	viz3.clear_curve("curve_one");
	ok(!viz3.has_curve("curve_one"), "curve still does not exist.");
});


test("set_two_curves", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	var curve_one = create_curve(); 
	var curve_two = create_curve(); 
	
	viz3.set_curve("curve_one", curve_one);
	viz3.set_curve("curve_two", curve_two);
	
	//currently no good way to check the rendered objects
	//just make sure everything passes
	ok(viz3.has_curve("curve_one")); 
	ok(viz3.has_curve("curve_two"));
});

test("get_set_override_clear_curve", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	var curve_one = create_curve(); 
	var curve_one_prime = create_curve(); 
	
	ok(curve_one !== curve_one_prime, "pre-test, two curves do not equal each other.");
	viz3.set_curve("curve_one", curve_one);
	ok(viz3.has_curve("curve_one"), "make sure it returns the exact same curve object");
	viz3.set_curve("curve_one", curve_one_prime);
	ok(viz3.has_curve("curve_one"), "make sure it returns the new curve object");
	viz3.clear_curve("curve_one");
	ok(!viz3.has_curve("curve_one"), "curve has been cleared");
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

test("get_dom_element_default_height", function () {
	var viz3 = BEZIER.widgets.visualizer_3d();
	var elm = viz3.get_dom_element()
	equal(elm.tagName.toLowerCase(), "canvas");
	equal(elm.width, 500);
	equal(elm.height, 500);
	
});

test("get_dom_element_given_height", function () {
	var viz3 = BEZIER.widgets.visualizer_3d(100, 200, 300);
	var elm = viz3.get_dom_element()
	equal(elm.tagName.toLowerCase(), "canvas");
	equal(elm.width, 200);
	equal(elm.height, 300);
	
});


module("Widgets - visualizer_3d - rendering strategies");

test("render_solid_tube - basic - control points", function () {
	var RENDER_MESHES = BEZIER.widgets.RENDER_MESHES;
	var curve = BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0,   0, 0),
											BEZIER.core.dim3(0,  10, 0),
											BEZIER.core.dim3(10, 10, 0),
											BEZIER.core.dim3(10, 0, 0)]);
	var radius = 2;
	var num_points = 100;
	
	var rendered = BEZIER.widgets.render_solid_tube(curve, radius, num_points);
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

test("render_solid_tube - basic - polygon", function () {
	var RENDER_MESHES = BEZIER.widgets.RENDER_MESHES;
	var curve = BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0,   0, 0),
											BEZIER.core.dim3(0,  10, 0),
											BEZIER.core.dim3(10, 10, 0),
											BEZIER.core.dim3(10, 0, 0)]);
	
	var radius = 2;
	var num_points = 100;
	var rendered = BEZIER.widgets.render_solid_tube(curve, radius, num_points);
	var polygon_mesh = rendered.control_polygon;
	
	equal(polygon_mesh.geometry.path.curves.length, 3, "assert number of curve");
	equal(polygon_mesh.geometry.radius, radius, "assert radius");
	
	function assert_segment(segment, pt1, pt2) {
		var t0 = segment.getPoint(0);
		var t1 = segment.getPoint(1);
		equal(t0.x, pt1.x);
		equal(t0.y, pt1.y);
		equal(t0.z, pt1.z);
	
		equal(t1.x, pt2.x);
		equal(t1.y, pt2.y);
		equal(t1.z, pt2.z);
	}

	assert_segment(polygon_mesh.geometry.path.curves[0], {x: 0, y: 0, z: 0}, {x: 0, y: 10, z: 0});
	assert_segment(polygon_mesh.geometry.path.curves[1], {x: 0, y: 10, z: 0}, {x: 10, y: 10, z: 0});
	assert_segment(polygon_mesh.geometry.path.curves[2], {x: 10, y: 10, z: 0}, {x: 10, y: 0, z: 0});
});

test("render_solid_tube - basic - curve with two identical control points", function () {
	var RENDER_MESHES = BEZIER.widgets.RENDER_MESHES;
	var curve = BEZIER.core.bezier_curve_3([BEZIER.core.dim3(1, 1, 1),
											BEZIER.core.dim3(1, 1, 1)]);
	
	var radius = 2;
	var num_points = 100;
	
	throws(
	    function () {
                BEZIER.widgets.render_solid_tube(curve, radius, num_points);
	        },
		"Error expected when two points are identical"
    );
	
	

});

test("render_solid_tube - basic - curve at 100 points", function () {
	var RENDER_MESHES = BEZIER.widgets.RENDER_MESHES;
	var curve = BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0,   0, 0),
											BEZIER.core.dim3(0,  10, 0),
											BEZIER.core.dim3(10, 10, 0),
											BEZIER.core.dim3(10, 0, 0)]);
	
	var radius = 2;
	var num_points = 100;
	var rendered = BEZIER.widgets.render_solid_tube(curve, radius, num_points);
	var curve_mesh = rendered.curve;
	
	equal(curve_mesh.geometry.path.points.length, num_points);
});

test("render_solid_tube - basic - curve at 1000 points", function () {
	var RENDER_MESHES = BEZIER.widgets.RENDER_MESHES;
	var curve = BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0,   0, 0),
											BEZIER.core.dim3(0,  10, 0),
											BEZIER.core.dim3(10, 10, 0),
											BEZIER.core.dim3(10, 0, 0)]);
	
	var radius = 2;
	var num_points = 1000;
	var rendered = BEZIER.widgets.render_solid_tube(curve, radius, num_points);
	var curve_mesh = rendered.curve;
	
	equal(curve_mesh.geometry.path.points.length, num_points);
});


module("Widgets - visualizer_3d - scene strategies");

test("stage_basic - no params", function () {
	
	var stage = BEZIER.widgets.stage_basic(100, 200);
	var scene = stage.make_scene();
	
	ok(scene);
	ok(scene.fog);
	//FIXME: I should be testing the components I added but I have no intelligent way of doing that.
	
	ok(stage.camera);
	ok(stage.camera_controls);
	equal(stage.camera_controls.noZoom, false);
	equal(stage.camera_controls.noPan, false);
	
	
	ok(stage.renderer);
	equal(stage.renderer.domElement.width, 100);
	equal(stage.renderer.domElement.height, 200);
	
});

test("stage_basic - make_scene new_instance", function () {
	
	var stage = BEZIER.widgets.stage_basic(100, 200);
	var sceneA = stage.make_scene();
	var sceneB = stage.make_scene();
	
	
	ok(sceneA !== sceneB, "make_scene must be return different objects.");
	
});