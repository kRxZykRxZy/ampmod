import Box2DIcon from "./images/box2d.svg";
import BatteryIcon from "./images/battery.svg";
import { APP_NAME } from "@ampmod/branding";
import { localise } from "../components/localise/localise";

export default [
    {
        id: "griffpatch",
        by: "DNin01",
        img: Box2DIcon,
    },
    {
        id: "battery",
        by: "8to16",
        img: BatteryIcon,
        isSupported: "getBattery" in navigator,
        scratchuserid: "141263923",
    },
];
