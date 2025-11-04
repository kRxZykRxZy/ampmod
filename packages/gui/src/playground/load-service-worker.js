import log from "../lib/log";
import serviceWorker from "./service-worker.js?asset/resource&name=sw.js";

let loaded = false;
const actuallyLoadServiceWorker = () => {
    navigator.serviceWorker.register(serviceWorker).catch(err => {
        log.error('sw error', err);
    });
};
const loadServiceWorker = () => {
    if (!process.env.DISABLE_SERVICE_WORKER && 'serviceWorker' in navigator && !loaded) {
        loaded = true;
        if (document.readyState === 'complete') {
            actuallyLoadServiceWorker();
        } else {
            window.addEventListener('load', actuallyLoadServiceWorker);
        }
    }
};

export {loadServiceWorker};
