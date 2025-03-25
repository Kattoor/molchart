import { drawLabel } from './label-utils.js';

export class Participant {
    constructor(name, index, boxWidth, boxGap, padding, y, group) {
        this.name = name;
        this.index = index;
        this.x = padding + index * (boxWidth + boxGap);
        this.y = y;
        this.center = { x: this.x + boxWidth / 2, y };
        drawLabel(group, this.x, y, name, boxWidth);
    }
}