/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global expect */
/*global throws */
/*global fuzzy_equal */ 
/*global BEZIER */ 


module("Widgets - grid");

function create_storage() {
	return BEZIER.storage.curve_storage();
	
}


function create_curve() {
	return BEZIER.core.bezier_curve_3();
}

test("Control Point Grid - test init", function () {
	
	var storage = create_storage();
	var curve   = create_curve();
	storage.set_curve("curve", curve);
	
	var cpg = BEZIER.widgets.control_point_grid(storage, "curve");
	
	equal(cpg.curve_name, "curve");
	ok(cpg.dom_element);
	
});


test("Control Point Grid - test update", function () {
	
	var storage = create_storage();
	var curve   = create_curve();
	storage.set_curve("curve", curve);
	
	
	var cpg = BEZIER.widgets.control_point_grid(storage, "curve");
	
	var data_before = cpg.dom_element.handsontable("getData");
	equal(data_before.length, 0);
	
	curve.append_point(BEZIER.core.dim3(1, 2, 3));
	curve.append_point(BEZIER.core.dim3(4, 5, 6));
	cpg.update();
	
	var data_after = cpg.dom_element.handsontable("getData");
	equal(data_after.length, 2);
	
	equal(data_after[0].x, 1);
	equal(data_after[0].y, 2);
	equal(data_after[0].z, 3);

	equal(data_after[1].x, 4);
	equal(data_after[1].y, 5);
	equal(data_after[1].z, 6);
	
});


test("Control Point Grid - test storage update", function () {
	
	var storage = create_storage();
	var curve   = create_curve();
	storage.set_curve("curve", curve);
	
	var cpg = BEZIER.widgets.control_point_grid(storage, "curve");
	
	var data_before = cpg.dom_element.handsontable("getData");
	equal(data_before.length, 0);
	
	curve.append_point(BEZIER.core.dim3(7, 8, 9));
	curve.append_point(BEZIER.core.dim3(10, 11, 12));

	storage.updated("curve");
	
	var data_after = cpg.dom_element.handsontable("getData");
	equal(data_after.length, 2);
	
	equal(data_after[0].x, 7);
	equal(data_after[0].y, 8);
	equal(data_after[0].z, 9);

	equal(data_after[1].x, 10);
	equal(data_after[1].y, 11);
	equal(data_after[1].z, 12);
	
});

test("Control Point Grid - test storage update other curve", function () {
	
	var storage = create_storage();
	var curve   = create_curve();
	var curve2  = create_curve();
	
	storage.set_curve("curve", curve);
	storage.set_curve("curve2", curve2);
	
	var cpg = BEZIER.widgets.control_point_grid(storage, "curve");
	
	var data_before = cpg.dom_element.handsontable("getData");
	equal(data_before.length, 0);
	
	curve2.append_point(BEZIER.core.dim3(7, 8, 9));
	curve2.append_point(BEZIER.core.dim3(10, 11, 12));

	storage.updated("curve2");
	
	var data_after = cpg.dom_element.handsontable("getData");
	equal(data_after.length, 0);
	
});