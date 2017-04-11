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
			displayStatistics(countyName);
			return document.getElementById('name').innerHTML=countyName;
		});

   // svg.append('path')
   //    .datum(topojson.mesh(data, data.objects.counties, function(a, b) { return a.properties.NAME_2 !== b.properties.NAME_2;}))
   //    .attr('d', path)
   //    .attr('class', 'county-boundary');


});

function displayStatistics(countyName) {
	// County names that have spaces in them have an underscore instead in the
	// CSV title. So, we get rid of spaces and replace with underscore.
	countyName = countyName.replace(' ', '_');

	var csvName = '/Data/2016/20161108__ga__general__' + countyName +
	 							'__precinct.csv';
	d3.csv(csvName, function(error, data) {
		//console.log("opened data csv file!");
		console.log(data[1]);
		var groupByOffice = d3.nest()
													.key(function(d) {return d.office})
													.entries(data);
		presCandidateVotes = getVotesByOffice(groupByOffice, 'President of the United States');
		console.log(presCandidateVotes);
		var voteSummaryString = ''
		for (var i = 0; i < presCandidateVotes.length; i++) {
			candidate = presCandidateVotes[i].candidate;
			candidateVotes = presCandidateVotes[i].votes;
			console.log(candidateVotes);
			voteSummaryString += candidate + ': ' + candidateVotes + '<br>';
			console.log(voteSummaryString);

		}
		document.getElementById('voteInfoName').innerHTML = voteSummaryString;
	});

	// This function takes an array that has all the votes by office of a
	// certain county.
	function getVotesByOffice(groupedVotes, office) {
		for (var i = 0; i < groupedVotes.length; i++) {
			console.log(groupedVotes[i].key== office);
			if (groupedVotes[i].key == office) {
				// The csv files are structured such that rows that have no
				// 'precinct' values are aggregate rows.
				return groupedVotes[i].values.filter(function (d) {
					return d.precinct == ''
				});
			}
		}

	}

}
