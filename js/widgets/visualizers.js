/*global THREE */ 

var BEZIER = BEZIER || {};
BEZIER.widgets = BEZIER.widgets  || {};


///////////////////////
//3D Visualizer Class
//main interface to THREE.js
///////////////////////

BEZIER.widgets.visualizer_3d = function (num_points) {
	
	num_points = num_points || 100;
	var curves = {};
	
	return {
		get_num_points: function () {
			return num_points;
		},

		set_num_points: function (num) {
			num_points = num;
		},
	
		get_curve_names: function (name) {
			var l = [];
			for (var key in curves) {
			    if (curves.hasOwnProperty(key)) {
			        l.push(key);
			    }
			}
			return l;
		},
		
		get_curve: function (name) {
			return curves[name];
		},
		set_curve: function (name, curve) {
			curves[name] = curve;
		},
		clear_curve: function (name) {
			delete curves[name];
		}
	};
	
};

////////////////////
//Rendering Strategies
////////////////////
BEZIER.widgets.render_solid_tube = function (curve, radius) {
	
	var control_point_material =  new THREE.MeshLambertMaterial({color: 0x0000ff, shading: THREE.SmoothShading});


	var control_points = new THREE.Object3D();
	
	var control_point_geom = new THREE.SphereGeometry(radius * 1.5, 16, 16);
	var cp, cp_mesh;
	for (var i = 0; i < curve.num_points(); i++) {
		cp = curve.get_point(i);
		cp_mesh = new THREE.Mesh(control_point_geom, control_point_material);
		cp_mesh.position.x = cp.x;
		cp_mesh.position.y = cp.y;
		cp_mesh.position.z = cp.z;
		control_points.add(cp_mesh);
	}
	
	return {
		control_points: control_points
	};
};