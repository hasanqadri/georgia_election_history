// Reference the following website for help:
//

//console.log(window.chartData)

var margins = {top: 20, right: 20, bottom: 30, left: 40},
    width = 300 - margins.left - margins.right,
    height = 300 - margins.top - margins.bottom;

/*margins
 * value accessor - returns the value to encode for a given data object.
 * scale - maps value to a visual display encoding, such as a pixel position.
 * map function - maps from data value to display value
 * axis - sets up axis
 */

 // setup x
 var xValue = function(d) { return d.Calories;}, // data -> value
     xScale = d3.scale.linear().range([0, width]), // value -> display
     xMap = function(d) { return xScale(xValue(d));}, // data -> display
     xAxis = d3.svg.axis().scale(xScale).orient("bottom");

 // setup y
 var yValue = function(d) { return d["Protein (g)"];}, // data -> value
     yScale = d3.scale.linear().range([height, 0]), // value -> display
     yMap = function(d) { return yScale(yValue(d));}, // data -> display
     yAxis = d3.svg.axis().scale(yScale).orient("left");

// setup fill color
var cValue = function(d) { return d.Manufacturer;},
    color = d3.scale.category10();

// add the graph canvas to the body of the webpage
var scatterPlotSVG = d3.select(".scatter-plot")
            .append("svg")
            .attr("width", width + margins.left + margins.right)
            .attr("height", height + margins.top + margins.bottom)
            .append("g")
            .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

// console.log(chartData.countyNames);
//
// // for (var i = 0; i < chartData.countyNames; i++) {
// //   console.log(i);
// //   var countyName = chartData.countyName[i];
// //   var csvName = getCSVName(countyName);
// //   d3.csv(csvName, function(error, data) {
// // 		var groupByOffice = d3.nest()
// // 			.key(function(d) {return d.office})
// // 			.entries(data);
// // 		raceVotes = getVotesByOffice(groupByOffice, race);
// //   });
// }

//console.log(chartData.countyNames);
// for (var i = 0; i < chartData.countyNames.length; i++) {
//   console.log(i);
//   var countyName = chartData.countyNames[i];
//   var csvName = getCSVName(countyName);
//   d3.csv(csvName, function(error, data) {
//     var groupByOffice = d3.nest()
//       .key(function(d) {return d.office})
//       .entries(data);
//     raceVotes = getVotesByOffice(groupByOffice, race);
//   });
// }

// for (var key in chartData) {
//   console.log(chartData[key])
// }
// x-axis
scatterPlotSVG.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("class", "label")
    .attr("x", width)
    .attr("y", -6)
    .style("text-anchor", "end")
    .text("REP Votes");

// y-axis
scatterPlotSVG.append("g")
    .attr("class", "y axis")
    .call(yAxis)
    .append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("DEM Votes");


var voteInfo = []

function drawScatterPlot(names) {
  //console.log(names)
  //console.log(Object.values(chartData))
  //var csvName = getCSVName(chartData.countyNames[0])
  for (var i = 0; i < names.length; i++) {
    //console.log(i);
    var countyName = names[i];
    var csvName = getCSVName(countyName);
    //console.log(csvName)
    d3.csv(csvName, function(error, data) {
  		var groupByOffice = d3.nest()
  			.key(function(d) {return d.office})
  			.entries(data);
  		raceVotes = getVotesByOffice(groupByOffice, getSelectedRace());
      //console.log(raceVotes);
      console.log(raceVotes)
      for (var i = 0; i < raceVotes.length; i++) {
        //console.log(raceVotes[data]);
        //voteInfo.push(raceVotes[data])
        //console.log(raceVotes[i])
        scatterPlotSVG.selectAll('.point')
          .datum(raceVotes[i])
          .append('circle')
          .attr('class', 'point')
          .attr('r', 4)
          .attr('cx', 10)
          .attr('cy', 10)
          .style('fill', 'red');
      }

    });
    //console.log(voteInfo)
  }



}
