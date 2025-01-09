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
    let sampleData = filteredData[0];
    console.log(`sampleData`, sampleData);

    // Get the otu_ids, otu_labels, and sample_values
    let otu_ids = sampleData.otu_ids;
    let otu_labels = sampleData.otu_labels;
    let sample_values = sampleData.sample_values;

    // console.log('Check: ', sampleValues);

    // Build a Bubble Chart
    let trace1 = {
      x: otu_ids,
      y: sample_values,
      mode: 'markers',
      marker: {
        sizes: sample_values/43,
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
    let sortedSamples = samplesField.sort((a, b) => b.sample_values - a.sample_values);

    // Slice the first 10 objects for plotting
    let firstTenSamples = sortedSamples.slice(0, 10);
    console.log(`firstTenSamples`, firstTenSamples);

    // Reverse the array to accommodate Plotly's defaults
    firstTenSamples.reverse();

    // Trace1 for the Greek Data
    let trace2 = {
      x: firstTenSamples.map(object => object.sample_values),
      y: slicedData.map(object => object.greekName),
      text: slicedData.map(object => object.greekName),
      name: "Greek",
      type: "bar",
      orientation: "h"
    };
    
    let yticks = otu_ids.map(id => `OTU ${id}`);

    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately

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
    let selectedValue = [];
    // dropdown.addEventListener('change', function(event) {
    //   const selectedValue = event.target.value;
    // });



    // Use the list of sample names to populate the select options
    dropdown.selectAll('option')  // Select all 'option' elements  
      .data(names)                // Link with data in 'namea' array
      .enter()                    // Create new 'option' for each new item
      .append('option')           // Append the '<option>' tag
      .text(d => d)               // Set text to the element in names
      .attr('value', d => d);     // Set value of each to the element in names
      
    d3.select('#selDataset')
      .on('change', function(event) {
        selectedValue = d3.select(this).property('value');
        console.log('Selected Value: ', selectedValue);
    });
    // Get the first sample from the list
    // let firstSample = names[0];   
    // let sample = dropdown.property('value');
    // sample = selectedValue;
    // console.log(`sample`, sample);
    // Build charts and metadata panel with the first sample
    buildCharts(selectedValue);  
    buildMetadata(selectedValue*1); // Convert firstSample to a number
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  // sample = dropdown.property('value');
  // buildCharts(sample);
  // buildMetadata(sample*1);
}

// Initialize the dashboard
init();
