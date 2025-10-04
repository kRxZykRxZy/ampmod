import paper from "@turbowarp/paper";
import Modes from "../../lib/modes";
import { styleShape } from "../style-path";
import { clearSelection } from "../selection";
import { getSquareDimensions } from "../math";
import BoundingBoxTool from "../selection-tools/bounding-box-tool";
import NudgeTool from "../selection-tools/nudge-tool";
import log from "../../log/log";

/**
 * amp: Tool for drawing rounded rectangles. Implementation of Scratch's stub.
 */
class RoundedRectTool extends paper.Tool {
    static get TOLERANCE() {
        return 2;
    }
    /**
     * @param {function} setSelectedItems Callback to set the set of selected items in the Redux state
     * @param {function} clearSelectedItems Callback to clear the set of selected items in the Redux state
     * @param {function} setCursor Callback to set the visible mouse cursor
     * @param {!function} onUpdateImage A callback to call when the image visibly changes
     */
    constructor(
        setSelectedItems,
        clearSelectedItems,
        setCursor,
        onUpdateImage
    ) {
        super();
        this.setSelectedItems = setSelectedItems;
        this.clearSelectedItems = clearSelectedItems;
        this.onUpdateImage = onUpdateImage;
        this.boundingBoxTool = new BoundingBoxTool(
            Modes.ROUNDED_RECT,
            setSelectedItems,
            clearSelectedItems,
            setCursor,
            onUpdateImage
        );
        const nudgeTool = new NudgeTool(
            Modes.ROUNDED_RECT,
            this.boundingBoxTool,
            onUpdateImage
        );

        // We have to set these functions instead of just declaring them because
        // paper.js tools hook up the listeners in the setter functions.
        this.onMouseDown = this.handleMouseDown;
        this.onMouseMove = this.handleMouseMove;
        this.onMouseDrag = this.handleMouseDrag;
        this.onMouseUp = this.handleMouseUp;
        this.onKeyUp = nudgeTool.onKeyUp;
        this.onKeyDown = nudgeTool.onKeyDown;

        this.rect = null;
        this.colorState = null;
        this.isBoundingBoxMode = null;
        this.active = false;

        // Default corner size
        this._cornerSize = new paper.Size(10, 10);
    }

    /**
     * Sets the corner size for rounded rectangles.
     * @param {paper.Size|number} cornerSize The corner size as a paper.Size object or a number for uniform rounding.
     */
    setCornerSize(cornerSize) {
        if (typeof cornerSize === "number") {
            this._cornerSize = new paper.Size(cornerSize, cornerSize);
        } else if (cornerSize instanceof paper.Size) {
            this._cornerSize = cornerSize;
        } else {
            log.warn(
                "Invalid cornerSize provided to RoundedRectTool.setCornerSize"
            );
            // Optionally, revert to default or handle error
            this._cornerSize = new paper.Size(10, 10);
        }

        // If a rectangle is currently selected, update its roundness
        if (this.boundingBoxTool && this.boundingBoxTool.selectedItems) {
            for (const item of this.boundingBoxTool.selectedItems) {
                if (item instanceof paper.Path.Rectangle) {
                    item.radius = this._cornerSize;
                    this.onUpdateImage();
                }
            }
        }
    }

    getHitOptions() {
        return {
            segments: true,
            stroke: true,
            curves: true,
            fill: true,
            guide: false,
            match: hitResult =>
                (hitResult.item.data &&
                    (hitResult.item.data.isScaleHandle ||
                        hitResult.item.data.isRotHandle)) ||
                hitResult.item.selected,
            tolerance: RoundedRectTool.TOLERANCE / paper.view.zoom,
        };
    }

    /**
     * Should be called if the selection changes to update the bounds of the bounding box.
     * @param {Array<paper.Item>} selectedItems Array of selected items.
     */
    onSelectionChanged(selectedItems) {
        this.boundingBoxTool.onSelectionChanged(selectedItems);
    }

    setColorState(colorState) {
        this.colorState = colorState;
    }

    handleMouseDown(event) {
        if (event.event.button > 0) return; // only first mouse button
        this.active = true;

        if (
            this.boundingBoxTool.onMouseDown(
                event,
                false /* clone */,
                false /* multiselect */,
                false /* doubleClicked */,
                this.getHitOptions()
            )
        ) {
            this.isBoundingBoxMode = true;
        } else {
            this.isBoundingBoxMode = false;
            clearSelection(this.clearSelectedItems);
        }
    }

    handleMouseDrag(event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseDrag(event);
            return;
        }

        if (this.rect) {
            this.rect.remove();
        }

        const rect = new paper.Rectangle(event.downPoint, event.point);
        const squareDimensions = getSquareDimensions(
            event.downPoint,
            event.point
        );
        if (event.modifiers.shift) {
            rect.size = squareDimensions.size.abs();
        }

        this.rect = new paper.Path.Rectangle(rect, this._cornerSize);
        if (event.modifiers.alt) {
            this.rect.position = event.downPoint;
        } else if (event.modifiers.shift) {
            this.rect.position = squareDimensions.position;
        } else {
            const dimensions = event.point.subtract(event.downPoint);
            this.rect.position = event.downPoint.add(dimensions.multiply(0.5));
        }

        styleShape(this.rect, this.colorState);
    }

    handleMouseUp(event) {
        if (event.event.button > 0 || !this.active) return; // only first mouse button

        if (this.isBoundingBoxMode) {
            this.boundingBoxTool.onMouseUp(event);
            this.isBoundingBoxMode = null;
            return;
        }

        if (this.rect) {
            if (this.rect.area < RoundedRectTool.TOLERANCE / paper.view.zoom) {
                // Tiny rectangle created unintentionally?
                this.rect.remove();
                this.rect = null;
            } else {
                this.rect.selected = true;
                this.setSelectedItems();
                this.onUpdateImage();
                this.rect = null;
            }
        }
        this.active = false;
    }

    handleMouseMove(event) {
        this.boundingBoxTool.onMouseMove(event, this.getHitOptions());
    }

    deactivateTool() {
        this.boundingBoxTool.deactivateTool();
    }
}

export default RoundedRectTool;
