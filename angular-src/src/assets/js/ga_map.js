// Used the following website for assistance:
// http://bl.ocks.org/mbeasley/6821149


//setting up basic chart variables
var width = 630,
	height = 800;

var chartData = {};

var countyName = []

var svg = d3.select(".ga-map").append("svg")
	.attr("width", width)
	.attr("height", height);

var projection = d3.geo.mercator()
	.translate([11212.5, 4912.5])
	.scale(7500);

var path = d3.geo.path()
	.projection(projection);

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

var map =  {};


//initializing variables needed throughout visualization
var treemapTotal = {};
var completeDemVotes = 0;
var completeRepVotes = 0;
var completeTotalVotes = 0;
var count = 0;
var treemapDem = [];
var demCount = 0;
var treemapRep = [];
var repCount = 0;
var hide = 1;
var x;


d3.json('./ga.json', function(error, data) {

	chartData.countyNames = [];
	// Getting the names of all the counties and storing them so that they can
	// be used later on
	data.objects.counties.geometries.forEach(function(d, i) {
		chartData.countyNames[i] = d.properties.NAME_2.replace(" ", "_");
	});
    for (x = 0; x < chartData.countyNames.length; x++) {
        tooltipStats(chartData.countyNames[x], getSelectedRace());
        treemapStats(chartData.countyNames[x], getSelectedRace());
    }
	chartData.georgia = topojson.feature(data, data.objects.states);
	chartData.counties = topojson.feature(data, data.objects.counties);

	// Store the features so that we can use them for the right county diplay
	chartData.countyFeatures = topojson.feature(data, data.objects.counties).features;


	svg.append('path')
		.datum(chartData.georgia)
		.attr('class', 'state')
		.attr('d', path);

	//goes through each county - for each, add path. Adds click, and hover listeners
	svg.selectAll('.counties')
		.data(topojson.feature(data, data.objects.counties).features)
		.enter()
		.append('path')
		.attr('class', 'counties')
		.attr("id", function (d) {return "county-" + d.properties.NAME_2.replace(" ", "_").toLowerCase()})
		.attr('d', path)
		.style('fill', function(d) {
			var countyName = d.properties.NAME_2.replace(" ", "_");
			determineElectionWinner(countyName, getSelectedRace());
		})
		//when a county is clicked, update each separate visualizations based on the county that was clicked
      .on('click', function(d){
				document.getElementById('inputCounty').value = '';
          if (hide) {
              x = document.getElementById('right');
              x.style.display = 'block';
              hide = 0;
          }

		  var countyName = d.properties.NAME_2;
          document.getElementById("nam").innerHTML = countyName + " County";

          start(treemapTotal, countyName.toLowerCase(), getSelectedRace(), getSelectedYear());

		  updateCountyLineGraph1(getSelectedRace(), countyName.toLowerCase());

	      displayStatistics(countyName.toLowerCase(), getSelectedRace());

	      resetAllCountyOpacities()

	      //setting all county opacities other than the one clicked to .25
	      for(var x = 0; x < chartData.countyNames.length; x++) {
			currentCounty = chartData.countyNames[x].toLowerCase()
			if (currentCounty != countyName.toLowerCase()){
				elem = document.getElementById('county-'+currentCounty)
				elem.style.opacity = .25;
			}
		  }

	   })
      	//handling tooltips when a county is hovered upon
      .on('mouseover', function(d){
		  var countyName = d.properties.NAME_2;

		  tooltip.transition()
              .duration(200)
              .style("opacity", .75);
          tooltip.html( function() {

              return (d.properties.NAME_2).toUpperCase() + " COUNTY" + "<br>" + map[countyName.toLowerCase()];
          })
              .style("left", (d3.event.pageX + 5) + "px")
              .style("top", (d3.event.pageY - 28) + "px");
      })
      .on("mouseout", function(d) {
          tooltip.transition()
              .duration(500)
              .style("opacity", 0);
      })

});

//reset the ga-map to its original state - called when 'Reset Vis' button is clicked
function resetMap(){
    x = document.getElementById('right');
    x.style.display = 'none';
    hide = 1;
	resetAllCountyOpacities()

}

//makes all county opacities equal to 1
function resetAllCountyOpacities(){
	for(var x = 0; x < chartData.countyNames.length; x++) {
		currentCounty = chartData.countyNames[x].toLowerCase()
		elem = document.getElementById('county-'+currentCounty)
		elem.style.opacity = 1;
	}
}

//checks if the inputted county is a valid GA county name. Returns boolean value
function isValidCounty(county){
	for(var x = 0; x < chartData.countyNames.length; x++) {
		currentCounty = chartData.countyNames[x].toLowerCase()
		// console.log(countyTyped)
		if (currentCounty == countyTyped){
			return true

		}
	}
	return false
}

