let margin = null,
    width = null,
    height = null;
let svg = null;
let x, y = null; // scales

setupCanvasSize();
appendSvg("body");
refreshChart(firsTime=true);
autoRefreshChart(5000);

function autoRefreshChart(miliSeconds) {
  setInterval(function () {
    console.log('refrescando');
    refreshChart(fisrtTime=false);
  }, miliSeconds);
}

function clearCanvas() {
  d3.selectAll("svg > g > *").remove();
}

function refreshChart(ftime) {
  d3.json("data.json", function (error, data) {
    if (error) throw error;

    // parse the date / time
    var parseTime = d3.timeParse("%d-%b-%y");
    
    clearCanvas();
    setupXScale(data);
    setupYScale(data);
    appendXAxis(data);
    appendYAxis(data);
    appendChartBars(data,ftime);
    appendLegend(data);

  });  

  
  }

function setupCanvasSize() {
  margin = {top: 50, left: 80, bottom: 100, right: 80};
  width = 700 - margin.left - margin.right;
  height = 550 - margin.top - margin.bottom;
}


// 1. let's start by selecting the SVG Node
function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",`translate(${margin.left}, ${margin.top})`);
}

// Now on the Y axis we want to map totalSales values to
// pixels

function setupYScale(totalSales)
{
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });

  y = d3.scaleLinear()
    .range([height,0])
    .domain([0, maxSales]);

}

// On the X axis we don't have a linear range of values, we have a discrete
// range of values (one per product)

function setupXScale(totalSales)
{
  x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(totalSales.map(function(d, i) {
      return d.product;
    }))
    .padding(0.1) //add a padding
}

function appendXAxis(totalSales) {
  // Add the X Axis
  svg.append("g")
    .attr("transform",`translate(0, ${height})`)
    .call(d3.axisBottom(x))
    
  svg.append("text")             
    .attr("transform",
          "translate(" + (width/2) + " ," + 
                         (height + margin.top + 20) + ")")
    .style("text-anchor", "middle")
    .text("Products");
}

function appendYAxis(totalSales) {
  // Add the Y Axis
  svg.append("g")
    .call(d3.axisLeft(y))
    svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Values");      
}

function appendChartBars(totalSales, firstPaint)
{
  var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Sales:</strong> <span style='color:red'>" + d.sales +"</span>";})
  
  svg.call(tip);

  //  Now let's select all the rectangles inside that svg
  // (right now is empty)
  var rects = svg.selectAll('rect').data(totalSales);

  // Now it's time to append to the list of Rectangles we already have
  var newRects = rects.enter();

  // Let's append a new Rectangles
  if (firstPaint==true)
  {
    Barchart=newRects.append('rect')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)  
    .attr('x', function(d, i) {return x(d.product);})
    .attr('y', height)
    .attr('width', x.bandwidth)
    .attr('height', 0)  
  
    Barchart.transition()
    .duration(500)
    .delay((d, i)=> i * 50)
    .attr('y', function(d) {return y(d.sales);})  
    .attr("class","bar")   
    .attr('height', function(d, i) {return (height - y(d.sales));})
    .attr('width', x.bandwidth)
    .style('fill', function(d, i) {return (d.color)})
    .style('stroke',"black")

    Barchart
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)  
  }
  else
  {
    Barchart=newRects.append('rect')
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)  
    .attr('x', function(d, i) {return x(d.product);})
    .attr('y', function(d) {return y(d.sales);})  
    .attr('width', x.bandwidth)
    .attr('height', function(d, i) {return (height - y(d.sales));})
    .style('fill', function(d, i) {return (d.color)})
    .style('stroke',"black")
    .attr("class","bar") 

    Barchart
    .on('mouseover', tip.show)
    .on('mouseout', tip.hide)  
    
  }
    
      
}

 //  Now let's add a Legend
function appendLegend(totalSales){

  legend = svg.append('g')
	  .attr('class', 'legend')
	  .attr('height', 100)
	  .attr('width', 100)

  legend.selectAll('rect')
    .data(totalSales)
    .enter()
    .append('rect')
	  .attr('x', width)
    .attr('y', function(d, i){ return i *  20})
	  .attr('width', 10)
	  .attr('height', 10)
    .style('fill', function(d){return d.color})
    .style('stroke',"black")
      
  legend.selectAll('text')
    .data(totalSales)
    .enter()
    .append('text')
	  .attr('x', width + 15)
    .attr('y',function(d, i) { return i *  20 + 10})
	  .text(function(d){ return d.product});
}