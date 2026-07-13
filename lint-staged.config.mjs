export default {
  // --no-warn-ignored: eslint 9 warns when lint-staged passes a file that the
  // flat config ignores (e.g. features/site/**); that warning would trip
  // --max-warnings 0. This suppresses only the ignored-file notice.
  '*.{ts,tsx}': ['eslint --fix --max-warnings 0 --no-warn-ignored', 'prettier --write'],
  '*.{js,mjs,cjs}': ['prettier --write'],
  '*.{json,md,yaml,yml}': ['prettier --write'],
  '*.css': ['prettier --write'],
}
