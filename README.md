# Installation #

If you plan to do phonegap testing, building, or deploying you will need
Ionic and Cordova installed.  Globally is preferred.

* `npm install -g ionic`
* `npm install -g cordova`

Also need to globally install Apache Cordova for some plugins:

https://cordova.apache.org/#getstarted

# Setup Local Environment #

Create two files in the root folder to use for local development.

* `.env.local` - Define local dev settings (can copy contents from `.env.local`)
* `.env.production.local` - Define settings when deploying for production (can copy contents from `.env.production`)

When you want to change from Solution-Tree to eSpeakers, you will change the `REACT_APP_BUILD` variable in the associated `*.local` file 
instead of editing `.env` or `.env.production`.  These `*.local` files are not committed to git.

Additionally, whenever you change the `REACT_APP_BUILD`, make sure you run the appropriate `prepare:*` script that will be used to regenerate the icons for that build.

* `yarn run prepare:st` - copies the SolutionTree icons to be used when building the app for Android or iOS
* `yarn run prepare:main` - copies the eSpeakers icons to be used when building the app for Android or iOS

*Be Careful that you don't have a mismatch on the `prepare:*` command and the `REACT_APP_BUILD` value, otherwise you will have a SolutionTree icon paired with the eSpeakers logo or vice versa*

# Running #

There are multiple npm scripts necessary for installation, updates, and running all
the necessary servers.  For more details on these scripts enter `npm run` 
with no parameters or open `package.json`.

* `npm install` will pull down all the required packages
* `npm start` will start the environment using .env.local to test on a web browser
* `npm run prepare:android` will deploy the .env.development environment to Android Studio
* `npm run prepare:ios` will deploy the .env.development environment to Xcode
* `npm run release:android` will deploy the .env.production environment to Android Studio
* `npm run release:ios` will deploy the .env.production environment to Xcode

You can do `npm start` for the easiest way to get up and running, but if 
you feel the terminal is too noisy or just prefer to have your tasks 
separated or more organized, then here is an example workflow for 
manually setting up and splitting the jobs up:

# White Labels #

To run a whitelabel, simply change the `REACT_APP_BUILD` variable in the .env.*.local file.  Valid values are `main` and `st`.

<!-- # Deploying / Building #

The best way to build an app is to prepare the folders, then build the app in the appropriate IDE (Android Studio or XCode).
1. `yarn run prepare:main && yarn run release:ios && yarn run release:android` will copy the eSpeakers logo and release the app to iOS and Android (Preferred method)
1. Open the IDE (`Android Studio` or `XCode`) and run the app in the emulator to make sure everything runs
1. Using the IDE, build an APK or iOS Build and upload it to each app store.  Instructions can be found here: 
https://docs.google.com/document/d/1ftNOXuJaO02Qlv-eTS8GcPEnfTEpsKG3s4zFTE4uA3M/edit#heading=h.tj9ky04sgd9b 
-->

# Production #
https://play.google.com/store/apps/details?id=com.espeakers.eventcx&hl=en_US
https://apps.apple.com/kg/app/espeakers/id426816714



