import { Chart } from './chart/Chart.js';
import { data, participants, options } from './data.js';
import buildConfig from './config.js';

const config = buildConfig(data.length);

scrollTo({ top: 0, behavior: 'smooth' });

const svg = SVG().addTo('#chart').size(config.width, config.height);
const chart = new Chart(svg, { participants, options, data, config });

await chart.render();
