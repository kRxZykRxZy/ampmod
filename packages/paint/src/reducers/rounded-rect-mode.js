import Modes from "../lib/modes";

const CHANGE_ROUNDED_RECT_RADIUS =
    "scratch-paint/rounded-rect-mode/CHANGE_ROUNDED_RECT_RADIUS";

const initialState = {
    roundedRectRadius: 10,
    name: Modes.ROUNDED_RECT,
};

const reducer = function (state, action) {
    if (typeof state === "undefined") state = initialState;
    switch (action.type) {
        case CHANGE_ROUNDED_RECT_RADIUS:
            return Object.assign({}, state, {
                roundedRectRadius: action.roundedRectRadius,
            });
        default:
            return state;
    }
};

const changeRoundedRectRadius = roundedRectRadius => ({
    type: CHANGE_ROUNDED_RECT_RADIUS,
    roundedRectRadius: roundedRectRadius,
});

export { reducer as default, changeRoundedRectRadius };
