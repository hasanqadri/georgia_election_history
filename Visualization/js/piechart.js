// Reference this site for aid:
// http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart

var dataset = [{county:"Sumter", votes:"4876", party:"REP"},
               {county:"asd", votes:"123", party:"DEM"},
               {county:"asd", votes:"5345", party:"IND"}]

var width = 300,
	  height = 300,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
  .range(['#c91f10', '#121faa', 'green']);

var pieSVG = d3.select(".pie-chart")
  .append("svg")
	.attr("width", width)
	.attr("height", height)
  .append('g')
  .attr('transform', 'translate(' + (height / 2) +  ',' + (width / 2) + ')');

var arc = d3.svg.arc()
  .innerRadius(0)
  .outerRadius(radius);

var pie = d3.layout.pie()
  .value(function(d) { return +d.votes; })
  .sort(null);

var piePath = pieSVG.selectAll('path')
          .data(pie(dataset))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d) {
            return color(d.data.party);
          })
          .each(function(d) { this._current = d; });

function arcTween(a) {
  var i = d3.interpolate(this._current, a);
  this._current = i(0);
  return function(t) {
    return arc(i(t));
  };
}

function displayPieGraph(data) {

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

}
