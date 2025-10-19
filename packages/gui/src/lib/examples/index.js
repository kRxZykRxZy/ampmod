const examples = {
    griffpatch: () =>
        import(
            /* webpackChunkName: "examples/griffpatch" */ "!arraybuffer-loader!./Box2D.sb3"
        ),
    battery: () =>
        import(
            /* webpackChunkName: "examples/battery" */ "!arraybuffer-loader!./Battery.apz"
        ),
};

export default examples;
