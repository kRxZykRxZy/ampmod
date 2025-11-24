export const isWorker = true;
export { self as centralDispatchService };
export default {
    isWorker,
    centralDispatchService: self
};
