/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global expect */
/*global fuzzy_equal */ 
/*global BEZIER */ 
/*global throws */ 

module("BezierCurve - BezierCurve3");

test("Test edit Point", function () {
	
	
	function assert_pt(pt, x, y, z) {
		
		equal(pt.x, x);
		equal(pt.y, y);
		equal(pt.z, z);
	}
	
	var pt1 = BEZIER.core.dim3(0, 0, 0);
	var bz = BEZIER.core.bezier_curve_3();
	
	bz.add_point(pt1);
	
	bz.edit_point(0, {x: 1});
	assert_pt(bz.get_point(0), 1, 0, 0);

	bz.edit_point(0, {y: 2});
	assert_pt(bz.get_point(0), 1, 2, 0);

	bz.edit_point(0, {z: 3});
	assert_pt(bz.get_point(0), 1, 2, 3);
	
});

test("Test Insert Point Out Of Range", function (){
	
	expect(2);
	
	var bz = BEZIER.core.bezier_curve_3([
	                                     BEZIER.core.dim3(0, 0, 0),
	                                     BEZIER.core.dim3(2, 2, 2),
	                                     ]);

	try{
		bz.insert_point(-1, BEZIER.core.dim3(0, 0, 0))
	} catch (e) {
		ok(true, "Insert Point raised an error when the desired index was less than 0.");
	}

	try{
		bz.insert_point(2, BEZIER.core.dim3(0, 0, 0))
	} catch (e) {
		ok(true, "Insert Point raised an error when the desired index was greater than the point length.");
	}
	
});


test("Test Insert Point", function () {
	var bz = BEZIER.core.bezier_curve_3([
	                                     BEZIER.core.dim3(0, 0, 0),
	                                     BEZIER.core.dim3(2, 2, 2),
	                                     ]);

	
	var pt1 = bz.get_point(1);
	equal(pt1.x, 2);
	equal(pt1.y, 2);
	equal(pt1.z, 2);
	
	bz.insert_point(1, BEZIER.core.dim3(1, 1, 1))
	
	var pt2 = bz.get_point(1);
	equal(pt2.x, 1);
	equal(pt2.y, 1);
	equal(pt2.z, 1);
	
	
	ok(pt1 !== pt2);
	equal(bz.num_points(), 3);
});

test("Test Add Get edit Remove Point", function () {
	
	var pt1 = BEZIER.core.dim3(1, 2, 3);
	var pt2 = BEZIER.core.dim3(4, 5, 6);
	
	
	var bz = BEZIER.core.bezier_curve_3();
	equal(bz.num_points(), 0, "Make sure the curve starts out empty.");
	
	var idx1 = bz.add_point(pt1);
	equal(bz.num_points(), 1, "We should now have one point.");
	equal(idx1, 0, "The added point has index 0.");
	
	var idx2 = bz.add_point(pt2);
	equal(bz.num_points(), 2, "Curve now has two points.");
	equal(idx2, 1, "Second point has index 1.");
	
	equal(bz.get_point(idx1), pt1, "make sure the point 1 was stored correctly.");
	equal(bz.get_point(idx2), pt2, "make sure the point 2 was stored correctly.");
	
	bz.edit_point(idx1, {x: 7, y: 8, z: 9});
	pt1 = bz.get_point(idx1);
	equal(pt1.x, 7, "point 1 x equals 7");
	equal(pt1.y, 8, "point 1 y equals 8");
	equal(pt1.z, 9, "point 1 z equals 9");
	
	bz.remove_point(idx1);
	equal(bz.num_points(), 1, "point count has decreased");
	equal(bz.get_point(idx1), pt2, "after the removal, point two is now it point 1's slot");
	
	bz.remove_point(idx1);
	equal(bz.num_points(), 0, "curve is now empty.");
});


test("Remove Point out of range", function () {
	var bz = BEZIER.core.bezier_curve_3();
	bz.add_point(BEZIER.core.dim3(1, 2, 3));
	expect(2);
	
	try {
		bz.remove_point(-1);
	} catch (e) {
		equal(e.name, "IllegalArgumentError", "T is out of range:" + e.message);
	}

	try {
		bz.remove_point(2);
	} catch (e) {
		equal(e.name, "IllegalArgumentError", "T is out of range:" + e.message);
	}

});

test("Empty Constructor", function () {

	var bz = BEZIER.core.bezier_curve_3();
	equal(bz.num_points(), 0);
	
});

test("No Points", function () {

	var bz = BEZIER.core.bezier_curve_3([]);
	equal(bz.num_points(), 0);
	
	ok( !bz.calculate(0) )
	
});

test("No Link Constructor", function () {
	
	var l = [BEZIER.core.dim3(0, 0, 0), BEZIER.core.dim3(1, 1, 1)];
	var bc3 =  BEZIER.core.bezier_curve_3(l);
	
	equal(bc3.num_points(), 2);
	l.push(BEZIER.core.dim3(2, 2, 2));
	equal(bc3.num_points(), 2);
});


test("Get Point", function () {
	
	var bc3 =  BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0, 0, 0), BEZIER.core.dim3(1, 1, 1)]);
	
	var d1 = bc3.get_point(0);
	var d2 = bc3.get_point(1);
	var d3 = bc3.get_point(2);
	var dn1 = bc3.get_point(-1);

	ok(d1, "D1 != null");
	ok(d2, "D2 != null");
	ok(!d3, "D3 == null");
	ok(d1 !== d2,   "D1 !== D2");
	ok(!dn1, "D3 is not null");
});

test("Num Points - One", function () {
	var bc3 =  BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0, 1, 2)]);
	equal(bc3.num_points(), 1, "Point Length");
});

test("Num Points - Two", function () {
	var bc3 =  BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0, 1, 2), BEZIER.core.dim3(0, 1, 2)]);
	equal(bc3.num_points(), 2, "Point Length");
});

test("Calculate - Negative T", function () {
	expect(1);
	
	var bc3 =  BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0, 1, 2), BEZIER.core.dim3(1, 2, 3)]);
	
	try {
		bc3.calculate(-0.1);
	} catch (e) {
		equal(e.name, "IllegalArgumentError", "T is out of range:" + e.message);	
	}
	
});

test("Calculate - T > 1", function () {
	expect(1);
	
	var bc3 =  BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0, 1, 2), BEZIER.core.dim3(1, 2, 3)]);
	
	try {
		bc3.calculate(1.1);
	} catch (e) {
		equal(e.name, "IllegalArgumentError", "T is out of range:" + e.message);		
	}
	
});

test("Calculate - Simple", function () {

	var bc3 =  BEZIER.core.bezier_curve_3([BEZIER.core.dim3(0, 1, 2), BEZIER.core.dim3(1, 2, 3)]);

	var t0   = bc3.calculate(0);
	var t0p5 = bc3.calculate(0.5);
	var t1   = bc3.calculate(1);

	equal(t0.x, 0);
	equal(t0.y, 1);
	equal(t0.z, 2);	

	equal(t0p5.x, 0.5);
	equal(t0p5.y, 1.5);
	equal(t0p5.z, 2.5);	
	
	equal(t1.x, 1);
	equal(t1.y, 2);
	equal(t1.z, 3);
});

