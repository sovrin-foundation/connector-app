## Tech stack used
- [React Native](https://facebook.github.io/react-native/)
- [React Navigation](http://reactnavigation.org)
- [Redux](http://redux.js.org)
- [Redux Saga](https://redux-saga.js.org)
- [Flow](http://flow.org/)
- [Jest](https://facebook.github.io/jest/)
- [Yarn](http://yarnpkg.com)
- [Cocoa pods](http://cocoadocs.org)

## Steps to contribute
- Create branch for each feature
- Follow TDD for each component/store
- Use flow to define types
- DO NOT use `npm` to install packages, not even `npm 5`. Always use `yarn` to install dependencies
- Run `npm run lint`, before pushing. We have not mandated it for now, but as soon as we write type for majority of our codebase. This will be automatically run before pushing the code to any branch. If lint is failed, then code will not be pushed.
- Tests are run by default when you try to push. If tests fail then code will not be pushed, not even to local branch.
- Raise pull request to merge any change to master
- Fill Pull request template properly while raising the PR

## Process
- PR template is made for submitting PR
- PR is `squashed and merged`
- Tests are run before each push
- Files are automatically formatted by prettier before committing
- Hooks for pre-commit and pre-push are in `package.json`
