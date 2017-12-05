var search = document.getElementById("search");
var word = document.getElementById("word");
var help = document.getElementById("help");
var check1;
var check2;
var slider;

window.onload = function() {
  check1 = document.getElementById("check1");
  check2 = document.getElementById("check2");
  slider = document.getElementById("myRange");
  search.addEventListener("click", function() { 
    mainTask();
  });

  check1.addEventListener('change', function() {
    mainTask();
  });

  check2.addEventListener('change', function() {
    mainTask();
  });
}

function mainTask(){
  if (word.value == ''){
      help.innerHTML = `
        <font color="red">Input was empty. </font>
        <a href="data/supported_words.csv" target="blank">
        Select from one of the supported words here.</a>
      `;
      return;
    }
    else {
      help.innerHTML =`
        <a href="data/supported_words.csv" target="blank">
        List of supported words</a>
      `;
    }

    var map = {};
    var map_inner = {};
    
    d3.csv("data/neighbors.csv", function(error, data) {
      for (var i=0; i<data.length; i++) {
          target = data[i]['word'];

          if (word.value != target) {
            continue;
          }

          var split_data = data[i]['neighbors'].split(' ');

          for (var j=0; j<split_data.length; j++){
            neighbor = split_data[j].split(':')[0];
            lex = split_data[j].split(':')[1];
            sem = split_data[j].split(':')[2];

            if (lex < slider.value/100.0){
              continue;
            }

            map[neighbor] = {}
            map[neighbor]['lexical_score'] = lex;
            map[neighbor]['semantic_score'] = sem;
          }
          if (word.value == target) {
            break;
          }

      }

      var display = [];
      var x_offsets = [2, 5]
      var y_offsets = [2, 2]
      neighbors = Object.keys(map);

      if (neighbors.length == 0){
        help.innerHTML = `
          <font color="red">The entered word is not in our database yet. </font>
          <a href="data/supported_words.csv" target="blank">
          Select from one of the supported words here.</a>
        `;

        return;
      }

      for (var i=0; i<neighbors.length; i++){

        neighbor = map[neighbors[i]];

        if ((neighbors[i].length > word.value.length) && (check1.checked)){
          continue;
        }

        lex = 0;
        if (neighbor['lexical_score'] == 1){
          lex = 1 - neighbor['lexical_score'];
        }
        else {
          lex = (1 - neighbor['lexical_score'] + 0.05) * 10;
        }
        sem = 1 - neighbor['semantic_score'];

        // Add lexical Entry
        var angle = Math.random()*Math.PI*2;
        x = (Math.cos(angle)*lex) + x_offsets[0];
        y = (Math.sin(angle)*lex) + y_offsets[0];

        display.push({
          'word': neighbors[i],
          'xCord': x, 
          'yCord': y,
          'score': neighbor['lexical_score'],
          'space': 'Lexical'
        });

        // Add semantic entry
        x = (Math.cos(angle)*sem) + x_offsets[1];
        y = (Math.sin(angle)*sem) + y_offsets[1];

        display.push({
          'word': neighbors[i],
          'xCord': x, 
          'yCord': y,
          'score': neighbor['semantic_score'],
          'space': 'Lexical -> Semantic'
        });
      }

      if (check2.checked) {
        d3.csv("data/semantic_neighbors.csv", function(error, data_inner) {
          for (var i=0; i<data_inner.length; i++) {
            target = data_inner[i]['word'];

            if (word.value != target) {
              continue;
            }

            var split_data = data_inner[i]['neighbors'].split(' ');

            for (var j=0; j<split_data.length; j++){
              neighbor = split_data[j].split(':')[0];
              sem = split_data[j].split(':')[1];

              map_inner[neighbor] = {}
              map_inner[neighbor]['semantic_score'] = sem;
            }

            if (word.value == target) {
              break;
            }
          }

          neighbors_inner = Object.keys(map_inner);

          for (var i=0; i<neighbors_inner.length; i++){
            neighbor = map_inner[neighbors_inner[i]];

            // Skip elements that are in lexical space and have 
            // already been covered.
            if (neighbors.indexOf(neighbors_inner[i]) >= 0) {
              continue;
            }

            console.log(check1.checked);
            if ((neighbors_inner[i].length > word.value.length) && (check1.checked)){
              continue;
            }

            sem = 1 - neighbor['semantic_score'];
            var angle = Math.random()*Math.PI*2;

            x = (Math.cos(angle)*sem) + x_offsets[1];
            y = (Math.sin(angle)*sem) + y_offsets[1];

            display.push({
              'word': neighbors_inner[i],
              'xCord': x, 
              'yCord': y,
              'score': neighbor['semantic_score'],
              'space': 'Semantic'
            });
          }

          updateData(display);
        });        
      }

      if (!check2.checked){
        updateData(display);
      }
    });
}

var margin = {top: 60, right: 20, bottom: 30, left: 240},
    width = 1060 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/data.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
    d.yCord = +d.yCord;
    d.xCord = +d.xCord;
  });

  x.domain(d3.extent(data, function(d) { return d.xCord; })).nice();
  y.domain(d3.extent(data, function(d) { return d.yCord; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("X-Axis");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Y-Axis")

});

// ** Update data section (Called from the onclick)
function updateData(display) {

  var x = d3.scale.linear()
    .range([0, width]);

  var y = d3.scale.linear()
    .range([height, 0]);

  //if (error) throw error;

  display.forEach(function(d) {
    d.yCord = +d.yCord;
    d.xCord = +d.xCord;
  });

  x.domain(d3.extent(display, function(d) { return d.xCord; })).nice();
  y.domain(d3.extent(display, function(d) { return d.yCord; })).nice();

  // Add the tooltip container to the vis container
  // it's invisible and its position/contents are defined during mouseover
  var tooltip = d3.select("#vis-container").append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);

  // tooltip mouseover event handler
  var tipMouseover = function(d) {
      var html  = d.word + "<br> <b> Score: </b> " + d.score.toString(2);
                  

      tooltip.html(html)
          .style("left", (d3.event.pageX + 15) + "px")
          .style("top", (d3.event.pageY - 28) + "px")
        .transition()
          .duration(200) // ms
          .style("opacity", .9) // started as 0!

  };
  // tooltip mouseout event handler
  var tipMouseout = function(d) {
      tooltip.transition()
          .duration(300) // ms
          .style("opacity", 0); // don't care about position!
  };


  svg.selectAll(".dot").remove();

  svg.selectAll(".dot")
      .data(display)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.xCord); })
      .attr("cy", function(d) { return y(d.yCord); })
      .style("fill", function(d) { return color(d.space); })
      .on("mouseover", tipMouseover)
      .on("mouseout", tipMouseout);
  
  var legend = svg.selectAll(".legend")
      .data(color.domain())
    .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });

  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });

    svg.selectAll(".dot")
      .append("circle")
      .attr("class", "dot")
      .attr("r", 100)
      .attr("cx", x(4))
      .attr("cy", y(2));


}