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
    console.log(data);
    console.log(sample);
    // Get the samples field
    let samplesField = data.sample;
    console.log(`samplesField: `, samplesField);

    // Filter the samples for the object with the desired sample number
    let filteredData = samplesField.filter(item => item.id === '940');
    let sampleData = filteredData[0];
    console.log(`sampleData`, sampleData);

    // Get the otu_ids, otu_labels, and sample_values


    // Build a Bubble Chart


    // Render the Bubble Chart


    // For the Bar Chart, map the otu_ids to a list of strings for your yticks


    // Build a Bar Chart
    // Don't forget to slice and reverse the input data appropriately


    // Render the Bar Chart

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {

    // Get the names field
    let names = data.names;

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    dropdown.selectAll('option')  // Select all 'option' elements  
      .data(names)                // Link with data in 'namea' array
      .enter()                    // Create new 'option' for each new item
      .append('option')           // Append the '<option>' tag
      .text(d => d)               // Set text to the element in names
      .attr('value', d => d);     // Set value of each to the element in names

    // Get the first sample from the list
    let firstSample = names[0];   
    
    // Build charts and metadata panel with the first sample
    buildCharts(firstSample);  
    buildMetadata(firstSample*1); // Convert firstSample to a number
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(firstSample);
  buildMetadata(firstSample);
}

// Initialize the dashboard
init();
