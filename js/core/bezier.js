/////////////////////////
//EXCEPTIONS
/////////////////////////
function IllegalArgumentError(){};




//////////////////////////
//Dim3
//////////////////////////
//Basic Collection of x,y,z coordinates.  Useful as points, vectors, deltas, whatever.  Future iterations may 
//require actual classes for these but there is no reason to get caught up in that now.

function Dim3(x,y,z){
	this.x = x ? x : 0
	this.y = y ? y : 0
	this.z = z ? z : 0
}

/////////////////////////////////////////
//Bezier Calculations
/////////////////////////////////////////

//Calculates binomial coefficients for a single n.
function binomial_coefficients(n){
	var C = [1];
	for (var k = 0; k < n; ++ k)
	    C[k+1] = (C[k] * (n-k)) / (k+1);
	return C;
}

//calculates a single bezier curve at point t.
function bezier_calculation(points, t){

	var n = points.length-1;
	var v = 0;
	var C = binomial_coefficients(n); //very inefficient but whatever.  Caching can be handled later.
	for(var i=0;i<points.length;i++){
		v += Math.pow(1-t, n-i) * Math.pow(t,i) * points[i] * C[i];
	}
	return v;
}

///////////////////////////////////////////
//Bezier Curve Classes
///////////////////////////////////////////

function BezierCurve3(control_points){

	if(!control_points || control_points.length == 0){
		throw new IllegalArgumentError("Must supply initial control points to curve.")
	}
	this._control_points = control_points;
}

BezierCurve3.prototype.get_point = function(idx){
	return this._control_points[idx];
}

BezierCurve3.prototype.calculate = function(t){
	var x=[], y=[], z=[];
	this._control_points.forEach(  function(pt){
		x.push(pt.x); y.push(pt.y); z.push(pt.z);
	});
	
	return new Dim3(
		bezier_calculation(x, t),
		bezier_calculation(y, t),
		bezier_calculation(z, t)
	);
}