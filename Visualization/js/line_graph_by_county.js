// console.log("asdfasfd");
// Set the dimensions of the canvas / graph
var margin2 = {top: 80, right: 120, bottom: 80, left: 100},
    width2 = 300,
    height2 = 300;
// Parse the year / time
var parseyear = d3.time.format("%Y").parse;

// Set the ranges
var x2 = d3.time.scale().range([0, width2]);
var y2 = d3.scale.linear().range([height2, 0]);

// Define the axes
var xAxix2 = d3.svg.axis().scale(x2)
    .orient("bottom").ticks(5);

var yAxix2 = d3.svg.axis().scale(y2)
    .orient("left").ticks(8);

// Define the line
var valueline1 = d3.svg.line()
    .x(function(d) { return x2(d.year); })
    .y(function(d) { return y2(d.value); });

// Adds the svg canvas
var county_line_svg = d3.select(".county-line-graph")
    .append("svg")
        .attr("width", width2 + margin2.left + margin2.right)
        .attr("height", height2 + margin2.top + margin2.bottom)
    .append("g")
        .attr("transform",
              "translate(" + margin2.left + "," + margin2.top + ")");
var allData1;
var titleRace = "for U.S. Senate"

// Get the data
d3.csv("Data/aggregated_votes_by_county.csv", function(error, data) {
    data.forEach(function(d) {
        d.year = parseyear(d.year);
        d.value = +d.votes;
    });
    allData1 = data
    ///////////////////////////////////////toggle this to change from president to senate
    var officeType = "senate"

    var currentCounty = "gwinnett"

    if (officeType == "president"){
      var republican = data.filter(function(d){
        return d.office == "president" && d.party == "republican" && d.electionType == "general" && d.county == currentCounty;
      })
      var libertarian = data.filter(function(d){
        return d.office == "president" && d.party == "libertarian" && d.electionType == "general" && d.county == currentCounty;
      })
      var democratic = data.filter(function(d){
        return d.office == "president" && d.party == "democratic" && d.electionType == "general" && d.county == currentCounty;
      })
      titleRace = "for U.S. President"

    }

    else if (officeType == "senate"){
      var republican = data.filter(function(d){
        return d.office == "senate" && d.party == "republican" && d.electionType == "general" && d.county == currentCounty;
      })
      var libertarian = data.filter(function(d){
        return d.office == "senate" && d.party == "libertarian" && d.electionType == "general" && d.county == currentCounty;
      })
      var democratic = data.filter(function(d){
        return d.office == "senate" && d.party == "democratic" && d.electionType == "general" && d.county == currentCounty;
      })
    }

    //combining all parties' objects to find the max value of all the data
    allParties = republican.concat(democratic).concat(libertarian)
    // Scale the range of the data
    x2.domain(d3.extent(republican, function(d) { return d.year; }));
    y2.domain([0, d3.max(allParties, function(d) { return d.value; })]);

    // Add the valueline1 path.
    county_line_svg.append("path")
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline1(republican));

    // Add the valueline1 path.
    county_line_svg.append("path")
        .attr("class", "line")
        .attr("d", valueline1(democratic));

        // Add the valueline1 path.
    county_line_svg.append("path")
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", valueline1(libertarian));

    // Add the X Axis
    county_line_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxix2);

    // Add the Y Axis
    county_line_svg.append("g")
        .attr("class", "y axis")
        .call(yAxix2);

    // Y-axis labels
   county_line_svg.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "13px")
   .style("color", "#333333")
   .attr("transform", "translate ("+ (-90) + "," +(height2/2)+") rotate(-90)")
   .text("Number of votes")
   .style("font-family", "Arial");

   // X-axis labels
   county_line_svg.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "13px")
   .style("color", "#333333")
   .attr("transform", "translate("+ (width2/2) + "," +(height2+50) + ")")
   .text("Year")
   .style("font-family", "Arial");

  //title for the chart
   county_line_svg.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "16px")
   .style("color", "#333333")
   .attr("transform", "translate("+ (width2/2+30) + "," +(-30) + ")")
   .text("Yearly Aggreate Votes Per Party " + titleRace + " in " + capitalizeCounty(currentCounty) + " County")
   .style("font-family", "Arial");

    county_line_svg.append("text")
    .attr("transform", "translate(" + (width2+3) + "," + y2(republican[republican.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Republican");

  county_line_svg.append("text")
    .attr("transform", "translate(" + (width2+3) + "," + y2(democratic[democratic.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("Democratic");

  county_line_svg.append("text")
    .attr("transform", "translate(" + (width2+3) + "," + y2(libertarian[libertarian.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "green")
    .text("Libertarian");

});

function capitalizeCounty(string){
      return string.charAt(0).toUpperCase() + string.slice(1);
}

function updateCountyLineGraph1(officeType, county){

  if(county == null){
    county = currentCounty;
  }
  else{
    currentCounty = county;
  }

  county_line_svg.selectAll("*").remove();
  if (officeType == "President of the United States"){
      var republican = allData1.filter(function(d){
        return d.office == "president" && d.party == "republican" && d.electionType == "general" && d.county == county;
      })
      var libertarian = allData1.filter(function(d){
        return d.office == "president" && d.party == "libertarian" && d.electionType == "general" && d.county == county;
      })
      var democratic = allData1.filter(function(d){
        return d.office == "president" && d.party == "democratic" && d.electionType == "general" && d.county == county;
      })
      titleRace = "for U.S. President"
    }

    else if (officeType == "United States Senator"){
      var republican = allData1.filter(function(d){
        return d.office == "senate" && d.party == "republican" && d.electionType == "general" && d.county == county;
      })
      var libertarian = allData1.filter(function(d){
        return d.office == "senate" && d.party == "libertarian" && d.electionType == "general" && d.county == county;
      })
      var democratic = allData1.filter(function(d){
        return d.office == "senate" && d.party == "democratic" && d.electionType == "general" && d.county == county;
      })
      titleRace = "for U.S. Senate"
    }

    //combining all parties' objects to find the max value of all the data
    allParties = republican.concat(democratic).concat(libertarian)
    // Scale the range of the data
    x2.domain(d3.extent(republican, function(d) { return d.year; }));
    y2.domain([0, d3.max(allParties, function(d) { return d.value; })]);

    // Add the valueline1 path.
    county_line_svg.append("path")
        .attr("class", "line")
        .style("stroke", "red")
        .attr("d", valueline1(republican));

    // Add the valueline1 path.
    county_line_svg.append("path")
        .attr("class", "line")
        .attr("d", valueline1(democratic));

        // Add the valueline1 path.
    county_line_svg.append("path")
        .attr("class", "line")
        .style("stroke", "green")
        .attr("d", valueline1(libertarian));

    // Add the X Axis
    county_line_svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height2 + ")")
        .call(xAxix2);

    // Add the Y Axis
    county_line_svg.append("g")
        .attr("class", "y axis")
        .call(yAxix2);

    // Y-axis labels
   county_line_svg.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "13px")
   .style("color", "#333333")
   .attr("transform", "translate ("+ (-90) + "," +(height2/2)+") rotate(-90)")
   .text("Number of votes")
   .style("font-family", "Arial");

   // X-axis labels
   county_line_svg.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "13px")
   .style("color", "#333333")
   .attr("transform", "translate("+ (width2/2) + "," +(height2+50) + ")")
   .text("Year")
   .style("font-family", "Arial");

  //title for the chart
   county_line_svg.append("text")
   .attr("text-anchor", "middle")
   .style("font-size", "16px")
   .style("color", "#333333")
   .attr("transform", "translate("+ (width2/2+30) + "," +(-30) + ")")
   .text("Yearly Aggreate Votes Per Party " + titleRace + " in " + capitalizeCounty(county) + " County")
   .style("font-family", "Arial");

    county_line_svg.append("text")
    .attr("transform", "translate(" + (width2+3) + "," + y2(republican[republican.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "red")
    .text("Republican");

  county_line_svg.append("text")
    .attr("transform", "translate(" + (width2+3) + "," + y2(democratic[democratic.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "steelblue")
    .text("Democratic");

  county_line_svg.append("text")
    .attr("transform", "translate(" + (width2+3) + "," + y2(libertarian[libertarian.length-1].value) + ")")
    .attr("dy", ".35em")
    .attr("text-anchor", "start")
    .style("fill", "green")
    .text("Libertarian");
}
