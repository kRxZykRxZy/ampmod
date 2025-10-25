const AbstractWindow = require("./abstract");
const { APP_NAME } = require("../brand");

class ExamplesWindow extends AbstractWindow {
    constructor() {
        super();
        this.window.setTitle(`Examples - ${APP_NAME}`);
        this.loadURL("tw-examples://./index.html");
    }

    getDimensions() {
        return {
            width: 800,
            height: 700,
        };
    }

    getPreload() {
        return "examples";
    }

    isPopup() {
        return true;
    }

    static show() {
        const window = AbstractWindow.singleton(ExamplesWindow);
        window.show();
    }
}

module.exports = ExamplesWindow;
