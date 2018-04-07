// SET UP DIMENSIONS
var w = 1200,
    h = 600;


// margin.middle is distance from center line to each y-axis
var margin = {
  top: 30,
  right: 20,
  bottom: 50,
  left: 20,
  middle: 28
};

// the width of each side of the chart
var regionWidth = w/2 - margin.middle;


// these are the x-coordinates of the y-axes
var pointA = regionWidth,
    pointB = w - regionWidth;


// some contrived data
var exampleData = [
  {group: '0-9', male: 10, female: 12},
  {group: '10-19', male: 14, female: 15},
  {group: '20-29', male: 15, female: 18},
  {group: '30-39', male: 18, female: 18},
  {group: '40-49', male: 21, female: 22},
  {group: '50-59', male: 19, female: 24},
  {group: '60-69', male: 15, female: 14},
  {group: '70-79', male: 8, female: 10},
  {group: '80-89', male: 4, female: 5},
  {group: '90-99', male: 2, female: 3},
  {group: '100-109', male: 1, female: 1},
];


// GET THE TOTAL POPULATION SIZE AND CREATE A FUNCTION FOR RETURNING THE PERCENTAGE
var totalPopulation = d3.sum(exampleData, function(d) { return d.male + d.female; }),
    percentage = function(d) { return d / totalPopulation; },
    percentageFemale = function(d) { return d / d3.sum(exampleData, function(d) { return d.female; }); }
    percentageMale = function(d) { return d / d3.sum(exampleData, function(d) { return d.male; }); };


// CREATE SVG
var svg = d3.select('body').append('svg')
  .attr('width', margin.left + w + margin.right)
  .attr('height', margin.top + h + margin.bottom)
  // ADD A GROUP FOR THE SPACE WITHIN THE MARGINS
  .append('g')
    .attr('transform', translation(margin.left, margin.top));


// find the maximum data value on either side
//  since this will be shared by both of the x-axes
var maxValue = Math.max(
  d3.max(exampleData, function(d) { return percentage(d.male); }),
  d3.max(exampleData, function(d) { return percentage(d.female); })
);


// SET UP SCALES

// the xScale goes from 0 to the width of a region
//  it will be reversed for the left x-axis
var xScale = d3.scaleLinear()
  .domain([0, maxValue])
  .range([0, regionWidth])
  .nice();

var xScaleLeft = d3.scaleLinear()
  .domain([0, maxValue])
  .range([regionWidth, 0]);

var xScaleRight = d3.scaleLinear()
  .domain([0, maxValue])
  .range([0, regionWidth]);

var yScale = d3.scaleBand()
  .domain(exampleData.map(function(d) { return d.group; }))
  .rangeRound([h,0], 0.1);


// SET UP AXES
var yAxisLeft = d3.axisRight(yScale)
  .tickSize(4,0)
  .tickPadding(margin.middle-4);

var yAxisRight = d3.axisLeft(yScale)
  .tickSize(4,0)
  .tickFormat('');

var xAxisRight = d3.axisBottom(xScale)
  .tickFormat(d3.format('.0%'));

var xAxisLeft = d3.axisBottom(xScale.copy().range([pointA, 0]))
  // REVERSE THE X-AXIS SCALE ON THE LEFT SIDE BY REVERSING THE RANGE
  .tickFormat(d3.format('.0%'));

// MAKE GROUPS FOR EACH SIDE OF CHART
// scale(-1,1) is used to reverse the left side so the bars grow left instead of right
var leftBarGroup = svg.append('g')
  .attr('transform', translation(pointA, 0) + 'scale(-1,1)');
var rightBarGroup = svg.append('g')
  .attr('transform', translation(pointB, 0));

// Tooltip
function mouseover(d) {
  div.style("display", "inline");
}

function mouseout() {
  div.style("display", "none");
}


function mousemoveLeft(d) {
  div.transition()
         .duration(200)
         .style("opacity", 1);
       div.html("Il " +  d3.format(".0%")(percentageMale(d.male)) + ' degli uomini residenti è di età compresa tra '+ d.group)
         .style("left", (d3.event.pageX - 90) + "px")
         .style("top", (d3.event.pageY - 28) + "px")
         .style("background", "MintCream");
}

function mousemoveRight(d) {
  div.transition()
         .duration(200)
         .style("opacity", 1);
       div.html("Il " +  d3.format(".0%")(percentageFemale(d.female)) + ' delle donne residenti è di età compresa tra '+ d.group)
         .style("left", (d3.event.pageX + 20) + "px")
         .style("top", (d3.event.pageY - 28) + "px")
         .style("background", "MintCream");
}

var div = d3.select("body").append("div")
    .attr("class", "tooltipLeft")
    .style("display", "none");

var div = d3.select("body").append("div")
    .attr("class", "tooltipRight")
    .style("display", "none");



// DRAW AXES
svg.append('g')
  .attr('class', 'axis y left')
  .attr('transform', translation(pointA, 0))
  .call(yAxisLeft)
  .selectAll('text')
  .style('text-anchor', 'middle');

// text label for the x axis
svg.append("text")
  .style("text-anchor", "start")
  .attr("y", -28 + margin.left)
  .attr("x", h - 35)
  .text("Fasce d'età");


svg.append('g')
  .attr('class', 'axis y right')
  .attr('transform', translation(pointB, 0))
  .call(yAxisRight);

svg.append('g')
  .attr('class', 'axis x left')
  .attr('transform', translation(0, h))
  .call(xAxisLeft);

svg.append("text")
  .style("text-anchor", "start")
  .attr("y", 638 )
  .attr("x", h - 125)
  .text("Percentuale (%) sul totale dei residenti");

svg.append('g')
  .attr('class', 'axis x right')
  .attr('transform', translation(pointB, h))
  .call(xAxisRight);

// DRAW BARS
leftBarGroup.selectAll('.bar.left')
  .data(exampleData)
  .enter().append('rect')
    .attr('class', 'bar left')
    .attr('x', 0)
    .attr('y', function(d) { return yScale(d.group); })
    .attr('width', function(d) { return xScale(percentage(d.male)); })
    .attr('height', yScale.bandwidth() - 3)
    .on("mouseover", mouseover)
    .on("mousemove", mousemoveLeft)
    .on("mouseout", mouseout);





rightBarGroup.selectAll('.bar.right')
  .data(exampleData)
  .enter().append('rect')
    .attr('class', 'bar right')
    .attr('x', 0)
    .attr('y', function(d) { return yScale(d.group); })
    .attr('width', function(d) { return xScale(percentage(d.female)); })
    .attr('height', yScale.bandwidth() - 3)
    .on("mouseover", mouseover)
    .on("mousemove", mousemoveRight)
    .on("mouseout", mouseout);






// so sick of string concatenation for translations
function translation(x,y) {
  return 'translate(' + x + ',' + y + ')';
}
