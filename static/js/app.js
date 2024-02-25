const debug = true;


const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Promise Pending
const dataDownload = d3.json(url);
if (debug) { console.log("Data: ", dataDownload); }

// Fetch the JSON data and console log it - all subsequent code within this function

d3.json(url).then(function (data) {
    if (debug) { console.log(data); }

    var itemIdx = (typeof itemIdx === 'undefined') ? 0 : itemIdx;
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
        let colorlist = ['red', 'orangered', 'orange', 'yellow', 'yellowgreen', 'green', 'blue', 'mediumblue', 'rebeccapurple', 'indigo'];//pairs with Jet and Portland
        let colorlist2 = ['#f0f921', '#fdca26', '#fb9f3a', '#ed7953', '#d8576b', '#bd3786', '#9c179e', '#7201a8', '#46039f', '#0d0887']//reverse plasma

        let trace1 = {
            x: barx,
            y: barystr,
            text: barz,
            type: 'bar',
            orientation: 'h',
            marker: { color: colorlist2 }
        };
        let data1 = [trace1];

        let layout1 = {
            title: { text: `ID_${data.names[itemIdx]} Top 10 OTUs<br><sup>(Operational Taxonomic Units)</sup>`, font: { size: 22 } },
            showlegend: false,
            height: 400,
            width: 500,
            xaxis: { title: "OTU count" },
            margin: { t: 50, r: 25, l: 75, b: 35 },
            paper_bgcolor: "royalblue",
            font: { color: "white", family: "Arial" }
        };

        Plotly.newPlot("bar", data1, layout1)
    };
    barChart(itemIdx);

});