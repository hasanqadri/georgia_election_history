// Reference this site for aid:
// http://zeroviscosity.com/d3-js-step-by-step/step-1-a-basic-pie-chart

var dataset = [1,2,3]

var width = 300,
	  height = 300,
    radius = Math.min(width, height) / 2;

var color = d3.scale.ordinal()
  .range(['red', 'blue', 'green']);

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
  .value(function(d) { console.log(d); return d; })
  .sort(null);

var piePath = pieSVG.selectAll('path')
          .data(pie(dataset))
          .enter()
          .append('path')
          .attr('d', arc)
          .attr('fill', function(d) {
            return color(d.data);
          });

// var g = svg.selectAll("arc")
// 	.data(pie(dataset))
// 	.enter()
//   .append("g")
// 	.attr("class", "arc");
//
// g.append("path")
// 	.attr("d", arc)
// 	.style("fill", function(d, i) { return color(i);});

// piePath = pieSVG.selectAll('path')
//   .data(pie(dataset))
//   .enter()
//   .append('path')
//   .attr('d', arc)
//   .style('fill', function(d, i) { return color(i); });

function displayPieGraph(data) {

  var pie = d3.layout.pie()
    .value(function(d) { return +d.votes; })
    .sort(null);

  console.log(data);
  // piePath = pieSVG.selectAll('path')
  //   .data(pie(data))
  //   .enter()
  //   .append('path')
  //   .attr('d', arc)
  //   .style('fill', function(d, i) { return color(d.data.party); });
  // console.log("after")

  piePath = d3.select('.pie-chart')
    .selectAll('path')
    .data(pie(data));

    piePath.attr("d", arc);

}


//
// var piePath = pieSVG.selectAll('path')
//   .data(pie(dataset))
//   .enter()
//   .append('path')
//   .attr('d', arc)
//   .attr('fill', function(d, i) {
//     return color(i);
//   });
