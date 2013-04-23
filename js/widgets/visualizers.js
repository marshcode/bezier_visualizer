var BEZIER = BEZIER || {};
BEZIER.widgets = BEZIER.widgets  || {};

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
	
		get_curve_names: function (name){
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