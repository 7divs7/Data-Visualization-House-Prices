// ********************** MAP HEADING ************************************************************** 
var mapHeading = document.createElement("div");
// Set attributes or properties for the div element
mapHeading.id = "map-heading";
mapHeading.className = "map-heading";
mapHeading.textContent = "Average House Prices | " + title_text;
mapHeading.style.fontSize = "20px";
mapHeading.style.fontWeight = "bold";
mapHeading.style.marginBottom = "10px";
mapHeading.style.textAlign = "center";
mapHeading.style.zIndex = "9999";
mapHeading.style.position = "absolute";
mapHeading.style.width = "952px";
mapHeading.style.left = "50%";
mapHeading.style.transform = "translateX(-50%)"
mapHeading.style.top = "15px"; 
// Append the div element to the body or any other parent element
document.body.appendChild(mapHeading);


// ********************** MAP LEGEND **************************************************************

// AVERAGE PRICE - LEGEND

// Define legend dimensions
var legendWidth = 200;
var legendHeight = 30;

// Append SVG for legend
var legendSvg = d3.select("body")
    .append("svg")
    .attr("width", legendWidth)
    .attr("height", legendHeight)
    .style("position", "absolute")
    .style("left", screen.width/1.9) 
    .style("top", "10px"); 

d3.csv(csv_file).then(csvData => {
    // min max price
    var minPrice = d3.min(csvData, function(d) { return +d.Price; });
    var maxPrice = d3.max(csvData, function(d) { return +d.Price; });

    // Define color scale
    var colorScale = d3.scaleSequential(customColorScale)
        .domain(d3.extent(csvData, d => d.Price)); 

    // Define legend scale
    var legendScale = d3.scaleLinear()
        .domain(d3.extent(csvData, d => d.Price)) 
        .range([0, legendWidth]);

    // Draw legend rectangles
    legendSvg.selectAll("rect")
    .data(d3.range(minPrice, maxPrice, 20000))
    .enter().append("rect")
    .attr("x", function(d) { return legendScale(d); })
    .attr("y", 0)
    .attr("width", legendWidth / 10)
    .attr("height", legendHeight)
    .attr("fill", function(d) { return colorScale(d); });

    // Adjust legend position
    legendSvg.attr("transform", "translate(50, 50)");

    // Legend labels
    // Append text for minimum price
    legendSvg.append("text")
    .attr("x", 2)
    .attr("y", legendHeight - 10)
    .text(minPrice)
    .style("font-size", "13px")
    .style("font-weight", "bold")
    .style("font-family", "Arial, Helvetica, sans-serif")
    .style("fill", "black");

    // Append text for maximum price
    legendSvg.append("text")
    .attr("x", legendWidth - 65)
    .attr("y", legendHeight - 10)
    .text("<= " + maxPrice) 
    .style("font-size", "13px")
    .style("font-weight", "bold")
    .style("font-family", "Arial, Helvetica, sans-serif")
    .style("fill", "white");
})

// CRIME DATA - LEGEND
// Define legend dimensions
var crimelegendWidth = 200;
var crimelegendHeight = 300;
var crimelegendPadding = 2.5;
var xPos = 50;
var yPos = 30;

// Append SVG for legend
var crimelegendSvg = d3.select("body")
    .append("svg")
    .attr("class", "crime-legend-container")
    .attr("width", crimelegendWidth)
    .attr("height", crimelegendHeight)
    .style("position", "absolute")
    .style("right",  "30px")
    .style("top", "100px")
    .style("display", "none");

var shield = "../img/shield.png";
var danger = "../img/danger.png";

// Append text label for heading
crimelegendSvg.append("text")
  .attr("x", xPos + 15)
  .attr("y", yPos - 10)
  .text("Crime Stats")
  .style("font-size", "13px")
  .style("font-weight", "bold")
  .style("font-family", "Arial, Helvetica, sans-serif");

crimelegendSvg.append("rect")
  .attr("x", xPos + 5 - crimelegendPadding - 5) 
  .attr("y", yPos - 25 - crimelegendPadding)
  .attr("width", 105)
  .attr("height", 25)
  .attr("fill", "none")
  .attr("stroke", "black") 
  .attr("stroke-width", 1); 

// Append Shield for crime < 50
crimelegendSvg.append("svg:image")
    .attr("class", "crime-legend")
    .attr("xlink:href", shield)
    .attr("x", xPos)
    .attr("y", yPos);

