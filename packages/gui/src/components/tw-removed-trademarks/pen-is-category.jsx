import React from 'react';
import {FormattedMessage} from 'react-intl';
import styles from './removed-trademarks.css';

const RemovedTrademarks = () => (
    <div className={styles.removedTrademarks}>
        <FormattedMessage
            // eslint-disable-next-line max-len
            defaultMessage="Looking for the Pen extension? It has been moved to the main toolbox."
            // eslint-disable-next-line max-len
            description="Appears at the bottom of the builtin 'Choose a Extension' library."
            id="amp.penExtensionMoved"
        />
    </div>
);

export default RemovedTrademarks;
