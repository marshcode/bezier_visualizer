module("TestDim3");

test("FullInit", function(){

	var d = new Dim3(1,2,3);
	equal(d.x, 1);
	equal(d.y, 2);
	equal(d.z, 3);
});

test("EmptyInit", function(){

	var d = new Dim3();
	equal(d.x, 0);
	equal(d.y, 0);
	equal(d.z, 0);
});

test("PartialInit", function(){

	var d = new Dim3(1,null,3);
	equal(d.x, 1);
	equal(d.y, 0);
	equal(d.z, 3);
});