import React from "react";
import { FormattedMessage } from "react-intl";
import styles from "./no-face-sensing.css";
import { APP_NAME } from "@ampmod/branding";

const NoFaceSensing = () => (
    <div className={styles.removedTrademarks}>
        <FormattedMessage
            // eslint-disable-next-line max-len
            defaultMessage="{APP_NAME} predates the Face Sensing extension and is currently attempting to resolve legal ambiguity related to the GNU Affero General Public Licence. As a result, it is currently not listed."
            // eslint-disable-next-line max-len
            description="Appears at the bottom of the builtin 'Choose an Extension' library, explaining how AmpMod was created before Face Sensing was added to Scratch."
            id="amp.noFaceSensing"
            values={{ APP_NAME }}
        />
    </div>
);

export default NoFaceSensing;
