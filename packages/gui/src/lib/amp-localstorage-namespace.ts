export default
  process.env.ampmod_mode === 'lab'
    ? `lab/${process.env.ampmod_lab_experiment_name}:`
    : process.env.ampmod_mode === 'canary'
    ? 'canary:'
    : 'amp:';