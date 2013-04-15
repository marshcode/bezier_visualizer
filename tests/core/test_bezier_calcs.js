/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global fuzzy_equal */ 
/*global BEZIER */


module("Bezier Calculations - Binomial Coefficients");

test("n=4", function () {
	var C = BEZIER.Core.binomial_coefficients(4);
	equal(C[0], 1);
	equal(C[1], 4);
	equal(C[2], 6);
	equal(C[3], 4);
	equal(C[4], 1);
});
test("n=5", function () {
	var C = BEZIER.Core.binomial_coefficients(5);
	equal(C[0],  1);
	equal(C[1],  5);
	equal(C[2], 10);
	equal(C[3], 10);
	equal(C[4],  5);
	equal(C[5],  1);
});
test("n=6", function () {
	var C = BEZIER.Core.binomial_coefficients(6);
	equal(C[0],  1);
	equal(C[1],  6);
	equal(C[2], 15);
	equal(C[3], 20);
	equal(C[4], 15);
	equal(C[5],  6);
	equal(C[6],  1);
});					

module("Bezier Calculations - Bezier Curves");	

test("even distribution", function () {
	var points = [0, 1,   2,   3,   4,   5,   6,   7,   8,   9,   10];
	var Ts =     [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
	
	for (var i = 0; i < Ts.length; i++) {
		fuzzy_equal(BEZIER.Core.bezier_calculation(points, Ts[i]), points[i], "Bezier Curve @ " + Ts[i]);
	}
});	

test("uneven distribution", function () {
	var points   = [0, 1,   2,   2.5, 3,   3.5, 4,   4.5, 5,   9,   10];
	var Ts       = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
	var expected = [0, 0.957, 1.758, 2.411, 2.979, 3.532, 4.164, 5.036, 6.369, 8.250, 10];
		
	for (var i = 0; i < Ts.length; i++) {
		fuzzy_equal(BEZIER.Core.bezier_calculation(points, Ts[i]), expected[i], "Bezier Curve @ " + Ts[i]);
	}
});			

test("back to start", function () {
	var points   = [0, 1, 0];
	var Ts       = [0, 0.25, 0.5, 0.75, 1];
	var expected = [0, 0.375, 0.5, 0.375,  0];
		
	for (var i = 0; i < Ts.length; i++) {
		fuzzy_equal(BEZIER.Core.bezier_calculation(points, Ts[i]), expected[i], "Bezier Curve @ " + Ts[i]);
	}

});	