crimelegendSvg.append("rect")
    .attr("x", xPos - crimelegendPadding)
    .attr("y", yPos - crimelegendPadding)
    .attr("width", 25)
    .attr("height", 25)
    .attr("fill", "none")
    .attr("stroke", "black") 
    .attr("stroke-width", 1); 

// Append Danger for crime > 50
crimelegendSvg.append("svg:image")
    .attr("class", "crime-legend")
    .attr("xlink:href", danger)
    .attr("x", xPos)
    .attr("y", yPos + 25)

crimelegendSvg.append("rect")
  .attr("x", xPos - crimelegendPadding)
  .attr("y", yPos + 25 - crimelegendPadding)
  .attr("width", 25)
  .attr("height", 25)
  .attr("fill", "none")
  .attr("stroke", "black") 
  .attr("stroke-width", 1); 

// Append text label for shield
crimelegendSvg.append("text")
  .attr("x", xPos + 30)
  .attr("y", yPos + 15)
  .text("Crime < 50")
  .style("font-size", "13px")
  .style("font-weight", "bold")
  .style("font-family", "Arial, Helvetica, sans-serif");

crimelegendSvg.append("rect")
  .attr("x", xPos + 30 - crimelegendPadding - 5) 
  .attr("y", yPos - crimelegendPadding)
  .attr("width", 80)
  .attr("height", 25)
  .attr("fill", "none")
  .attr("stroke", "black") 
  .attr("stroke-width", 1); 

// Append text label for danger
crimelegendSvg.append("text")
  .attr("x", xPos + 30)
  .attr("y", yPos + 40)
  .text("Crime > 50")
  .style("font-size", "13px")
  .style("font-weight", "bold")
  .style("font-family", "Arial, Helvetica, sans-serif");

crimelegendSvg.append("rect")
  .attr("x", xPos + 30 - crimelegendPadding - 5) 
  .attr("y", yPos + 25 - crimelegendPadding)
  .attr("width", 80)
  .attr("height", 25)
  .attr("fill", "none")
  .attr("stroke", "black") 
  .attr("stroke-width", 1); 



// POPULATION LEGEND
// Define legend dimensions
var poplegendWidth = 200;
var poplegendHeight = 100;
var poplegendPadding = 2.5;
var xPos = 50;
var yPos = 30;

// Append SVG for legend
var poplegendSvg = d3.select("body")
.append("svg")
.attr("class", "pop-legend-container")
.attr("width", poplegendWidth)
.attr("height", poplegendHeight)
.style("position", "absolute")
.style("right",  "75px")
.style("top", "190px")
.style("display", "none");

// Append text label for heading
poplegendSvg.append("text")
  .attr("x", xPos + 15)
  .attr("y", yPos - 10)
  .text("Population density")
  .style("font-size", "13px")
  .style("font-weight", "bold")
  .style("font-family", "Arial, Helvetica, sans-serif");

poplegendSvg.append("rect")
  .attr("x", xPos + 5 - poplegendPadding - 5) 
  .attr("y", yPos - 25 - poplegendPadding)
  .attr("width", 152)
  .attr("height", 25)
  .attr("fill", "none")
  .attr("stroke", "black") 
  .attr("stroke-width", 1); 

  poplegendSvg.append("rect")
  .attr("x", xPos + 5 - poplegendPadding - 5) 
  .attr("y", yPos - poplegendPadding)
  .attr("width", 152)
  .attr("height", 30)
  .attr("fill", "none")
  .attr("stroke", "black") 
  .attr("stroke-width", 1); 


  // rect for bars
  for(let i = 0; i < 6; i++)
  {
    poplegendSvg.append("rect")
    .attr("x", xPos + 45 + (i*10) - poplegendPadding - 5) 
    .attr("y", yPos + 10 - poplegendPadding)
    .attr("width", 10)
    .attr("height", 10)
    .attr("fill", "none")
    .attr("stroke", "black") 
    .attr("stroke-width", 1)
    .attr("fill", "#1c96c5");
  }

  // text for min data
  poplegendSvg.append("text")
  .attr("x", xPos )
  .attr("y", yPos + 20)
  .text("Min:0 ")
  .style("font-size", "12px")
  .style("font-weight", "bold")
  .style("font-family", "Arial, Helvetica, sans-serif");

  // text for max data
  poplegendSvg.append("text")
  .attr("x", xPos + 100)
  .attr("y", yPos + 20)
  .attr("class", "pop-max-text")
  .text("Max:180")
  .style("font-size", "12px")
  .style("font-weight", "bold")
  .style("font-family", "Arial, Helvetica, sans-serif");
 

