export function drawLabel(group, x, y, text, width, radius, height = 50) {
    const rect = group.rect(Math.round(width), height)
        .fill('#ecf0f1')
        .radius(radius)
        .move(Math.round(x), Math.round(y - height / 2));

    const textEl = group.text(text)
        .font({ size: 16, anchor: 'start' })
        .fill('#000');

    const bbox = textEl.bbox();
    const textX = x + (width - bbox.width) / 2;
    const textY = y - bbox.height / 2;
    textEl.move(Math.round(textX), Math.round(textY));

    return {
        eliminate: () => {
            rect.animate(500).attr({ fill: '#ff0000' });
            textEl.animate(500).attr({ fill: '#ffffff' });
        },
    };
}

export function drawRect(group, x, y, width, height, color) {
    group.rect(Math.round(width), Math.round(height))
        .fill(color)
        .radius(6)
        .move(Math.round(x), Math.round(y - height / 2));
}