//handles updating the ga-map layout and changing the colors and opacities, as well as updating the other graphs on click of a county
d3.select("#inputCounty").on('keyup',function() {

	resetAllCountyOpacities()

	// chartData.countyNames
	validCountyTyped = false;

    countyTyped = document.getElementById('inputCounty').value.toLowerCase()

	if (isValidCounty(countyTyped)){
			x = document.getElementById('right');
			x.style.display = 'block';
        start(treemapTotal, countyTyped.toLowerCase(), getSelectedRace(), getSelectedYear());

	    updateCountyLineGraph1(getSelectedRace(), countyTyped.toLowerCase());

        displayStatistics(countyTyped.toLowerCase(), getSelectedRace());

		for(var x = 0; x < chartData.countyNames.length; x++) {
			currentCounty = chartData.countyNames[x].toLowerCase()
			if (currentCounty != countyTyped){
				elem = document.getElementById('county-'+currentCounty)
				elem.style.opacity = .25;
			}
		}
	}
	else{
		x = document.getElementById('right');
		x.style.display = 'none';
	}

})

//updates the county variable
function updateCountyFromInput(){
	county = document.getElementById('inputCounty').innerHTML
}

//gets the selected race from the dropdown html element
function getSelectedRace() {
	var raceDropdown = document.getElementById("raceDropdown");
	var raceSelected = raceDropdown.options[raceDropdown.selectedIndex].value;
	return raceSelected;
}

//gets the selected year from the dropdown html element
function getSelectedYear() {
	var yearDropdown = document.getElementById("yearDropdown");
	var yearSelected = yearDropdown.options[yearDropdown.selectedIndex].text;
	return yearSelected;
}

//goes through the relevant csv file, and calculates the candidate with the highest number of votes. Based on the number of votes,
//and the party, the colors are updated on the ga-map
function determineElectionWinner(countyName, race) {
	csvName = getCSVName(countyName.toLowerCase());
	d3.csv(csvName, function(error, data) {
		var groupByOffice = d3.nest()
			.key(function(d) {return d.office})
			.entries(data);

		votesByRace = getVotesByOffice(groupByOffice, race);
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
		countyName=countyName.toLowerCase();
		if (maxParty.includes("R")) {
			d3.select('#county-' + countyName)
				.transition()
				.duration(1000)
				.style("fill", "#c91f10");
		}
		if (maxParty.includes("D")) {
			d3.select('#county-' + countyName)
				.transition()
				.duration(1000)
				.style("fill", "#121faa");
		}
		// For independents, some csv files have the party as "IND", while others
		// have only the letter "L"
		if (maxParty.includes("I") || maxParty.includes("L")) {
			d3.select('#county-' + countyName)
				.transition()
				.duration(1000)
				.style("fill", "green");
		}
	});
}
//:)

// This function determines what date the election was held based on
// The year and the office
function getElectionDate(office, year) {
	if (office == 'President of the United States') {
		if (year == 2016) return '1108';
		if (year == 2012) return '1106';
		if (year == 2008) return '1104';
		if (year == 2004) return '1102';
		if (year == 2000) return '1107';
	}
	if (office == 'United States Senator') {
		if (year == 2016) return '1108';
		if (year == 2014) return '1104';
	}
}

//returns the csv name from the '/Data' folder given some county's name
function getCSVName(countyName) {
	countyName = countyName.toLowerCase().replace(' ', '_');

	// Getting the value of the dropdown. Got it from:
	// stackoverflow.com/questions/1085801/get-selected-value-in-
	// dropdown-list-using-javascript
	var yearSelected = getSelectedYear();
	var raceSelected = getSelectedRace();
	var electionDate = getElectionDate(raceSelected, yearSelected);

	var csvName = '/Data/' + yearSelected + '/' + yearSelected
		+ electionDate + '__ga__general__' + countyName.toLowerCase() + '__precinct.csv';
	return csvName;
}

// Display statistics at top of HTML page
function displayStatistics(countyName, race) {
	csvName = getCSVName(countyName.toLowerCase());
	d3.csv(csvName, function(error, data) {
		var groupByOffice = d3.nest()
			.key(function(d) {return d.office})
			.entries(data);
		raceVotes = getVotesByOffice(groupByOffice, race);
		displayPieGraph(raceVotes);

		// pass raceVotes data to piechart so that we can display the pie graph
		var voteSummaryString = ''
		for (var i = 0; i < raceVotes.length; i++) {
			candidate = raceVotes[i].candidate;
			candidateVotes = raceVotes[i].votes;
			voteSummaryString += candidate + ': ' + candidateVotes + '<br>';
		}
        map[countyName.toLowerCase()] = voteSummaryString;
		return voteSummaryString;
	});
}

