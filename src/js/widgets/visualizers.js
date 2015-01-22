/*global THREE */ 
/*global assert */
/*global $ */
/*global jQuery */

var BEZIER = BEZIER || {};
BEZIER.widgets = BEZIER.widgets  || {};


///////////////////////
//3D Visualizer Class
//main interface to THREE.js
///////////////////////

BEZIER.widgets.visualizer_3d = function (curve_storage, width, height, stage_factory) {
	//FIXME: constructor is getting a little long.  Consider adding some setters and making some sensible defaults
	//it is also getting tougher to understand the constructor since a lot of the arguments are simple integers
	//FIXME MORE: this class is getting big and god-like.
	
	if (!curve_storage) {
		throw BEZIER.errors.illegal_argument_error("curve_storage cannot be null");
	}
	
	var num_points = 100;
	stage_factory = stage_factory || BEZIER.widgets.stage_basic;
	var curve_factory = BEZIER.widgets.render_solid_tube;
	
	
	var curves = {};
	var default_options = {points_visible:  true,
						   polygon_visible: true,
						   curve_visible:   true,
						   size:          0.25};
	
	
	
	var stage = stage_factory(width || 500, height || 500);	
	var scene = stage.make_scene();
	var interaction_controller = BEZIER.widgets.interaction.interaction_controller(stage, scene);


	var render_trigger = false;
	function render() {
		stage.renderer.render(scene, stage.camera);
		render_trigger = true;
	}
		
	
	function set_visibility_helper(curve_name, is_visible, option_name, mesh_name) {
		var curve_info = curves[curve_name];
		if (!curve_info) {
			return;
		}
		var options = curve_info.options;			
		var mesh = curve_info.meshes[mesh_name];
		
		if (is_visible !== null) {
			options[option_name] = Boolean(is_visible);
			mesh.traverse(function (o) {
				o.visible = is_visible;
			});				
		}
	}

	var post_init_done = false;
	var that = {

		//////POST_INIT//////////////
		//ugly but necessary - some things need to happen after the dom_element is placed.  That can't (shouldn't) happen in the contructor
		post_init: function(){
			if(post_init_done){
				return;
			}

			post_init_done = true;
			stage.camera_controls.handleResize();
		},

		///////////CAMERA
		enable_camera: function(is_enabled){
			stage.camera_controls.enabled = is_enabled;
		},

		get_mouse_interaction_event_manager: function(){
			return interaction_controller.events;
		},

		///////Options///////////	
		get_options: function (curve_name) {
			
			if(curve_name === "default"){
				return jQuery.extend({}, default_options);
			}
			
			var curve_info = curves[curve_name];
			if (!curve_info) {
				return;
			}
			
			return jQuery.extend({}, curve_info.options);
		},
			
		/////////POINTS//////////
		get_num_points: function () {
			return num_points;
		},

		set_num_points: function (num) {
			num_points = num;
		},
	
		////////RENDERING////////////
		
		set_curve_factory: function (_curve_factory) {
			curve_factory  = _curve_factory || curve_factory;
		},
				
		update: function () {
			render_trigger = false;
			stage.camera_controls.update();

			if (!render_trigger) {
				render();
			}
		},
		
		////////RENDERING OPTIONS////////////
		get_view: function () {
			var target = stage.camera_controls.target;
			var position = stage.camera_controls.object.position;
			//copying the positions protects them from outside modification
			return {"target": BEZIER.core.dim3(target.x, target.y, target.z),
				    "position": BEZIER.core.dim3(position.x, position.y, position.z)};
		},
		
		set_view: function (target, position) {
			
			if (!target) {
				throw BEZIER.errors.illegal_argument_error("Target cannot be null.");
			}

			//copying the positions protects them from outside modification
			stage.camera_controls.target.set(target.x, target.y, target.z);
			if (position) {
				stage.camera.position.set(position.x, position.y,  position.z);
			}

			this.update();
		},
		
		set_curve_size: function (curve_name, radius){
			var curve_info = curves[curve_name];
			if (!curve_info) {
				return;
			}
			var options = curve_info.options;
			options.size = Math.max(radius, 0);
		},
		
		set_points_visibility: function (curve_name, is_visible) {
			set_visibility_helper(curve_name, is_visible, "points_visible", "control_points");
		},

		set_polygon_visibility: function (curve_name, is_visible) {
			set_visibility_helper(curve_name, is_visible, "polygon_visible", "control_polygon");
		},
		set_curve_visibility: function (curve_name, is_visible) {
			set_visibility_helper(curve_name, is_visible, "curve_visible", "curve");
		},		
		
		//////////DOM Manipulaion/////////////////////
		get_dom_element: function () {
			return stage.renderer.domElement;
		}
		
	};
	
	
	
	function process_removed_curve(curve_name) {
			
			var curve = curves[curve_name];
			if (curve) {
				var meshes = curve.meshes;
				scene.remove(meshes.control_points);
				scene.remove(meshes.control_polygon);
				scene.remove(meshes.curve);	
			}
	
			delete curves[curve_name];
			interaction_controller.clear_curve(curve_name);
			
		}
	
	function process_edited_curve(curve_name) {
			
			var previous_curve = curves[curve_name];
			var options = null;
			if (previous_curve) {
				options = previous_curve.options;
			} else {
				options = jQuery.extend({}, default_options);
			}
		
			var curve = curve_storage.get_curve(curve_name);
			var meshes = curve_factory(curve, options.size, that.get_num_points());
			
			process_removed_curve(curve_name);
			interaction_controller.watch_curve(curve_name, meshes.interaction_mapping);

			curves[curve_name] = {meshes: meshes, options: options};
			scene.add(meshes.control_points);
			scene.add(meshes.control_polygon);
			scene.add(meshes.curve);
			
			that.set_points_visibility(curve_name, options.points_visible);
			that.set_polygon_visibility(curve_name, options.polygon_visible);
			that.set_curve_visibility(curve_name, options.curve_visible);
			that.update();
		}
	
	
	
	curve_storage.on(curve_storage.EVENT_UPDATED, process_edited_curve);
	curve_storage.on(curve_storage.EVENT_ADDED, process_edited_curve);
	
	curve_storage.on(curve_storage.EVENT_CLEARED, process_removed_curve);

	stage.camera_controls.addEventListener('change', render);
	return that;

};

