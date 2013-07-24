/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global expect */
/*global throws */
/*global fuzzy_equal */ 
/*global BEZIER */ 


module("Parsers - Single Curve");

function do_simple_parse_test(data, expected_data){
	
	var curve = BEZIER.parsers.single(data);
	var num_points = curve.num_points();
	
	equal(num_points, expected_data.length, "Checking expected point vs actual number of points.");
	expected_data.forEach(function (expected, idx) {	
		
		var dim3 = curve.get_point(idx);
		equal(dim3.x, expected[0], "X coordinate not equal.");
		equal(dim3.y, expected[1], "Y coordinate not equal.");
		equal(dim3.z, expected[2], "Z coordinate not equal.");
	
	});
}


var test_vector = [
	["parse simple curve",
	 "1,2,3\n" +
	 "4,5,6\n" +
	 "7,8,9\n", [[1, 2, 3], [4, 5, 6], [7, 8, 9]]],
	 
	["parse small simple curve",
	 "1,2,3\n" +
	 "4,5,6\n", [[1, 2, 3], [4, 5, 6]]],

	["parse curve with spaces",
	 "1,2,3\n" +
	 "\n" +
	 "4,5,6\n", [[1, 2, 3], [4, 5, 6]]],
	 
	["parse simple curve with comments",
	 "#a comment\n" +
	 "1,2,3\n" +
	 "4,5,6 #internal comment\n" +
	 "7,8,9\n" +
	 "#another comment\n", [[1, 2, 3], [4, 5, 6], [7, 8, 9]]]        
];

test_vector.forEach(function (vector) {
	
	test(vector[0], function () {
		do_simple_parse_test(vector[1], vector[2]);
	});
});
