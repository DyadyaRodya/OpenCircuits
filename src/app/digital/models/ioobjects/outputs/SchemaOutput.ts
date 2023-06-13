import { serializable } from "serialeazy";
import { V } from "Vector";
import { ClampedValue } from "math/ClampedValue";
import { DigitalComponent } from "digital/models/DigitalComponent";
import {GenPropInfo} from "core/utils/PropInfoUtils";

const [Info, InitialProps] = GenPropInfo({
    infos: {
        "color": {
            type:    "color",
            label:   "Color",
            initial: "#ffffff",
        },
        "textColor": {
            type:    "color",
            label:   "Text Color",
            initial: "#000000",
        },
    },
});

@serializable("SchemaOutput")
export class SchemaOutput extends DigitalComponent {
    public constructor() {
        super(
            new ClampedValue(1),
            new ClampedValue(0),
            V(1.2, 0.6), undefined, undefined,
            InitialProps
        );
    }

    public override getPropInfo(key: string) {
        return Info[key] ?? super.getPropInfo(key);
    }

    public override getDisplayName(): string {
        return "SchemaOutput";
    }
}
