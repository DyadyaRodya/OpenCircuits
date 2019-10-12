import {DEFAULT_SIZE} from "digital/utils/Constants";

import {V} from "Vector";
import {ClampedValue} from "math/ClampedValue";

import {InputPort} from "../../ports/InputPort";
import {OutputPort} from "../../ports/OutputPort";
import {InputPortSet} from "../../ports/PortSets";
import {Positioner} from "../../ports/positioners/Positioner";
import {MuxSelectPositioner} from "../../ports/positioners/MuxPositioners";

import {Component} from "../Component";

export abstract class Mux extends Component {
    protected selects: InputPortSet;

    public constructor(inputPortCount: ClampedValue, outputPortCount: ClampedValue,
                       inputPositioner?: Positioner<InputPort>, outputPositioner?: Positioner<OutputPort>, selectPortCount?: number) {
        super(inputPortCount, outputPortCount, V(DEFAULT_SIZE+10, 2*DEFAULT_SIZE), inputPositioner, outputPositioner);

        this.selects = new InputPortSet(this, new ClampedValue(2, 1, 8), new MuxSelectPositioner());

        if(selectPortCount != null)
          this.setSelectPortCount(selectPortCount);
        else
          this.setSelectPortCount(2);
    }

    public setSelectPortCount(val: number): void {
        // Calculate size
        const width = Math.max(DEFAULT_SIZE/2*(val-1), DEFAULT_SIZE);
        const height = DEFAULT_SIZE/2*Math.pow(2, val);
        this.transform.setSize(V(width+10, height));

        this.selects.setPortCount(val);
    }

    public getSelectPorts(): Array<InputPort> {
        return this.selects.getPorts();
    }

    public getSelectPortCount(): ClampedValue {
        return this.selects.getCount();
    }

    public numSelects(): number {
        return this.selects.length;
    }

    // @Override
    public getInputPorts(): Array<InputPort> {
        return super.getInputPorts().concat(this.selects.getPorts());
    }

}
