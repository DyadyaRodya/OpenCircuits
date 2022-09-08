import {GetHelpers} from "test/helpers/Helpers";

import {SelectionsWrapper} from "core/utils/SelectionsWrapper";

import {GroupAction} from "core/actions/GroupAction";

import {ConnectionAction} from "core/actions/addition/ConnectionAction";

import {CreateICDataAction}                  from "digital/actions/CreateICDataAction";
import {CreateReplaceDigitalComponentAction} from "digital/actions/ReplaceDigitalComponentActionFactory";

import {InputPortChangeAction} from "digital/actions/ports/InputPortChangeAction";

import {DigitalCircuitDesigner} from "digital/models";

import {ANDGate, Button, IC, ICData, LED,
        Multiplexer, ORGate, SRLatch, Switch, XORGate} from "digital/models/ioobjects";


describe("CreateReplaceDigitalComponentAction", () => {
    const designer = new DigitalCircuitDesigner(0);
    const { Place, Connect } = GetHelpers(designer);

    afterEach(() => {
        designer.reset();
    });

    test("ANDGate -> ORGate", () => {
        const [a, b, and, out] = Place(new Switch(), new Switch(), new ANDGate(), new LED());
        const or = { id: "ORGate" };

        Connect(a, 0, and, 0);
        Connect(b, 0, and, 1);
        Connect(and, 0, out, 0);

        // Initial
        expect(out.isOn()).toBeFalsy();
        a.activate(true);
        expect(out.isOn()).toBeFalsy();
        b.activate(true);
        expect(out.isOn()).toBeTruthy();
        a.activate(false);
        expect(out.isOn()).toBeFalsy();
        b.activate(false);
        expect(out.isOn()).toBeFalsy();

        // Replaced
        const [action, orGate] = CreateReplaceDigitalComponentAction(designer, and, or);
        action;
        expect(and.getDesigner()).toBeUndefined();
        expect(orGate.getDesigner()).toBeDefined();
        expect(designer.getObjects().includes(orGate)).toBeTruthy();
        expect(out.isOn()).toBeFalsy();
        a.activate(true);
        expect(out.isOn()).toBeTruthy();
        b.activate(true);
        expect(out.isOn()).toBeTruthy();
        a.activate(false);
        expect(out.isOn()).toBeTruthy();
        b.activate(false);
        expect(out.isOn()).toBeFalsy();

        // Undo
        action.undo();
        expect(and.getDesigner()).toBe(designer);
        expect(designer.getObjects().some((component) => (component instanceof ORGate))).toBeFalsy();
        expect(out.isOn()).toBeFalsy();
        a.activate(true);
        expect(out.isOn()).toBeFalsy();
        b.activate(true);
        expect(out.isOn()).toBeTruthy();
        a.activate(false);
        expect(out.isOn()).toBeFalsy();
        b.activate(false);
        expect(out.isOn()).toBeFalsy();
    });

    test("ANDGate -> ORGate (special name)", () => {
        const [a, b, and, out] = Place(new Switch(), new Switch(), new ANDGate(), new LED());
        const or = { id: "ORGate" };

        Connect(a, 0, and, 0);
        Connect(b, 0, and, 1);
        Connect(and, 0, out, 0);

        and.setName("My favorite gate");

        // Replaced
        const [action, orGate] = CreateReplaceDigitalComponentAction(designer, and, or);
        action;
        expect(orGate.getName()).toBe("My favorite gate");
    });

    test("ANDGate -> Switch", () => {
        const [and, out1, out2] = Place(new ANDGate(), new LED(), new LED());
        const a = { id: "Switch" };

        Connect(and, 0, out1, 0);
        Connect(and, 0, out2, 0);

        // Initial
        expect(out1.isOn()).toBeFalsy();
        expect(out2.isOn()).toBeFalsy();

        // Replaced
        const [action, switchA] = CreateReplaceDigitalComponentAction(designer, and, a);
        action;
        expect(out1.isOn()).toBeFalsy();
        expect(out2.isOn()).toBeFalsy();
        expect(switchA).toBeDefined();
        switchA.activate(true);
        expect(out1.isOn()).toBeTruthy();
        expect(out2.isOn()).toBeTruthy();
        switchA.activate(false);
        expect(out1.isOn()).toBeFalsy();
        expect(out2.isOn()).toBeFalsy();
    });

    test("XORGate -> NOTGate", () => {
        const [a, xor, out] = Place(new Switch(), new XORGate(), new LED());
        const not = { id: "NOTGate" };

        Connect(a, 0, xor, 0);
        Connect(xor, 0, out, 0);

        // Initial
        expect(out.isOn()).toBeFalsy();
        a.activate(true);
        expect(out.isOn()).toBeTruthy();
        a.activate(false);
        expect(out.isOn()).toBeFalsy();

        // Replaced
        const [action] = CreateReplaceDigitalComponentAction(designer, xor, not);
        action;
        expect(out.isOn()).toBeTruthy();
        a.activate(true);
        expect(out.isOn()).toBeFalsy();
        a.activate(false);
        expect(out.isOn()).toBeTruthy();
    });

    test("Switch -> XORGate", () => {
        const [a, b, c, out1, out2] = Place(new Switch(), new Switch(), new Switch(), new LED(), new LED());
        const xor = { id: "XORGate" };
        Connect(a, 0, out1, 0);
        Connect(a, 0, out2, 0);

        // Initial
        expect(out1.isOn()).toBeFalsy();
        expect(out2.isOn()).toBeFalsy();
        a.activate(true);
        expect(out1.isOn()).toBeTruthy();
        expect(out2.isOn()).toBeTruthy();
        a.activate(false);
        expect(out1.isOn()).toBeFalsy();
        expect(out2.isOn()).toBeFalsy();

        // Replaced
        const [action, xorGate] = CreateReplaceDigitalComponentAction(designer, a, xor);
        action;
        Connect(b, 0, xorGate, 0);
        Connect(c, 0, xorGate, 1);

        expect(out1.isOn()).toBeFalsy();
        expect(out2.isOn()).toBeFalsy();
        b.activate(true);
        expect(out1.isOn()).toBeTruthy();
        expect(out2.isOn()).toBeTruthy();
        c.activate(true);
        expect(out1.isOn()).toBeFalsy();
        expect(out2.isOn()).toBeFalsy();
        b.activate(false);
        expect(out1.isOn()).toBeTruthy();
        expect(out2.isOn()).toBeTruthy();
        c.activate(false);
        expect(out1.isOn()).toBeFalsy();
        expect(out2.isOn()).toBeFalsy();
    });

    test("Multiplexer -> ANDGate", () => {
        const [mux, in0, in1,
               in2, in3, out] = Place(new Multiplexer(), new Switch(), new Switch(),
                                      new Switch(), new Switch(), new LED());
        const and = { id: "ANDGate", amt: 4 };
        Connect(in0, 0, mux, 0);
        Connect(in1, 0, mux, 1);
        Connect(in2, 0, mux, 2);
        Connect(in3, 0, mux, 3);
        Connect(mux, 0, out, 0);

        const [action] = CreateReplaceDigitalComponentAction(designer, mux, and);
        action;

        // Modified
        expect(out.isOn()).toBeFalsy();
        in0.activate(true);
        expect(out.isOn()).toBeFalsy();
        in1.activate(true);
        expect(out.isOn()).toBeFalsy();
        in2.activate(true);
        expect(out.isOn()).toBeFalsy();
        in3.activate(true);
        expect(out.isOn()).toBeTruthy();
    });

    test("Multiplexer -> Demultiplexer", () => {
        const [mux, in0, in1, out] = Place(new Multiplexer(), new Switch(), new Switch(), new LED());
        const demux = { id: "Demultiplexer" };
        Connect(in0, 0, mux, 0);
        new ConnectionAction(mux.getDesigner()!, in1.getOutputPort(0), mux.getSelectPorts()[0]);
        Connect(mux, 0, out, 0);

        const [action, demuxComp] = CreateReplaceDigitalComponentAction(designer, mux, demux);
        action;

        expect(demuxComp.getDesigner()).toBeDefined();
    });

    test("ANDGate -> Multiplexer", () => {
        const [in1, in2, in3, and, out] = Place(new Switch(), new Switch(), new Switch(), new ANDGate(), new LED());
        const mux = { id: "Multiplexer" };
        new InputPortChangeAction(and, 2, 3);
        Connect(in1, 0, and, 0);
        Connect(in2, 0, and, 1);
        Connect(in3, 0, and, 2);
        Connect(and, 0, out, 0);

        // Initial
        expect(out.isOn()).toBeFalsy();
        in1.activate(true);
        expect(out.isOn()).toBeFalsy();
        in2.activate(true);
        expect(out.isOn()).toBeFalsy();
        in3.activate(true);
        expect(out.isOn()).toBeTruthy();
        in1.activate(false);
        in2.activate(false);
        in3.activate(false);

        const [action, muxComponent] = CreateReplaceDigitalComponentAction(designer, and, mux);
        action;

        // Replaced
        expect(muxComponent).toBeDefined();
        expect(in1.getOutputs()[0].getOutputComponent()).toBe(muxComponent);
        expect(in2.getOutputs()[0].getOutputComponent()).toBe(muxComponent);
        expect(in3.getOutputs()[0].getOutputComponent()).toBe(muxComponent);
        expect(out.getInputs()[0].getInputComponent()).toBe(muxComponent);
        const muxInputs = muxComponent.getInputs().map((wire) => wire.getInputComponent());
        expect(muxInputs).toEqual(expect.arrayContaining([in1, in2, in3]));
        expect(muxComponent.getOutputs()[0].getOutputComponent()).toBe(out);
    });

    test("IC -> ANDGate", () => {
        const [a, b, or, out] = Place(new Switch(), new Switch(), new ORGate(), new LED());
        const and = { id: "ANDGate" };
        Connect(a, 0, or, 0);
        Connect(b, 0, or, 1);
        Connect(or, 0, out, 0);
        const data = ICData.Create([a, b, or, out])!;
        expect(data).toBeDefined();
        new CreateICDataAction(data, designer);

        const [ic, d, e, outer] = Place(new IC(data), new Switch(), new Switch(), new LED());
        Connect(d, 0, ic, 0);
        Connect(e, 0, ic, 1);
        Connect(ic, 0, outer, 0);

        const [action, andComponent] = CreateReplaceDigitalComponentAction(designer, ic, and);
        action;

        expect(d.getOutputs()[0].getOutputComponent()).toBe(andComponent);
        expect(e.getOutputs()[0].getOutputComponent()).toBe(andComponent);
        expect(outer.getInputs()[0].getInputComponent()).toBe(andComponent);
        const andInputs = andComponent.getInputs().map((wire) => wire.getInputComponent());
        expect(andInputs).toEqual(expect.arrayContaining([d, e]));
        expect(andComponent.getOutputs()[0].getOutputComponent()).toBe(outer);
    });

    test("ANDGate -> IC", () => {
        const [a, b, or, out, and] = Place(new Switch(), new Switch(), new ORGate(), new LED(), new ANDGate());
        Connect(a, 0, or, 0);
        Connect(b, 0, or, 1);
        Connect(or, 0, out, 0);
        const data = ICData.Create([a, b, or, out])!;
        expect(data).toBeDefined();
        new CreateICDataAction(data, designer);

        const [d, e, outer] = Place(new Switch(), new Switch(), new LED());
        Connect(d, 0, and, 0);
        Connect(e, 0, and, 1);
        Connect(and, 0, outer, 0);

        const [action, ic] = CreateReplaceDigitalComponentAction(designer, and, { id: "ic/0" });
        action;

        expect(d.getOutputs()[0].getOutputComponent()).toBe(ic);
        expect(e.getOutputs()[0].getOutputComponent()).toBe(ic);
        expect(outer.getInputs()[0].getInputComponent()).toBe(ic);
        const icInputs = ic.getInputs().map((wire) => wire.getInputComponent());
        expect(icInputs).toEqual(expect.arrayContaining([d, e]));
        expect(ic.getOutputs()[0].getOutputComponent()).toBe(outer);
    });

    test("Switch -> Button -> Clock", () => {
        const [a, out] = Place(new Switch(), new LED());
        const button = { id: "Button" };
        const clock = { id: "Clock" };

        Connect(a, 0, out, 0);

        expect(out.isOn()).toBeFalsy();
        a.click();
        expect(out.isOn()).toBeTruthy();
        a.click();
        expect(out.isOn()).toBeFalsy();

        const [action, buttonComponent] = CreateReplaceDigitalComponentAction(designer, a, button) as
                                          [GroupAction, Button];
        action;

        expect(a.getDesigner()).toBeUndefined();
        expect(buttonComponent.getDesigner()).toBe(designer);
        expect(out.isOn()).toBeFalsy();
        buttonComponent.press();
        expect(out.isOn()).toBeTruthy();
        buttonComponent.release();
        expect(out.isOn()).toBeFalsy();

        const [action2, clockComponent] = CreateReplaceDigitalComponentAction(designer, buttonComponent, clock);
        action2;

        expect(buttonComponent.getDesigner()).toBeUndefined();
        expect(clockComponent).toBeDefined();
        expect(clockComponent.getDesigner()).toBe(designer);
    });

    test("Update selection", () => {
        const selections = new SelectionsWrapper();
        const [a, out] = Place(new Switch(), new LED());
        const button = { id: "Button" };

        Connect(a, 0, out, 0);

        selections.select(a);
        const [action, buttonComponent] = CreateReplaceDigitalComponentAction(designer, a, button, selections);
        action;

        expect(buttonComponent).toBeDefined();
        expect(selections.has(buttonComponent)).toBeTruthy();
        expect(selections.has(a)).toBeFalsy();
    });

    describe("Invalid", () => {
        test("ANDGate -> Switch", () => {
            const [a, and] = Place(new Switch(), new ANDGate());
            const b = { id: "Switch" };
            Connect(a, 0, and, 0);
            expect(() => CreateReplaceDigitalComponentAction(designer, and, b)).toThrow();
        });

        test("SRLatch -> ANDGate", () => {
            const [sr, out1, out2] = Place(new SRLatch(), new LED(), new LED());
            const and = { id: "ANDGate" };
            Connect(sr, 0, out1, 0);
            Connect(sr, 1, out2, 0);
            expect(() => CreateReplaceDigitalComponentAction(designer, sr, and)).toThrow();
        });

        test("Original not in designer", () => {
            const orig = new ANDGate();
            const replacement = { id: "ORGate" };

            expect(() => CreateReplaceDigitalComponentAction(designer, orig, replacement)).toThrow();
        });

        test("Replacement is invalid", () => {
            const [orig] = Place(new ANDGate());
            const replacement = { id: "Invalid component id" };

            expect(() => CreateReplaceDigitalComponentAction(designer, orig, replacement)).toThrow();
        });
    });
});
