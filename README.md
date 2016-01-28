# NodeJS Demo Component

Base files for any component used by the [NodeJS Demo Core](https://github.rtp.raleigh.ibm.com/people-insights-commons/nodejs-demo-core).
Provides some basic behavior to build deployment-ready components and supports
optional coffee scripting.

## Setting your component

You will need to modify the `package.json` in order to provide
information relevant to your component.

The exported component name will be defined by the field `exportName` present in the `package.json` or by the field `name` if the first one is missing.

## Build your component

You can run `gulp` command to build your component. Binaries will be
deployed to `bin` folder and the build output in `.build` folder.

Gulp scripts are stored in `.gulp` directory. You can customize your
build scripts as you wish.

## Keep The Template Updated

Add the base project as a remote repository.
```sh
git remote add upstream git@github.rtp.raleigh.ibm.com:people-insights-commons/nodejs-demo-component.git
```
And pull updates!
```sh
git pull upstream master
```