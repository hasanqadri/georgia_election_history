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

	chartData.countyNames = []
	// Getting the names of all the counties and storing them so that they can
	// be used later on
	data.objects.counties.geometries.forEach(function(d, i) {
		chartData.countyNames[i] = d.properties.NAME_2.replace(" ", "_");
	});
	chartData.georgia = topojson.feature(data, data.objects.states);
  chartData.counties = topojson.feature(data, data.objects.counties);
	console.log(chartData)

	svg.append('path')
	   .datum(chartData.georgia)
	   .attr('class', 'state')
	   .attr('d', path);

	svg.selectAll('.counties')
		.data(topojson.feature(data, data.objects.counties).features)
		.enter()
		.append('path')
		.attr('class', 'counties')
		.attr("id", function (d) {return "county-" + d.properties.NAME_2.replace(" ", "_")})
		.attr('d', path)
		.style('fill', function(d) {
			var countyName = d.properties.NAME_2.replace(" ", "_");
			determineElectionWinner(countyName, getSelectedRace());
		})
		.on('mouseover', function(d){
			var countyName = d.properties.NAME_2;
			displayStatistics(countyName, getSelectedRace());
			return document.getElementById('name').innerHTML=countyName;
		});

});

function getSelectedRace() {
	var raceDropdown = document.getElementById("raceDropdown");
	var raceSelected = raceDropdown.options[raceDropdown.selectedIndex].value;
	return raceSelected;
}

function getSelectedYear() {
	var yearDropdown = document.getElementById("yearDropdown");
	var yearSelected = yearDropdown.options[yearDropdown.selectedIndex].text;
	return yearSelected;
}

function determineElectionWinner(countyName, race) {
	csvName = getCSVName(countyName);
	d3.csv(csvName, function(error, data) {
		var groupByOffice = d3.nest()
													.key(function(d) {return d.office})
													.entries(data);
	  //console.log(groupByOffice);
		votesByRace = getVotesByOffice(groupByOffice, race);
		console.log(votesByRace);
		var maxParty = votesByRace[0].party;
		var maxVotes = votesByRace[0].votes;
		for (var i = 1; i < votesByRace.length; i++) {
			curParty = votesByRace[i].party;
			curVotes = +votesByRace[i].votes;
			if (curVotes > maxVotes) {
				maxVotes = curVotes;
				maxParty = curParty;
			}
		}
		if (maxParty.includes("R")) {
			d3.select('#county-' + countyName)
			.transition(10000)
			.style("fill", "#c91f10");
		}
		if (maxParty.includes("D")) {
			d3.select('#county-' + countyName)
			.transition(1000)
			.style("fill", "#121faa");
		}
		// For independents, some csv files have the party as "IND", while others
		// have only the letter "L"
		if (maxParty.includes("I") || maxParty.includes("L")) {
			d3.select('#county-' + countyName)
			.transition(1000)
			.style("fill", "green");
		}
	});
}
//:)

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

function getCSVName(countyName) {
	countyName = countyName.replace(' ', '_');

	// Getting the value of the dropdown. Got it from:
	// stackoverflow.com/questions/1085801/get-selected-value-in-
	// dropdown-list-using-javascript
	var yearSelected = getSelectedYear();

	var electionDate = getElectionDate("President", yearSelected);

	var csvName = '/Data/' + yearSelected + '/' + yearSelected
								+ electionDate + '__ga__general__' + countyName + '__precinct.csv';
	return csvName;
}

function displayStatistics(countyName, race) {
	csvName = getCSVName(countyName);

	d3.csv(csvName, function(error, data) {
		var groupByOffice = d3.nest()
													.key(function(d) {return d.office})
													.entries(data);
		raceVotes = getVotesByOffice(groupByOffice, race);
		var voteSummaryString = ''
		for (var i = 0; i < raceVotes.length; i++) {
			candidate = raceVotes[i].candidate;
			candidateVotes = raceVotes[i].votes;
			voteSummaryString += candidate + ': ' + candidateVotes + '<br>';
		}
		document.getElementById('voteInfoName').innerHTML = voteSummaryString;
	});

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


// handle on selection event whenever a new year is chosen
d3.select('#yearDropdown')
	.on('change', function() {
		console.log("called")
		svg.selectAll('.counties').forEach( function(d) {
			for (var i = 0; i < chartData.countyNames.length; i++) {                             // neeeeeeeeerd
				var countyName = chartData.countyNames[i];
				console.log(countyName);
				determineElectionWinner(countyName, getSelectedRace());
			}
		});
	});

// handle on selection event whenever a new race is chosen
d3.select('#raceDropdown')
	.on('change', function() {
		console.log("called")
		svg.selectAll('.counties').forEach( function(d) {
			for (var i = 0; i < chartData.countyNames.length; i++) {                             // neeeeeeeeerd
				var countyName = chartData.countyNames[i];
				console.log(countyName);
				determineElectionWinner(countyName, getSelectedRace());
			}
		});
	});
