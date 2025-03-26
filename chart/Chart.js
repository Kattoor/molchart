import { Row } from './Row.js';
import { Participant } from './Participant.js';
import { Option } from './Option.js';
import { VoteLine } from './VoteLine.js';

export class Chart {
    constructor(svg, { participants, options, data, config }) {
        this.svg = svg;
        this.participants = participants;
        this.options = options;
        this.data = data;
        this.config = config;
        this.pathsLayer = svg.group();
        this.labelsLayer = svg.group();
        this.currentPos = {};
        this.participantColors = {};
        this.optionsByWeek = new Map();
    }

    async render() {
        this._setupColors();
        this._drawParticipants();
        this._drawWeeks();
        await this._animateVotes();
    }

    _setupColors() {
        const colors = [ '#01407e', '#86be00', '#ff80e9', '#00b94f', '#ff0d5d', '#77c0ff', '#6ad8c7', '#57004f', '#ff9f42', '#962c00', '#005b3b', '#ff7c85', '#3d2900', '#dfc47b' ];
        this.participants.forEach((name, i) => {
            //const hue = (i * 360 / this.participants.length) % 360;
            this.participantColors[name] = colors[i]; //`hsl(${hue}, 70%, 50%)`;
        });
    }

    _drawParticipants() {
        const { config, labelsLayer } = this;
        const y = config.layout.rowHeight / 2;
        const gap = config.layout.participantBoxGap;
        const width = this._participantsRowWidth(this.participants.length, gap);
        this.participants.forEach((name, i) => {
            const p = new Participant(name, i, width, gap, config.layout.participantPadding, y, labelsLayer, this.participantColors[name]);
            this.currentPos[name] = p.center;
        });
    }

    _drawWeeks() {
        const { options, config, labelsLayer } = this;
        options.forEach((weekObj, weekIdx) => {
            const y = (weekIdx + 1) * config.layout.spacingY + config.layout.rowHeight / 2;
            new Row(labelsLayer, y, `Week ${weekIdx + 1}`, config);

            const opts = weekObj.option;
            const gap = config.layout.optionBoxGap;
            const width = this._optionsRowWidth(opts.length, gap);
            this.optionsByWeek[weekIdx] = {};

            opts.forEach(({ name, eliminated }, i) => {
                const o = new Option(name, i, width, gap, config.layout.paddingLeft, y, labelsLayer, eliminated);
                this.optionsByWeek[weekIdx][name] = o;
            });
        });
    }

    async _animateVotes() {
        const { data, participants, pathsLayer, config } = this;

        for (let week = 0; week < data.length; week++) {
            const votes = data[week];

            await this._eliminateOptions(week);
            await this._delay(500);

            const fromMap = new Map();
            const toMap = new Map();
            const fromIdx = new Map();
            const toIdx = new Map();

            participants.forEach(name => {
                const from = this.currentPos[name];
                const to = this.optionsByWeek[week][votes[name]]?.center;
                if (!to) return;

                const fKey = `${from.x},${from.y}`;
                const tKey = `${to.x},${to.y}`;

                fromMap.set(fKey, (fromMap.get(fKey) || 0) + 1);
                toMap.set(tKey, (toMap.get(tKey) || 0) + 1);
            });

            participants.forEach(name => {
                const from = this.currentPos[name];
                const to = this.optionsByWeek[week][votes[name]]?.center;
                if (!to) return;

                const fKey = `${from.x},${from.y}`;
                const tKey = `${to.x},${to.y}`;

                const fCount = fromMap.get(fKey);
                const tCount = toMap.get(tKey);

                const fIdx = fromIdx.get(fKey) || 0;
                const tIdx = toIdx.get(tKey) || 0;

                fromIdx.set(fKey, fIdx + 1);
                toIdx.set(tKey, tIdx + 1);

                const fOffset = (fIdx - (fCount - 1) / 2) * config.stroke.offset;
                const tOffset = (tIdx - (tCount - 1) / 2) * config.stroke.offset;

                const fromPoint = { x: from.x + fOffset, y: from.y + config.layout.optionBoxHeight / 2 };
                const toPoint = { x: to.x + tOffset, y: to.y - config.layout.optionBoxHeight / 2 };

                new VoteLine(pathsLayer, fromPoint, toPoint, this.participantColors[name], config);
                this.currentPos[name] = to;
            });

            await this._delay(500);
            scrollTo({ top: config.layout.spacingY * week, behavior: 'smooth' });
            await this._delay(500);
        }
    }

    async _eliminateOptions(week) {
        this.options[week].option
            .filter(opt => opt.eliminated)
            .forEach(opt => {
                for (let i = week; i < this.options.length; i++) {
                    const optionBox = this.optionsByWeek[i]?.[opt.name];
                    if (optionBox) {
                        optionBox.eliminate(); // <- ✅ call it here, just before vote lines
                    }
                }
            });
    }

    _delay(ms) {
        return new Promise(r => setTimeout(r, ms));
    }

    _optionsRowWidth(count, gap) {
        return (this.config.width - this.config.layout.paddingLeft - this.config.layout.paddingRight - (count - 1) * gap) / count;
    }

    _participantsRowWidth(count, gap) {
        return (this.config.width - this.config.layout.participantPadding - this.config.layout.participantPadding - (count - 1) * gap) / count;
    }
}
