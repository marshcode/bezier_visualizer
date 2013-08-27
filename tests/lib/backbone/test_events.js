/*global module */ 
/*global test */ 
/*global equal */ 
/*global ok */ 
/*global fuzzy_equal */ 
/*global BEZIER */
/*global expect */
/*global Backbone */
/*global _ */

module("Library Tests - Backbone");


test("Events - Call Order", function () {
	var ctr = 0;
	var num = 15;
	var event_mgr = _.extend({}, Backbone.Events);
	
	expect(num);
	
	function create_callback(event_mgr, i) {
		event_mgr.on("action", function () {
			equal(i, ctr, i + "=" + ctr);
			ctr += 1;
		});
	}
	
	for (var i = 0; i < num; i++) {
		create_callback(event_mgr, i);
	}
	
	event_mgr.trigger("action");
	
});
