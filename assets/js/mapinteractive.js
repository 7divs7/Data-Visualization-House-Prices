
// ********************** MAP SLIDER ***************************************************************
// Create tooltip
const tooltip = d3.select("body")
  .append("id", "tooltip")
  .style("position", "absolute")
  .attr("class", "tooltip");

// Create a parent div element
var sliderDiv = d3.select("body")
    .append("div")
    .attr("class", "slider-container")
    .style("position", "relative")
    .style("left", "50px")
    .style("top", "520px");

// Append label to the parent div
sliderDiv.append("label")
    .text("Year       ")
    .style("color", "black")
    .style("display", "block"); // Display label as block element for better spacing

// Create the input element for the slider and set attributes
var sliderInput = sliderDiv.append("input")
    .attr("type", "range")
    .attr("min", "2010")
    .attr("max", "2023")
    .attr("value", "2010")
    .attr("class", "slider")
    .on("input", function() {
      var rect = this.getBoundingClientRect();
      var tooltipX = rect.left + rect.width / 2 + window.scrollX;
      var tooltipY = rect.top - 30 + window.scrollY;
      tooltip.style("left", tooltipX + "px");
      tooltip.style("top", tooltipY + "px");
      tooltip.style("display", "block");
      tooltip.html(this.value);
      title_text = this.value;
      csv_file_price = "../datasets/avg-house-price/" + this.value + ".csv"
      csv_file_crime = "../datasets/crime-stats/" + this.value + ".csv"
      csv_file_pop = "../datasets/population/" + this.value + ".csv"
      updateMapHeading(); // Call the functions to update map heading text and load new map
      loadMap(csv_file_price, csv_file_crime, csv_file_pop);
      
    })
    .on("mouseover", function() {
      var rect = this.getBoundingClientRect();
      var tooltipX = rect.left + rect.width / 2 + window.scrollX;
      var tooltipY = rect.top - 30 + window.scrollY;
      tooltip.style("left", tooltipX + "px");
      tooltip.style("top", tooltipY + "px");
      tooltip.style("display", "block");
      tooltip.html(this.value);
    })
    .on("mouseout", () => tooltip.style("display", "none"));

// Append the parent div element to the body or any other parent element
sliderDiv.style("margin", "20px"); 
sliderDiv.selectAll("label")
    .style("display", "block"); 




// ********************** MAP SELECTIONS - FACTORS ************************************************* 
// Data for checkboxes
var checkboxData = ["Population", "Crime Stats"];

// Select the parent element where you want to append the checkboxes
var checkboxDiv = d3.select("body")
    .append("div")
    .attr("class", "map-selection-factor");

// Append checkboxes for each item in the data array
var checkboxes = checkboxDiv.selectAll("div")
    .data(checkboxData)
    .enter()
    .append("div");

// Append checkbox inputs
checkboxes.append("input")
    .attr("type", "checkbox")
    .attr("id", function(d, i) { return "checkbox-" + i; }) // Optional: Assign unique IDs
    .attr("class", "checkbox") 
    .on("change", function(d, i) {
      var label = d3.select(this.parentNode).select("label");
      var checkboxLabel = label.text(); // Get the text of the label associated with the checkbox
      checkboxLabels["checkbox-" + i] = checkboxLabel; // Store label text in the object
      if (this.checked) {
          label.style("color", "black"); // Change color when checkbox is checked
          if (d === "Crime Stats") {
            makeCrimeDataVisible();
          }
          if (d === "Population") {
            makePopDataVisible();
          }
      } else {
          label.style("color", "#3D3B40"); // Reset color when checkbox is unchecked
          if (d === "Crime Stats") {
            hideCrimeData();
          }
          if (d === "Population") {
            hidePopData();
          }
      }
  });

// Append labels for checkboxes
checkboxes.append("label")
    .attr("for", function(d, i) { return "checkbox-" + i; }) // Associate label with checkbox
    .text(function(d) { return d; }); // Set label text

// Apply styles to checkboxes and labels
checkboxes.style("margin-bottom", "10px"); 
checkboxes.style("margin-top", "10px")
checkboxes.selectAll("input, label")
    .style("margin-right", "5px"); 







