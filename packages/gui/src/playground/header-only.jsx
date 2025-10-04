import "./import-first";
import React from "react";
import render, { renderToBottom } from "./app-target";

import { applyGuiColors } from "../lib/themes/guiHelpers";
import { detectTheme } from "../lib/themes/themePersistance";

import Header from "../components/amp-header/header.jsx";
import Footer from "../components/amp-footer/footer.jsx";

/* eslint-disable react/jsx-no-literals */

applyGuiColors(detectTheme());
document.documentElement.lang = "en";

render(<Header />);
renderToBottom(<Footer />);
