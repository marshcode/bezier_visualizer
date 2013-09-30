/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global expect */
/*global throws */
/*global fuzzy_equal */ 
/*global BEZIER */ 
/*global THREE */ 

module("Widgets - visualizer_3d");

function create_curve_3d() {
	//Real curve object.  Now required since the visualizer is trying to render the geometries
	return BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0, 0, 0), BEZIER.core.dim3(1, 1, 1)]);
}

function create_curve_storage_3d() {
	return BEZIER.storage.curve_storage();
}

function instrumented_renderer() {
	
	
	return {
		stack: [],
		instrument: function (curve, radius, num_points) {
			this.stack.push([curve, radius, num_points]);
			return {"control_ponts": null, "control_polygon": null, "curve": null};//not returning anything useful here.  Might come back to bite us?
		}
	};
}

function vectors_equal(d1, d2){
	return d1.x == d2.x && d1.y == d2.y && d1.z == d2.z;
	
}

test("Get Options - get default options", function (){
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
	var curve = create_curve_3d();

	var default_options = viz3.get_options("default");
	
	equal(default_options.size, 0.25);
	equal(default_options.points_visible,  true);
	equal(default_options.polygon_visible, true);
	equal(default_options.curve_visible,   true);
	
	
});


test("Get Options - initialized to defaults", function (){
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
	var curve = create_curve_3d();
	var curve_name = "curve";
	
	var options = viz3.get_options(curve_name);
	equal(options, null);
	
	curve_storage.set_curve(curve_name, curve);
	var options = viz3.get_options(curve_name);
	
	equal(options.size, 0.25);
	equal(options.points_visible,  true);
	equal(options.polygon_visible, true);
	equal(options.curve_visible,   true);
	
	
});

test("Set Curve Size", function () {

	//no way to access the options and rendering won't do any good. for now, we test to make sure there are no exceptions.
	
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
	var curve = create_curve_3d();
	var curve_name = "curve";
	
	curve_storage.set_curve(curve_name, curve);
	
	viz3.set_curve_size(curve_name, 0.5);
	var options = viz3.get_options(curve_name);
	equal(options.size, 0.5);
	
	viz3.set_curve_size(curve_name, -1);
	options = viz3.get_options(curve_name);
	equal(options.size, 0);
	
	viz3.set_curve_size(curve_name, 1000);
	options = viz3.get_options(curve_name);
	equal(options.size, 1000);
});




test("Set Point Visibility", function () {

	//no way to access the options and rendering won't do any good. for now, we test to make sure there are no exceptions.
	
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
	var curve = create_curve_3d();
	var curve_name = "curve";
	
	curve_storage.set_curve(curve_name, curve);
	viz3.set_points_visibility(curve_name, false);
	var options = viz3.get_options(curve_name);
	equal(options.points_visible, false);
});


test("Set Polygon Visibility", function () {
	
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
	var curve = create_curve_3d();
	var curve_name = "curve";
	
	curve_storage.set_curve(curve_name, curve);
	viz3.set_polygon_visibility(curve_name, false);
	var options = viz3.get_options(curve_name);
	equal(options.polygon_visible, false);
});

test("Set Curve Visibility", function () {

	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
	var curve = create_curve_3d();
	var curve_name = "curve";
	
	curve_storage.set_curve(curve_name, curve);
	viz3.set_curve_visibility(curve_name, false);
	var options = viz3.get_options(curve_name);
	equal(options.curve_visible, false);
});

test("Set View - Blank Target", function () {
	expect(3);
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
	
	var old_view = viz3.get_view();
	
	try {
		viz3.set_view();
	}catch (e) {
		equal(e.name, "IllegalArgumentError", e.message);
	}
	
	var new_view = viz3.get_view();
	ok(vectors_equal(old_view.target, new_view.target), "Target vectors should match the original");
	ok(vectors_equal(old_view.position, new_view.position), "Position vectors match the original");
	
});

test("Set/Get View - Blank Position", function () {
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
	
	var old_view = viz3.get_view();
	
	var new_target = BEZIER.core.dim3(1, 2, 3);
	viz3.set_view(new_target);
	var new_view = viz3.get_view();
	
	ok(!vectors_equal(old_view.target, new_view.target), "Target vectors should not match the original");
	ok(vectors_equal(new_target, new_view.target), "Target should matc new vector");	
	ok(vectors_equal(old_view.position, new_view.position), "Position vectors should match the original");
});

test("Set View - Normal", function () {
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
	
	var new_target = BEZIER.core.dim3(1, 2, 3);
	var new_position = BEZIER.core.dim3(4, 5, 6);
	
	var old_view = viz3.get_view();
	viz3.set_view(new_target, new_position);
	var new_view = viz3.get_view();
	
	ok(!vectors_equal(old_view.target, new_view.target), "Target vectors should not match the original");
	ok(!vectors_equal(old_view.position, new_view.position), "Position vectors should not match the original");
	
	ok(vectors_equal(new_target, new_view.target), "Target should match new vector");	
	ok(vectors_equal(new_position, new_view.position), "Position should match new vector");
	
});

