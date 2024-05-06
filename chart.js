const svg = document.getElementById('svg');

let somethingIsSelected = false;
let selectedParticipants = [];
let selectedOptions = [];

document.addEventListener('click', (e) => {
    if (!e.ctrlKey) {
        if (somethingIsSelected) {
            document.querySelectorAll('div').forEach((div) => div.style.opacity = '1');
            document.querySelectorAll('path').forEach((div) => div.style.opacity = '1');
            document.querySelectorAll('div').forEach((div) => div.classList.remove('selected'));
            somethingIsSelected = false;
            selectedParticipants = [];
            selectedOptions = [];
        }
    }
});

const colors = [
    '#01407e',
    '#86be00',
    '#ff80e9',
    '#00b94f',
    '#ff0d5d',
    '#77c0ff',
    '#6ad8c7',
    '#57004f',
    '#ff9f42',
    '#962c00',
    '#005b3b',
    '#ff7c85',
    '#3d2900',
    '#dfc47b'
];

/* Draw participants */
participants.forEach((participant, i) => {
    const div = document.createElement('div');
    div.setAttribute('data-option', participant);
    div.innerHTML = participant;
    div.style.border = `0.4rem solid ${colors[i]}`;
    div.className = 'participant square';

    div.addEventListener('click', (e) => {
        e.stopPropagation();
        somethingIsSelected = true;

        if (e.ctrlKey) {
            if (selectedParticipants.includes(participant)) {
                selectedParticipants.splice(selectedParticipants.indexOf(participant), 1);
            } else {
                selectedParticipants.push(participant);
            }
        } else {
            selectedOptions = [];
            selectedParticipants = [participant];
        }

        document.querySelectorAll('path').forEach((path) => {
            path.style.opacity = '0';
        });

        document.querySelectorAll('div').forEach((div) => {
            div.classList.remove('selected');
        });

        for (let participant of selectedParticipants) {
            for (let path of [...document.querySelectorAll(`path[data-participant="${participant}"]`)]) {
                path.style.opacity = '1';
            }

            document.querySelector(`#participants-container>div[data-option="${participant}"]`).classList.add('selected');
        }

        for (let {option, week} of selectedOptions) {
            for (let [participant] of Object.entries(data[week]).filter(([, innerTo]) => innerTo === option)) {
                for (let path of [...document.querySelectorAll(`path[data-participant="${participant}"]`)]) {
                    path.style.opacity = '1';
                }
            }

            document.querySelector(`div[data-week="${week}"] > div[data-option="${option}"]`).classList.add('selected');
        }
    });

    document.getElementById('participants-container').appendChild(div);
});

/* Draw options */
for (let i = 0; i < data.length; i++) {
    const weekContainerDiv = document.createElement('div');
    weekContainerDiv.setAttribute('data-week', i.toString());
    weekContainerDiv.style.backgroundColor = '#00000022';
    weekContainerDiv.className = 'options-row';

    const weekRecord = data[i];

    const weekHeader = document.createElement('div');
    weekHeader.innerHTML = 'Week ' + (i + 1);
    weekHeader.style.display = 'flex';
    weekHeader.style.alignItems = 'center';
    weekHeader.style.color = 'white';
    weekContainerDiv.append(weekHeader);

    for (let to of options) {
        const optionDiv = document.createElement('div');
        optionDiv.setAttribute('data-option', to);
        optionDiv.innerHTML = to;
        optionDiv.className = 'square';

        const eliminationIndex = eliminations.indexOf(to);
        if (eliminationIndex !== -1 && i >= eliminationIndex) {
            setTimeout(() => optionDiv.style.animation = 'eliminate 0.5s linear forwards', (eliminationIndex) * 1000);
        }

        optionDiv.addEventListener('click', (e) => {
            e.stopPropagation();

            if (eliminationIndex === i) {
                return;
            }

            somethingIsSelected = true;

            if (e.ctrlKey) {
                const selectedOptionIndex = selectedOptions.findIndex((selectedOption) => selectedOption.option === to && selectedOption.week === i);
                if (selectedOptionIndex !== -1) {
                    selectedOptions.splice(selectedOptionIndex, 1);
                } else {
                    selectedOptions.push({option: to, week: i});
                }
            } else {
                selectedOptions = [{option: to, week: i}];
                selectedParticipants = [];
            }

            document.querySelectorAll('path').forEach((path) => {
                path.style.opacity = '0';
            });

            document.querySelectorAll('div').forEach((div) => {
                div.classList.remove('selected');
            });

            for (let participant of selectedParticipants) {
                for (let path of [...document.querySelectorAll(`path[data-participant="${participant}"]`)]) {
                    path.style.opacity = '1';
                }

                document.querySelector(`#participants-container>div[data-option="${participant}"]`).classList.add('selected');
            }

            for (let {option, week} of selectedOptions) {
                for (let [participant] of Object.entries(data[week]).filter(([, innerTo]) => innerTo === option)) {
                    for (let path of [...document.querySelectorAll(`path[data-participant="${participant}"]`)]) {
                        path.style.opacity = '1';
                    }
                }

                document.querySelector(`div[data-week="${week}"] > div[data-option="${option}"]`).classList.add('selected');
            }
        });

        weekContainerDiv.appendChild(optionDiv);
    }

    document.getElementById('options-container').appendChild(weekContainerDiv);
}

