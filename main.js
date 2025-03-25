import { chartConfig } from './chart-config.js';
import { Participant } from './participant.js';
import { OptionBox } from './option.js';
import { VoteLine } from './vote-line.js';

// Provide these from your data context

const draw = SVG().addTo('#chart').size(chartConfig.width, chartConfig.height);
const pathsLayer = draw.group();
const labelsLayer = draw.group();

// Generate participant colors
const participantColors = {};
participants.forEach((p, i) => {
    const hue = (i * 360 / participants.length) % 360;
    participantColors[p] = `hsl(${hue}, 70%, 50%)`;
});

// === Draw Participants ===
const participantTotalWidth = chartConfig.width - 2 * chartConfig.chartPadding;
const participantBoxWidth = (participantTotalWidth - (participants.length - 1) * chartConfig.participantBoxGap) / participants.length;
const participantY = 50;

const participantMap = {};
participants.forEach((name, i) => {
    const p = new Participant(name, i, participantBoxWidth, chartConfig.participantBoxGap, chartConfig.chartPadding, participantY, labelsLayer);
    participantMap[name] = p.center;
});

// === Draw Option Rows ===
const optionPosByWeek = {};

options.forEach((weekObj, weekIdx) => {
    const rowY = (weekIdx + 1) * chartConfig.spacingY + 50;
    const optionNames = weekObj.option;
    const numOptions = optionNames.length;

    // Week label
    labelsLayer.text(`Week ${weekIdx + 1}`).move(10, rowY - 6).font({ size: 12 }).fill('#000');

    // Box spacing
    const totalGaps = (numOptions - 1) * chartConfig.optionBoxGap;
    const availableWidth = chartConfig.width - 2 * chartConfig.chartPadding - totalGaps;
    const boxWidth = availableWidth / numOptions;

    optionPosByWeek[weekIdx] = {};
    optionNames.forEach((name, i) => {
        const box = new OptionBox(name, i, boxWidth, chartConfig.optionBoxGap, chartConfig.chartPadding, rowY, labelsLayer);
        optionPosByWeek[weekIdx][name] = box.center;
    });
});

// === Animate Vote Lines ===
async function animateVotes() {
    const currentPos = { ...participantMap };
    for (let week = 0; week < data.length; week++) {
        const weekVotes = data[week];
        const pathCount = new Map();

        participants.forEach(name => {
            const from = currentPos[name];
            const to = optionPosByWeek[week][weekVotes[name]];
            if (!to) return;

            const key = `${from.x},${from.y}->${to.x},${to.y}`;
            const count = pathCount.get(key) || 0;
            pathCount.set(key, count + 1);

            const offset = (count - 0.5) * chartConfig.strokeOffset;
            new VoteLine(pathsLayer, from, to, participantColors[name], offset, chartConfig);
            currentPos[name] = to;
        });

        await new Promise(r => setTimeout(r, 1500));
    }
}

animateVotes();
