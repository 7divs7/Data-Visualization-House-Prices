// set the dimensions and margins of the graph
const margin = {top: 10, right: 50, bottom: 30, left: 80},
    width = 860 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Create a div element
var div = d3.select("body")
   .append("div")
   .attr("id", "my_dataviz")
   .style("background-color", "white")
   .style("padding", "10px")
   .style("border", "1px solid black");


// Create select element
var selectButton = d3.select("body")
   .append("select")
   .attr("id", "selectButton");

// Create a tooltip element
const tooltip = d3.select("body")
  .append("div")
  .attr("class", "tooltip");

// append the svg object to the body of the page
const svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);
    
    function showTooltipWithTransition(tooltip, x, y, text) {
      tooltip.fontFamily = "Arial, Helvetica, sans-serif";
      const lag = 50; // Lag in milliseconds
      let mouseX, mouseY;
      // Function to show the tooltip and mimic mouse cursor movement
      function showTooltip(x, y, text) {
          tooltip.innerHTML = text;
          mouseX = x;
          mouseY = y;
    }
    document.addEventListener("mousemove", function(event) {
        showTooltip(event.pageX, event.pageY, text);
    
        // Apply lag to mimic cursor movement
        setTimeout(function() {
            tooltip.style.left = mouseX + 20 + 'px';
            tooltip.style.top = mouseY + 20 + 'px';
        }, lag);
    });
    }


