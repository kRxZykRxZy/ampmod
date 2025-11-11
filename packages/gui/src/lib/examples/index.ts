const examples: Record<string, () => Promise<typeof import('!arraybuffer-loader!*')>> = {
    griffpatch: () => import(/* webpackChunkName: "examples-apz-griffpatch" */ '!arraybuffer-loader!./Box2D.sb3'),
    battery: () => import(/* webpackChunkName: "examples-apz-battery" */ '!arraybuffer-loader!./Battery.apz')
};

export default examples;
