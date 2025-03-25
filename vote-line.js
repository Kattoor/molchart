export class VoteLine {
    constructor(pathsLayer, from, to, color, offset, config) {
        const fromOffset = { x: from.x + offset, y: from.y };
        const toOffset = { x: to.x + offset, y: to.y };
        const ctrl1 = { x: fromOffset.x, y: fromOffset.y + 40 };
        const ctrl2 = { x: toOffset.x, y: toOffset.y - 40 };

        const pathStr = `M ${fromOffset.x} ${fromOffset.y} C ${ctrl1.x} ${ctrl1.y}, ${ctrl2.x} ${ctrl2.y}, ${toOffset.x} ${toOffset.y}`;

        const path = pathsLayer.path(pathStr)
            .fill('none')
            .stroke({ width: config.strokeWidth, color, linecap: 'round' });

        const length = path.length();
        path.attr('stroke-dasharray', length).attr('stroke-dashoffset', length);
        path.animate(1000).attr({ 'stroke-dashoffset': 0 });
    }
}