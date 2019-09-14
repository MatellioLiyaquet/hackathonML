// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  api: 'http://52.90.191.251:3001/api',
  firebaseConfig: {
    apiKey: "AIzaSyA2GdeRkGbLaWsfTzbqeuAca0FIe34LbHE",
    authDomain: "react-my-burger-9833c.firebaseapp.com",
    databaseURL: "https://react-my-burger-9833c.firebaseio.com",
    projectId: "react-my-burger-9833c",
    storageBucket: "react-my-burger-9833c.appspot.com",
    messagingSenderId: "232157515666",
    appId: "1:232157515666:web:6edf52fe5165d450"
  }
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
