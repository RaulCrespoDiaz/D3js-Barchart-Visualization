# Visualitation Mandatory Exercise
## The target of this script is to display a barchart using the refactor sample make in class

### 1) Add a padding between each of the chart bars.

This is the original

![No padding](./pictures/02_Chart_Original.png "Chart Original")

This is the target

![Bar Padding](./pictures/02_Chart_Bar_Padding.png "Chart Padding")

**Solution**

```diff
function setupXScale(totalSales)
{
  x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(totalSales.map(function(d, i) {
      return d.product;
    }))
+    .padding(0.1) //add a padding
}

```

### 2) Adding some color to each bar, based on the product Id

I add a new field to  data.json called 'color'

```json
[{ "product": "Pepinos", "sales": 6 , "color": "blue"},
{ "product": "Tomates", "sales": 2 , "color": "red"},
{ "product": "Pimientos", "sales": 10 , "color": "yellow"}]
```

**Solution**

and add .style to the rectangle with the color in the same way we use 'product' and 'sales'

```diff
Barchart=newRects.append('rect')
        .attr('x', function(d, i) {return x(d.product);})
        .attr('y', function(d) {return y(d.sales);})  
        .attr('width', x.bandwidth)
        .attr('height', function(d, i) {return (height - y(d.sales));})
++      .style('fill', function(d, i) {return (d.color)})
```

This is the result

![Bar Color](./pictures/02_Chart_Bar_Paddin_colored.png "Chart Color")


### 3) Let's rotate 90º the bar chart, we want it to show it like:

![Vertical](./pictures/02_vertical.png "Chart Vertical")

First let's swap X Scale and Y Scale


```javascript

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

// 1. let's start by selecting the SVG Node
function setupCanvasSize() {
  margin = {top: 100, left: 180, bottom: 120, right: 130};
  width = 960 - margin.left - margin.right;
  height = 800 - margin.top - margin.bottom;
}

function appendSvg(domElement) {
  svg = d3.select(domElement).append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");
              ;
}


function setupXScale()
{
  x = d3.scaleBand()
    .rangeRound([0, width])
    .domain(totalSales.map(function(d, i) {
      return d.product;
    }));

}

function setupYScale()
{
  var maxSales = d3.max(totalSales, function(d, i) {
    return d.sales;
  });

  y = d3.scaleLinear()
    .range([height,0])
    .domain([0, maxSales]);    
}

function appendXAxis() {
  // Add the X Axis
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));
}

function appendYAxis() {
  //   
  // Add the Y Axis
  svg.append("g")   

  .call(d3.axisLeft(y));
}

function appendChartBars()
{
  // 2. Now let's select all the rectangles inside that svg
  // (right now is empty)
  var rects = svg.selectAll('rect')
    .data(totalSales);

    // Now it's time to append to the list of Rectangles we already have
    var newRects = rects.enter();


    newRects.append('rect')
      .attr('x', function(d, i) {
        return x(d.product);
      })
      .attr('y', function(d) {
        return y(d.sales);
      })     
      .attr('height', function(d, i) {
        return height - y(d.sales);
      })
      .attr('width', x.bandwidth)      
      ;

}
```

### 4) Adding a legend

**Solution**

Let's start by adding a new style for the new legend (styles.css)

```css
.legend {
  padding: 5px;
  font: 15px sans-serif;
}
```
and we add the function **appendLegend**

```javascript
function appendLegend(totalSales){

  legend = svg.append('g')
	  .attr('class', 'legend')
	  .attr('height', 100)
	  .attr('width', 100)
    .attr('transform',
       `translate(60,0)`)

  legend.selectAll('rect')
    .data(totalSales)
    .enter()
    .append('rect')
	  .attr('x', width - 65)
    .attr('y', (d, i)=> i *  20)
	  .attr('width', 10)
	  .attr('height', 10)
    .style('fill', (d)=> d.color)
    .style('stroke',"black")
      
  legend.selectAll('text')
    .data(totalSales)
    .enter()
    .append('text')
	  .attr('x', width - 52)
    .attr('y',(d, i)=> i *  20 + 9)
	  .text((d)=> d.product);
}
```

This is the result

![Bar Leyend](02_Chart_Bar_Paddin_colored_with legend.PNG "Chart Leyend")

