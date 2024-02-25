const debug = true;

const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataDownload = d3.json(url);
if (debug) { console.log("Data: ", dataDownload); }

// Fetch the JSON data and console log it - all subsequent code within this function
 
d3.json(url).then(function(data) {
    if (debug) { console.log(data); }
});