////////////////////
//Rendering Strategies
////////////////////

BEZIER.widgets.render_solid_tube = function (curve, radius, num_points) {
	assert(radius > 0, "radius must be greater than 0.");
	assert(num_points > 0, "num_points must be greater than 0.");
	
	var control_point_material =  new THREE.MeshLambertMaterial({ color: 0x0000ff, emissive: 0x000000, ambient: 0x000000, shading: THREE.SmoothShading });
	var control_polygon_material =  new THREE.MeshLambertMaterial({color: 0x00ff00, emissive: 0x000000, ambient: 0x000000, shading: THREE.SmoothShading});
	var curve_material =  new THREE.MeshLambertMaterial({ color: 0xff0000, emissive: 0x000000, ambient: 0x000000, shading: THREE.SmoothShading });
	var mapping = BEZIER.widgets.interaction.curve_mapping();
	
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
		mapping.map_control_point(cp_mesh, i);
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
	var tdelta = 1 / num_points;
	for (var t = 0; t <= 1; t += tdelta) {
		var pt = curve.calculate(t);
		points.push(new THREE.Vector3(pt.x, pt.y, pt.z));
	}
	var spline = new THREE.SplineCurve3(points);
	var spline_geometry = new THREE.TubeGeometry(spline, 64, radius, 8, false);
	var curve_mesh = new THREE.Mesh(spline_geometry, curve_material);

	mapping.map_knot(control_polygon);
	mapping.map_curve(curve_mesh);

	var meshes = {};
	meshes.control_points  = control_points;
	meshes.control_polygon = control_polygon;
	meshes.curve           = curve_mesh;
	meshes.interaction_mapping = mapping;
	return meshes;
};

/////////////////////////
//STAGE STRATEGIES
/////////////////////////

BEZIER.widgets.stage_basic = function (width, height) {	
	var clear_color = 0xcccccc;
	
	//RENDERER
	var renderer = new THREE.WebGLRenderer({antialias: false});
	renderer.setClearColor(new THREE.Color(clear_color), 1);
	renderer.setSize(width, height);
	
	//CAMERA AND CONTROLS
	var camera = new THREE.PerspectiveCamera(60, width / height, 1, 1000);
	var camera_controls = new THREE.TrackballControls(camera, renderer.domElement);

	camera.position.z = 1;
	
	camera_controls.rotateSpeed = 3.0;
	camera_controls.zoomSpeed = 1.2;
	camera_controls.panSpeed = 0.8;
	
	camera_controls.noZoom = false;
	camera_controls.noPan = false;
	camera_controls.noRotate = false;



	//SCENE
	function make_scene() {
		var scene = new THREE.Scene();
		scene.fog = new THREE.FogExp2(clear_color, 0.002);
		
		var light = new THREE.DirectionalLight(0xffffff);
		light.position.set(1, 1, 1);
		scene.add(light);

		light = new THREE.DirectionalLight(0xffffff);
		light.position.set(-1, -1, -1);
		scene.add(light);

		light = new THREE.AmbientLight(0xffffff);
		scene.add(light);
		
		return scene;
		
	}
	
	return {
		camera:          camera,
		camera_controls: camera_controls,
		make_scene:      make_scene,
		renderer:        renderer

	};

};
////////////////////////
//Interaction
////////////////////////
BEZIER.widgets.interaction = {};