/* Draw lines */
for (let i = 0; i < data.length; i++) {
    const weekRecord = data[i];

    const fromRow = i === 0 ? document.querySelector('#participants-container') : document.querySelector(`div[data-week="${i - 1}"]`);
    const toRow = document.querySelector(`div[data-week="${i}"]`);

    const weekRecordEntries = Object.entries(weekRecord);

    const lines = [];
    const fromSquareConnectionsCounters = {};
    const toSquareConnectionCounters = {};

    for (let j = 0; j < weekRecordEntries.length; j++) {
        const [participant, to] = weekRecordEntries[j];
        const color = colors[j];

        const fromSquare = i === 0 ? fromRow.querySelector(`div[data-option="${participant}"]`) : fromRow.querySelector(`div[data-option="${data[i - 1][participant]}"]`);
        const toSquare = toRow.querySelector(`div[data-option="${to}"]`);

        if (!fromSquareConnectionsCounters[fromSquare.dataset.option]) {
            fromSquareConnectionsCounters[fromSquare.dataset.option] = {
                amountOfConnections: 0,
                currentConnectionCount: 0
            };
        }

        if (!toSquareConnectionCounters[toSquare.dataset.option]) {
            toSquareConnectionCounters[toSquare.dataset.option] = {
                amountOfConnections: 0,
                currentConnectionCount: 0
            };
        }

        fromSquareConnectionsCounters[fromSquare.dataset.option].amountOfConnections += 1;
        toSquareConnectionCounters[toSquare.dataset.option].amountOfConnections += 1;

        lines.push({fromSquare, toSquare, participant, color});
    }

    for (let {fromSquare, toSquare, participant, color} of lines) {
        const fromSquareOffsetX = getOffsetX(fromSquareConnectionsCounters[fromSquare.dataset.option]);
        const toSquareOffsetX = getOffsetX(toSquareConnectionCounters[toSquare.dataset.option]);
        drawCurve(fromSquare, fromSquareOffsetX, toSquare, toSquareOffsetX, participant, i, fromSquare.dataset.option, toSquare.dataset.option, color);
    }
}

function getOffsetX(counter) {
    const amountOfConnections = counter.amountOfConnections;
    if (amountOfConnections > 1) {
        const arr = [];

        if (amountOfConnections % 2 !== 0) {
            for (let i = -Math.floor(amountOfConnections / 2); i < 0; i++) {
                arr.push(i);
            }
            arr.push(0);
            for (let i = 1; i <= Math.floor(amountOfConnections / 2); i++) {
                arr.push(i);
            }
        } else {
            for (let i = -Math.floor(amountOfConnections / 2); i < 0; i++) {
                arr.push(i + .5);
            }
            for (let i = 1; i <= Math.floor(amountOfConnections / 2); i++) {
                arr.push(i - .5);
            }
        }

        const result = arr[counter.currentConnectionCount] * 16;

        counter.currentConnectionCount += 1;

        return result;
    }
    return 0;
}

