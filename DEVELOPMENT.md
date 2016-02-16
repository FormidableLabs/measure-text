Development
===========

## Build

Build for production use (NPM, bower, etc) and create `dist` UMD bundles
(min'ed, non-min'ed)

```
$ npm run-script build
```

Note that `dist/` files are only updated and committed on **tagged releases**.

## Quality

### In Development

During development, run the following to run tests and check for linting errors:

```sh
$ npm run-script check
```

### Continuous Integration

Travis runs the following:
```sh
builder run check-ci  # PhantomJS,Firefox + coverage 
```

#### Code Coverage

Code coverage reports are outputted to:

```
coverage/
  client/
    BROWSER_STRING/
      lcov-report/index.html  # Viewable web report.
```

## Releases

**IMPORTANT - NPM**: To correctly run `preversion` your first step is to make
sure that you have a very modern `npm` binary:

```sh
$ npm install -g npm
```

Built files in `dist/` should **not** be committeed during development or PRs.
Instead we _only_ build and commit them for published, tagged releases. So
the basic workflow is:

```sh
# Make sure you have a clean, up-to-date `master`
$ git pull
$ git status # (should be no changes)

# Choose a semantic update for the new version.
# If you're unsure, read about semantic versioning at http://semver.org/
$ npm version major|minor|patch -m "Version %s - INSERT_REASONS"

# ... the `dist/` and `lib/` directories are now built, `package.json` is
# updated, and the appropriate files are committed to git (but unpushed).
#
# *Note*: `lib/` is uncommitted, but built and must be present to push to npm.

# Check that everything looks good in last commit and push.
$ git diff HEAD^ HEAD
$ git push && git push --tags
# ... the project is now pushed to GitHub and available to `bower`.

# And finally publish to `npm`!
$ npm publish
```

And you've published!

For additional information on the underlying NPM technologies and approaches,
please review:

* [`npm version`](https://docs.npmjs.com/cli/version): Runs verification,
  builds `dist/` and `lib/` via `scripts` commands.
    * Our scripts also run the applicable `git` commands, so be very careful
      when running out `version` commands.
* [`npm publish`](https://docs.npmjs.com/cli/publish): Uploads to NPM.
    * **NOTE**: We don't _build_ in `prepublish` because of the
      [`npm install` runs `npm prepublish` bug](https://github.com/npm/npm/issues/3059)
