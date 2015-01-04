/*global $ */

var BEZIER = BEZIER || {};
BEZIER.widgets = BEZIER.widgets || {};


BEZIER.widgets.control_point_grid = function (storage, curve_name) {
	
	var container = $("<div></div>");

	var append_button = $("<input id='grid_append' type='button' value='Append Row' />");
	append_button.click( function(){
		var count = container.handsontable('countRows');
		container.handsontable('alter', 'insert_row', count);
	});
	container.append(append_button);

	container.handsontable({
		data: [],
		minSpareRows: 0,
		contextMenu: ['row_above', 'row_below', 'remove_row', 'hsep3', 'undo', 'redo'],
		fillHandle: false,
		colHeaders: ['X', 'Y', 'Z'], //, 'Highlight'],
		rowHeaders: true,
	    columns: [
	        {data: 'x', type: "numeric", allowInvalid: false},
	        {data: 'y', type: "numeric", allowInvalid: false},
	        {data: 'z', type: "numeric", allowInvalid: false}
	    ],

		afterRemoveRow: function (index) {
                if (!storage.has_curve(curve_name)) {
				    return;
	            }

                var curve = storage.get_curve(curve_name);
                curve.remove_point(index);
                storage.updated(curve_name);
		    },

		beforeChange: function (changes, source) {
            if (!changes) {
                return;
	        }

            $(changes).each(function (idx, change) {
                //typeof(change[3] == 'string' && change[3].length === 0
                //redundant when new value is 0 but it catches all of the empty rows
                if (!change[3] && change[1] !== "highlight") {
                    changes[idx][3] = 0;
                }
            });
			
			
		},

		afterChange: function (changes, source) {

            if (!changes) {
                return;
            }
            if (!storage.has_curve(curve_name)) {
				return;
            }

			var curve = storage.get_curve(curve_name);
            var row, prop, old_val, new_val;
            var point;

            $(changes).each(function (idx, change) {
                row = change[0]; prop = change[1]; old_val = change[2]; new_val = change[3];
                point = curve.get_point(row);

                if (old_val === new_val) {
                    return; //nothing to do here
                }

                if (prop === 'x') {
                    point.x = new_val;
                } else if (prop === 'y') {
                    point.y = new_val;
                } else if (prop === 'z') {
                    point.z = new_val;
                }
                
            });

            storage.updated(curve_name);

		},
		
		afterCreateRow: function (index) {

			if (!storage.has_curve(curve_name)) {
				return;
			}

			var curve = storage.get_curve(curve_name);
			var pt = BEZIER.core.dim3(0, 0, 0);

            if (index < curve.num_points() ) {

                curve.insert_point(index, pt);
			} else {
				curve.append_point(pt);
			}
				
			storage.updated(curve_name);

		}
		

		
	});
	
	var that = {
			dom_element: container,
			curve_name: curve_name,
			
			update: function () {				
				if(!storage.has_curve(curve_name)){
					return
				}
				
				var data = [];
				var curve = storage.get_curve(curve_name);
				var pt;
				
				for (var i = 0; i < curve.num_points(); i++) {
					pt = curve.get_point(i);
					data.push({x: pt.x, 
							   y: pt.y, 
							   z: pt.z});
				}
				this.dom_element.handsontable("loadData", data);
				
				
			}
			
		};
	
	
	storage.on(storage.EVENT_UPDATED, function (updated_curve_name) {
		
		if(that.curve_name != updated_curve_name){
			return;
		}
		
		that.update();
		
	});
	
	that.update();
	return that;
};

BEZIER.widgets.cpg_controller = function (storage, grid_factory){

	var tab_container = $("<div id='tabs'><ul></ul></div>");

	if(!grid_factory){
		grid_factory = function(curve_name){
			return BEZIER.widgets.control_point_grid(storage, curve_name);
		}
	}

	var name_key = function(curve_name){
		return curve_name.replace(/ /g, '_');
	};

	var add_tab_helper = function(tab_title, grid){
		var title_key = name_key(tab_title);


		var tabTitle = $('<li></li>');
		var tabLink = $('<a></a>')
		tabTitle.attr('id', 'link'+title_key);
		tabLink.attr('href', '#tab'+title_key);
		tabLink.html(tab_title);
		tabTitle.append(tabLink);

		$(tab_container).children("ul").append(tabTitle);

		var content = $("<div></div>");
		content.attr('id', 'tab' + title_key )
		content.append(grid);

		$(tab_container).append(content);
        $(tab_container).tabs("refresh");

		$(tabLink).trigger( "click" );
		return content;
    };

	var clear_tab_helper = function(curve_name){
		var title_key = name_key(curve_name);
		$(tab_container).children('ul').children('li#link'+title_key).remove();
		$(tab_container).children('div#tab'+title_key).remove();
		$(tab_container).tabs("refresh");
	};

	tab_container.tabs();

	//when a curve is added, add a grid in response
	storage.on(storage.EVENT_ADDED, function (curve_name) {
		var cpg = grid_factory(curve_name);
		add_tab_helper(curve_name, cpg.dom_element);
	});

	//when a curve is edited, update the table in response
	//storage.on(storage.EVENT_UPDATED, function (curve_name) {
		//var cpg.update();
	//});

	//when a curve is deleted, blow away the curve in response
	storage.on(storage.EVENT_CLEARED, function (curve_name) {
		clear_tab_helper(curve_name);
	});

	var that = {
		dom_element: tab_container
	};

	return that;
};