// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // get the metadata field
    let metadata = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let filteredData = metadata.filter(item => item.id === sample);
    let sampleMetaData = filteredData[0];
    
    // Use d3 to select the panel with id of `#sample-metadata`
    let demographics = d3.select(`#sample-metadata`);

    // Use `.html("") to clear any existing metadata
    demographics.html("");

    // Iterate over the sample metadata for each key-value in the filtered metadata.
    Object.entries(sampleMetaData).forEach(([key, value]) => {
      demographics.append('span')        // New paragraph for each field
      .text(`${key.toUpperCase()}: ${value}`);      // add text "field: value"
    
      demographics.append('br');
    })
  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the samples field
    let samplesField = data.samples;

    // Filter the samples for the object with the desired sample number
    let filteredData = samplesField.filter(item => item.id === sample);
    // console.log(`filteredData:`, filteredData);
    let sampleData = filteredData[0];
    // console.log(`sampleData:`, sampleData);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values.map(Number);
    // console.log(sample_values.type);

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        size: sample_values,
        color: otu_ids,
      },
      text: otu_labels,
      type: 'scatter'
    };

    let bubbleData = [trace1];

    let layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: {title: 'OTU ID'},
      yaxis: {title: 'Number of Bacteria'}
    }

    // Render the Bubble Chart
    Plotly.newPlot("bubble", bubbleData, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    // Sort the data by sample_values descending
    let sortedSamples = filteredData.sort((a, b) => b.sample_values - a.sample_values);
    sortedSamples = sortedSamples[0];
    // console.log(`sortedSamples`, sortedSamples);
    let top_otu_ids = sortedSamples.otu_ids.slice(0, 10);
    let top_otu_labels = sortedSamples.otu_labels.slice(0, 10);
    let top_sample_values = sortedSamples.sample_values.slice(0, 10);
    // console.log(`topOTU_IDS: `, top_otu_ids);
    // Slice the first 10 objects for plotting
    // let firstTenSamples = sortedSamples.slice(0, 10);
    // console.log(`firstTenSamples`, firstTenSamples);

    // Reverse the array to accommodate Plotly's defaults
    top_otu_ids.reverse();
    top_otu_labels.reverse();
    top_sample_values.reverse();

    let yticks = top_otu_ids.map(id => `OTU ${id}  `);

    // Trace2 for the Bar Chart Data
    let trace2 = {
      x: top_sample_values,
      y: yticks,
      text: top_otu_labels,
      name: "Bacteria Cultures",
      type: "bar",
      orientation: "h"
    };
    console.log(yticks);


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately
    let barData = [trace2];

    layout = {
      title: 'Top 10 Bacteria Cultures Found',
      xaxis: {title: 'Number of Bacteria'}
    }
    // Render the Bar Chart
    Plotly.newPlot("bar", barData, layout)

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    const dropdown = d3.select('#selDataset');
        
    // Use the list of sample names to populate the select options
    dropdown.selectAll('option')  // Select all 'option' elements  
      .data(names)                // Link with data in 'namea' array
      .enter()                    // Create new 'option' for each new item
      .append('option')           // Append the '<option>' tag
      .text(d => d)               // Set text to the element in names
      .attr('value', d => d);     // Set value of each to the element in names

    d3.select('#selDataset').on('change', function() {
      let newSample = d3.select(this).property('value');
      buildCharts(newSample);
      buildMetadata(newSample*1); // Convert newSample to a number
    });

    // Get the first sample from the list 
    let sample = dropdown.property('value');

    // Build charts and metadata panel with the first sample
    buildCharts(sample);  
    buildMetadata(sample*1); // Convert firstSample to a number
  });
}



// Function for event listener
// function optionChanged(newSample) {
//   // Build charts and metadata panel each time a new sample is selected
//   sample = dropdown.property('value');
//   buildCharts(sample);
//   buildMetadata(sample*1);
// }

// Initialize the dashboard
init();
