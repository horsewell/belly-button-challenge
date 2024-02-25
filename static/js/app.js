const debug = false;
const bgColour = 'RoyalBlue';
const fontColour = 'white';

document.body.style.backgroundColor = bgColour;


const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataDownload = d3.json(url);
if (debug) { console.log("Data: ", dataDownload); }

// Fetch the JSON data and console log it - all subsequent code within this function

d3.json(url).then(function (data) {
    if (debug) { console.log(data); }

    var itemIdx = (typeof itemIdx === 'undefined') ? 0 : itemIdx;

    //Create DDL from names list - working code option 1
    let selectList = d3.select('select');
    data.names.forEach(nameNumber => selectList.append('option').attr('value', nameNumber).text(nameNumber));

    if (debug) { console.log(itemIdx) }

    // Create a bar chart
    // Plots top ten Operational Taxonomic Units (otu_id) by count (sample_values) 
    // with additional hover info giving the types of bacteria found (otu_labels) for the default or selected Test Subject ID
    function barChart(itemIdx) {
        let barx = data.samples[itemIdx].sample_values.slice(0, 10).reverse();//sample_values
        let bary = data.samples[itemIdx].otu_ids.slice(0, 10).reverse();//otu_ids, use this to build string for chart
        let barystr = []// use this for bar chart
        bary.forEach(pear => barystr.push(`OTU_${pear}`));
        let barz = data.samples[itemIdx].otu_labels.slice(0, 10).reverse();//otu_labels

        if (debug) { console.log(barx); console.log(bary); console.log(barz); }

        //color options
        let colours = ["#FFFF00", "#FFCC00", "#FF9900", "#FF6600", "#FF3300", "#FF0000", "#CC0000", "#990000", "#660000", "#330000"];

        let trace1 = {
            x: barx,
            y: barystr,
            text: barz,
            type: 'bar',
            orientation: 'h',
            marker: { color: colours }
        };
        let data1 = [trace1];

        let layout1 = {
            title: { text: `ID_${data.names[itemIdx]} Top 10 OTUs<br><sup>(Operational Taxonomic Units)</sup>`, font: { size: 22 } },
            showlegend: false,
            height: 400,
            width: 500,
            xaxis: { title: "OTU count" },
            margin: { t: 50, r: 25, l: 75, b: 35 },
            paper_bgcolor: bgColour,
            font: { color: fontColour, family: "Arial" }
        };

        Plotly.newPlot("bar", data1, layout1)
    };
    barChart(itemIdx);

    // Crete a bubble plot visual
    // Plots all of the Operational Taxonomic Units (otu_id) on the x axis and by marker color
    // and count(sample_value) on the y axis and by marker size
    // additional hover info shows the types of bacteria found (otu_labels) for the default or selected Test Subject ID

    function bubbleChart(itemIdx) {
        let bubblex = [data.samples[itemIdx].otu_ids];
        let bubbley = [data.samples[itemIdx].sample_values];
        let bubblez = [data.samples[itemIdx].otu_labels];

        if (debug) { console.log(bubblex); console.log(bubbley); console.log(bubblez); }

        let trace2 = {
            x: bubblex[0],
            y: bubbley[0],
            xlimit: 4000,
            text: bubblez[0],
            mode: 'markers',
            marker: {
                size: bubbley[0],
                color: bubblex[0],
                colorscale: 'Electric'
            }
        };
        let data2 = [trace2];

        let layout2 = {
            title: { text: `ID_${data.names[itemIdx]} OTU Counts`, font: { size: 24 } },
            showlegend: false,
            margin: { t: 75, r: 25, l: 50, b: 35 },
            paper_bgcolor: bgColour,
            font: { color: fontColour, family: "Arial" },
            xaxis: { title: "OTU_ID" },
            yaxis: { title: "OTU count" }
        };

        Plotly.newPlot('bubble', data2, layout2)
    };
    bubbleChart(itemIdx);

    //The dropdown select box - changes the dashboard based on the user selection
    let dropdown = d3.select("#selDataset");
    dropdown.on("change", function () {
        userChoice = this.value;
        if (debug) { console.log(userChoice); }
        const userChoiceIndex = (element) => element == userChoice;
        if (debug) { console.log(userChoiceIndex); }
        itemIdx = data.names.findIndex(userChoiceIndex);
        if (debug) { console.log(itemIdx); }

        // display the new dashboard
        d3.select('#sample-metadata').html(""); dInfo(itemIdx);
        barChart(itemIdx);
        bubbleChart(itemIdx);
        gaugeChart(itemIdx)
    });

    // Demographic Information Graphic
    function dInfo(itemIdx) {
        let demoInfo = data.metadata[itemIdx];
        if (debug) { console.log(demoInfo); }
        Object.entries(demoInfo).forEach(([key, value]) => {
            let addDemoData = d3.select('#sample-metadata').append('li');
            addDemoData.text(`${key}:  ${value}`)
        })
    };
    dInfo(itemIdx);

    // Bonus

    // Gauge Chart visual
    // Plots the average number of times that the default or selected Test Subject washed their belly button per week (wfreq)
    function gaugeChart(itemIdx) {
        let gaugechartinfo = data.metadata[itemIdx].wfreq;
        if (debug) { console.log(gaugechartinfo); }

        let data3 = [
            {
                type: "indicator",
                mode: "gauge+number",
                value: gaugechartinfo,
                title: { text: "Belly Button Washing Frequency<br><sup>Scrubs per Week</sup>", font: { size: 22 } },
                gauge: {
                    axis: { range: [null, 9], tick0: 0, dticks: 8, tickwidth: 1, tickcolor: "darkblue" },
                    bar: { color: "darkblue" },
                    bgcolor: "white",
                    borderwidth: 2,
                    bordercolor: "gray",
                    steps: [
                        // color scheme 2: pairs with Plasma (only one color scheme should be active at a time)
                        { range: [0, 1], color: "#f0f921" },
                        { range: [1, 2], color: "#fdca26" },
                        { range: [2, 3], color: "#fb9f3a" },
                        { range: [3, 4], color: "#ed7953" },
                        { range: [4, 5], color: "#d8576b" },
                        { range: [5, 6], color: "#bd3786" },
                        { range: [6, 7], color: "#9c179e" },
                        { range: [7, 8], color: "#7201a8" },
                        { range: [8, 9], color: "#46039f" },
                        //{ range: [9, 10], color: '#0d0887'  }//max washing = 9, don't need this one
                    ],
                }
            }
        ];

        let layout3 = {
            width: 500,
            height: 400,
            margin: { t: 100, r: 25, l: 25, b: 25 },
            paper_bgcolor: bgColour,
            font: { color: fontColour, family: "Arial" }
        };

        Plotly.newPlot('gauge', data3, layout3)
    };
    gaugeChart(itemIdx)

});