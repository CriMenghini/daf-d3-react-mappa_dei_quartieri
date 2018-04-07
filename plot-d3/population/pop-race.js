var w = 150,
    h = 150;

var outerRadius = (w /3) - 10;
var innerRadius = (w / 2) - 15;

var color = ['#C0C0C0', '#FFA500'];

var data = {stranieri: 3903, totali: 32403};


var ammount = data.stranieri;
var total = data.totali;
var percent = (ammount / total) * 100;
var ratio = percent / 100;
var piePercent = Math.PI * ratio;


var arc = d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(0)
          .endAngle(Math.PI);

var arcLine = d3.arc()
          .innerRadius(innerRadius)
          .outerRadius(outerRadius)
          .startAngle(0)
          .endAngle(piePercent);


var svg = d3.select("body")
          .append("svg")
          .attr("width", w)
          .attr("height", h)
          .append('g')
          .attr("transform", 'translate(' + w /2 + ',' + h / 2 + ')');

var path = svg.append('path')
          .attr("d", arc)
          .attr("transform", 'rotate(-90)')
          .attr("fill", color[0]);

var path2 = svg.append('path')
          .attr("d", arcLine)
          .attr("transform", 'rotate(-90)')
          .attr("fill", color[1]);

var middleCount = svg.append('text')
          .text(Math.round(percent) + "%")
          .attr("class", "middle-text")
          .attr('text-anchor', 'middle');

