// Your browser will call the onload() function when the document
// has finished loading. In this case, onload() points to the
// start() method we defined below. Because of something called
// function hoisting, the start() method is callable on line 6
// even though it is defined on line 8.

// This is where all of our javascript code resides. This method
// is called by "window" when the document (everything you see on
// the screen) has finished loading.
//Used http://mbostock.github.io/d3/talk/20111018/treemap.html as reference

    // Select the graph from the HTML page and save
    // a reference to it for later.
    /**          treemapTotal = {"name" : "Total", "votes": completeTotalVotes, "children": [ {
                "name": "Democrat Votes" , "votes" : completeDemVotes, "children": [treemapDem]},
                {"name":"Republican Votes", "votes" : completeRepVotes, "children": [treemapRep]}]};
     **/
    var count = 1;
    var curr = "";
    var nodes;
    var cell;
    function start(totalData, countyName, race) {
        var w = 600 - 80,
            h = 500 - 180,
            x = d3.scale.linear().range([0, w]),
            y = d3.scale.linear().range([0, h]),
            color = d3.scale.category20c(),
            root,
            node;

        var treemap = d3.layout.treemap()
            .round(false)
            .size([w, h])
            .sticky(true)
            .value(function (d) {
                return d.votes;
            });

        if (curr == "") {
            curr = race;
        } else if (curr != race) {
            d3.select("#tree").remove();
        }
        if (count) {

            svg = d3.select("#treemap")
                .attr("class", "chart")
                .style("width", w + "px")
                .style("height", h + "px")
                .append("svg:svg")
                .attr("id", "tree")
                .attr("width", w)
                .attr("height", h)
                .append("svg:g")
                .attr("transform", "translate(.5,.5)");
            console.log("in if");
            count = 0;

            node = root = totalData;
            nodes = treemap.nodes(root)
                .filter(function (d) {
                    return !d.children;
                });


            cell = svg.selectAll("g")
                .data(nodes)
                .enter().append("svg:g")
                .attr("class", "cell")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .on("click", function (d) {
                    return zoom(node == d.parent ? root : d.parent);
                });

            cell.append("svg:rect")
                .attr("width", function (d) {
                    return d.dx - 1;
                })
                .attr("height", function (d) {
                    return d.dy - 1;
                })
                .style("fill", function (d) {
                    if (countyName == d.countyName) {
                        return "#ffd700";
                    } else {
                        return (d.parent.name == "Democrat Votes" ? "#4c4cff" : "#ff4c4c");
                    }
                });

            cell.append("svg:text")
                .attr("x", function (d) {
                    return d.dx / 2;
                })
                .attr("y", function (d) {
                    return d.dy / 2;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.countyName;
                })
                .style("opacity", function (d) {
                    d.w = this.getComputedTextLength();
                    return d.dx > d.w ? 1 : 0;
                });
        } else {
            console.log("second if " + treemap);
            while (svg.lastChild) {
                svg.removeChild(svg.lastChild);
            }
            d3.select("#tree").remove();

            svg = d3.select("#treemap")
                .attr("class", "chart")
                .style("width", w + "px")
                .style("height", h + "px")
                .append("svg:svg")
                .attr("id", "tree")
                .attr("width", w)
                .attr("height", h)
                .append("svg:g")
                .attr("transform", "translate(.5,.5)");

            node = root = totalData;
            nodes = treemap.nodes(root)
                .filter(function (d) {
                    return !d.children;
                });


            cell = svg.selectAll("g")
                .data(nodes)
                .enter().append("svg:g")
                .attr("class", "cell")
                .attr("transform", function (d) {
                    return "translate(" + d.x + "," + d.y + ")";
                })
                .on("click", function (d) {
                    return zoom(node == d.parent ? root : d.parent);
                });

            cell.append("svg:rect")
                .attr("width", function (d) {
                    return d.dx - 1;
                })
                .attr("height", function (d) {
                    return d.dy - 1;
                })
                .style("fill", function (d) {
                    if (countyName == d.countyName) {
                        return "#ffd700";
                    } else {
                        return (d.parent.name == "Democrat Votes" ? "#4c4cff" : "#ff4c4c");
                    }
                });

            cell.append("svg:text")
                .attr("x", function (d) {
                    return d.dx / 2;
                })
                .attr("y", function (d) {
                    return d.dy / 2;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", "middle")
                .text(function (d) {
                    return d.countyName;
                })
                .style("opacity", function (d) {
                    d.w = this.getComputedTextLength();
                    return d.dx > d.w ? 1 : 0;
                });

        }
        /**
         d3.select(window).on("click", function() { zoom(root); });

         d3.select("select").on("change", function() {
            treemap.value(this.value == "votes ? votes : count).nodes(root);
            zoom(node);

        });**/

        function size(d) {
            return d.votes;
        }


        function zoom(d) {
            var kx = w / d.dx, ky = h / d.dy;
            x.domain([d.x, d.x + d.dx]);
            y.domain([d.y, d.y + d.dy]);

            var t = svg.selectAll("g.cell").transition()
                .duration(d3.event.altKey ? 7500 : 750)
                .attr("transform", function (d) {
                    return "translate(" + x(d.x) + "," + y(d.y) + ")";
                });

            t.select("rect")
                .attr("width", function (d) {
                    return kx * d.dx - 1;
                })
                .attr("height", function (d) {
                    return ky * d.dy - 1;
                })

            t.select("text")
                .attr("x", function (d) {
                    return kx * d.dx / 2;
                })
                .attr("y", function (d) {
                    return ky * d.dy / 2;
                })
                .style("opacity", function (d) {
                    return kx * d.dx > d.w ? 1 : 0;
                });

            node = d;
            d3.event.stopPropagation();
        }
    }