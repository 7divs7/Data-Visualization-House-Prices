// ********************* GLOBAL VARIABLES ****************************************************
var title_text = 2010;
var csv_file = "../datasets/avg-house-price/2010.csv"
var checkboxLabels = {};

// ********************* USER-DEF FUNCTIONS ***********************************************************

// Function to set custom color scale
var customColorScale = function(t) {
  var colorInterpolator1 = d3.interpolateRgb("#F8E9AB", "#E06864");
  var colorInterpolator2 = d3.interpolateRgb("#E06864", "#4A116C");
  // var colorInterpolator1 = d3.interpolateRgb("#fcc638", "#d1024e");
  // var colorInterpolator2 = d3.interpolateRgb("#d1024e", "#ba006d");
  if (t < 0.5) {
      return colorInterpolator1(t * 2);
  } else {
      return colorInterpolator2((t - 0.5) * 2);
  }
}


// Function to show the tooltip and glide it across the screen
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


// Function to update map heading text
function updateMapHeading() {
  mapHeading.textContent = "Average House Prices | " + title_text;
}

// Function to update map based on factors
function updateCheckboxEvents() {
  // assign flag variables for each factor
  var isCheckedCrime, isCheckedPop;

  // get the checkbox for the respective label
  var crimeCheckbox = d3.selectAll('input[type="checkbox"]').filter(function() {
    return d3.select(this.parentNode).select("label").text() === 'Crime Stats';
  });
  var popCheckbox = d3.selectAll('input[type="checkbox"]').filter(function() {
    return d3.select(this.parentNode).select("label").text() === 'Population';
  });

  // Check if the checkboxes are checked
  crimeCheckbox.each(function() {
     isCheckedCrime = d3.select(this).property('checked');
  });
  popCheckbox.each(function() {
    isCheckedPop = d3.select(this).property('checked');
 });

 // Set visibility based on checkbox flags
  if(isCheckedCrime) {
    makeCrimeDataVisible();
  }
  if(!isCheckedCrime) {
    hideCrimeData();
  }
  if(isCheckedPop) {
    makePopDataVisible();
  }
  if(!isCheckedPop) {
    hidePopData();
  }  
}

// Function to make the crime data symbols visible
function makeCrimeDataVisible() {
  g.selectAll(".borough-crime")
    .style("display", "block"); 
  
    d3.select(".crime-legend-container")
    .style("display", "block");
}
// Function to hide crime data icons
function hideCrimeData() {
  g.selectAll(".borough-crime")
    .style("display", "none");

    d3.select(".crime-legend-container")
    .style("display", "none");
}

// Function to make the population data symbols visible
function makePopDataVisible() {
  g.selectAll(".borough-population")
    .style("display", "block"); 
  
    d3.select(".pop-legend-container")
    .style("display", "block");
}
// Function to hide crime data icons
function hidePopData() {
  g.selectAll(".borough-population")
    .style("display", "none");

    d3.select(".pop-legend-container")
    .style("display", "none");
}


// Load the GeoJSON data for London boroughs
function loadMap(csv_file_price, csv_file_crime="../datasets/crime-stats/2010.csv", csv_file_pop="../datasets/population/2010.csv") {
  // Load both CSV files simultaneously
  Promise.all([
    d3.csv(csv_file_price),
    d3.csv(csv_file_crime),
    d3.csv(csv_file_pop)
  ]).then(([csvData_price, csvData_crime, csvData_pop]) => {
    // Convert Price from string to number for csvData1
    csvData_price.forEach(d => {
      d.Price = +d.Price;
    });

    // Convert other data from string to appropriate data types for csvData2
    csvData_crime.forEach(d => {
    });

    // Load GeoJSON data for London boroughs
    d3.json("https://vega.github.io/vega-datasets/data/londonBoroughs.json").then(data => {
      const boroughs = topojson.feature(data, data.objects.boroughs);

      // Create color scale for csvData1
      const colorScale = d3.scaleSequential(customColorScale)
        .domain(d3.extent(csvData_price, d => d.Price));

      // Clear previous map data
      g.selectAll('.borough').remove();
      // Create choropleth map - avg house prices
      createMap(csvData_price, boroughs, colorScale);

       // Remove previous circles before adding new ones
      g.selectAll('.borough-crime').remove();
      addCrimeData(csvData_crime,boroughs);

      updateCheckboxEvents();

      // Remove previous bars before adding new ones
      g.selectAll('.borough-population').remove();
      g.selectAll('.borough-population-1').remove();
      addPopData(csvData_pop,boroughs);

      updateCheckboxEvents();

      // Tooltip
      showTooltip(csvData_price, csvData_crime, csvData_pop, boroughs);
        
    });
  });
}

