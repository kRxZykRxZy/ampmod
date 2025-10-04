const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");
const Cast = require("../../util/cast");
const formatMessage = require("format-message");

// eslint-disable-next-line max-len
const iconURI =
    "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjciIGhlaWdodD0iMjYiIHZpZXdCb3g9IjAgMCAyNyAyNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3QgeD0iMC42MDIwODEiIHdpZHRoPSIyNiIgaGVpZ2h0PSIyNiIgcng9IjEzIiBmaWxsPSIjRTVGMEZGIi8+CjxjaXJjbGUgY3g9IjE5LjcxMjYiIGN5PSIxMy4wMDA0IiByPSIzLjQ0NjY1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCAxOS43MTI2IDEzLjAwMDQpIiBmaWxsPSIjRkZCRjAwIiBzdHJva2U9IiNDQzk5MDAiIHN0cm9rZS13aWR0aD0iMC44NjE2NjMiLz4KPGNpcmNsZSBjeD0iMTguODkzOSIgY3k9IjkuOTQ0NjIiIHI9IjMuNDQ2NjUiIHRyYW5zZm9ybT0icm90YXRlKC0xMjAgMTguODkzOSA5Ljk0NDYyKSIgZmlsbD0iI0NGNjNDRiIgc3Ryb2tlPSIjQkQ0MkJEIiBzdHJva2Utd2lkdGg9IjAuODYxNjYzIi8+CjxjaXJjbGUgY3g9IjE2LjY1NzEiIGN5PSI3LjcwODI5IiByPSIzLjQ0NjY1IiB0cmFuc2Zvcm09InJvdGF0ZSgtMTUwIDE2LjY1NzEgNy43MDgyOSkiIGZpbGw9IiM5OTY2RkYiIHN0cm9rZT0iIzc3NERDQiIgc3Ryb2tlLXdpZHRoPSIwLjg2MTY2MyIvPgo8Y2lyY2xlIGN4PSIxMy42MDIiIGN5PSI2Ljg4OTUyIiByPSIzLjQ0NjY1IiBmaWxsPSIjNEM5N0ZGIiBzdHJva2U9IiMzMzczQ0MiIHN0cm9rZS13aWR0aD0iMC44NjE2NjMiLz4KPGNpcmNsZSBjeD0iMTAuNTQ3IiBjeT0iNy43MDgzNCIgcj0iMy40NDY2NSIgdHJhbnNmb3JtPSJyb3RhdGUoLTMwIDEwLjU0NyA3LjcwODM0KSIgZmlsbD0iIzU3NUU3NSIgc3Ryb2tlPSIjNTc1RTc1IiBzdHJva2Utd2lkdGg9IjAuODYxNjYzIi8+CjxjaXJjbGUgY3g9IjguMzEwMjIiIGN5PSI5Ljk0NTE2IiByPSIzLjQ0NjY1IiB0cmFuc2Zvcm09InJvdGF0ZSgxMjAgOC4zMTAyMiA5Ljk0NTE2KSIgZmlsbD0iIzBGQkQ4QyIgc3Ryb2tlPSIjMEI4NDYyIiBzdHJva2Utd2lkdGg9IjAuODYxNjYzIi8+CjxjaXJjbGUgY3g9IjcuNDkxNTIiIGN5PSIxMy4wMDA0IiByPSIzLjQ0NjY1IiB0cmFuc2Zvcm09InJvdGF0ZSg5MCA3LjQ5MTUyIDEzLjAwMDQpIiBmaWxsPSIjRkY2NjgwIiBzdHJva2U9IiNGRjMzNTUiIHN0cm9rZS13aWR0aD0iMC44NjE2NjMiLz4KPGNpcmNsZSBjeD0iOC4zMTAyMSIgY3k9IjE2LjA1NSIgcj0iMy40NDY2NSIgdHJhbnNmb3JtPSJyb3RhdGUoLTEyMCA4LjMxMDIxIDE2LjA1NSkiIGZpbGw9IiNGRjY2MUEiIHN0cm9rZT0iI0U2NEQwMCIgc3Ryb2tlLXdpZHRoPSIwLjg2MTY2MyIvPgo8Y2lyY2xlIGN4PSIxMC41NDY2IiBjeT0iMTguMjkxOCIgcj0iMy40NDY2NSIgdHJhbnNmb3JtPSJyb3RhdGUoLTE1MCAxMC41NDY2IDE4LjI5MTgpIiBmaWxsPSIjRkY4QzFBIiBzdHJva2U9IiNEQjZFMDAiIHN0cm9rZS13aWR0aD0iMC44NjE2NjMiLz4KPGNpcmNsZSBjeD0iMTMuNjAyIiBjeT0iMTkuMTEwNyIgcj0iMy40NDY2NSIgZmlsbD0iIzU5QzA1OSIgc3Ryb2tlPSIjMzg5NDM4IiBzdHJva2Utd2lkdGg9IjAuODYxNjYzIi8+CjxwYXRoIGQ9Ik0yMC4xMDM4IDE4LjI5MTRDMjAuMTAzOCAyMC4xOTQ5IDE4LjU2MDcgMjEuNzM4IDE2LjY1NzIgMjEuNzM4QzE0Ljc1MzYgMjEuNzM4IDEzLjIxMDUgMjAuMTk0OSAxMy4yMTA1IDE4LjI5MTRDMTMuMjEwNSAxNi4zODc4IDE0Ljc1MzYgMTQuODQ0NyAxNi42NTcyIDE0Ljg0NDdMMjAuMTAzOCAxOC4yOTE0WiIgZmlsbD0iIzVDQjFENiIgc3Ryb2tlPSIjMkU4RUI4IiBzdHJva2Utd2lkdGg9IjAuODYxNjYzIi8+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNMTYuMzQ0NSAxMy43MDk1QzE2LjY4MTUgMTUuMjU5NyAxOC4wNjE0IDE2LjQyMDcgMTkuNzEyNiAxNi40MjA3QzIwLjcyMjggMTYuNDIwNyAyMS42MzE1IDE1Ljk4NjEgMjIuMjYxOSAxNS4yOTM2QzIyLjMxMzQgMTUuNTMwNiAyMi4zNDA2IDE1Ljc3NjYgMjIuMzQwNiAxNi4wMjlDMjIuMzQwNiAxNy45MzI1IDIwLjc5NzQgMTkuNDc1NyAxOC44OTM5IDE5LjQ3NTdDMTYuOTkwNCAxOS40NzU3IDE1LjQ0NzMgMTcuOTMyNSAxNS40NDczIDE2LjAyOUMxNS40NDczIDE1LjEzNTcgMTUuNzg3MSAxNC4zMjE4IDE2LjM0NDUgMTMuNzA5NVoiIGZpbGw9IiNGRkFCMTkiLz4KPHBhdGggZD0iTTE2LjM0NDUgMTMuNzA5NUwxNi43NjU1IDEzLjYxOEMxNi43MzEzIDEzLjQ2MDQgMTYuNjEyIDEzLjMzNTIgMTYuNDU2MiAxMy4yOTM0QzE2LjMwMDUgMTMuMjUxNiAxNi4xMzQ1IDEzLjMwMDIgMTYuMDI2IDEzLjQxOTRMMTYuMzQ0NSAxMy43MDk1Wk0yMi4yNjE5IDE1LjI5MzZMMjIuNjgyOSAxNS4yMDIxQzIyLjY0ODcgMTUuMDQ0NSAyMi41Mjk0IDE0LjkxOTMgMjIuMzczNiAxNC44Nzc1QzIyLjIxNzkgMTQuODM1NyAyMi4wNTE5IDE0Ljg4NDMgMjEuOTQzNCAxNS4wMDM2TDIyLjI2MTkgMTUuMjkzNlpNMTkuNzEyNiAxNS45ODk5QzE4LjI2ODMgMTUuOTg5OSAxNy4wNjAzIDE0Ljk3NDMgMTYuNzY1NSAxMy42MThMMTUuOTIzNSAxMy44MDFDMTYuMzAyNiAxNS41NDUxIDE3Ljg1NDUgMTYuODUxNSAxOS43MTI2IDE2Ljg1MTVWMTUuOTg5OVpNMjEuOTQzNCAxNS4wMDM2QzIxLjM5MTEgMTUuNjEwMSAyMC41OTY1IDE1Ljk4OTkgMTkuNzEyNiAxNS45ODk5VjE2Ljg1MTVDMjAuODQ5MSAxNi44NTE1IDIxLjg3MTkgMTYuMzYyIDIyLjU4MDUgMTUuNTgzNkwyMS45NDM0IDE1LjAwMzZaTTIxLjg0MDkgMTUuMzg1MUMyMS44ODU5IDE1LjU5MjIgMjEuOTA5NyAxNS44MDc2IDIxLjkwOTcgMTYuMDI5SDIyLjc3MTRDMjIuNzcxNCAxNS43NDU3IDIyLjc0MDkgMTUuNDY4OSAyMi42ODI5IDE1LjIwMjFMMjEuODQwOSAxNS4zODUxWk0yMS45MDk3IDE2LjAyOUMyMS45MDk3IDE3LjY5NDYgMjAuNTU5NSAxOS4wNDQ4IDE4Ljg5MzkgMTkuMDQ0OFYxOS45MDY1QzIxLjAzNTQgMTkuOTA2NSAyMi43NzE0IDE4LjE3MDUgMjIuNzcxNCAxNi4wMjlIMjEuOTA5N1pNMTguODkzOSAxOS4wNDQ4QzE3LjIyODMgMTkuMDQ0OCAxNS44NzgxIDE3LjY5NDYgMTUuODc4MSAxNi4wMjlIMTUuMDE2NEMxNS4wMTY0IDE4LjE3MDUgMTYuNzUyNCAxOS45MDY1IDE4Ljg5MzkgMTkuOTA2NVYxOS4wNDQ4Wk0xNS44NzgxIDE2LjAyOUMxNS44NzgxIDE1LjI0NzEgMTYuMTc1MSAxNC41MzU2IDE2LjY2MzEgMTMuOTk5NUwxNi4wMjYgMTMuNDE5NEMxNS4zOTkxIDE0LjEwOCAxNS4wMTY0IDE1LjAyNDMgMTUuMDE2NCAxNi4wMjlIMTUuODc4MVoiIGZpbGw9IiNDRjhCMTciLz4KPHBhdGggZD0iTTE2LjM0NDUgMTMuNzA5NUMxNi42ODE1IDE1LjI1OTcgMTguMDYxNCAxNi40MjA3IDE5LjcxMjYgMTYuNDIwN0MyMC43MjI4IDE2LjQyMDcgMjEuNjMxNSAxNS45ODYxIDIyLjI2MTkgMTUuMjkzNiIgc3Ryb2tlPSIjQ0M5OTAwIiBzdHJva2Utd2lkdGg9IjAuODYxNjYzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPC9zdmc+Cg==";

/**
 * Class for Future blocks
 * @constructor
 */
class FutureBlocks {
    constructor(runtime) {
        /**
         * The runtime instantiating this block package.
         * @type {Runtime}
         */
        this.runtime = runtime;
    }

    /**
     * @returns {object} metadata for this extension and its blocks.
     */
    getInfo() {
        return {
            id: "future",
            name: formatMessage({
                id: "future.name",
                default: "Future",
                description: '"Future" extension',
            }),
            menuIconURI: iconURI,
            blocks: [
                /* NOTE: The blocks below are not actually created by the extension,
                 * but rather they are core blocks that are not in the palette.
                 * (That's the point of this extension.) */
                {
                    blockType: BlockType.XML,
                    xml: '<block type="argument_reporter_string_number"><field name="VALUE">project platform</field></block>',
                },
                {
                    blockType: BlockType.XML,
                    xml: '<block type="event_whentouchingobject"><value name="TOUCHINGOBJECTMENU"><shadow type="event_touchingobjectmenu"/></value></block>',
                },
            ],
        };
    }
}

module.exports = FutureBlocks;
