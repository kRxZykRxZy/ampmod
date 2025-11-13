import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import styles from './monitor.css';
import { Virtuoso } from 'react-virtuoso';

class ListMonitorScroller extends React.Component {
    handleEventFactory = (index) => () => {
        this.props.onActivate(index);
    };

    renderItem = (index) => {
        const value = this.props.values[index];
        const isNestedList = Array.isArray(value);
        const { draggable, activeIndex, activeValue, categoryColor, onDeactivate, onInput, onFocus, onKeyPress, onRemove } = this.props;

        return (
            <div className={styles.listRow}>
                <div className={styles.listIndex}>{index + 1}</div>
                <div
                    className={styles.listValue}
                    data-index={index}
                    style={{ background: categoryColor.background, color: categoryColor.text }}
                    onClick={draggable ? this.handleEventFactory(index) : undefined}
                >
                    {draggable && activeIndex === index ? (
                        <div className={styles.inputWrapper}>
                            <input
                                autoFocus
                                autoComplete="off"
                                className={classNames(styles.listInput, 'no-drag', isNestedList ? styles.nestedListInput : null)}
                                spellCheck={false}
                                style={{ color: categoryColor.text }}
                                type="text"
                                value={isNestedList ? 'nested array' : activeValue}
                                onBlur={onDeactivate}
                                onChange={onInput}
                                onFocus={onFocus}
                                onKeyDown={onKeyPress}
                                readOnly={isNestedList}
                            />
                            <div className={styles.removeButton} onMouseDown={onRemove}>
                                {'✖︎'}
                            </div>
                        </div>
                    ) : (
                        <div className={styles.valueInner}>
                            {isNestedList ? <i>nested array</i> : value}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    renderEmpty = () => (
        <div className={classNames(styles.listRow, styles.listEmpty)}>
            <FormattedMessage
                defaultMessage="(empty)"
                description="Text shown on a list monitor when a list is empty"
                id="gui.monitor.listMonitor.empty"
            />
        </div>
    );

    render() {
        const { height, values, width, activeIndex } = this.props;

        return (
            <Virtuoso
                style={{ height: height - 42, width }}
                totalCount={values.length}
                itemContent={(index) => this.renderItem(index)}
                components={{
                    EmptyPlaceholder: this.renderEmpty,
                }}
                followOutput={activeIndex !== null ? 'smooth' : false} // auto-scroll to activeIndex
            />
        );
    }
}

ListMonitorScroller.propTypes = {
    activeIndex: PropTypes.number,
    activeValue: PropTypes.string,
    categoryColor: PropTypes.shape({
        background: PropTypes.string.isRequired,
        text: PropTypes.string.isRequired
    }).isRequired,
    draggable: PropTypes.bool,
    height: PropTypes.number,
    onActivate: PropTypes.func,
    onDeactivate: PropTypes.func,
    onFocus: PropTypes.func,
    onInput: PropTypes.func,
    onKeyPress: PropTypes.func,
    onRemove: PropTypes.func,
    values: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.array
        ])
    ),
    width: PropTypes.number
};

export default ListMonitorScroller;
