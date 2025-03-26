export class Row {
    constructor(group, y, labelText, config) {
        const { width, layout } = config;

        group.rect(width, layout.rowHeight)
            .fill(config.colors.rowBackground)
            .radius(0)
            .move(0, y - layout.rowHeight / 2);

        group.text(labelText)
            .font({ size: 16, weight: 'bold', anchor: 'start' })
            .fill('#fff')
            .move(15, y - 10); // vertical alignment tweak
    }
}
