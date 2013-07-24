var BEZIER = BEZIER || {};
BEZIER.parsers = BEZIER.parsers  || {};


BEZIER.parsers.single = function (data) {
	data = data.trim();
	var points = [];
	
	data.split('\n').forEach(function (line) {
		line = line.trim();
		if (line[0] === "#" || line.length === 0) { //allow comments and blank lines
			return;
		}
		line = line.split("#")[0]; //allow inline comments
		line = line.split(",");
		
		points.push(BEZIER.core.dim3(Number(line[0]), Number(line[1]), Number(line[2])));
		
	});
	
	
	return BEZIER.core.bezier_curve_3(points);
	
};