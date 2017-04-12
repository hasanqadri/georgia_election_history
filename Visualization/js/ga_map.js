// Used the following website for assistance:
// http://bl.ocks.org/mbeasley/6821149

var width = 900,
	height = 800;

var chartData = {};

var svg = d3.select(".ga-map").append("svg")
			.attr("width", width)
			.attr("height", height);

var projection = d3.geo.mercator()
        .translate([11212.5, 4912.5])
        .scale(7500);

var path = d3.geo.path()
        .projection(projection);


d3.json('/Data/Geo/ga.json', function(error, data) {

	console.log(data);
	chartData.georgia = topojson.feature(data, data.objects.states);
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

});

function displayStatistics(countyName) {
	// County names that have spaces in them have an underscore instead in the
	// CSV title. So, we get rid of spaces and replace with underscore.
	countyName = countyName.replace(' ', '_');

	// Getting the value of the dropdown. Got it from:
	// stackoverflow.com/questions/1085801/get-selected-value-in-
	// dropdown-list-using-javascript
	var yearDropdown = document.getElementById("yearDropdown");
	var yearSelected = yearDropdown.options[yearDropdown.selectedIndex].text;

	var electionDate = getElectionDate("President", yearSelected);

	var csvName = '/Data/' + yearSelected + '/' + yearSelected
								+ electionDate + '__ga__general__' + countyName + '__precinct.csv';

	d3.csv(csvName, function(error, data) {
		var groupByOffice = d3.nest()
													.key(function(d) {return d.office})
													.entries(data);
		presCandidateVotes = getVotesByOffice(groupByOffice, 'President of the United States');
		var voteSummaryString = ''
		for (var i = 0; i < presCandidateVotes.length; i++) {
			candidate = presCandidateVotes[i].candidate;
			candidateVotes = presCandidateVotes[i].votes;
			voteSummaryString += candidate + ': ' + candidateVotes + '<br>';

		}
		document.getElementById('voteInfoName').innerHTML = voteSummaryString;
	});

	// This function determines what date the election was held based on
	// The year and the office
	function getElectionDate(office, year) {
		if (office == 'President') {
			if (year == 2016) return '1108';
			if (year == 2012) return '1106';
			if (year == 2008) return '1104';
			if (year == 2004) return '1102';
			if (year == 2000) return '1107';
		}
	}

	// This function takes an array that has all the votes by office of a
	// certain county.
	function getVotesByOffice(groupedVotes, office) {
		for (var i = 0; i < groupedVotes.length; i++) {
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