test("Set View - No Object Modification", function () {
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
		
	var modified_view = viz3.get_view();
	var old_view = viz3.get_view();
	
	modified_view.position.x = 10;
	modified_view.position.y = 11;
	modified_view.position.z = 12;
	
	modified_view.target.x = 10;
	modified_view.target.y = 11;
	modified_view.target.z = 12;
	
	var new_view = viz3.get_view();
	
	ok(!vectors_equal(modified_view.target, new_view.target), "Target vector should not be modified.");
	ok(!vectors_equal(modified_view.position, new_view.position), "Position vector should not be modified.");
	
	ok(vectors_equal(old_view.target, new_view.target), "Target should match original target.");	
	ok(vectors_equal(old_view.position, new_view.position), "Position should match original position.");
	
});


test("Empty Constructor", function () {
	expect(1);
	try {
		var viz3 = BEZIER.widgets.visualizer_3d();
	} catch (e) {
		equal(e.name, "IllegalArgumentError", e.message);
	}


});

test("Constructor", function () {
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage);
	equal(viz3.get_num_points(), 100, "Assert get_point equals constructor");
	viz3.set_num_points(50);
	equal(viz3.get_num_points(), 50, "Assert get_point equals constructor");
});


test("get set num points", function () {
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 100);
	viz3.set_num_points(200);
	equal(viz3.get_num_points(), 200, "Assert that points were set correctly.");
	
});

test("set_curve with i/r and num_point change", function () {
	
	var i_r = instrumented_renderer();
	var num_points_1 = 300;
	var num_points_2 = 400;
	
	function instrument(curve, radius, num_points) {
		return i_r.instrument(curve, radius, num_points);
	}
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 500, 500);
	viz3.set_num_points(num_points_1);
	viz3.set_curve_factory(instrument);
	var curve_one = create_curve_3d();
	
	equal(i_r.stack.length, 0, "i_r stack has no calls on it.");
	
	curve_storage.set_curve("curve_one", curve_one);
	viz3.set_num_points(num_points_2);
	curve_storage.set_curve("curve_one", curve_one);
	
	equal(i_r.stack.length, 2, "i_r stack has two calls on it.");
	
	equal(i_r.stack[0][2], num_points_1, "assert that the original num_points was used.");
	equal(i_r.stack[1][2], num_points_2, "assert that the new num_points was used.");
	
});

test("set_curve with instrumented renderer", function () {
	

	var i_r = instrumented_renderer();
	function instrument(curve, radius, num_points) {
		return i_r.instrument(curve, radius, num_points);
	} 
	
	var curve_storage = create_curve_storage_3d();
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage);
	viz3.set_curve_factory(instrument);
	var curve_one = create_curve_3d();
	
	equal(i_r.stack.length, 0, "instrumented renderer is empty");
	curve_storage.set_curve("curve_one", curve_one);
	ok(curve_storage.has_curve("curve_one"), "curve placed into renderer");
	equal(i_r.stack.length, 1, "instrumented renderer has one item");
	
	var curve_info = i_r.stack[0];
	ok(curve_one === curve_info[0], "proper curve object passed in.");
	equal(typeof curve_info[1], "number", "radius is a number");
	equal(curve_info[2], viz3.get_num_points(), "number of rendered points set equal to visualizer points.");
	
});



test("get_dom_element_default_height", function () {
	
	var curve_storage = create_curve_storage_3d(curve_storage);
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage);
	var elm = viz3.get_dom_element();
	equal(elm.tagName.toLowerCase(), "canvas");
	equal(elm.width, 500);
	equal(elm.height, 500);
	
});

test("get_dom_element_given_height", function () {
	
	var curve_storage = create_curve_storage_3d(curve_storage);
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 200, 300);
	var elm = viz3.get_dom_element();
	equal(elm.tagName.toLowerCase(), "canvas");
	equal(elm.width, 200);
	equal(elm.height, 300);
	
});

test("Widgets - visualizer_3d - update force render", function () {
	expect(2);
	function stage_test(width, height) {
		
		var stage = BEZIER.widgets.stage_basic(width, height);
		var num_children = stage.make_scene().children.length;
		
		var renderer = {render: function (scene, camera) {
			ok(camera === stage.camera, "assering that the camera object given is the stage camera.");
			//each curve creates three meshes: curve, points and control polygon.
			ok(scene.children.length - num_children > 0, "make sure that we added something beyond.");
			
		}};
		stage.renderer = renderer;
		return stage;
	}
	
	var curve_storage = create_curve_storage_3d(curve_storage);
	var viz3 = BEZIER.widgets.visualizer_3d(curve_storage, 200, 300, stage_test);
	var curve_one = create_curve_3d(); 
	curve_storage.set_curve("curve_one", curve_one);
	//viz3.update(); #render is forced when curves are added
	
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
	ok(stage.renderer.domElement === stage.camera_controls.domElement);
	
});

test("stage_basic - make_scene new_instance", function () {
	
	var stage = BEZIER.widgets.stage_basic(100, 200);
	var sceneA = stage.make_scene();
	var sceneB = stage.make_scene();
	
	
	ok(sceneA !== sceneB, "make_scene must be return different objects.");
	
});