export default function buildConfig(amountOfWeeks) {
    const config = {
        layout: {
            paddingLeft: 80,
            paddingRight: 20,
            participantPadding: 20,
            rowHeight: 80,
            spacingY: 300,
            optionBoxHeight: 50,
            optionBoxGap: 15,
            participantBoxGap: 25,
        },

        stroke: {
            width: 16,
            offset: 16,
        },

        colors: {
            rowBackground: '#00000022',
            eliminated: '#ff0000',
            eliminatedText: '#ffffff',
            optionFill: '#ecf0f1',
            text: '#000',
        }
    };

    config.height = config.layout.spacingY * amountOfWeeks + config.layout.rowHeight;

    const div = document.createElement('div');
    div.style.width = '100px';
    div.style.height = config.height + 'px';
    div.style.position = 'absolute';
    div.style.top = '0';
    document.body.appendChild(div);

    config.width = Math.max(document.body.clientWidth, 900);

    return config;
}
