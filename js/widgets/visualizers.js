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
BEZIER.widgets.RENDER_MESHES = {CONTROL_POINTS: 0, CONTROL_POLYGON: 1};

BEZIER.widgets.render_solid_tube = function (curve, radius) {
	var RENDER_MESHES = BEZIER.widgets.RENDER_MESHES;
	var control_point_material =  new THREE.MeshLambertMaterial({color: 0x0000ff, shading: THREE.SmoothShading});
	var control_polygon_material =  new THREE.MeshLambertMaterial({color: 0x00ff00, emissive: 0x000000, ambient: 0x000000, shading: THREE.SmoothShading});

	//control points
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
	
	
	//control polygon
	var curve_path = new THREE.CurvePath();
	var pt1, pt2, line, lineGeometry, lineMesh;
	for (i = 0; i < curve.num_points() - 1; i++) {
		pt1 = curve.get_point(i);
		pt2 = curve.get_point(i + 1);
	
		line = new THREE.LineCurve3(new THREE.Vector3(pt1.x, pt1.y, pt1.z), new THREE.Vector3(pt2.x, pt2.y, pt2.z));
		curve_path.add(line);
	}
	var control_polygon = new THREE.Mesh(new THREE.TubeGeometry(curve_path, 64, radius, 8, false), 
										control_polygon_material);
	
	
	
	var meshes = {};
	meshes[RENDER_MESHES.CONTROL_POINTS] = control_points;
	meshes[RENDER_MESHES.CONTROL_POLYGON] = control_polygon;
	return meshes;
};