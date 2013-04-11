module("Bezier Calculations - Binomial Coefficients");

test("n=4", function(){
	var C = binomial_coefficients(4);
	equal(C[0], 1);
	equal(C[1], 4);
	equal(C[2], 6);
	equal(C[3], 4);
	equal(C[4], 1);
});
test("n=5", function(){
	var C = binomial_coefficients(5);
	equal(C[0],  1);
	equal(C[1],  5);
	equal(C[2], 10);
	equal(C[3], 10);
	equal(C[4],  5);
	equal(C[5],  1);
});
test("n=6", function(){
	var C = binomial_coefficients(6);
	equal(C[0],  1);
	equal(C[1],  6);
	equal(C[2], 15);
	equal(C[3], 20);
	equal(C[4], 15);
	equal(C[5],  6);
	equal(C[6],  1);
});					

module("Bezier Calculations - Bezier Curves");	

test("even distribution", function(){
	var points = [0, 1,   2,   3,   4,   5,   6,   7,   8,   9,   10];
	var Ts =     [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
	
	for(var i=0;i<points.length;i++){
		//ok(  Math.abs( bezier_calculation(points, Ts[i]) - points[i]  ) < 0.001, "Bezier Curve @ " + Ts[i]  );
		fuzzy_equal(bezier_calculation(points, Ts[i]), points[i], "Bezier Curve @ " + Ts[i]);
	}
	
	
});					