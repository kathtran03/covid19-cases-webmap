mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0aHRyYW4wMyIsImEiOiJjbTZxeWhodXkxcDRqMnFvaWJueWY3dzYzIn0.Qio5gJ5Wer70rWl-nxF85g';

const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/light-v10',
        zoom: 4.2,
        center: [-100, 40],
        projection: 'albers'
    }
);

async function geojsonFetch() { 
    let response = await fetch('assets/us-covid-2020-rates.json');
    let ratesData = await response.json();
    map.on('load', function loadingData() {
    map.addSource('ratesData', {
    type: 'geojson',
    data: ratesData
});

map.addLayer({
    'id': 'US-layer',
    'type': 'fill',
    'source': 'ratesData',
    'paint': {
        'fill-color': [
            'step',
            ['get', 'rates'],
            '#FFEDA0',   // stop_output_0 - 0-20
            20,          // stop_input_0
            '#FED976',   // stop_output_1 - 20-50
            50,          // stop_input_1
            '#FEB24C',   // stop_output_2 - 50-75
            75,          // stop_input_2
            '#FD8D3C',   // stop_output_3 - 75-100
            100,         // stop_input_3
            '#FC4E2A',   // stop_output_4 - 100-150
            150,         // stop_input_4
            '#E31A1C',   // stop_output_5 - 150-200
            200,         // stop_input_5
            '#BD0026',   // stop_output_6 - 200-250
            250,         // stop_input_6
            "#800026"    // stop_output_7 - 250+
        ],
        'fill-outline-color': '#BBBBBB',
        'fill-opacity': 0.7,
    }
});

const layers = [
    '0-20',
    '20-50',
    '50-75',
    '75-100',
    '100-150',
    '150-200',
    '200-250',
    '250+'
];
const colors = [
    '#FFEDA070',
    '#FED97670',
    '#FEB24C70',
    '#FD8D3C70',
    '#FC4E2A70',
    '#E31A1C70',
    '#BD002670',
    '#80002670'
];

const legend = document.getElementById('legend');
legend.innerHTML = "<b>COVID-19 Case Rate<br>(per 1,000 people)</b><br><br>";

layers.forEach((layer, i) => {
    const color = colors[i];
    const item = document.createElement('div');
    const key = document.createElement('span');
    key.className = 'legend-key';
    key.style.backgroundColor = color;

    const value = document.createElement('span');
    value.innerHTML = `${layer}`;
    item.appendChild(key);
    item.appendChild(value);
    legend.appendChild(item);
});

map.on('mousemove', 'US-layer', (event) => {
    const county = event.features[0].properties;
    document.getElementById('text-description').innerHTML
    
    map.getCanvas().style.cursor = 'pointer';
    
    // Show tooltip with just the name
    const tooltip = document.getElementById('hover-tooltip');
    tooltip.innerHTML = `${county.county} County, ${county.state}`;
    tooltip.style.display = 'block';
    tooltip.style.left = event.originalEvent.pageX + 10 + 'px';
    tooltip.style.top = event.originalEvent.pageY + 10 + 'px';
});


map.on('click', 'US-layer', (event) => {
    const county = event.features[0].properties;
    
    document.getElementById('modal-title').innerHTML = `${county.county} County, ${county.state}`;
    document.getElementById('modal-details').innerHTML = `
        <p><span class='stat-label'>COVID-19 Rate:</span> <span class='stat-value'>${county.rates.toFixed(2)} per 1,000 people</span></p>
        <p><span class='stat-label'>Total Cases:</span> <span class='stat-value'>${county.cases.toLocaleString()}</span></p>
        <p><span class='stat-label'>Deaths:</span> <span class='stat-value'>${county.deaths.toLocaleString()}</span></p>
        <p><span class='stat-label'>Population (18+):</span> <span class='stat-value'>${county.pop18.toLocaleString()}</span></p>
        <p><span class='stat-label'>Deaths per 100 cases:</span> <span class='stat-value'>${(county.deaths / county.cases * 100).toFixed(2)}%</span></p>
    `;
    document.getElementById('info-modal').classList.add('show');
});

    });
}

document.querySelector('.close-modal').addEventListener('click', function() {
    document.getElementById('info-modal').classList.remove('show');
});

window.addEventListener('click', function(event) {
    const modal = document.getElementById('info-modal');
    if (event.target === modal) {
        modal.classList.remove('show');
    }
    
});



geojsonFetch();