import "../import-first.js";
import Header from "../components/header/header";
import Footer from "../components/footer/footer";
import Privacy from "./privacy";
import NewCompiler from "./new-compiler";
import "./minor-pages.css";
import render from "../../playground/app-target";
import { applyGuiColors } from "../../lib/themes/guiHelpers.js";
import { detectTheme } from "../../lib/themes/themePersistance.js";

/* eslint-disable react/jsx-no-literals */

applyGuiColors(detectTheme());
document.documentElement.lang = "en";

function getPage() {
    switch (window.__PAGE__) {
        case "privacy":
            return <Privacy />;
        case "newcompiler":
            return <NewCompiler />;
        default:
            console.warn("Unknown page:", window.__PAGE__);
            return null;
    }
}

render(
    <>
        <Header />
        {getPage()}
        <Footer />
    </>
);
