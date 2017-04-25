// Reference this site for aid:
// http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart

// Fake data, pie chart updating only works if there is an initial pie chart
var dataset = [{county:"Sumter", votes:"4876", party:"REP", candidate:"test"},
               {county:"asd", votes:"123", party:"DEM", candidate:"test"},
               {county:"asd", votes:"5345", party:"IND", candidate:"test"}]
               
//constants for layout width, height, and radius
var width = 250,
    height = 250,
    radius = Math.min(width, height) / 2;

//possible colors that are being used for the donut graph
var color = d3.scale.ordinal()
    .range(['#ff4c4c', '#4c4cff', 'green']);

//creating a svg pie chart
var pieSVG = d3.select(".pie-chart")
  .append("svg")
	.attr("width", width)
	.attr("height", height)
  .append('g')
  .attr('transform', 'translate(' + (height / 2) +  ',' + (width / 2) + ')');

//specifying the arc radiuses (both inner and outer)
var arc = d3.svg.arc()
    .innerRadius(radius - 100)
    .outerRadius(radius - 20);

var textArc = d3.svg.arc()
	.outerRadius(radius - 40)
	.innerRadius(radius - 40);

var pie = d3.layout.pie()
  .value(function(d) { return +d.votes; })
  .sort(null);

var g = pieSVG.selectAll("arc")
	.data(pie(dataset))
	.enter()
  .append("g")
	.attr("class", "arc");

//adds the path for each item in the pie graph
g.append("path")
	.attr("d", arc)
	.style("fill", function(d) { return color(d.data.party);})
  .each(function(d) { this._current = d; });

//adds the text for the pie graph based on the party of the item
g.append("text")
	.attr("transform", function(d) { return "translate(" + textArc.centroid(d) + ")"; })
	.text(function(d) { return d.data.party;})
	.style("fill", "#fff")
  .each(function(d) { this._current = d; });

// The below link was how we figured out how to do transitions:
// http://www.cagrimmett.com/til/2016/08/27/d3-transitions.html
function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

//helper function for angle calculations for transitions 
function labelarcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return "translate(" + textArc.centroid(i(t)) + ")";
  };
}

//called in ga-map.js to display the pie graph using the data passed in. 
function displayPieGraph(data) {

  console.log(data)

  var pie = d3.layout.pie()
    .value(function(d) { return +d.votes; })
    .sort(null);

  piePath = d3.select('.pie-chart')
    .selectAll('path')
    .data(pie(data));

  piePath
    .transition()
    .duration(500)
    .attrTween("d", arcTween);

  // g.selectAll('text')
  //  .text(function(d) { return d.data.candidate;})

    d3.selectAll("text")
      .data(pie(data))
      .transition()
      .duration(500)
      .attrTween("transform", labelarcTween);

}
