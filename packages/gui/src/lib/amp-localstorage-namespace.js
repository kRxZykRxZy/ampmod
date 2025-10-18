// Default; this is what we use on ampmod.codeberg.page.
let lsNamespace = "amp:";

// This is where the point of this file comes in.
if (process.env.ampmod_mode === "lab") {
    // Lab is a bit funky because there are multiple versions (unlike canary/prod).
    // The experiment name prevents conflicts. E.g. removing "accent" from
    // amp:theme would be catastrophic for all other lab versions and the eventual
    // canary / production build.
    lsNamespace = `lab/${process.env.ampmod_lab_experiment_name}:`;
} else if (process.env.ampmod_mode === "canary") {
    // We should also separate canary from prod for similar reasons even though there
    // is only one version in the canary repository.
    lsNamespace = "canary:";
}

export { lsNamespace };
