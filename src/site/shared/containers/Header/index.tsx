//import {CircuitInfo} from "core/utils/CircuitInfo";

import {CircuitInfoHelpers} from "shared/utils/CircuitInfoHelpers";

//import {Utility} from "shared/containers/Header/Right/UtilitiesDropdown";

import {HeaderLeft}  from "./Left";
import {HeaderRight} from "./Right";


import "./index.scss";


type Props = {
    img: string;
    helpers: CircuitInfoHelpers;
/*     info: CircuitInfo;
    extraUtilities: Utility[]; */
    closeModal: CallableFunction;
}
export const Header = ({ closeModal, helpers/* , info, extraUtilities */ }: Props) => (

    <header id="header">
        <HeaderLeft helpers={helpers} closeModal={closeModal}/>

        <HeaderRight helpers={helpers} /* info={info} extraUtilities={extraUtilities} */ />
    </header>
);
