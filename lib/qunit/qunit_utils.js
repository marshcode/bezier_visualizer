function fuzzy_equal(a, b, message, threshold){

	if(!threshold){ threshold = 0.001; }

	valid = Math.abs(a-b) < 0.001;
	ok(valid, a + " ~= " + b + " within " + threshold + ": " + message);


}