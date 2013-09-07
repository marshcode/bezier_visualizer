/*global $ */

var BEZIER = BEZIER || {};
BEZIER.widgets = BEZIER.widgets || {};


BEZIER.widgets.control_point_grid = function (storage, curve_name) {
	
	var container = $("<div></div>");
	
	container.handsontable({
		data: [],
		minSpareRows: 1,
		contextMenu: ['row_above', 'row_below', 'remove_row', 'hsep3', 'undo', 'redo'],
		fillHandle: false,
		colHeaders: ['INDEX', 'X', 'Y', 'Z'], //, 'Highlight'],
	    columns: [
	        {data: 'index', type: "numeric", allowInvalid: false, readOnly:true},
	        {data: 'x', type: "numeric", allowInvalid: false},
	        {data: 'y', type: "numeric", allowInvalid: false},
	        {data: 'z', type: "numeric", allowInvalid: false},
	        //{data: 'highlight', type: 'checkbox', allowInvalid: false, readOnly: false}
	    ],

		afterRemoveRow: function (index) {},

		beforeChange: function (changes, source) {},

		afterChange: function (changes, source) {},

	    cells: function (row, col, prop) {
            var cellProperties = {};
            cellProperties.renderer = function (instance, td, row, col, prop, value, cellProperties) {
            	Handsontable.TextCell.renderer.apply(this, arguments);
                if (col === 0) {
                    td.style.fontWeight = 'bold';
                    td.style.color = 'black';
                    td.style.background = '#EEE';
                }else{
                	td.style.fontWeight = 'normal';
                }

            };
		    return cellProperties;
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
					data.push({index:i,
							   x: pt.x, 
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