## Steps to contribute
- Create branch for each feature
- Follow TDD for each component/store
- Use flow to define types
- DO NOT use `npm` to install packages, not even `npm 5`. Always use `yarn` to install dependencies
- Tests are run by default when you try to push. If tests fail then code will not be pushed, not even to local branch.
- Push will fail even if there are any lint errors
- Raise pull request to merge any change to master
- Fill Pull request template properly while raising the PR

## Process
- PR template is made for submitting PR
- PR is `squashed and merged`
- Tests are run before each push
- Files are automatically formatted by prettier before committing
- Hooks for pre-commit and pre-push are in `package.json`