function calculateControlPoints(x1, y1, x2, y2) {
    return {
        x1: x1,
        y1: y1 + 300 / 2,
        x2: x2,
        y2: y2 - 300 / 2
    };
}

function drawCurve(start, startOffsetX, end, endOffsetX, participant, week, optionFrom, optionTo, color) {
    const startRect = start.getBoundingClientRect();
    const endRect = end.getBoundingClientRect();

    const x1 = startRect.left + startRect.width / 2 + window.scrollX + startOffsetX;
    const y1 = startRect.bottom + window.scrollY;
    const x2 = endRect.left + endRect.width / 2 + window.scrollX + endOffsetX;
    const y2 = endRect.top + window.scrollY;

    const controlPoints = calculateControlPoints(x1, y1, x2, y2);

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', `M${x1},${y1} C${controlPoints.x1},${controlPoints.y1} ${controlPoints.x2},${controlPoints.y2} ${x2},${y2}`);
    path.setAttribute('stroke', color);
    path.setAttribute('stroke-width', '16px');
    path.setAttribute('fill', 'none');
    path.setAttribute('data-participant', participant);
    path.setAttribute('data-week', week);
    path.setAttribute('data-option-from', optionFrom);
    path.setAttribute('data-option-to', optionTo);
    path.setAttribute('pathLength', '1');
    path.setAttribute('data-start-offset-x', startOffsetX);
    path.setAttribute('data-end-offset-x', endOffsetX);
    setTimeout(() => path.style.animation = 'dash 0.5s linear forwards', week * 1000 + 500);

    path.addEventListener('click', (e) => {
        if (path.style.opacity === '0') {
            return;
        }

        e.stopPropagation();
        somethingIsSelected = true;

        selectedParticipants = [];
        selectedOptions = [];

        document.querySelector(`.participant[data-option="${participant}"]`).style.opacity = '1';

        document.querySelectorAll('path').forEach((path) => {
            path.style.opacity = '0';
        });

        document.querySelectorAll('div').forEach((div) => {
            div.classList.remove('selected');
        });

        for (let path of [...document.querySelectorAll(`path[data-participant="${participant}"]`)]) {
            path.style.opacity = '1';
        }
    });

    svg.appendChild(path);
}

function moveCurve(path, start, startOffsetX, end, endOffsetX) {
    const startRect = start.getBoundingClientRect();
    const endRect = end.getBoundingClientRect();

    const x1 = startRect.left + startRect.width / 2 + window.scrollX + startOffsetX;
    const y1 = startRect.bottom + window.scrollY;
    const x2 = endRect.left + endRect.width / 2 + window.scrollX + endOffsetX;
    const y2 = endRect.top + window.scrollY;

    const controlPoints = calculateControlPoints(x1, y1, x2, y2);

    path.setAttribute('d', `M${x1},${y1} C${controlPoints.x1},${controlPoints.y1} ${controlPoints.x2},${controlPoints.y2} ${x2},${y2}`);
}

addEventListener('resize', () => {
    document.querySelectorAll('path').forEach((path) => {
        const startOption = path.dataset.week === '0'
            ? document.querySelector(`#participants-container > div[data-option="${path.dataset.participant}"]`)
            : document.querySelector(`#options-container > div[data-week="${+path.dataset.week - 1}"] > div[data-option="${path.dataset.optionFrom}"]`);
        const endOption = path.dataset.week === '0'
            ? document.querySelector(`#options-container > div[data-week="${+path.dataset.week}"] > div[data-option="${path.dataset.optionTo}"]`)
            : document.querySelector(`#options-container > div[data-week="${+path.dataset.week}"] > div[data-option="${path.dataset.optionTo}"]`);

        moveCurve(path, startOption, +path.dataset.startOffsetX, endOption, +path.dataset.endOffsetX);
    });
});
