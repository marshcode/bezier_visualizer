var BEZIER = BEZIER || {};
BEZIER.storage = BEZIER.storage || {};


/////////////////////////
//EXCEPTIONS
/////////////////////////
BEZIER.storage.curve_storage = function () {

	var curves = {};
	
	var that = {
		UPDATED_EVENT: "changed",
		CLEARED_EVENT: "cleared",
			
		updated: function (name) {
			
			if (!this.has_curve(name)) {
				return;
			}
			this.trigger(this.UPDATED_EVENT, name);
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
		
		has_curve: function (name) {
			return name in curves;
		},
		
		get_curve: function (name) {
			if (this.has_curve(name)) {
				return curves[name];
			}
			return null;
		},
		
		set_curve: function (name, curve) {			
			curves[name] = curve;
			this.updated(name);
		},
		clear_curve: function (name) {
			var curve = curves[name];
			if (!curve) {
				return;
			}

			delete curves[name];
			this.trigger(this.CLEARED_EVENT, name);
		}
	};
	
	_.extend(that, Backbone.Events);
	return that;
	
};