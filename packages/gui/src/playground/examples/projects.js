import Box2DIcon from "./images/box2dlogo.png";
import BatteryIcon from "./images/battery.svg";
import { APP_NAME } from "@ampmod/branding";

export default [
    {
        id: "griffpatch",
        title: "Box2D Physics Sample",
        by: "DNin01",
        img: Box2DIcon,
        description: `${APP_NAME}'s Box2D extension allows you to add 2-dimensional physics to your games.`,
    },
    {
        id: "battery",
        title: "What's my battery on?",
        by: "8to16",
        img: BatteryIcon,
        description:
            "The Battery extension can get the battery percentage of your device.",
        isSupported: "getBattery" in navigator,
    },
];
