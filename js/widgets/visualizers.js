/*global THREE */ 
/*global assert */

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

BEZIER.widgets.render_solid_tube = function (curve, radius, num_points) {
	assert(radius > 0, "radius must be greater than 0.");
	assert(num_points > 0, "num_points must be greater than 0.");
	
	var RENDER_MESHES = BEZIER.widgets.RENDER_MESHES;
	var control_point_material =  new THREE.MeshLambertMaterial({color: 0x0000ff, shading: THREE.SmoothShading});
	var control_polygon_material =  new THREE.MeshLambertMaterial({color: 0x00ff00, emissive: 0x000000, ambient: 0x000000, shading: THREE.SmoothShading});
	var curve_material =  new THREE.MeshLambertMaterial({ color: 0xff0000, emissive: 0x000000, ambient: 0x000000, shading: THREE.SmoothShading });

	
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
	
	
	
	//curve
	var points = [];
	var pt;
	var tdelta = 1 / num_points;
	for (var t = 0; t <= 1; t += tdelta) {
		pt = curve.calculate(t);
		points.push(new THREE.Vector3(pt.x, pt.y, pt.z));
	}
	var spline = new THREE.SplineCurve3(points);
	var spline_geometry = new THREE.TubeGeometry(spline, 64, radius, 8, false);
	var curve_mesh = new THREE.Mesh(spline_geometry, curve_material);
	
	var meshes = {};
	meshes["control_points"]  = control_points;
	meshes["control_polygon"] = control_polygon;
	meshes["curve"]           = curve_mesh;
	return meshes;
};

/////////////////////////
//STAGE STRATEGIES
/////////////////////////
BEZIER.widgets.stage_basic = function (width, height) {
	var camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
	var controls = new THREE.TrackballControls(camera);
	var scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0xcccccc, 0.002);
	
	controls.noZoom = false;
	controls.noPan = false;
	
	// lights

	var light = new THREE.DirectionalLight(0xffffff);
	light.position.set(1, 1, 1);
	scene.add(light);

	light = new THREE.DirectionalLight(0xffffff);
	light.position.set(-1, -1, -1);
	scene.add(light);

	light = new THREE.AmbientLight(0xffffff);
	scene.add(light);


	// renderer

	var renderer = new THREE.WebGLRenderer({antialias: false});
	renderer.setClearColor(scene.fog.color, 1);
	renderer.setSize(width, height);
	
	return {
		camera:          camera,
		camera_controls: controls,
		scene:           scene,
		renderer:        renderer

	};
	
};