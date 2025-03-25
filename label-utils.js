export function drawLabel(group, x, y, text, width, height = 28) {
    group.rect(width, height)
        .fill('#fff')
        .stroke({ width: 1, color: '#ccc' })
        .radius(6)
        .move(x, y - height / 2);

    const textEl = group.text(text)
        .font({ size: 12 })
        .fill('#000');

    const bbox = textEl.bbox();
    const textX = x + (width - bbox.width) / 2;
    const textY = y - bbox.height / 2;
    textEl.move(textX, textY);
}