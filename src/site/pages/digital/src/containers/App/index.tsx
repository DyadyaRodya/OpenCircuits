import {useCallback, useState, useEffect} from "react";
import {Button} from "react-bulma-components";
import { createRoot } from 'react-dom/client';

//import {CircuitMetadataBuilder} from "core/models/CircuitMetadata";

import {DigitalCircuitInfo} from "digital/utils/DigitalCircuitInfo";

import {CircuitInfoHelpers} from "shared/utils/CircuitInfoHelpers";

import {useWindowSize} from "shared/utils/hooks/useWindowSize";

import {ContextMenu}               from "shared/containers/ContextMenu";
import {HistoryBox}                from "shared/containers/HistoryBox";
import {ImageExporterPopup,
        ImageExporterPreviewProps} from "shared/containers/ImageExporterPopup";
//import {LoginPopup}     from "shared/containers/LoginPopup";
import {SelectionPopup} from "shared/containers/SelectionPopup";
import {SideNav}        from "shared/containers/SideNav";

import {PropertyModule} from "shared/containers/SelectionPopup/modules/PropertyModule";

import {DigitalPaste} from "site/digital/utils/DigitalPaste";

import {DigitalHeader}          from "site/digital/containers/DigitalHeader";
import {DigitalItemNav}         from "site/digital/containers/DigitalItemNav";
//import {ExprToCircuitPopup}     from "site/digital/containers/ExprToCircuitPopup";
/* import {ICDesigner}             from "site/digital/containers/ICDesigner";
import {ICViewer}               from "site/digital/containers/ICViewer"; */
import {ImageExporterPreview}   from "site/digital/containers/ImageExporterPreview";
import {KeyboardShortcutsPopup} from "site/digital/containers/KeyboardShortcutsPopup";
import {MainDesigner}           from "site/digital/containers/MainDesigner";
import {QuickStartPopup}        from "site/digital/containers/QuickStartPopup";

import {BusButtonModule}                from "site/digital/containers/SelectionPopup/modules/BusButtonModule";
//import {ClockSyncButtonModule}          from "site/digital/containers/SelectionPopup/modules/ClockSyncButtonModule";
//import {ComparatorInputCountModule}     from "site/digital/containers/SelectionPopup/modules/ComparatorInputCountModule";
//import {CreateICButtonModule}           from "site/digital/containers/SelectionPopup/modules/CreateICButtonModule";
//import {DecoderInputCountModule}        from "site/digital/containers/SelectionPopup/modules/DecoderInputCountModule";
import {InputCountModule}               from "site/digital/containers/SelectionPopup/modules/InputCountModule";
//import {OscilloscopeModule}             from "site/digital/containers/SelectionPopup/modules/OscilloscopeModules";
//import {OutputCountModule}              from "site/digital/containers/SelectionPopup/modules/OutputCountModule";
import {ReplaceComponentDropdownModule} from "site/digital/containers/SelectionPopup/modules/ReplaceComponentDropdownModule";
import {SelectPortCountModule}          from "site/digital/containers/SelectionPopup/modules/SelectPortCountModule";
//import {ViewICButtonModule}             from "site/digital/containers/SelectionPopup/modules/ViewICButtonModule";

//import docsConfig    from "site/digital/data/docsUrlConfig.json";
//import exampleConfig from "site/digital/data/examples.json";

import "./index.scss";


/* const exampleCircuits = exampleConfig.examples.map((example) =>
    new CircuitMetadataBuilder()
        .withId(example.file)
        .withName(example.name)
        .withOwner("Example")
        .withDesc("Example Circuit")
        .withThumbnail(example.thumbnail)
        .build()
); */

type Props = {
    info: DigitalCircuitInfo;
    helpers: CircuitInfoHelpers;
    canvas: React.RefObject<HTMLCanvasElement>;
    inputField: any;
    buttonRootElement: HTMLElement;
}

export const App = ({ info, helpers, canvas, inputField, buttonRootElement }: Props) => {
    const { h, w } = useWindowSize();
    const imageExporterPreview = useCallback((props: ImageExporterPreviewProps) => (
        <ImageExporterPreview mainInfo={info} {...props} />
    ), [info]);
    const editor = (
        <div className="App">
            <SideNav helpers={helpers}
                    /* exampleCircuits={exampleCircuits} */ />

            <div className="App__container" style={{ height: h+"px" }}>
                <DigitalHeader img="/moodle-develop/question/type/digitalcircuit/img/icons/logo.svg"
                            helpers={helpers}
                            /* info={info}  */closeModal={() => saveAndClose()}/>

                <main>
                    <MainDesigner info={info} canvas={canvas} />

                    <DigitalItemNav info={info} />
                    <HistoryBox info={info} />

                    <SelectionPopup info={info}
                                    /* docsUrlConfig={docsConfig} */>
                        <PropertyModule info={info} />
                        <InputCountModule info={info} />
                        {/* <ComparatorInputCountModule info={info} /> */}
                        <SelectPortCountModule info={info} />
                        {/* <DecoderInputCountModule info={info} /> */}
                        {/* <OutputCountModule info={info} />
                        <OscilloscopeModule info={info} /> */}
                        {/* <ClockSyncButtonModule info={info} /> */}
                        <BusButtonModule info={info} />
                        <ReplaceComponentDropdownModule info={info} />
                        {/* <CreateICButtonModule info={info} />
                        <ViewICButtonModule info={info} /> */}
                    </SelectionPopup>

                    <ContextMenu info={info}
                                paste={(data, menuPos) => DigitalPaste(data, info, menuPos)} />
                </main>
            </div>

            {/* <ICDesigner mainInfo={info} />
            <ICViewer mainInfo={info} /> */}

            <QuickStartPopup />
            <KeyboardShortcutsPopup />
            {/* <ImageExporterPopup preview={imageExporterPreview} /> */}

            {/* <ExprToCircuitPopup mainInfo={info} /> */}

            {/* <LoginPopup /> */}
        </div>
        );
    
    const openEditorButton = (<Button id="openModal" name="openModal" type="button" color={"info"} onClick={() => {
        const pageStyle = document.getElementById("page-wrapper")?.style;
        if (pageStyle) pageStyle.display = 'none';
        setShowModal(true);
        }}>Open Editor</Button>);

    const buttonRoot = createRoot(buttonRootElement);
    useEffect(()=>buttonRoot.render(openEditorButton),[]);

    const [showModal, setShowModal] = useState(false);
    // Memoize for eslint(react/no-unstable-nested-components)
    

    function saveAndClose() {
        inputField.value = helpers.GetSerializedCircuit();
        setShowModal(false);
        const pageStyle = document.getElementById("page-wrapper")?.style;
        if (pageStyle) pageStyle.display = '';
    };
    
    return (
        <div>
            {showModal? <div style={{width:w, height: h, position: 'absolute'}} >{editor}</div> : ""}             
        </div>
    );
};
