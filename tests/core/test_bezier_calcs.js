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
	equal(C[0], 1);
	equal(C[1], 5);
	equal(C[2], 10);
	equal(C[3], 10);
	equal(C[4], 5);
	equal(C[5], 1);
});
test("n=6", function(){
	var C = binomial_coefficients(6);
	equal(C[0], 1);
	equal(C[1], 6);
	equal(C[2], 15);
	equal(C[3], 20);
	equal(C[4], 15);
	equal(C[5], 6);
	equal(C[6], 1);
});											