// Function to update Tooltip
function showTooltip(csvData_price, csvData_crime, csvData_pop) {
  g.selectAll('.borough')
  .on('mouseover', function(d) {
    const tooltip = document.getElementById('tooltip');
    const [x, y] = d3.mouse(this.parentNode);
    const boroughData = csvData_price.find(entry => entry.Borough === d.id);
    const crimeData = csvData_crime.find(entry => entry.Borough === d.id);
    const popData = csvData_pop.find(entry => entry.Borough === d.id);
    var x1 = x + 10 + 440;
    var y1 = y + 10;
    var text = `<b>${d.id}</b><br>Average House Price: £ ${boroughData.Price}
            <br>Average Crime Stats: ${crimeData.Crime}
            <br>Average Population density (per hectare): ${popData.Population}`;
    //console.log(text);
    showTooltipWithTransition(tooltip, x1, y1, text);
    tooltip.style.display = 'block';
  })
  .on('mouseout', function() {
    // Hide the tooltip
    const tooltip = document.getElementById('tooltip');
    tooltip.style.display = 'none';
  })

}

// Create Choropleth Map
function createMap(csvData, boroughs, colorScale) {
  // Boroughs outline
  g.selectAll('path')
  .data(boroughs.features)
  .enter()
  .append('path')
  .attr('class', 'borough')
  .attr('d', path)
  .style('fill', d => {
    const boroughData = csvData.find(entry => entry.Borough === d.id);
    if (boroughData) {
      return colorScale(boroughData.Price);
    } else {
      return 'lightgray'; // Set a default color for boroughs without data
    }
  })
}

//Function to Add symbols for Crime data
function addCrimeData(csvData, boroughs) {
  // Append png icons for each borough
  g.selectAll(".borough-crime")
  .data(boroughs.features)
  .enter()
  .append("image")
  .attr("class", "borough-crime")
  .attr("x", d => path.centroid(d)[0]-5)
  .attr("y", d => path.centroid(d)[1]-5)
  .attr("width", 12)
  .attr("height", 12)
      // .attr("xlink:href", "../img/danger.png")
  .attr("xlink:href", d => {
    const crimeData = csvData.find(entry => entry.Borough === d.id);
    if (crimeData.Crime > 40) {
      //console.log(crimeData.Crime);
      return "../img/danger.png";
    } else {
      return "../img/shield.png";
    }
  })
  .style("opacity", 1)
  .style("display", "none");
}


// Function to add bar for population data
function addPopData(csvData, boroughs) {
  // Set the dimensions of the rectangle
  const rectWidth = 5;
  const rectHeight = 5;
  const totalBoxes = 6;
  var color = "white";
  var boxes = totalBoxes;

  for(let i = 0; i < totalBoxes; i++)
  { 
    g.selectAll("borough-population-1")
    .data(boroughs.features)
    .enter()
    .append("rect")
    .attr("class", "borough-population")
    .attr("x", d => path.centroid(d)[0] + rectWidth * i + 5) 
    .attr("y", d => path.centroid(d)[1] + 5) 
    .attr("width", rectWidth) 
    .attr("height", rectHeight) 
    .style("fill", d => {
      const popData = csvData.find(entry => entry.Borough === d.id);
      const maxPop = d3.max(csvData, d => +d.Population);
      boxes = popData.Population/maxPop * totalBoxes;
      d3.select(".pop-max-text").text("Max:" + maxPop);
      //console.log(boxes);
      if(i < boxes){
        return "#1c96c5";
      }
      else{
        return "white";
      }
    })
    .attr("stroke", "black") 
    .attr("stroke-width", 1);
    //.style("display", "none"); 
  }
  g.selectAll(".borough-population")
    .style("display", "none");

    // d3.select(".pop-max-text").text(`Max:${maxPop}`);
}



// ********************** CHOROPLETH LONDON MAP ***********************************************
// Set up the dimensions for MAP SVG
const width = 950;
const height = 600;

// Zoom in and out of map
const zoom = d3.zoom()
        .scaleExtent([1, 30])
        .translateExtent([[0,0],[width, height]])
        .on('zoom', function () {
            d3.select('g').attr('transform', d3.event.transform)
          });

// Create the SVG container
const svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .style("border", "1px solid white")
  .style("background-color", "#f6f6f6") 
  .style("position", "absolute")
  // .style("left", screen.width/25) 
  // .style("top", "35px")
  .style("left", "50%")  // Align to the center horizontally
  .style("transform", "translateX(-50%)")  // Adjust to center properly
  .style("top", "35px")
  .call(zoom); 

// Define the projection for the map 
const projection = d3.geoMercator()
  .center([0.1278, 51.5074])
  .scale(42000)
  .translate([width / 1.5, height / 2.1]);

// Define the path generator
const path = d3.geoPath().projection(projection);

const g = svg.append('g');

var tooltip_div = d3.select("body").append("div")
     .attr("class", "tooltip")
     .attr("id", "tooltip")

loadMap(csv_file)

 
