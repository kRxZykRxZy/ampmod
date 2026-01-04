import log from "../lib/log";

const loadServiceWorker = () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
        log.info('SW registered: ', registration);
    }).catch(registrationError => {
        log.error('SW registration failed: ', registrationError);
    });
};

export {loadServiceWorker};
