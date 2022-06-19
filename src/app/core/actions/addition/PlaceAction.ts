import {Action} from "core/actions/Action";

import {CircuitDesigner} from "core/models/CircuitDesigner";
import {Component}       from "core/models/Component";

import {GroupAction}      from "../GroupAction";
import {ReversableAction} from "../ReversableAction";


/**
 * PlaceAction represents the action of placing a new Component into the CircuitDesigner.
 */
export class PlaceAction extends ReversableAction {
    private designer: CircuitDesigner;
    private obj: Component;

    /**
     * Initializes a PlaceAction given the CircuitDesigner, Component, and a flip boolean.
     *
     * @param designer The CircuitDesigner this action is done on.
     * @param obj The Component being placed.
     * @param flip The flip boolean, false for a PlaceAction, true for a DeleteAction.
     */
    public constructor(designer: CircuitDesigner, obj: Component, flip = false) {
        super(flip);

        this.designer = designer;
        this.obj = obj;
    }

    /**
     * Executes a PlaceAction by adding the object to the designer.
     *
     * @returns 'this' PlaceAction after execution.
     */
    public normalExecute(): Action {
        this.designer.addObject(this.obj);

        return this;
    }

    /**
     * Undoes a PlaceAction by removing the object from the designer.
     *
     * @returns 'this' PlaceAction after undoing.
     */
    public normalUndo(): Action {
        this.designer.removeObject(this.obj);

        return this;
    }

    public getName(): string {
        return `Placed ${this.obj.getName()}`;
    }

}

/**
 * The DeleteAction represents the action of deleting a Component
 * from a CircuitDesigner. The DeleteAction is the reverse of a PlaceAction.
 */
export class DeleteAction extends PlaceAction {
    public constructor(designer: CircuitDesigner, obj: Component) {
        super(designer, obj, true);
    }
}

/**
 * Creates a GroupAction for multiple PlaceActions.
 *
 * @param designer The CircuitDesigner the actions are being done on.
 * @param objs The Components of each action.
 * @returns A GroupAction representing the PlaceActions of every Component.
 */
export function CreateGroupPlaceAction(designer: CircuitDesigner, objs: Component[]): GroupAction {
    return new GroupAction(objs.map(o => new PlaceAction(designer, o)), "Group Place Action");
}
