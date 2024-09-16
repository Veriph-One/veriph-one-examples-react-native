# Veriph.One's React Native integration example

This project was created using [Expo](https://expo.dev) and [`create-expo-app`](https://www.npmjs.com/package/create-expo-app). It contains a barebones mobile application that integrates with Veriph.One's native SDK to showcase a phone capture flow.

## Getting Started

1. Ensure you have gone through the developer documentation to understand how to integrate phone-based verification to your web app. Developer docs can be found [here](https://developer.veriph.one/docs/intro).

2. Install dependencies

   ```bash
   npm install
   ```

3. Setup your API URL and Veriph.One API Key in the `/.env` file. <b>IMPORTANT:</b> This non-production example stores the API Key in `/.env` for simplicity sake. However, [this isn't recommended](https://docs.expo.dev/guides/environment-variables/) in a production environment. Please consider these other mechanisms to safely manage your credentials: [Storing sensitive info](https://reactnative.dev/docs/security#storing-sensitive-info).

4. Make sure your server is running and has both the Start and Result Endpoints ready to receive requests. Make changes to `makeStartVerificationRequest` and `makeResultVerificationRequest` in `/app/index.tsx` accordingly. These requests should match your API inputs and outputs. Feel free to tinker with the code as needed.

5. Start the app using a platform specific command such as:
   ```bash
      npm run android
   ```

or

   ```bash
      npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)

## Implement the SDK in your own app

Ready to integrate the Veriph.One SDK into your app? Follow these steps to do so:

### Android

1. Go to this project's `android/app/build.gradle` and copy line 170 (`implementation("one.veriph:veriph-one-android-sdk:1.0.9")`) to your own app's Android gradle file (same path). Make sure to add this line under the `dependencies` section.

2. Copy the file `android/app/src/main/java/one/veriph/modules/VeriphOneModule.kt` to a similar path in your project's Android java code. Your path should be something like: `android/app/src/main/java/[com]/[example]/modules/VeriphOneModule.kt`. Make sure to update line 1 (`package one.veriph.modules`) of the file to your apps package.

3. Repeat step 2 for the file `android/app/src/main/java/one/veriph/modules/AppPackage.kt`. Make sure to update line 1 with the proper package name.

4. Go to this project's `android/app/src/main/java/one/veriph/examples/MainApplication.kt` and use it as a reference to update the `getPackages` method. It should look like the snippet below. Note: if you are already adding other packages, just add the line `add(AppPackage())`. Make sure to import the Package from the correct package, for example: `import one.veriph.modules.AppPackage`.
   ```kotlin
   override fun getPackages(): List<ReactPackage> {
      val packages = PackageList(this).packages
      packages.apply {
         // Packages that cannot be autolinked yet can be added manually here, for example:
         // add(MyReactNativePackage())
         add(AppPackage())
      }
      return packages
   }
   ```

5. Recompile and run your project again using:
   ```bash
      npm run android
   ```

### iOS
Coming soon...

### Connecting platform code to React Native

1. Whenever you need to start a verification: In your React code, get a reference to the Veriph.One Module by using `const { VeriphOneModule } = NativeModules;`.

2. Create a method similar to `startVerificationWithUuid` in `app/index.tsx` to start a verification once you obtain a session UUID from your API:
   ```javascript
   const startVerificationWithUuid = (sessionUuid: string) => {
      VeriphOneModule.subscribeToVerificationEvent(
      apiKey,
      sessionUuid,
      (result: string | null) => {
         console.log(`Session UUID: ${result}`);
         if (result) {
            // Ask your server for a result and instructions on what to do next
            makeResultVerificationRequest(sessionUuid);
         } else {
            // The flow was interrupted by the user or finished unsuccessfully
            alert("Verification failed :(");
         }
      }
      );
   };
   ```

3. Connect this method to your Start and Result endpoint calls to finish the integration.

## Need support? Want more examples?

We can gladly help out. Get in touch through [our website](https://www.veriph.one/contact).