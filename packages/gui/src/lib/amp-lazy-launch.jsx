import React, { Suspense } from "react";
import styles from "./amp-lazy-launch.css";
import render from "../playground/app-target.js";

const Loading = ({ message }) => (
    <div className={styles.launching}>
        <p>{message}</p>
    </div>
);

export const lazyLaunch = ({
    message = "Launching editor...",
    component,
    ...props
} = {}) => {
    const Editor =
        component || React.lazy(() => import("../playground/editor.jsx"));

    render(
        <Suspense fallback={<Loading message={message} />}>
            <Editor {...props} />
        </Suspense>
    );
};
