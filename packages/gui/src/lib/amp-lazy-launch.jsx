import React, { Suspense } from "react";
import styles from "./amp-lazy-launch.css";
import render from "../playground/app-target.js";

const Loading = () => <div className={styles.launching}></div>;

export const lazyLaunch = ({ component, ...props } = {}) => {
    const Editor =
        component || React.lazy(() => import("../playground/editor.jsx"));

    render(
        <Suspense fallback={<Loading />}>
            <Editor {...props} />
        </Suspense>
    );
};
