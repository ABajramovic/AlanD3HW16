var svgWidth = 900;
var svgHeight = 600;
var margin = {
  top: 60,
  right: 60,
  bottom: 90,
  left: 90
};

// Create the width and height based svg margins
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the canvas to append the SVG group that contains the states data
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Create the chartGroup that will contain the data
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
var file = "assets/data/data.csv"
d3.csv(file).then(successHandle, errorHandle);

// Use error handling function to append data and SVG objects
function errorHandle(error) {
  throw err;
}

// Function takes in argument statesData
function successHandle(statesData) {

  // Loop through the data
  statesData.map(function (data) {
    data.poverty = +data.poverty;
    data.obesity = +data.obesity;
  });

  // Scale
  var xLinearScale = d3.scaleLinear()
    .domain([8.1, d3.max(statesData, d => d.poverty)])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([20, d3.max(statesData, d => d.obesity)])
    .range([height, 0]);

  // Create axis
  var bottomAxis = d3.axisBottom(xLinearScale)
    .ticks(9);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Append the axes to the chart group 
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);
  chartGroup.append("g")
    .call(leftAxis);

  // Create circles for scatter plot
  var circlesGroup = chartGroup.selectAll("circle")
    .data(statesData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.obesity))
    .attr("r", "13")
    .attr("fill", "#788dc2")
    .attr("opacity", ".75")

  var circlesGroup = chartGroup.selectAll()
    .data(statesData)
    .enter()
    .append("text")
    .attr("x", d => xLinearScale(d.poverty))
    .attr("y", d => yLinearScale(d.obesity))
    .style("font-size", "13px")
    .style("text-anchor", "middle")
    .style('fill', 'white')
    .text(d => (d.abbr));

  // Initialize tool tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([60, -40])
    .html(function (d) {
      return (`${d.state}<br>Poverty: ${d.poverty}%<br>Obesity: ${d.obesity}% `);
    });

  // Create tooltip
  chartGroup.call(toolTip);

  // display and hide the tooltip
  circlesGroup.on("mouseover", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 20)
    .attr("x", 0 - (height / 4))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Obese (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 1})`)
    .attr("class", "axisText")
    .text("In Poverty (%)");
}