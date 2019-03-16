import {LEFT_MOUSE_BUTTON,
        OPTION_KEY,
        SHIFT_KEY,
        IO_PORT_RADIUS,
        ROTATION_CIRCLE_R1,
        ROTATION_CIRCLE_R2} from "../utils/Constants";

import {Vector, V} from "../utils/math/Vector";
import {Transform} from "../utils/math/Transform";
import {RectContains,CircleContains} from "../utils/math/MathUtils";
import {Camera} from "../utils/Camera";
import {Input} from "../utils/Input";
import {RenderQueue} from "../utils/RenderQueue";
import {Action} from "../utils/actions/Action";
import {ActionManager} from "../utils/actions/ActionManager";

import {CircuitDesigner} from "../models/CircuitDesigner";

import {MainDesignerView} from "../views/MainDesignerView";

import {ToolManager} from "../utils/tools/ToolManager";

import {MouseListener} from "../utils/MouseListener";

import {PressableComponent} from "../models/ioobjects/PressableComponent";
import {Component} from "../models/ioobjects/Component";
import {IOObject} from "../models/ioobjects/IOObject";
import {InputPort} from "../models/ioobjects/InputPort";
import {SelectionPopupController} from "./SelectionPopupController";

export const MainDesignerController = (function() {
    let designer: CircuitDesigner;
    let view: MainDesignerView;
    let input: Input;

    let toolManager: ToolManager;
    let renderQueue: RenderQueue;

    const resize = function() {
        view.resize();

        MainDesignerController.Render();
    }

    const onMouseDown = function(button: number): void {
        if (toolManager.onMouseDown(input, button))
            MainDesignerController.Render();
    }

    const onMouseMove = function(): void {
        if (toolManager.onMouseMove(input))
            MainDesignerController.Render();
    }

    const onMouseDrag = function(button: number): void {
        if (toolManager.onMouseDrag(input, button)) {
            SelectionPopupController.Hide();
            MainDesignerController.Render();
        }
    }

    const onMouseUp = function(button: number): void {
        if (toolManager.onMouseUp(input, button)) {
            SelectionPopupController.Update();
            MainDesignerController.Render();
        }
    }

    const onClick = function(button: number): void {
        if (toolManager.onClick(input, button))
            MainDesignerController.Render();
    }

    const onKeyDown = function(key: number): void {
        if (toolManager.onKeyDown(input, key))
            MainDesignerController.Render();
    }

    const onKeyUp = function(key: number): void {
        if (toolManager.onKeyUp(input, key))
            MainDesignerController.Render();
    }

    const onScroll = function(): void {
        // @TODO move this stuff as well
        let zoomFactor = input.getZoomFactor();

        // Calculate position to zoom in/out of
        let pos0 = view.getCamera().getWorldPos(input.getMousePos());
        view.getCamera().zoomBy(zoomFactor);
        let pos1 = view.getCamera().getScreenPos(pos0);
        let dPos = pos1.sub(input.getMousePos());
        view.getCamera().translate(dPos.scale(view.getCamera().getZoom()));

        SelectionPopupController.Update();
        MainDesignerController.Render();
    }
    return {
        Init: function(): void {
            // pass Render function so that
            //  the circuit is redrawn every
            //  time its updated
            designer = new CircuitDesigner(1, () => this.Render());
            view = new MainDesignerView();

            // utils
            toolManager = new ToolManager(view.getCamera(), designer);
            renderQueue = new RenderQueue(() =>
                view.render(designer,
                            toolManager.getSelectionTool().getSelections(),
                            toolManager));

            // input
            input = new Input(view.getCanvas());
            input.addListener("click",     (b) => onClick(b));
            input.addListener("mousedown", (b) => onMouseDown(b));
            input.addListener("mousedrag", (b) => onMouseDrag(b));
            input.addListener("mousemove", ( ) => onMouseMove());
            input.addListener("mouseup",   (b) => onMouseUp(b));
            input.addListener("keydown",   (b) => onKeyDown(b));
            input.addListener("keyup",     (b) => onKeyUp(b));
            input.addListener("scroll", onScroll);

            window.addEventListener("resize", _e => resize(), false);

            toolManager.getSelectionTool().addSelectionChangeListener( () => SelectionPopupController.Update() );
        },
        Render: function(): void {
            renderQueue.render();
        },
        ClearSelections: function(): void {
            toolManager.getSelectionTool().clearSelections();
        },
        PlaceComponent: function(component: Component) {
            toolManager.placeComponent(component);
        },
        GetSelections: function(): Array<IOObject> {
            return toolManager.getSelectionTool().getSelections();
        },
        GetCanvas: function(): HTMLCanvasElement {
            return view.getCanvas();
        },
        GetCamera: function(): Camera {
            return view.getCamera();
        },
        GetDesigner: function(): CircuitDesigner {
            return designer;
        }
    };
})();
