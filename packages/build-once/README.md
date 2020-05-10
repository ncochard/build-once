> Build your code, only if you need to...

# Configuration

Install this package in your project using `npm install -D build-once` of `yarn add --dev build-once`.

Add the section `build-once` in your `package.json`. For each of your build commands, specify the list of files from your `src` folder and the files from your `dist` folder.

Add this to the `package.json`...

        {
          "name": "your-package",
          "build-once": {
            "build": {
                "input": [
                    "src/**/*.*"
                ],
                "output": [
                    "dist/**/*.*"
                ]
            },
            "build:prod": {
                "input": [
                    "src/**/*.*"
                ],
                "output": [
                    "dist/**/*.*"
                ]
            }
          },
          "scripts" {
            "build": "...",
            "build:once": "build-once --script build",
            "build:prod": "...",
            "build:prod:once": "build-once --script build:prod",
            ...
          }
        }


Add this to the `.gitignore`...

        node_modules
        .build-once
        etc.

Then, instead of typing `npm run build` to build your code, you can type `npm run build:once`.
The first time that you execute `npm run build:once`, the command will take just as long as `npm run build`. But the second time, it should complete instantly; unless you have edited one of the source files.

# How does it work?

This utility will calculate and stores a MD5 hash of all the files within your `src` folder and your `dist` folder. The hash values are stored inside a `.build-once` folder. So the second time you execute `npm run build:once`, this utility can workout if the source code has changed and if the application needs to be rebuilt.

- Before the build, we calculate the hash values for the `src` and `dist` folders. Then compare them with the last values stored.
- If the hash values have changed; it must mean that the source code was edited, or the `dist` folder was tempered with. In that case, the build is executed.
- After the build, we recaclulate the hash values for the `src` and `dist` folders and store them for the next execution.

# Why?

I created this utility for large applications that take a while to compile and where the `--watch` command of `tsc`, `babel` or `webpack` cannot be used.

This is expecially useful on a large `lerna` monorepo with multiple packages. Hitting `npm run build` after going a `git pull` was too time consuming. So `npm run build:once` becomes really useful to only rebuild the packages that need to be rebuilt.

# Monorepo

If you work on a large `lerna` monorepo, you may consider adding to the `input` a set of your package dependencies.

Given the monorepo below...

    packages/
      package1/
        src/
        package.json
      package2/
        src/
        package.json
    package.json
    lerna.json

Let's consider that `package1` has a dependency on `package2`. So you may want to add the following to `package1/package.json`. This way, this utility knows that `package1` needs to be rebuilt when `package2` is modified.

    "input": [
        "src/**/*.**",
        "./node_modules/package2/.build-once/*.*" <-- Do this to indicate that package1 has a dependency on package2.
    ],

Do not scan the whole `node_modules` folder. This would scan too many files, and the MD5 hash generation would take too long.

    "input": [
        "src/**/*.**",
        "./node_modules/**/*.*" <-- DO NOT DO THIS!!
    ],

# Command line options

    $ build-once --help
    Usage: build-once [options]

    Options:
      -n, --script <script>  name of the script configuration
      -d, --debug            outputs debugging information
      -h, --help             display help for command

The `debug` option will output in the `.build-once` folder the list of files that were scanned for updates. This can be useful to debug your configuration.


# Tips

To speed up the calculation of the MD5 hash, try to reduce the number of files that `build-once` have to scan.

    "input": [
        "src/**/*.**",
        "!**/*.map" <-- Exclude from the MD5 calculation files that are not essential to the compilation of the project.
    ],

# Configuration options

Using the `command` parameter, you can configure whether you prefer your build commands to be executed using yarn (e.g. `yarn run build`) or npm (e.g. `npm run build`).

    {
      "name": "your-package",
      "build-once": {
        ...
        "command": "yarn"|"npm" (Default: "npm")
      },
      "scripts" { ... }
    }