//gets the statistics needed for tooltips
function tooltipStats(countyName, race) {
    csvName = getCSVName(countyName.toLowerCase());
    d3.csv(csvName, function(error, data) {
        var groupByOffice = d3.nest()
            .key(function(d) {return d.office})
            .entries(data);
        raceVotes = getVotesByOffice(groupByOffice, race);
        var voteSummaryString = '';
        for (var i = 0; i < raceVotes.length; i++) {
            candidate = raceVotes[i].candidate;
            candidateVotes = raceVotes[i].votes;
            voteSummaryString += candidate + ': ' + candidateVotes + '<br>';
        }
        map[countyName.toLowerCase()] = voteSummaryString;
        return voteSummaryString;
    });
}

//gets the statistics needed for the treemap
function treemapStats(countyName, race) {
    csvName = getCSVName(countyName.toLowerCase());
    var totalVotes = 0;
    var demVotes = 0;
    var repVotes = 0;
    if (count < 158) {
        document.getElementById("load").innerHTML = "Loading....";
    } else {
        document.getElementById("load").innerHTML = "Loaded";
    }
    d3.csv(csvName, function(error, data) {
        var groupByOffice = d3.nest()
            .key(function(d) {return d.office})
            .entries(data);
        raceVotes = getVotesByOffice(groupByOffice, race);
        for (var i = 0; i < raceVotes.length; i++) {
            if (i == 0) {
                repVotes = raceVotes[i].votes;
            } else if (i == 1) {
                demVotes = raceVotes[i].votes;
            }
        }
        //calculating the total number of votes per party
        totalVotes = (+demVotes) + (+repVotes);
        completeTotalVotes = (+completeTotalVotes) + (+totalVotes);
        completeRepVotes = (+completeRepVotes) + (+repVotes);
        completeDemVotes = (+completeDemVotes) + (+demVotes);
        //var totalObj = {countyName.toLowerCase(): countyName.toLowerCase(), votes: totalVotes};
        var demObj = {countyName: countyName.toLowerCase(), votes: demVotes};
        var repObj = {countyName: countyName.toLowerCase(), votes: repVotes};

        //treemapTotal[count] = totalObj;
        treemapDem[demCount] = demObj;
        treemapRep[repCount] = repObj;
        demCount++;
        repCount++;
        count++;
		console.log(count);

		if (count == 159) {
            document.getElementById("load").innerHTML = "Loaded";
            treemapTotal = {"name" : "Total", "children": [ {
                "name": "Democrat Votes" ,  "children": treemapDem},
                {"name":"Republican Votes", "children": treemapRep}]};
			return treemapTotal;
        }
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
        x = document.getElementById('right');
        x.style.display = 'none';
				resetAllCountyOpacities()
        hide = 1;
        console.log(getSelectedRace());
        if ((getSelectedRace() === "President of the United States" && getSelectedYear() == 2014) || (getSelectedRace() === "United States Senator" && getSelectedYear() == 2012)) {
            if (getSelectedRace() == "President of the United States") {
                alert("There was no Presidential race in 2014.");
            } else {
                alert("There was no Senator race in 2012");
            }
        } else {
            treemapTotal = {};
            completeDemVotes = 0;
            completeRepVotes = 0;
            completeTotalVotes = 0;
            count = 0;
            treemapDem = [];
            demCount = 0;
            treemapRep = [];
            repCount = 0;
            for (x = 0; x < chartData.countyNames.length; x++) {
                tooltipStats(chartData.countyNames[x], getSelectedRace());
                treemapStats(chartData.countyNames[x], getSelectedRace());
            }
            svg.selectAll('.counties').forEach(function (d) {
                for (var i = 0; i < chartData.countyNames.length; i++) {
                    var countyName = chartData.countyNames[i];
                    determineElectionWinner(countyName, getSelectedRace());
                }
            });
        }
	});

// handle on selection 1event whenever a new race is chosen
d3.select('#raceDropdown')
	.on('change', function() {
        x = document.getElementById('right');
        x.style.display = 'none';
				resetAllCountyOpacities()
        hide = 1;
        if ((getSelectedRace() === "President of the United States" && getSelectedYear() == 2014) || (getSelectedRace() == "United States Senator" && getSelectedYear() === 2012)) {
            if (getSelectedRace() == "President of the United States") {
                alert("There was no Presidential race in 2014.");
            } else {
                alert("There was no Senator race in 2012");
            }
        } else {

            treemapTotal = {};
            completeDemVotes = 0;
            completeRepVotes = 0;
            completeTotalVotes = 0;
            count = 0;
            treemapDem = [];
            demCount = 0;
            treemapRep = [];
            repCount = 0;
            for (x = 0; x < chartData.countyNames.length; x++) {
                tooltipStats(chartData.countyNames[x], getSelectedRace());
                treemapTotal = treemapStats(chartData.countyNames[x], getSelectedRace());
            }


            svg.selectAll('.counties').forEach(function (d) {
                for (var i = 0; i < chartData.countyNames.length; i++) {
                    var countyName = chartData.countyNames[i];
                    determineElectionWinner(countyName, getSelectedRace());
                }
            });
            // updateLineGraph(getSelectedRace());
            // updateCountyLineGraph1(getSelectedRace(), null);
        }
	});
