// Used the following website for assistance:
// http://bl.ocks.org/mbeasley/6821149

var width = 900,
	height = 800;

var chartData = {};

var svg = d3.select(".ga-map").append("svg")
			.attr("width", width)
			.attr("height", height);

// var projection = d3.geo.albersUsa()
//     .scale(1070) // size, bigger is bigger
//     .translate([width / 2, height / 2]);

var projection = d3.geo.mercator()
        .translate([11212.5, 4912.5])
        .scale(7500);

var path = d3.geo.path()
        .projection(projection);



d3.json('/Data/Geo/ga.json', function(error, data) {
//	console.log(topojson.feature(data, data.objects.states));
	console.log(data);
	chartData.georgia = topojson.feature(data, data.objects.states);
	//console.log(chartData)
    chartData.counties = topojson.feature(data, data.objects.counties);

	svg.append('path')
	   .datum(chartData.georgia)
	   .attr('class', 'state')
	   .attr('d', path);

	svg.selectAll('.counties')
		.data(topojson.feature(data, data.objects.counties).features)
		.enter()
		.append('path')
		.attr('class', 'counties')
		.attr('d', path)
		.on('mouseover', function(d){
			var countyName = d.properties.NAME_2;
			return document.getElementById('name').innerHTML=countyName;
		});

   // svg.append('path')
   //    .datum(topojson.mesh(data, data.objects.counties, function(a, b) { return a.properties.NAME_2 !== b.properties.NAME_2;}))
   //    .attr('d', path)
   //    .attr('class', 'county-boundary');
    

});
