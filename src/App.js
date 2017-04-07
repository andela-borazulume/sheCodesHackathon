import React, { Component } from 'react';
import * as d3 from "d3";
import accounts from './accounts.json';
import './App.css';

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.chartConfig = this.chartConfig.bind(this);
  }

  chartConfig() {
    let data = {};
    accounts.forEach(account => {
      if (data[account['state']] == null) {
        data[account['state']] = { male: 0, female: 0 }
      }
      account['gender'] === 'M' ? data[account['state']]['male'] += 1 : data[account['state']]['female'] += 1;
    });

    var labels = [], male = [], female = [], newdata = [];
    Object.keys(data).map(key => {
      labels.push(key);
      male.push(data[key].male)
      female.push(data[key].female)
    });
    newdata.push(male, female);

    var margin = { top: 20, right: 100, bottom: 30, left: 100 },
      width = 1400 - margin.left - margin.right,
      height = 500 - margin.top - margin.bottom;

    var y = d3.scale.linear()
      .domain([0, 25])
      .range([height, 0]);

    var x3 = d3.scale.ordinal()
      .domain(labels.map(function (d) { return d; }))
      .rangeBands([0, width], .2);

    var x0 = d3.scale.ordinal()
      .domain(d3.range(labels.length))
      .rangeBands([0, width], .2);

    var x1 = d3.scale.ordinal()
      .domain(d3.range(newdata.length))
      .rangeBands([0, x0.rangeBand()]);

    // var z = d3.scale.category10();
    var z = d3.scale.ordinal()
      .range(["#6b486b", "#ff8c00"]);

    var xAxis = d3.svg.axis()
      .scale(x3)
      .orient("bottom");

    var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left");

    var svg = d3.select("body").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("svg:g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
      .attr("className", "y axis")
      .call(yAxis);

    svg.append("g")
      .attr("className", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    svg.append("g").selectAll("g")
      .data(newdata)
      .enter().append("g")
      .style("fill", function (d, i) { return z(i); })
      .attr("transform", function (d, i) { return "translate(" + x1(i) + ",0)"; })
      .selectAll("rect")
      .data(function (d) { return d; })
      .enter().append("rect")
      .attr("width", x1.rangeBand())
      .attr("height", y)
      .attr("x", function (d, i) { return x0(i); })
      .attr("y", function (d) { return height - y(d); });

    var legend = svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 10)
      .attr("text-anchor", "end")
      .selectAll("g")
      .data(["Male", "Female"])
      .enter().append("g")
      .attr("transform", function (d, i) { return "translate(0," + i * 20 + ")"; });

    legend.append("rect")
      .attr("x", width - 19)
      .attr("width", 19)
      .attr("height", 19)
      .attr("fill", z);

    legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9.5)
      .attr("dy", "0.32em")
      .text(function (d) { return d; });
  }

  render() {
    return (
      <div className="App">
        <h1>Grouped bar chart Showing The Number of Both<br/> Male and Female employees in a State</h1>
        {this.chartConfig()}
      </div>
    );
  }
}

export default App;




