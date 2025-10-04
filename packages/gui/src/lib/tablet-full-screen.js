import * as bowser from "bowser";

/**
 * Helper method to request full screen in the browser when on a tablet.
 */
export default function () {
    const parsedResult = bowser.parse(navigator.userAgent);

    if (parsedResult.platform.type === "tablet") {
        if (parsedResult.engine.name === "Blink") {
            if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen();
            }
        } else if (parsedResult.engine.name === "WebKit") {
            if (document.documentElement.webkitRequestFullScreen) {
                document.documentElement.webkitRequestFullScreen();
            }
        } else if (parsedResult.engine.name === "Gecko") {
            if (document.documentElement.mozRequestFullScreen) {
                document.documentElement.mozRequestFullScreen();
            }
        }
    }
}
