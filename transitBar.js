//To pull one at a time (one route) would have to change the data to select a data position identical to route selected?


//select the body section of html and append a div.

var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1);

// Set up a linear scale for housing units.
var linearscale = d3.scaleLinear()
    .domain([0, 10000])
    .range([5, 150]);

//Set up a linear scale for employment.
var linearscaleemp = d3.scaleLinear()
    .domain([0, 90000])
    .range([1, 100]);


//Setting variable to a div element from the html in order to [later] add text of stop names.
var transitLines = d3.select("#transitLines");


//hello data
d3.csv("stations_housing_emp.csv", function(error, data){
    if (error){
        console.log(error);
        
//Within this function is where all of the text, lines, svg shapes are added. First park uses underscore to format the data. We will need to re-organize this based on the json file.
    }else{
        var groupedData = _.groupBy(data, function(x){return x.route});
        var groupedArr = _.keys(groupedData).map(function(y){
            return {name: y, data: groupedData[y]}
        });
        console.log(groupedArr);

//Creating another div within the div, in which to place rows. 
       var row = transitLines.selectAll("div")
            .data(groupedArr)
            .enter()
            .append("div")
			.attr("class", "valign-wrapper")
			.style("height", "100px");
			
			row.append("svg").style("width", 800).style("height",200);

//In order to start adding stuff, create blank svg.
        var svg = d3.selectAll("svg")

//Create a new group within the svg.
        var g = svg.append("g")

//Adding a line for "baseline" of chart.
        g.append("line")
            .attr("x1", 100)
            .attr("y1", 125)
            .attr("y2", 125)
            .attr("x2", function (d, i){
                return 100 + (d.data.length * 40)
        })

//Adding first set of rectangles for housing.
        svg.selectAll("rect.first")
          .data(function(d){
        
            return d.data;

            
          }).enter().append("rect")
            .attr("class","first")
            .attr("x", function (d, i){return 100+(i * 40) })
            .attr("y", function (d) {return 125- linearscale(d.units);})
            .attr("width", 15)
            .attr("height", function (d) {return linearscale(d.units);})
            .attr("fill", "#04244D")
            .attr("stroke","white")
			.attr("opacity", 0.75)
            .attr("stroke-width","1")
        //Adding tooltips to these rectangles.
            .on("mouseover", function(d){
                div.transition()
                .duration(200)
                .style("opacity",0.9)
                div.html(d.station + ", Near " + d.units + " Units")
                .style("left",(d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });

//Adding second set of rectangles for employment.
        svg.selectAll("rect.second")
          .data(function(d){
        
            return d.data;

            
          }).enter().append("rect")
            .attr("class","second")
            .attr("x", function (d, i){return 115+(i * 40) })
            .attr("y", function (d) {return 125 - linearscaleemp(d.emp);})
            .attr("width", 15)
            .attr("height", function (d) {return linearscaleemp(d.emp);})
            .attr("fill", "blue")
            .attr("stroke","white")
			.attr("opacity", 0.75)
            .attr("stroke-width","1")
        //Adding tooltips to these rectangles.
            .on("mouseover", function(d){
                div.transition()
                .duration(200)
                .style("opacity",0.9)
                div.html(d.station + ", Near " + d.emp + " Jobs")
                .style("left",(d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {
            div.transition()
                .duration(200)
                .style("opacity", 0);
        });
    }
})

