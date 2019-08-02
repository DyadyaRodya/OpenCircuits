import {MainDesignerController} from "./MainDesignerController";
import {ItemNavController} from "./ItemNavController";
import {RemoteCircuitController} from "./RemoteCircuitController";
import {Importer} from "../utils/io/Importer";

export const SideNavController = (() => {
    const tab = document.getElementById("header-sidenav-open-tab");
    const sidenav = document.getElementById("sidenav");

    const sidenavModeCheckbox = <HTMLInputElement>document.getElementById("sidenav-mode-checkbox");

    const overlay = document.getElementById("overlay");

    const context = document.getElementById("content");

    let isOpen = false;
    let disabled = false;

    let editMode = true;

    const toggleEditMode = function(): void {
        editMode = !editMode;

        MainDesignerController.SetEditMode(!editMode);

        // Toggle ItemNavController
        if (ItemNavController.IsOpen())
            ItemNavController.Toggle();

        // Disable or re-enable ItemNavController
        if (editMode)
            ItemNavController.Enable();
        else
            ItemNavController.Disable();

        // Toggle SideNavController if entering play mode
        if (SideNavController.IsOpen() && !editMode)
            SideNavController.Toggle();
    }

    const toggle = function(): void {
        sidenav.classList.toggle("shrink");
        overlay.classList.toggle("invisible");
        context.classList.toggle("sidenav__shift");
    }

    // Callback
    const loadExampleCircuit = function(id: string): Promise<void> {
        return RemoteCircuitController.LoadExampleCircuit(id)
            .then((contents) => {
                Importer.read(MainDesignerController.GetDesigner(), contents);
            });
    }

    return {
        Init: function(): Promise<number> {
            isOpen = false;

            tab.onclick = () => { SideNavController.Toggle(); };

            sidenavModeCheckbox.onchange = () => { toggleEditMode() };

            overlay.addEventListener("click", () => {
                if (SideNavController.IsOpen())
                    SideNavController.Toggle();
            });

            return RemoteCircuitController.LoadExampleCircuitList()
                     .then((names: string[]) => {
                        // TODO: Render this list of names into the side-bar
                    })
                    .then(() => 1)
        },
        Toggle: function(): void {
            if (disabled)
                return;

            isOpen = !isOpen;
            toggle();
        },
        IsOpen: function(): boolean {
            return isOpen;
        },
        Enable: function(): void {
            disabled = false;
        },
        Disable: function(): void {
            disabled = true;
        }
    }

})();
