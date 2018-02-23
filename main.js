
// Let's start using ES6
// And let's organize the code following clean code concepts
// Later one we will complete a version using imports + webpack

// Isolated data array to a different file

let margin = null,
    width = null,
    height = null;
    

let svg = null;
let x, y = null; // scales

setupCanvasSize();
appendSvg("body");
setupXScale();
setupYScale();
appendXAxis();
appendYAxis();
appendChartBars();
//rotarTodo("body");

// 1. let's start by selecting the SVG Node
function setupCanvasSize() {
  margin = {top: 0, left: 80, bottom: 20, right: 30};
  width = 960 - margin.left - margin.right;
  height = 120 - margin.top - margin.bottom;
}

function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);
  svg.attr("transform", "rotate(-90)")

}

// Now on the X axis we want to map totalSales values to
// pixels
// in this case we map the canvas range 0..350, to 0...maxSales
// domain == data (data from 0 to maxSales) boundaries
function setupXScale()
{
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });

  x = d3.scaleLinear()
    .range([0, width])
    .domain([0, maxSales]);

}

// Now we don't have a linear range of values, we have a discrete
// range of values (one per product)
// Here we are generating an array of product names
function setupYScale()
{
  y = d3.scaleBand()
    .rangeRound([0, height])
    .domain(totalSales.map(function(d, i) {
      return d.product;
    }))
    .padding(0.1) //add a padding
}

function appendXAxis() {
  // Add the X Axis
  svg.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(d3.axisBottom(x))
    
  svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Value");
}

function appendYAxis() {
  // Add the Y Axis
  svg.append("g")
    .call(d3.axisLeft(y))
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Products");      
}

function appendChartBars()
{
  // 2. Now let's select all the rectangles inside that svg
  // (right now is empty)
  var rects = svg.selectAll('rect')
    .data(totalSales);

    // Now it's time to append to the list of Rectangles we already have
    var newRects = rects.enter();

    // Let's append a new Rectangles
    // UpperCorner:
    //    Starting x position, the start from the axis
    //    Starting y position, where the product starts on the y scale
    // React width and height:
    //    height: the space assign for each entry (product) on the Y axis
    //    width: Now that we have the mapping previously done (linear)
    //           we just pass the sales and use the X axis conversion to
    //           get the right value
    newRects.append('rect')
      .attr('x', x(0))
      .attr('y', function(d, i) {
        return y(d.product);
      })
      .attr('height', y.bandwidth)
      //.attr('height', 25)
      .attr('width', function(d, i) {
        return x(d.sales);
      })
      .style('fill', function(d, i) {
        return (d.color)});
        
}

function rotarTodo(domElemen)
{
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);
}

  //chart.xAxis
    //        .axisLabel("Time (s)")
      //      .tickFormat(d3.format(',.1f'))
        //    .staggerLabels(true)
