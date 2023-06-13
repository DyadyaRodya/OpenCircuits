/* eslint-disable key-spacing */
import {Circuit, ContentsData} from "core/models/Circuit";

import {DigitalCircuitDesigner} from "digital/models";

import {/* Button, */ IC/* , Switch */} from "digital/models/ioobjects";


interface SerializationEntry {
    type: string;
    data: Record<string, unknown>;
}

type Ref = { ref: string };
function isRef(o: unknown): o is Ref {
    if (!o || typeof o !== "object")
        return false;
    return ("ref" in o);
}

export function VersionConflictResolver(fileContents: string | Circuit): string {
    const metadata = {
        "id":"",
        "name":"",
        "owner":"",
        "desc":"",
        "thumbnail":"data:image/png;base64,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",
        "version":"3.2"
      };
    const circuit = (typeof(fileContents) === "string" ? {metadata: metadata, ...JSON.parse(fileContents)} as Circuit : fileContents);

    const v = parseFloat(circuit.metadata.version);

    const contents = JSON.parse(circuit.contents) as Record<string, SerializationEntry>;

    if (v < 2.1) {
        const transformations: Record<string, Array<{ports: string, positioner: string}>> = {
            "Multiplexer":    [{ ports: "inputs",  positioner: "ConstantSpacePositioner" },
                               { ports: "outputs", positioner: "Positioner" }],
            "Demultiplexer":  [{ ports: "outputs", positioner: "ConstantSpacePositioner" },
                               { ports: "inputs",  positioner: "Positioner" }],
            "ANDGate":        [{ ports: "inputs",  positioner: "Positioner" }],
            "NANDGate":       [{ ports: "inputs",  positioner: "Positioner" }],
            "SegmentDisplay": [{ ports: "inputs",  positioner: "ConstantSpacePositioner" }],
            "SRFlipFlop":     [{ ports: "inputs",  positioner: "FlipFlopPositioner" }],
            "JKFlipFlop":     [{ ports: "inputs",  positioner: "FlipFlopPositioner" }],
            "SRLatch":        [{ ports: "inputs",  positioner: "Positioner" }],
        };

        Object.values(contents).forEach(({ type, data }) => {
            const transformation = transformations[type] ?? [];
            // Replace positioners
            transformation.forEach(({ ports, positioner: type }) => {
                // Get PortSet from (inputs/outputs) of Component
                const set = contents[(data[ports] as Ref)["ref"]];
                const positionerRef = (set.data["positioner"] as Ref)["ref"]; // Get positioner ID from PortSet

                contents[positionerRef] = { "type": type, "data": {} };
            });
        });
    }

    // Migrate from old property system to new "props" property system
    //  https://github.com/OpenCircuits/OpenCircuits/pull/1087
    if (v < 3.1) {
        // Represents the transformation of property keys by object type,
        //  `newKey` is assumed to be part of the object's `props` struct
        const transformations = {
            "Clock": [
                { prevKey: "frequency", newKey: "delay",  defaultVal: 0 },
                { prevKey: "paused",    newKey: "paused", defaultVal: 0 },
            ],
            "ConstantNumber": [
                { prevKey: "inputNum", newKey: "inputNum", defaultVal: 0 },
            ],
            "DigitalWire": [
                { prevKey: "color", newKey: "color", defaultVal: "#ffffff" },
            ],
            "Label": [
                { prevKey: "color",     newKey: "color",     defaultVal: "#ffffff"  },
                { prevKey: "textColor", newKey: "textColor", defaultVal: "#000000" },
            ],
            "SchemaInput": [
                { prevKey: "color",     newKey: "color",     defaultVal: "#ffffff"  },
                { prevKey: "textColor", newKey: "textColor", defaultVal: "#000000" },
            ],
            "SchemaOutput": [
                { prevKey: "color",     newKey: "color",     defaultVal: "#ffffff"  },
                { prevKey: "textColor", newKey: "textColor", defaultVal: "#000000" },
            ],
            "LED": [
                { prevKey: "color", newKey: "color", defaultVal: "#ffffff" },
            ],
            "Oscilloscope": [
                { prevKey: "frequency",   newKey: "delay"      , defaultVal: 0     },
                { prevKey: "paused",      newKey: "paused"     , defaultVal: false },
                { prevKey: "numSamples",  newKey: "samples"    , defaultVal: 100   },
                { prevKey: "displaySize", newKey: "displaySize"                    },
            ],
        } as Record<string, Array<{ prevKey: string, newKey: string, defaultVal?: unknown }>>;

        Object.values(contents).forEach(({ type, data }) => {
            const transformation = transformations[type] ?? [];

            if (transformation.length === 0)
                return;

            // Add props with all the new properties
            data["props"] = {
                type: "",
                data: Object.fromEntries(
                    transformation.map(({ prevKey, newKey, defaultVal }) =>
                        [newKey, (data[prevKey] ?? defaultVal)]
                    )
                ),
            };

            // Remove old properties
            transformation.forEach(({ prevKey }) => (delete data[prevKey]));
        });
    }

    // Migrate transforms to Prop system and camera attributes to Props
    if (v < 3.2) {
        // Utility func to get vector data through a ref or directly
        const getEntry = (parent: SerializationEntry, key: string) => {
            const v = parent["data"][key];
            if (!v)
                return;
            if (isRef(v))
                return contents[v["ref"]];
            return v as SerializationEntry;
        }

        Object.values(contents).forEach((entry) => {
            const t = getEntry(entry, "transform");
            if (!t)
                return;

            entry.data["props"] = {
                type: "",
                data: {
                    ...(entry.data["props"] as SerializationEntry ?? ({ data: {} }))["data"],
                    pos: getEntry(t, "pos")!,
                    size: getEntry(t, "size")!,
                    angle: t["data"]["angle"],
                },
            };
            delete entry.data["transform"];
        });

        // Get camera info
        const cam = getEntry(contents["0"], "camera")!;
        const pos = getEntry(cam, "pos");
        const zoom = cam["data"]["zoom"] as number;
        cam.data["props"] = {
            type: "",
            data: { pos, zoom },
        };
    }

    circuit.contents = JSON.stringify(contents);
    return JSON.stringify(circuit);
}

export function VersionConflictPostResolver(version: string, data: ContentsData) {
    const v = parseFloat(version);

    const designer = data.designer as DigitalCircuitDesigner;

    if (v < 3) {
        // Fix issue where old ICs don't have the properly separated 'collections' so need to sort them out
        designer.getObjects().filter((o) => o instanceof IC).forEach((ic: IC) => {
            const INPUT_WHITELIST: Array<any> = [/* Switch, Button */];

            const c = ic["collection"];
            const inputs = c["inputs"];
            const others = c["others"];

            const wrongInputs = inputs.filter((i) => !INPUT_WHITELIST.some((type) => i instanceof type));
            wrongInputs.forEach((i) => {
                // Remove from `inputs` and push into `others`
                inputs.splice(inputs.indexOf(i), 1);
                others.push(i);
            });
        });
    }
}
