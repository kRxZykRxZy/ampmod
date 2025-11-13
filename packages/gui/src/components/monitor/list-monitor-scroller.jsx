import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { FormattedMessage } from 'react-intl';

import styles from './monitor.css';
import { Virtuoso } from 'react-virtuoso';
import { darken } from 'polished';

class ListMonitorScroller extends React.Component {
    handleEventFactory = (index) => () => {
        this.props.onActivate(index);
    };

    renderItem = (index) => {
        const value = this.props.values[index];
        const { draggable, activeIndex, activeValue, categoryColor, onDeactivate, onInput, onFocus, onKeyPress, onRemove, width } = this.props;

        // Check if this is a uniform 2D array (table)
        const is2DArray = Array.isArray(value) && value.every(Array.isArray);

        // Single nested array
        const isNestedList = Array.isArray(value) && !is2DArray;

        return (
            <div className={styles.listRow}>
                <div className={styles.listIndex}>{index + 1}</div>
                <div
                    className={styles.listValue}
                    data-index={index}
                    style={{ background: categoryColor.background, color: categoryColor.text }}
                    // onClick={draggable ? this.handleEventFactory(index) : undefined}
                >
                    {draggable && activeIndex === index && !isNestedList && !is2DArray ? (
                        <div className={styles.inputWrapper}>
                            <input
                                autoFocus
                                autoComplete="off"
                                className={classNames(styles.listInput, 'no-drag')}
                                spellCheck={false}
                                style={{ color: categoryColor.text }}
                                type="text"
                                value={activeValue}
                                onBlur={onDeactivate}
                                onChange={onInput}
                                onFocus={onFocus}
                                onKeyDown={onKeyPress}
                            />
                            <div className={styles.removeButton} onMouseDown={onRemove}>
                                {'✖︎'}
                            </div>
                        </div>
                    ) : is2DArray ? (
                        <div style={{ overflowX: 'auto', margin: '4px 0' }}>
                            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                                <tbody>
                                    {value.map((row, rIdx) => (
                                        <tr key={rIdx}>
                                            {row.map((cell, cIdx) => (
                                                <td
                                                    key={cIdx}
                                                    style={{
                                                        border: '1px solid #ccc',
                                                        padding: '4px 8px',
                                                        background: darken(0.05, categoryColor.background),
                                                        color: categoryColor.text
                                                    }}
                                                >
                                                    {cell}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : isNestedList ? (
                        <div style={{ height: Math.min(150, value.length * 24), margin: '4px 0' }}>
                            <Virtuoso
                                style={{ height: '100%' }}
                                totalCount={value.length}
                                itemContent={(i) => (
                                    <div className={styles.listValue} style={{ background: darken(0.1, categoryColor.background), color: categoryColor.text }}>
                                        <div className={styles.valueInner}>{value[i]}</div>
                                    </div>
                                )}
                            />
                        </div>
                    ) : (
                        <div className={styles.valueInner}>{value}</div>
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
