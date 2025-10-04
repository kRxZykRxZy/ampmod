const BlockType = require("../../extension-support/block-type");
const ArgumentType = require("../../extension-support/argument-type");
const AmpMod = require("../../extension-support/ampmod-api");
const {
    TargetType,
} = require("../../extension-support/tw-extension-api-common");
const { startHats } = require("../../compiler/compat-block-utility");

if (process.env.NODE_ENV === "production") {
    throw Error("Electro Test cannot be used in production");
}

/**
 * Class for Electro Test blocks
 * @constructor
 */
class ElectroTestBlocks {
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
            id: "electroTest",
            name: "Electro Test",
            docsURI: "https://example.com",
            globalExtensions: ["colours_more"],
            blocks: [
                {
                    blockType: BlockType.LABEL,
                    text: "All the world's a stage.",
                    filter: [TargetType.STAGE],
                },
                {
                    blockType: BlockType.LABEL,
                    text: "does apple cat drink sprite",
                    filter: [TargetType.SPRITE],
                },
                {
                    blockType: BlockType.ARRAY,
                    opcode: "listOfGreetings",
                    text: "list of greetings",
                },
                {
                    blockType: BlockType.ARRAY,
                    opcode: "addRandomNumber",
                    text: "add a random number to [ARRAY]",
                    arguments: {
                        ARRAY: {
                            type: ArgumentType.ARRAY,
                        },
                    },
                },
                {
                    blockType: BlockType.REPORTER,
                    opcode: "ampApiObject",
                    text: "AmpMod API object",
                },
                {
                    blockType: BlockType.MULTIREPORTER,
                    opcode: "multiReporter",
                    text: "reporter that can be dropped in array/boolean arguments",
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: "helpUrlExists",
                    text: "I have my own helpURI",
                    helpURI:
                        "https://ampmod.miraheze.org/wiki/AmpMod_Wiki:UltiFools/If_()_then_()_else_()",
                    tooltip:
                        "so when you right click me and click 'Help', I will not go to example.com",
                },
                {
                    blockType: BlockType.INLINE,
                    opcode: "drawer",
                    text: ["drawer 1", "drawer 2", "drawer 3", "drawer bottom"],
                    branchCount: 3,
                },
                {
                    blockType: BlockType.COMMAND,
                    extensions: ["shape_switch_case"],
                    opcode: "scbb",
                    text: "switch, case, beep boop",
                },
                {
                    blockType: BlockType.COMMAND,
                    opcode: "inlineinputsno",
                    text: ["test", "without", "inline", "inputs"],
                    inlineInputs: false,
                },
            ],
        };
    }

    listOfGreetings() {
        return ["hello", "hi", "greetings", "welcome", "hola", "bonjour"];
    }

    addRandomNumber(args) {
        const baseArray = args.ARRAY;
        return [...baseArray, Math.floor(Math.random() * 10) + 1];
    }

    ampApiObject() {
        return AmpMod;
    }

    multiReporter() {
        return "I'm not joking";
    }

    helpUrlExists() {
        console.log("Yes");
    }

    scbb() {
        alert("switch like a snitch");
    }
}

module.exports = ElectroTestBlocks;
