// Reference this site for aid:
// http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart

var width = 300,
	  height = 300;

var countypic = d3.select(".countypic")
  .append("svg")
	.attr("width", width)
	.attr("height", height)
  .append('g');

countypic.append('path')
    .datum(chartData.georgia)
    .attr('class', 'state')
    .attr('d', path);

countypic.select('.counties')
    .data(topojson.feature(data, data.objects.counties).features)
    .enter()
    .append('path')
    .attr('class', 'counties')
    .attr("id", function (d) {return "county-" + d.properties.NAME_2.replace(" ", "_")})
    .attr('d', path)
    .style('fill', function(d) {
        var countyName = d.properties.NAME_2.replace(" ", "_");
        determineElectionWinner(countyName, getSelectedRace());
    });

function displayCounty(data) {

  var pie = d3.layout.pie()
    .value(function(d) { return +d.votes; })
    .sort(null);

  piePath = d3.select('.pie-chart')
    .selectAll('path')
    .data(pie(data));

    piePath.attr("d", arc);
}