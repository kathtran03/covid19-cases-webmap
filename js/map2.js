mapboxgl.accessToken = 'pk.eyJ1Ijoia2F0aHRyYW4wMyIsImEiOiJjbTZxeWhodXkxcDRqMnFvaWJueWY3dzYzIn0.Qio5gJ5Wer70rWl-nxF85g';
let map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v10',
    zoom: 4.2,
    center: [-100, 40],
    projection: 'albers'
});

async function geojsonFetch() {
    let response = await fetch('assets/us-covid-2020-counts.json');
    let countsData = await response.json();
    
    const grades = [500, 2000, 10000], 
          colors = ['rgb(237,248,251)', 'rgba(113, 158, 202, 1)', 'rgb(129,15,124)'], 
          radii = [5, 12, 28];
    
    map.on('load', () => {
    map.addSource('countsData', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });

    map.addLayer({
        'id': 'covid-point',
        'type': 'circle',
        'source': 'countsData',
        'paint': {
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [grades[0], radii[0]],
                    [grades[1], radii[1]],
                    [grades[2], radii[2]],
                ]
            },
            'circle-color': {
            'property': 'cases',
            'stops': [
                [grades[0], colors[0]],
                [grades[1], colors[1]],
                [grades[2], colors[2]],
            ]
        },
        'circle-stroke-color': 'white',
        'circle-stroke-width': 1,
        'circle-opacity': 0.6
        }
    });
    
// Change cursor to pointer on hover
map.on('mouseenter', 'covid-point', () => {
    map.getCanvas().style.cursor = 'pointer';
});

// Change cursor back to default when leaving layer
map.on('mouseleave', 'covid-point', () => {
    map.getCanvas().style.cursor = '';
});

// Enhanced click event to show detailed popup
map.on('click', 'covid-point', (event) => {
    const properties = event.features[0].properties;
    new mapboxgl.Popup()
        .setLngLat(event.features[0].geometry.coordinates)
        .setHTML(`
            <strong>${properties.county}, ${properties.state}</strong><br>
            Cases: <strong>${properties.cases.toLocaleString()}</strong><br>
            Deaths: ${properties.deaths.toLocaleString()}
        `)
        .addTo(map);
    });
    });

const legend = document.getElementById('legend');

var labels = ['<strong>COVID-19 Cases</strong>'], vbreak;
for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    dot_radius = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radius +
        'px; height: ' +
        dot_radius + 'px; "></i> <span class="dot-label" style="top: ' + dot_radius / 2 + 'px;">' + vbreak +
        '</span></p>');
}

const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">Covid-19 Data</a></p>';

legend.innerHTML = labels.join('') + source;
    };




geojsonFetch();