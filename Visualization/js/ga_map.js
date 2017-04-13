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
		chartData.countyNames[i] = d.properties.NAME_2
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
		.attr("id", function (d) {return "county-" + d.properties.NAME_2})
		.attr('d', path)
		.style('fill', function(d) {
			var countyName = d.properties.NAME_2;
			determineElectionWinner(countyName);
		})
		.on('mouseover', function(d){
			var countyName = d.properties.NAME_2;
			displayStatistics(countyName);
			return document.getElementById('name').innerHTML=countyName;
		});

});

function determineElectionWinner(countyName) {
	//console.log("called")
	csvName = getCSVName(countyName);
	//var color;
	d3.csv(csvName, function(error, data) {
		var groupByOffice = d3.nest()
													.key(function(d) {return d.office})
													.entries(data);
		presCandidateVotes = getVotesByOffice(groupByOffice, 'President of the United States');
		var maxParty = presCandidateVotes[0].party;
		var maxVotes = presCandidateVotes[0].votes;
		for (var i = 1; i < presCandidateVotes.length; i++) {
			curParty = presCandidateVotes[i].party;
			curVotes = +presCandidateVotes[i].votes;
			if (curVotes > maxVotes) {
				maxVotes = curVotes;
				maxParty = curParty;
			}
		}
		var countyElement = document.getElementById('county-' + countyName);
		if (maxParty.includes("R")) {
			console.log(countyName)
			countyElement.style.fill = "#c91f10"
		}
		if (maxParty.includes("D")) {
			countyElement.style.fill = "#121faa"
		}
		// For independents, some csv files have the party as "IND", while others
		// have only the letter "L"
		if (maxParty.includes("I") || maxParty.includes("L")) {
			countyElement.style.fill = "green"
		}
	});
}

function updateElectionColors() {
	console.log("called")
	svg.selectAll('.counties').forEach( function(d) {
		for (var i = 0; i < chartData.countyNames.length; i++) {
			var countyName = chartData.countyNames[i];
			determineElectionWinner(countyName);
		}
	});
}

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
	var yearDropdown = document.getElementById("yearDropdown");
	var yearSelected = yearDropdown.options[yearDropdown.selectedIndex].text;

	var electionDate = getElectionDate("President", yearSelected);

	var csvName = '/Data/' + yearSelected + '/' + yearSelected
								+ electionDate + '__ga__general__' + countyName + '__precinct.csv';
	return csvName;
}

function displayStatistics(countyName) {
	csvName = getCSVName(countyName);

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
