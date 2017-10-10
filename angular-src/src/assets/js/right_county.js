var width = 200,
	  height = 200;

var rightProjection = d3.geo.mercator()
  .center([0,0])
	//.translate([11212.5, 4912.5])
  .translate([11212.5, 4912.5])
  //.translate( [width/2,height/2] )
	.scale(7500);

var rightPath = d3.geo.path()
	.projection(rightProjection);

var rightSVG = d3.select(".right-county")
      .append("svg")
    	.attr("width", width)
    	.attr("height", height)
      .attr("id", "test")
      .append('path')
      //.append('g')
      //.attr('transform', 'translate(' + (height / 2) +  ',' + (width / 2) + ')');

// scaleX = d3.scale.linear()
//      .domain([-30,30])
//      .range([0,600]),
//
// scaleY = d3.scale.linear()
//      .domain([0,50])
//      .range([500,0]),

// d3.json('/Data/states/jsoncounties-GA.min.js', function(error, data) {
//   console.log(data)
//   console.log(data.features.counties[2].geometry.coordinates);
//   var points = data.features.counties[2].geometry.coordinates[0]
//   //var points = points.map(function(d) { console.log(d); return [-scaleX(d[0]),scaleY(d[1])]; });
//   console.log(points)
//     rightSVG
//       .datum(data.features.counties[2].geometry)
//       .attr('class', 'state')
//       .attr('d', rightPath);
  // rightSVG.selectAll(".polygon")
  //    .data([points])
  //    .enter().append("polygon")
  //    .attr("points",function(d) {
  //       // d is 2D array
  //       // default toString behavior for Array is join with comma
  //       return d.join(" ");
  //   })
  // .attr("stroke","black")
  // .attr("stroke-width",2);
// })

function drawRightCounty (countyData) {
  // console.log(countyData);
  rightSVG
    .datum(countyData)
    .attr('id', 'rightCountyChild')
    .attr('d', rightPath);
  //console.log(document.getElementById("rightCountyChild").style.x = 200);
}
