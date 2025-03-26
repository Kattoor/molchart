export class VoteLine {
    constructor(group, from, to, color, config) {
        const midY = (from.y + to.y) / 2;

        const pathStr = `
      M ${from.x} ${from.y}
      C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}
    `;

        const path = group.path(pathStr.trim())
            .fill('none')
            .stroke({ width: config.stroke.width, color, linecap: 'round' });

        const length = path.length();
        path.attr('stroke-dasharray', length).attr('stroke-dashoffset', length);
        path.animate(500).attr({ 'stroke-dashoffset': 0 });
    }
}
