// Define function to initialize the page
const init = () => {
    // Use D3 to read the JSON file
    d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
      const samples = data.samples;
      const names = data.names;
      const metadata = data.metadata;
  
      const sampleValues = samples.map(sample => sample.sample_values);
      const otuIds = samples.map(sample => sample.otu_ids);
      const otuLabels = samples.map(sample => sample.otu_labels);
  
      // Create the dropdown menu with options for each sample
      const dropdown = d3.select("#selDataset");
      names.forEach((name, index) => {
        dropdown.append("option").text(name).property("value", index);
      });
  
      // Initial charts with the first sample
      updateCharts(0, sampleValues, otuIds, otuLabels, metadata);
    });
  }
  
  // Define function to update the bar chart based on the selected sample
  const updateChart = (selectedIndex, sampleValues, otuIds, otuLabels) => {
    // Use D3 to select the bar chart container
    const barChart = d3.select("#bar");
  
    // Clear existing chart content
    barChart.html("");
  
    // Select the top 10 values, ids, and labels for the selected sample
    const top10Values = sampleValues[selectedIndex].slice(0, 10).reverse();
    const top10Ids = otuIds[selectedIndex].slice(0, 10).reverse();
    const top10Labels = otuLabels[selectedIndex].slice(0, 10).reverse();
  
    // Create the horizontal bar chart
    const trace = {
      x: top10Values,
      y: top10Ids.map(id => `OTU ${id}`),
      text: top10Labels,
      type: "bar",
      orientation: "h"
    };
  
    const data = [trace];
  
    const layout = {
      title: `Top 10 OTUs for Sample ${selectedIndex}`,
      xaxis: { title: "Sample Values" },
      yaxis: { title: "OTU IDs" }
    };
  
    Plotly.newPlot("bar", data, layout);
  
    console.log("Bar Chart Updated:", trace);
  }
  
  // Define function to update the bubble chart based on the selected sample
  const updateBubbleChart = (selectedIndex, sampleValues, otuIds, otuLabels, metadata) => {
    // Use D3 to select the bubble chart container
    const bubbleChart = d3.select("#bubble");
  
    // Clear existing chart content
    bubbleChart.html("");
  
    // Create the bubble chart
    const trace = {
      x: otuIds[selectedIndex],
      y: sampleValues[selectedIndex],
      text: otuLabels[selectedIndex],
      mode: 'markers',
      marker: {
        size: sampleValues[selectedIndex],
        color: otuIds[selectedIndex],
        colorscale: 'Viridis'
      }
    };
  
    const data = [trace];
  
    const layout = {
      title: `Bubble Chart for Sample ${selectedIndex}`,
      xaxis: { title: 'OTU ID' },
      yaxis: { title: 'Sample Values' }
    };
  
    Plotly.newPlot("bubble", data, layout);
  
    console.log("Bubble Chart Updated:", trace);
  }
  
  // Define function to update demographic info based on the selected sample
  const updateDemographicInfo = (selectedIndex, metadata) => {
    // Use D3 to select the demographic info panel
    const demographicInfoPanel = d3.select("#sample-metadata");
  
    // Clear existing content
    demographicInfoPanel.html("");
  
    // Select the metadata for the selected sample
    const selectedMetadata = metadata[selectedIndex];
  
    // Iterate over key-value pairs and append to the panel
    Object.entries(selectedMetadata).forEach(([key, value]) => {
      demographicInfoPanel.append("p").text(`${key}: ${value}`);
    });
  
    console.log("Demographic Info Updated:", selectedMetadata);
  }
  
  // Update the charts along with the demographic info panel
  const updateCharts = (selectedIndex, sampleValues, otuIds, otuLabels, metadata) => {
    updateChart(selectedIndex, sampleValues, otuIds, otuLabels);
    updateBubbleChart(selectedIndex, sampleValues, otuIds, otuLabels, metadata);
    updateDemographicInfo(selectedIndex, metadata);
  }
  
  // Initialize the page
  init();
  
  // Event listener for changes in the dropdown selection
  d3.select("#selDataset").on("change", function () {
    const selectedIndex = this.value;
    updateCharts(selectedIndex, sampleValues, otuIds, otuLabels, metadata);
  });
  