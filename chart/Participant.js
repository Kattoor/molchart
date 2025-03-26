import { drawLabel, drawRect } from './utils.js';

export class Participant {
    constructor(name, index, boxWidth, boxGap, padding, y, group, color) {
        const x = padding + index * (boxWidth + boxGap);
        this.center = { x: x + boxWidth / 2, y };

        drawRect(group, x - 6, y, boxWidth + 12, 62, color);
        drawLabel(group, x, y, name, boxWidth, 0);
    }
}