//Read the data
d3.csv("../datasets/combined-dataset-main.csv").then( function(data) {

    // List of groups (here I have one group per column)
    const allGroup = new Set(data.map(d => d.Borough))

    // add the options to the button
    d3.select("#selectButton")
      .selectAll('myOptions')
     	.data(allGroup)
      .enter()
    	.append('option')
      .text(function (d) { return d; }) // text showed in the menu
      .attr("value", function (d) { return d; }) // corresponding value returned by the button

    // A color scale: one color for each group
    const myColor = d3.scaleOrdinal()
      .domain(allGroup)
      .range(d3.schemeSet2);

    // Add X axis --> it is a date format
   const x = d3.scaleLinear()
      .domain([d3.min(data, function(d) { return +d.Year; }), d3.max(data, function(d) { return +d.Year; })])
      .range([ 0, width ]);
    svg.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(d3.axisBottom(x).ticks(15).tickFormat(d3.format("d")));

   // Add Y axis
   const y = d3.scaleLinear()
      .domain([0, d3.max(data, function(d) { return +d.Price; })])
      .range([ height, 0 ]);
   svg.append("g")
      .call(d3.axisLeft(y));

  // Add Y2 axis
  const y2 = d3.scaleLinear()
    .domain([0, d3.max(data, d => +d.Crime)]) // Update with appropriate data property
    .range([height, 0]);
  svg.append("g")
    .attr("class", "axis")
    .attr("transform", `translate(${width}, 0)`) // Move the axis to the right side of the chart
    .call(d3.axisRight(y2)); // Use d3.axisRight() to create a right-oriented axis

  //add xlabel
  // text label for the x axis
  svg.append("text")             
  .attr("transform",
        "translate(" + (width/2) + " ," + 
                       (height + margin.top + 20) + ")")
  .style("text-anchor", "middle")
  .text("Year");

//add y and y2 labels
// text label for the y axis
svg.append("g")
  .append("circle")  // Append circle element
  .attr("cx", "-70")    // Position the circle
  .attr("cy", "300")
  .attr("r", 7)  // Set radius
  .style("fill", "steelblue");  // Set fill color
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 0 - margin.left)
  .attr("x",0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Average House Prices (in £) "); 

// text label for the y2 axis
svg.append("g")
  .append("circle")  // Append circle element
  .attr("cx", "770")    // Position the circle
  .attr("cy", "310")
  .attr("r", 7)  // Set radius
  .style("fill", "#6cd4b6");  // Set fill color
svg.append("text")
  .attr("transform", "rotate(-90)")
  .attr("y", 810 - margin.right)
  .attr("x", 0 - (height / 2))
  .attr("dy", "1em")
  .style("text-anchor", "middle")
  .text("Crime Statistics (in number) "); 
   
   // Initialize line with first group of the list
   const line = svg
      .append('g')
      .append("path")
      .datum(data.filter(function(d){return d.Borough==="Barking and Dagenham";}))
      .attr("d", d3.line()
         .x(function(d) { return x(d.Year); })
         .y(function(d) { return y(+d.Price); })
      )
      .attr("stroke", "steelblue")
      .style("stroke-width", 4)
      .style("fill", "none");

       data1 = data.filter(function(d){return d.Borough==="Barking and Dagenham";})
       console.log(data1);

      svg.selectAll('.circle')
        .data(data1)
        .enter()
        .append('circle')
        .attr('class', 'circle')
        .attr('cx', d => x(d.Year)) // Use the x scale to position circles based on Year
        .attr('cy', d => y(d.Price))
        .attr('r', 5)
        .attr('fill', "steelblue") // Add fill color for circles
        .on('mouseover', function(event, d) {
          const [x, y] = d3.pointer(event, this);
          const x1 = x + 10; // Adjust x position of tooltip
          const y1 = y + 50; // Adjust y position of tooltip
          const text = `<b>${d.Year}</b><br>Average House Price: £ ${d.Price}`;
          tooltip.transition().duration(200).style("opacity", 0.9);
          tooltip.html(text)
              .style("left", `${x1}px`)
              .style("top", `${y1}px`)
          tooltip.style("background-color", "steelblue")
          tooltip.style("display", "block");
      })
      .on('mouseout', function() {
          tooltip.transition().duration(200).style("opacity", 0);
          tooltip.style("display", "none");
      });


      // Initialize line 2 with first group of the list
   const line2 = svg
   .append('g')
   .append("path")
   .datum(data.filter(function(d){return d.Borough==="Barking and Dagenham";}))
   .attr("d", d3.line()
      .x(function(d) { return x(d.Year); })
      .y(function(d) { return y2(+d.Crime); })
   )
   .attr("stroke", "#6cd4b6")
   .style("stroke-width", 4)
   .style("fill", "none");

   svg.selectAll('.circle2')
     .data(data1)
     .enter()
     .append('circle')
     .attr('class', 'circle2')
     .attr('cx', d => x(d.Year)) // Use the x scale to position circles based on Year
     .attr('cy', d => y2(d.Crime))
     .attr('r', 5)
     .attr('fill', "#6cd4b6") // Add fill color for circles
     .on('mouseover', function(event, d) {
       const [x, y] = d3.pointer(event, this);
       const x1 = x + 10; // Adjust x position of tooltip
       const y1 = y + 50; // Adjust y position of tooltip
       const text = `<b>${d.Year}</b><br>Crime (in number): ${d.Crime}`;
       tooltip.transition().duration(200).style("opacity", 0.9);
       tooltip.html(text)
           .style("left", `${x1}px`)
           .style("top", `${y1}px`)
       tooltip.style("background-color", "#6cd4b6")
       tooltip.style("display", "block");
   })
   .on('mouseout', function() {
       tooltip.transition().duration(200).style("opacity", 0);
       tooltip.style("display", "none");
   });




    // A function that update the chart
    function update(selectedGroup) {

      // Create new data with the selection?
      const dataFilter = data.filter(function(d){return d.Borough==selectedGroup})

      // Give these new data to update lines
      line
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.Year) })
            .y(function(d) { return y(+d.Price) })
          )
          .attr("stroke", "steelblue")
      
      line2
          .datum(dataFilter)
          .transition()
          .duration(1000)
          .attr("d", d3.line()
            .x(function(d) { return x(d.Year) })
            .y(function(d) { return y2(+d.Crime) })
          )
          .attr("stroke", "#6cd4b6")

      
         
    // Update circles
    const circles = svg.selectAll('.circle')
    .data(dataFilter);

    const circles2 = svg.selectAll('.circle2')
    .data(dataFilter);

circles.enter()
    .append('circle')
    .attr('class', 'circle')
    .attr('r', 5)
    .merge(circles)
    .transition()
    .duration(1000)
    .attr('cy', d => y(+d.Price))
    .attr('cx', d => x(d.Year));

circles.exit().remove();

circles2.enter()
    .append('circle')
    .attr('class', 'circle2')
    .attr('r', 5)
    .merge(circles2)
    .transition()
    .duration(1000)
    .attr('cy', d => y2(+d.Crime))
    .attr('cx', d => x(d.Year))
    .style("fill", "#6cd4b6");

circles2.exit().remove();


// Hide tooltip on update
tooltip.transition().duration(200).style("opacity", 0);
tooltip.style("display", "none");
}

   
    // When the button is changed, run the updateChart function
    d3.select("#selectButton").on("change", function(event,d) {
        // recover the option that has been chosen
        const selectedOption = d3.select(this).property("value")
        // run the updateChart function with this selected option
        update(selectedOption);
    })

})

