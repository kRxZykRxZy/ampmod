if [[ "$(uname)" == "Darwin" ]]; then
  # macOS (BSD) sed requires a backup extension after -i
  SED_ARGS="-i ''"
else
  # GNU sed (Linux) does not
  SED_ARGS="-i"
fi
sed $SED_ARGS 's|codeberg.org/ampmod/[^.]*.git#develop|codeberg.org/ampmod/[^.]*.git#production|g' "package.json"