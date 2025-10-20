export default require
    .context("./", false, /\.apz$/)
    .keys()
    .reduce((acc, filePath) => {
        const key = filePath.replace(/^.\//, "").replace(/\.apz$/, "");
        acc[key] = () =>
            import(
                /* webpackChunkName: "apb" */ `!arraybuffer-loader!./${key}.apz`
            );
        return acc;
    }, {});