BEZIER.widgets.interaction.curve_mapping = function(){

	var knot;
	var curve;
	var points = {};

	var TYPES = {
		CONTROL_POINT:"control_point",
		KNOT:"knot", /*This should be renamed to control_polygon*/
		CURVE:"curve"
	};

	return {
		TYPES:TYPES,
		map_control_point: function(object, index){
			points[index] = object;
		},
		map_knot: function(object){
			knot = object;
		},
		map_curve: function(object){
			curve = object;
		},
		get: function(object){
			var type;
			var data = {};

			if(object === knot){
				type = TYPES.KNOT
			} else if(object === curve){
				type = TYPES.CURVE;
			} else {
				for(var index in points){
					var point = points[index];
					if(object === point){
						type = TYPES.CONTROL_POINT
						data.index = index;
					}
				}
			}

			if(type){
				data.type = type;
				return data;
			}
		},

		get_all_objects: function(){
			var all_objects = [knot, curve];
			for(var index in points){
				all_objects.push(points[index]);
			}
			return all_objects;
		}

	};

};

BEZIER.widgets.interaction.interaction_controller = function(stage){

	var curves = {};

	var events = {
		MOUSE_DOWN:"mouse_down",
		MOUSE_OVER:"mouse_over",
		MOUSE_LEFT:"mouse_left",
		MOUSE_UP:"mouse_up",
		enabled_events:{}
	};
	events = _.extend(events, Backbone.Events);
	var is_event_enabled = function(event_type){
		return events.enabled_events[event_type] === true;
	};


	var dom_element = stage.renderer.domElement;

	var that =   {
		events: events,

		watch_curve: function(curve_name, mapping){
			curves[curve_name] = mapping;
		},

		clear_curve: function(curve_name){
			delete curves[curve_name];
		},

		check_interaction: function(mouse_pos){
			var width = dom_element.width;
			var height = dom_element.height;

			var vector = new THREE.Vector2( ( mouse_pos.x/ width ) * 2 - 1, - ( mouse_pos.y / height ) * 2 + 1);
			var camera = stage.camera;

       		var raycaster = new THREE.Raycaster( );
			raycaster.setFromCamera( vector, camera );

			for(curve_name in curves){
				var mapping = curves[curve_name];
				var intersects = raycaster.intersectObjects( mapping.get_all_objects(), true );
				if(intersects.length > 0){
					return {
						curve_name: curve_name,
						mapping: mapping.get(intersects[0].object),
						intersection:intersects[0]
					};
				}
			}


		}

	};

	var box;
	var get_mouse_dim_helper = function(event){
		if(!box){
			box = dom_element.getBoundingClientRect();
		}
		return {x:event.x - box.left, y:event.y - box.top};
	};

	//event listeners
	dom_element.addEventListener("mouseup", function (evt) {
		if(!is_event_enabled(events.MOUSE_UP)){return;}

		var mousedim = get_mouse_dim_helper(evt);
		var info = that.check_interaction(mousedim);
		if(info){
			info.event = evt;
			events.trigger(events.MOUSE_UP, info);
		}

	});
	dom_element.addEventListener("mousedown", function (evt) {
		if(!is_event_enabled(events.MOUSE_DOWN)){return;}

		var mousedim = get_mouse_dim_helper(evt);
		var info = that.check_interaction(mousedim);
		if(info){
			info.event = evt;
			events.trigger(events.MOUSE_DOWN, info);
		}

	});

	var last_object_over;
	dom_element.addEventListener("mousemove", function (evt) {
		var left_enabled = is_event_enabled(events.MOUSE_LEFT);
		var over_enabled = is_event_enabled(events.MOUSE_OVER);

		if(!left_enabled && !over_enabled){return;}

		var mousedim = get_mouse_dim_helper(evt);
		var info = that.check_interaction(mousedim);

		var do_over  = false;
		var do_left = false;
		var first_time = false;
		if(!last_object_over && info){
			//we don't have a last object but we do have a hit.  This is a brand new hit.
			do_over = true;
			do_left = false;
			first_time = true;
		}
		else if(last_object_over && info){
			//we have an object and a hit - we are either continuing an old hit or we have a new one.  Figure that out now.
			do_over = true;
			do_left = last_object_over && last_object_over !== info.intersection.object;
			first_time = do_left;
		}
		else if(!info && last_object_over){
			do_left = true;
		}

		if(do_left && left_enabled){
			var evt = {object:last_object_over, event:event};
			last_object_over = null;
			events.trigger(events.MOUSE_LEFT, evt);
		}

		if(do_over && over_enabled){
			info.event = evt;
			info.first_time = first_time;
			last_object_over = info.intersection.object;
			events.trigger(events.MOUSE_OVER, info);
		}


	});


	return that;
};