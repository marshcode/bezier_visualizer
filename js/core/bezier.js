var BEZIER = BEZIER || {};
BEZIER.errors = BEZIER.errors || {};
BEZIER.core = BEZIER.core || {};


/////////////////////////
//EXCEPTIONS
/////////////////////////
BEZIER.errors.IllegalArgumentError = function () {};


//////////////////////////
//Dim3
//////////////////////////
//Basic Collection of x,y,z coordinates.  Useful as points, vectors, deltas, whatever.  Future iterations may 
//require actual classes for these but there is no reason to get caught up in that now.
BEZIER.core.Dim3 = function (x, y, z) {
	this.x = x || 0;
	this.y = y || 0;
	this.z = z || 0; 
};

/////////////////////////////////////////
//Bezier Calculations
/////////////////////////////////////////
//Calculates binomial coefficients for a single n.

BEZIER.core.binomial_coefficients = function (n) {
	var C = [1];
	for (var k = 0; k < n; ++ k) {
		C[k + 1] = (C[k] * (n - k)) / (k + 1);
	}
	    
	return C;
};

//calculates a single bezier curve at point t.
BEZIER.core.bezier_calculation = function (points, t) {

	var n = points.length - 1;
	var v = 0;
	var C = BEZIER.core.binomial_coefficients(n); //very inefficient but whatever.  Caching can be handled later.
	for (var i = 0; i < points.length; i++) {
		v += Math.pow(1 - t, n - i) * Math.pow(t, i) * points[i] * C[i];
	}
	return v;
};

///////////////////////////////////////////
//Bezier Curve Classes
///////////////////////////////////////////

BEZIER.core.BezierCurve3 = function (control_points) {

	if (!control_points || control_points.length === 0) {
		throw new BEZIER.errors.IllegalArgumentError("Must supply initial control points to curve.");
	}
	control_points = control_points.slice();
	
	this.get_point = function (idx) {
		return control_points[idx];
	};
	
	this.num_points = function () {
		return control_points.length;
	};
	
};

BEZIER.core.BezierCurve3.prototype.calculate = function (t) {
	var x = [], 
		y = [], 
		z = [];
	
	var pt = null;
	for (var i = 0; i < this.num_points(); i++) {
		pt = this.get_point(i);
		x.push(pt.x); 
		y.push(pt.y); 
		z.push(pt.z);
	}
	
	return new BEZIER.core.Dim3(
		BEZIER.core.bezier_calculation(x, t),
		BEZIER.core.bezier_calculation(y, t),
		BEZIER.core.bezier_calculation(z, t)
	);
};