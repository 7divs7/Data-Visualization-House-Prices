// Define dataset
const data = [
  { label: "Category 1", value:  (1-0.96)},
  { label: "Main", value: 0.96 } // blue
];

// Set dimensions
const width = 800;
const height = 400;
const radius = Math.min(width/2, height/2) / 2;

// Define color scale
const color1 = d3.scaleOrdinal()
  .domain(data.map(d => d.label))
  .range(["lightgray", "#ec594e"]);


// Define SVG
const svg = d3.select("#donut-chart")
  .style("display", "block") 
  .style("margin", "auto")  
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width / 6}, ${height / 2})`);

// Define arc generator
const arc = d3.arc()
  .innerRadius(radius * 0.6)
  .outerRadius(radius);

// Define pie layout
const pie = d3.pie()
  .value(d => d.value);

// Draw arcs
const arcs = svg.selectAll("arc")
  .data(pie(data))
  .enter()
  .append("g")
  .attr("class", "arc");

arcs.append("path")
  .attr("d", arc)
  .attr("fill", d => color1(d.data.label))
  .attr("stroke", "white")
  .style("stroke-width", "2px");

// Add total value label in the center
const mainData = data.find(item => item.label === "Main");
svg.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "0.35em")
  .style("font-family", "Arial") // Change font family here
  .style("font-size", "50px") // Change font size here
  .style("font-weight", "bold") // Make text bold
  .style("fill", "#ec594e") // Change color to steel blue
  .text(mainData.value);



// 2nd donut
// Define dataset for the second donut chart
const data2 = [
  { label: "Category A", value:  (1-0.46)},
  { label: "Category B", value: 0.46 } // blue
];

// Define color scale
const color2 = d3.scaleOrdinal()
  .domain(data.map(d => d.label))
  .range(["lightgray", "#6cd4b6"]);


// Define SVG for the second donut chart
const svg2 = d3.select("#donut-chart")
  .append("svg") // Append a new SVG element
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", `translate(${width/(2)}, ${height / 2})`);

// Define arc generator for the second donut chart
const arc2 = d3.arc()
  .innerRadius(radius * 0.6)
  .outerRadius(radius);

// Draw arcs for the second donut chart
const arcs2 = svg2.selectAll("arc")
  .data(pie(data2))
  .enter()
  .append("g")
  .attr("class", "arc");

arcs2.append("path")
  .attr("d", arc2)
  .attr("fill", d => color2(d.data.label))
  .attr("stroke", "white")
  .style("stroke-width", "2px");

// Add total value label in the center for the second donut chart
const mainData2 = data2.find(item => item.label === "Category B");
svg2.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "0.35em")
  .style("font-family", "Arial") // Change font family here
  .style("font-size", "50px") // Change font size here
  .style("font-weight", "bold") // Make text bold
  .style("fill", "#4fb095") // Change color to steel blue
  .text(mainData2.value);



// 3rd donut
// Define dataset for the third donut chart
const data3 = [
  { label: "Category X", value:  0.10},
  { label: "Category Y", value: 0.90 } // blue
];

// Define color scale
const color3 = d3.scaleOrdinal()
  .domain(data.map(d => d.label))
  .range(["lightgray", "#f7bf50"]);

// Define SVG for the third donut chart and adjust its position using CSS
const svg3 = d3.select("#donut-chart")
.append("svg") // Append a new SVG element
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", `translate(${width/(1.2)}, ${height / 2})`);

// Define arc generator for the third donut chart
const arc3 = d3.arc()
  .innerRadius(radius * 0.6)
  .outerRadius(radius);

// Draw arcs for the third donut chart
const arcs3 = svg3.selectAll("arc")
  .data(pie(data3))
  .enter()
  .append("g")
  .attr("class", "arc");

arcs3.append("path")
  .attr("d", arc3)
  .attr("fill", d => color3(d.data.label))
  .attr("stroke", "white")
  .style("stroke-width", "2px");

// Add total value label in the center for the third donut chart
const mainData3 = data3.find(item => item.label === "Category Y");
svg3.append("text")
  .attr("text-anchor", "middle")
  .attr("dy", "0.35em")
  .style("font-family", "Arial")
  .style("font-size", "50px")
  .style("font-weight", "bold")
  .style("fill", "#f7bf50")
  .text(mainData3.value);





// Define heading text for the first donut chart
svg.append("text")
  .attr("x", 0)
  .attr("y", -height / 2 + 40) // Adjust position above the chart
  .attr("id", "label")
  .attr("text-anchor", "middle")
  .style("font-size", "24px")
  .style("font-weight", "bold")
  .style("font-family", "Arial")
  .text("Population Density")
  .append("tspan")
  .attr("x", 0)
  .attr("dy", "1.5em") // Adjust the line height
  .text("Strong positive correlation")
  .style("font-size", "16px");;

// Define heading text for the second donut chart
svg2.append("text")
  .attr("x", 0)
  .attr("y", -height / 2 + 40) // Adjust position above the chart
  .attr("id", "label")
  .attr("text-anchor", "middle")
  .style("font-size", "24px")
  .style("font-weight", "bold")
  .style("font-family", "Arial")
  .text("Crime Stats")
  .append("tspan")
  .attr("x", 0)
  .attr("dy", "1.5em") // Adjust the line height
  .text("Weak positive correlation")
  .style("font-size", "16px");

// Define heading text for the third donut chart
svg3.append("text")
  .attr("x", 0)
  .attr("y", -height / 2 + 40) // Adjust position above the chart
  .attr("id", "label")
  .attr("text-anchor", "middle")
  .style("font-size", "24px")
  .style("font-weight", "bold")
  .style("font-family", "Arial")
  .text("Average Income")
  .append("tspan")
  .attr("x", 0)
  .attr("dy", "1.5em") // Adjust the line height
  .text("Strong positive correlation")
  .style("font-size", "16px");