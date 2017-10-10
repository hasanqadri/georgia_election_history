// console.log("asdfasfd");
// Set the dimensions of the canvas / graph
var margin1 = {top: 80, right: 120, bottom: 80, left: 100},
    width1 = 300,
    height1 = 300;
console.log("ASDFASF")
// Parse the year / time
var parseyear = d3.time.format("%Y").parse;

// Set the ranges
var x1 = d3.time.scale().range([0, width1]);
var y1 = d3.scale.linear().range([height1, 0]);

// Define the axes
var xAxis1 = d3.svg.axis().scale(x1)
    .orient("bottom").ticks(5);

var yAxis1 = d3.svg.axis().scale(y1)
    .orient("left").ticks(8);

// Define the line
var valueline = d3.svg.line()
    .x(function(d) { return x1(d.year); })
    .y(function(d) { return y1(d.value); });

// Adds the svg canvas
var svg1 = d3.select(".line-graph")
    .append("svg")
        .attr("width", width1 + margin1.left + margin1.right)
        .attr("height", height1 + margin1.top + margin1.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin1.left + "," + margin1.top + ")");
var allData;
var titleRace = "for U.S. Senate"

// Get the data
d3.csv("../Data/aggregated_votes.csv", function(error, data) {
    data.forEach(function(d) {
        d.year = parseyear(d.year);
        d.value = +d.votes;
    });

    allData = data
    ///////////////////////////////////////toggle this to change from president to senate
    var officeType = "senate"



    if (officeType == "president"){
      var republican = data.filter(function(d){
        return d.office == "president" && d.party == "republican" && d.electionType == "general";
      })
      var libertarian = data.filter(function(d){
        return d.office == "president" && d.party == "libertarian" && d.electionType == "general";
      })
      var democratic = data.filter(function(d){
        return d.office == "president" && d.party == "democratic" && d.electionType == "general";
      })
      titleRace = "for U.S. President"

    }

    else if (officeType == "senate"){
      var republican = data.filter(function(d){
        return d.office == "senate" && d.party == "republican" && d.electionType == "general";
      })
      var libertarian = data.filter(function(d){
        return d.office == "senate" && d.party == "libertarian" && d.electionType == "general";
      })
      var democratic = data.filter(function(d){
        return d.office == "senate" && d.party == "democratic" && d.electionType == "general";
      })
    }

    // Scale the range of the data
    x1.domain(d3.extent(republican, function(d) { return d.year; }));
    y1.domain([0, d3.max(republican, function(d) { return d.value; })]);

    // Add the valueline path.
    svg1.append("path")
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline(republican));

    // Add the valueline path.
    svg1.append("path")
        .attr("class", "line")
        .attr("d", valueline(democratic));

        // Add the valueline path.
    svg1.append("path")
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", valueline(libertarian));

    // Add the X Axis
    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xAxis1);

    // Add the Y Axis
    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis1);

    // Y-axis labels
   svg1.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "13px")
   .style("color", "#333333")
   .attr("transform", "translate ("+ (-90) + "," +(height1/2)+") rotate(-90)")
   .text("Number of votes")
   .style("font-family", "Arial");

   // X-axis labels
   svg1.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "13px")
   .style("color", "#333333")
   .attr("transform", "translate("+ (width1/2) + "," +(height1+50) + ")")
   .text("Year")
   .style("font-family", "Arial");

  //title for the chart
   svg1.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "16px")
   .style("color", "#333333")
   .attr("transform", "translate("+ (width1/2+30) + "," +(-30) + ")")
   .text("Yearly Aggreate Votes Per Party " + titleRace)
   .style("font-family", "Arial");

    svg1.append("text")
    .attr("transform", "translate(" + (width1+3) + "," + y1(republican[republican.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Republican");

  svg1.append("text")
    .attr("transform", "translate(" + (width1+3) + "," + y1(democratic[democratic.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("Democratic");

  svg1.append("text")
    .attr("transform", "translate(" + (width1+3) + "," + y1(libertarian[libertarian.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "green")
    .text("Libertarian");

});

function updateLineGraph(officeType){
  svg1.selectAll("*").remove();
  if (officeType == "President of the United States"){
      var republican = allData.filter(function(d){
        return d.office == "president" && d.party == "republican" && d.electionType == "general";
      })
      var libertarian = allData.filter(function(d){
        return d.office == "president" && d.party == "libertarian" && d.electionType == "general";
      })
      var democratic = allData.filter(function(d){
        return d.office == "president" && d.party == "democratic" && d.electionType == "general";
      })
      titleRace = "for U.S. President"
    }

    else if (officeType == "United States Senator"){
      var republican = allData.filter(function(d){
        return d.office == "senate" && d.party == "republican" && d.electionType == "general";
      })
      var libertarian = allData.filter(function(d){
        return d.office == "senate" && d.party == "libertarian" && d.electionType == "general";
      })
      var democratic = allData.filter(function(d){
        return d.office == "senate" && d.party == "democratic" && d.electionType == "general";
      })
      titleRace = "for U.S. Senate"
    }

    // Scale the range of the data
    x1.domain(d3.extent(republican, function(d) { return d.year; }));
    y1.domain([0, d3.max(republican, function(d) { return d.value; })]);

    // Add the valueline path.
    svg1.append("path")
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline(republican));

    // Add the valueline path.
    svg1.append("path")
        .attr("class", "line")
        .attr("d", valueline(democratic));

        // Add the valueline path.
    svg1.append("path")
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", valueline(libertarian));

    // Add the X Axis
    svg1.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height1 + ")")
        .call(xAxis1);

    // Add the Y Axis
    svg1.append("g")
        .attr("class", "y axis")
        .call(yAxis1);

    // Y-axis labels
   svg1.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "13px")
   .style("color", "#333333")
   .attr("transform", "translate ("+ (-90) + "," +(height1/2)+") rotate(-90)")
   .text("Number of votes")
   .style("font-family", "Arial");

   // X-axis labels
   svg1.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "13px")
   .style("color", "#333333")
   .attr("transform", "translate("+ (width1/2) + "," +(height1+50) + ")")
   .text("Year")
   .style("font-family", "Arial");

  //title for the chart
   svg1.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "16px")
   .style("color", "#333333")
   .attr("transform", "translate("+ (width1/2+30) + "," +(-30) + ")")
   .text("Yearly Aggreate Votes Per Party " + titleRace)
   .style("font-family", "Arial");

    svg1.append("text")
    .attr("transform", "translate(" + (width1+3) + "," + y1(republican[republican.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Republican");

  svg1.append("text")
    .attr("transform", "translate(" + (width1+3) + "," + y1(democratic[democratic.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("Democratic");

  svg1.append("text")
    .attr("transform", "translate(" + (width1+3) + "," + y1(libertarian[libertarian.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "green")
    .text("Libertarian");
}
