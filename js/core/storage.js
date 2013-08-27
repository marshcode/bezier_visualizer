var BEZIER = BEZIER || {};
BEZIER.storage = BEZIER.storage || {};


/////////////////////////
//EXCEPTIONS
/////////////////////////
BEZIER.storage.curve_storage = function () {

	var curves = {};
	
	var that = {
		get_curve_names: function (name) {
			var l = [];
			for (var key in curves) {
			    if (curves.hasOwnProperty(key)) {
			        l.push(key);
			    }
			}
			return l;
		},
		
		has_curve: function (name) {
			return name in curves;
		},
		
		get_curve: function (name){
			if(this.has_curve(name)){
				return curves[name]
			}
			return null;
		},
		
		set_curve: function (name, curve) {			
			curves[name] = curve;
			this.trigger("changed", name);
		},
		clear_curve: function (name) {
			var curve = curves[name];
			if (!curve) {
				return;
			}

			delete curves[name];
			this.trigger("cleared", name);
		}
	};
	
	_.extend(that, Backbone.Events);
	return that;
	
};