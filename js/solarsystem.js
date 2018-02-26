
function dataPass(d) {
  return {
    galaxy: d.galaxy,
    distance: +d.distance,
    diameter: +d.diameter,
    text: d.text
  };
} 

d3.csv('data/galaxys.csv', dataPass, function(err, data) {
  if (err) throw err;
  console.log(data);



  var dur = 1000;  
  var m = { top: 30, right: 80, bottom: 30, left: 60 },
      w = window.innerWidth - m.left - m.right,
      h = window.innerHeight * 0.66 - m.top - m.bottom;

  var svg = d3.select('#vis')
    .append('svg')
      .attr('width', w + m.left + m.top)
      .attr('height', h + m.top + m.bottom)
    .append('g')
      .attr('transform', 'translate(' + m.left + ', ' + m.top + ')');



  var rE = d3.extent(data, function(d) { return d.diameter; });
  var rS = d3.scaleLinear().domain([0, rE[1]]).range([0, h * 0.30]);
  var xS = d3.scalePoint().domain(data.map(function(el) { return el.galaxy; })).range([30, w * 0.975]);




  svg.selectAll('.galaxy')
    .data(data).enter()
    .append('circle')
      .attr('class', 'galaxy')
      .attr('id', function(d) { return d.galaxy; })
      .attr('cx', function(d) { return xS(d.galaxy); })
      .attr('cy', h / 2)
      .attr('r', 0)
    .transition().duration(dur).ease(d3.easeElastic.period(0.9))
      .attr('r', function(d) { return rS(d.diameter); });

  var rMilkyWay = rS(data.filter(function(el) { return el.galaxy === 'DracoDwarf'; })[0].diameter); // move MilkyWay out of the way
  d3.select('#DracoDwarf').attr('transform', 'translate(' + (-rMilkyWay * 0) + ', ' + '100)');
  d3.select('#MilkyWay').attr('transform', 'translate(' + (-rMilkyWay * 0) + ', ' + '20)');


  d3.timeout(function() {  

    svg.selectAll('.label')
      .data(data).enter()
      .append('text')
        .attr('class', 'label')
        .attr('id', function(d) { return 'label-' + d.galaxy; })
        .attr('x', function(d) { return xS(d.galaxy); })
        .attr('y', h / 3)
        .attr('dx', -1)
        .attr('dy', -3)
        .text(function(d) { return d.galaxy; })
        .style('opacity', 0)
      .transition().delay(function(d, i) { return i * 34; })
        .style('opacity', 1);
    
    d3.select('#label-DracoDwarf').attr('transform', 'translate(0, ' + (-h * 0.15) + ')');


    svg.selectAll('.label-line')
      .data(data).enter()
      .append('line')
        .attr('class', 'label-line')
        .attr('id', function(d) { return 'line-' + d.galaxy; })
        .attr('x1', function(d) { return xS(d.galaxy); })
        .attr('y1', h / 3)
        .attr('x2', function(d) { return xS(d.galaxy); })
        .attr('y2', function(d) { return h / 2 - rS(d.diameter) - 4; })
        .style('opacity', 0)
      .transition().delay(function(d, i) { return i * 30; })
        .style('opacity', 1);
    
    svg.append('text')
        .attr('id', 'note')
        .attr('x', w + m.right / 4)
        .attr('y', h + m.bottom / 2)
        .attr('text-anchor', 'end')
  }, dur);


  var offset = d3.select('h1').node().getBoundingClientRect().height;
  d3.selectAll('.galaxy').on('mouseover', mouseover);
  d3.selectAll('.galaxy').on('mousemove', mousemove);
  d3.selectAll('.galaxy').on('mouseout', mouseout);


  function mouseover(d) {

    d3.select('#tooltip')
      .style('opacity', 0.9)
      .style('top', (d3.mouse(this)[1] + offset) + 'px')
 

    var htmlHeader = 
      '' + d.galaxy + '<br>' +
      '<span id="small">Diameter: ' + d.diameter + ' Light Years <br>' +
      'Distance to MilkyWay: ' + d.distance + ' Light Years </span><br>';

    d3.select('#theader')
      .html(htmlHeader);

    d3.select('#tbody')
      .html(d.text);

  } 

  function mousemove(d) {
    d3.select('#tooltip')
      .style('top', (d3.mouse(this)[1] + offset) + 'px')
      .style('left', (d3.mouse(this)[0] + 20) + 'px');
  } 

  function mouseout() {
    d3.select('#tooltip')
      .transition().duration(50)
      .style('opacity', 0);
  } 




}); 

