var BEZIER = BEZIER || {};
BEZIER.storage = BEZIER.storage || {};


/////////////////////////
//EXCEPTIONS
/////////////////////////
BEZIER.storage.curve_storage = function () {

	var curves = {};
	
	var that = {
		EVENT_ADDED:   "added",
		EVENT_UPDATED: "changed",
		EVENT_CLEARED: "cleared",
			
		updated: function (name) {
			
			if (!this.has_curve(name)) {
				return;
			}
			this.trigger(this.EVENT_UPDATED, name);
		},
		
		get_curve_names: function () {
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

		get_all_curves: function () {

			var curve_names = this.get_curve_names();
			var curves = {};

			for(var i=0; i<curve_names.length; i++) {
				var curve_name = curve_names[i];
				curves[curve_name] = this.get_curve(curve_name);
			}

			return curves;
		},

		set_curve: function (name, curve) {			
			
			var event = this.EVENT_ADDED;
			if(this.has_curve(name)){
				event = this.EVENT_UPDATED;
			}
				
				
			curves[name] = curve;
			this.trigger(event, name);
		},
		clear_curve: function (name) {
			var curve = curves[name];
			if (!curve) {
				return;
			}

			delete curves[name];
			this.trigger(this.EVENT_CLEARED, name);
		},

		clear_all_curves: function () {
			var curve_names = this.get_curve_names();
			for(var i=0; i<curve_names.length; i++){
				var curve_name = curve_names[i];
				this.clear_curve(curve_name);
			}
		}
	};
	
	
	_.extend(that, Backbone.Events);
	return that;
	
};