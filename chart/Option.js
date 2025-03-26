import { drawLabel } from './utils.js';

export class Option {
    constructor(name, index, boxWidth, boxGap, padding, y, group, isEliminated = false) {
        const x = padding + index * (boxWidth + boxGap);
        this.center = { x: x + boxWidth / 2, y };
        this.name = name;
        this.eliminated = isEliminated;

        const label = drawLabel(group, x, y, name, boxWidth, 6);
        this._eliminate = label.eliminate;
    }

    eliminate() {
        this._eliminate();
    }
}
