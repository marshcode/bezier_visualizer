/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global expect */
/*global fuzzy_equal */ 
/*global BEZIER */ 


module("BezierCurve - BezierCurve3");

test("Empty Constructor", function () {
	expect(1);

	try {
		var bz = new BEZIER.core.BezierCurve3();
	} catch (e) {
		ok(e instanceof BEZIER.errors.IllegalArgumentError, "Throws error on empty constructor");	
	}
});

test("No Points", function () {
	expect(1);

	try {
		var bz = new BEZIER.core.BezierCurve3([]);
	} catch (e) {
		ok(e instanceof BEZIER.errors.IllegalArgumentError, "Throws error when no control point are given.");	
	}
});

test("Get Point", function () {
	
	var bc3 =  new BEZIER.core.BezierCurve3([new BEZIER.core.Dim3(0, 0, 0), new BEZIER.core.Dim3(1, 1, 1)]);
	
	var d1 = bc3.get_point(0);
	var d2 = bc3.get_point(1);
	var d3 = bc3.get_point(2);


	ok(d1, "D1 != null");
	ok(d2, "D2 != null");
	ok(!d3, "D3 == null");
	ok(d1 !== d2,   "D1 !== D2");
});

test("Num Points - One", function () {
	var bc3 =  new BEZIER.core.BezierCurve3([new BEZIER.core.Dim3(0, 1, 2)]);
	equal(bc3.num_points(), 1, "Point Length");
});

test("Num Points - Two", function () {
	var bc3 =  new BEZIER.core.BezierCurve3([new BEZIER.core.Dim3(0, 1, 2), new BEZIER.core.Dim3(0, 1, 2)]);
	equal(bc3.num_points(), 2, "Point Length");
});

test("Calculate - Simple", function () {

	var bc3 =  new BEZIER.core.BezierCurve3([new BEZIER.core.Dim3(0, 1, 2), new BEZIER.core.Dim3(1, 2, 3)]);

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

