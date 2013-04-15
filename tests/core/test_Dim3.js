/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global fuzzy_equal */ 

module("TestDim3");

test("FullInit", function () {

	var d = new BEZIER.core.Dim3(1, 2, 3);
	equal(d.x, 1, "Assert X Coordinate");
	equal(d.y, 2, "Assert X Coordinate");
	equal(d.z, 3, "Assert Z Coordinate");
});

test("EmptyInit", function () {

	var d = new BEZIER.core.Dim3();
	equal(d.x, 0, "Assert X Coordinate");
	equal(d.y, 0, "Assert Y Coordinate");
	equal(d.z, 0, "Assert Z Coordinate");
});

test("PartialInit", function () {

	var d = new BEZIER.core.Dim3(1, null, 3);
	equal(d.x, 1, "Assert X Coordinate");
	equal(d.y, 0, "Assert Y Coordinate");
	equal(d.z, 3, "Assert Z Coordinate");
});

test("ZeroInit", function () {

	var d = new BEZIER.core.Dim3(0, 0, 0);
	equal(d.x, 0, "Assert X Coordinate");
	equal(d.y, 0, "Assert Y Coordinate");
	equal(d.z, 0, "Assert Z Coordinate");
});