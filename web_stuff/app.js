// get the url 
var url = window.location.href;
//getting the access token from url 
var access_token = url.split("#")[1].split("=")[1].split("&")[0]; 
// get the userid 
var userId = url.split("#")[1].split("=")[2].split("&")[0]; 
console.log(access_token); 
console.log(userId);

var xhr = new XMLHttpRequest();
var data;
xhr.open('GET', 'https://api.fitbit.com/1/user/' + userId + '/body/log/weight/date/2019-02-01/1m.json');
xhr.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr.onload = function () {
    if (xhr.status === 200) {
        console.log(xhr.responseText);
	//document.write(JSON.parse(xhr.responseText)['weight'][0]['weight']);
        data = JSON.parse(xhr.responseText)['weight'];
	console.log(data);
	var weight = [];
	var dates = []
	var i;
	// TODO scenarios for when data doesnt exist
	for (i=0; i<data.length; i++) {
    	    weight.push(data[i]['weight']);
	    dates.push(data[i]['date']);
	}
	//document.write(weight);
	console.log(weight);
	graph(weight, dates, 1);
    } else {
        console.log('error ' + xhr.status);
    }
};
xhr.send();


var xhr2 = new XMLHttpRequest();
var data2;
//xhr.open('GET', 'https://api.fitbit.com/1/user/' + userId + '/activities/heart/date/2019-02-01/1m.json');
xhr2.open('GET', 'https://api.fitbit.com/1/user/' + userId + '/activities/heart/date/2019-01-05/2019-02-01/1min.json');
xhr2.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr2.onload = function () {
    if (xhr2.status === 200) {
        console.log(xhr2.responseText);
	//document.write(JSON.parse(xhr.responseText)['weight'][0]['weight']);
        data2 = JSON.parse(xhr2.responseText)['activities-heart'];
	//console.log(data2);
	var restingrate = [];
	var dates = []
	var i;
	// TODO scenarios for when data doesnt exist
	for (i=0; i<data2.length; i++) {
    	    restingrate.push(data2[i]['value']['restingHeartRate']);
	    dates.push(data2[i]['dateTime']);
	}
	//document.write(weight);
	//console.log(restingrate);
	graph(restingrate, dates, 2);
    } else {
        console.log('error ' + xhr2.status);
    }
};
xhr2.send();



var xhr3 = new XMLHttpRequest();
var data3;
xhr3.open('GET', 'https://api.fitbit.com/1.2/user/' + userId + '/sleep/date/2019-01-05/2019-02-05.json');
xhr3.setRequestHeader("Authorization", 'Bearer ' + access_token);
xhr3.onload = function () {
    if (xhr3.status === 200) {
        console.log(xhr3.responseText);
	//document.write(JSON.parse(xhr.responseText)['weight'][0]['weight']);
        data3 = JSON.parse(xhr3.responseText)['sleep'];
	console.log(data3);
	var sleep = [];
	var dates = []
	var i;
	// TODO scenarios for when data doesnt exist
	for (i=0; i<data3.length; i++) {
    	    sleep.push(data3[i]['duration']/3600000);
	    dates.push(data3[i]['dateOfSleep']);
	}
	//document.write(weight);
	console.log(sleep);
	graph(sleep, dates, 3);
    } else {
        console.log('error ' + xhr3.status);
    }
};
xhr3.send();


function graph(data, dates, graph_num) {
    /*var canvas = d3.select("body")
                        .append("svg")
                        .attr("width", 500)
                        .attr("height", 500);
        var circle = canvas.append("circle")
                        .attr("cx",250)
                        .attr("cy", 250)
                        .attr("r", 50)
                        .attr("fill", "red");
*/


//////////////
var gr;
if (graph_num == 1) {
	gr = "#first-graph";
} else if (graph_num == 2) {
	gr = "#second-graph";
} else if (graph_num == 3) {
	gr = "#third-graph";
}

    var margin = 50;
var width = 200;
var height = 200;
var margin = 50;
var width = 200;
var height = 200;

const xMin = 0;
    const xMax = data.length;

    const yMin = Math.min.apply(null, data);
    const yMax = Math.max.apply(null, data);
    const x = d3.scaleLinear().domain([xMin, xMax]).range([0, width]);

    const y = d3.scaleLinear().domain([yMin, yMax]).range([height, margin]);
/*
var x = d3.scaleBand()
  .domain([0,1,2,3,4,5])
  .range([0,width]);

var y = d3.scaleLinear()
  .domain([0,250])
  .range([height,0]);
*/

d3.select(gr)
  .append("g")
  .attr("transform", "translate("+margin+","+margin+")")
  .selectAll("rect").data(data)
  .enter().append("rect")
  .attr("x", function(d,i) {return i*(200.0/xMax);})
  .attr("y", function(d) {return y(d)})
  .attr("width", function(d) { return 200.0/xMax;})
  .attr("height", function(d) { return height-y(d);});

d3.select(gr).append("g")
  .attr("transform", "translate("+margin+","+margin+")")
  .call(d3.axisLeft(y));

d3.select(gr).append("g")
  .attr("transform", "translate("+margin+","+(height+margin)+")")
  .call(d3.axisBottom(x));


////////

    if (graph_num == 1) {
        var y_axis_label = "Weight in Kilograms";
        var x_axis_label = "Days";

    } else if (graph_num == 2) {
        var y_axis_label = "Average Heart Rate";
        var x_axis_label = "Days";
    } else {
        var y_axis_label = "Hours of Sleep";
        var x_axis_label = "Days";
    }
/*
    const xScale = d3.scaleLinear().domain([xMin, xMax]).range([padding, w - padding]);

    const yScale = d3.scaleLinear().domain([yMin, yMax]).range([h - padding, padding]);

    const svg = d3.select('#plot_area').append('svg').attr('width', w).attr('height', h);
*/
    // Add x-axis
    //svg.append('g').style('font-size', '12px').attr('transform', 'translate(0,' + (h - padding) + ')').call(d3.axisBottom(xScale));

    // Add y-axis
    //d3.select(gr).append('g').style('font-size', '12px').attr('transform', 'translate(' + padding + ',0)').call(d3.axisLeft(yScale));

    // Add x-axis label
    d3.select(gr).append('text').attr('x', width/2).attr('y', height+90).attr('text-anchor', 'middle').style('font-family', 'sans-serif').text(x_axis_label);

    //  Add y-axis label
   d3.select(gr).append('text').attr('text-anchor', 'middle').attr('transform', 'translate(15,' + height/1.5 + ')rotate(-90)').style('font-family', 'sans-serif').text(y_axis_label)
/////////


}

function revokeAccess() {
    var params = "token=" + access_token;
    var xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://api.fitbit.com/oauth2/revoke');
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Authorization", 'Basic MjJCVEhaOjdhNzFkNTFiMjMzYWZiMTIzYWNkMjQ5ZmJhODUwNDgy', true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            console.log(xhr.responseText)
        }
    };
    xhr.send(params);
}



