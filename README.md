# Ebuddy-monorepo starter

This Ebuddy-monorepo starter is maintained by the Turborepo core team.

## Using this example

Run the following command:

```sh
cp apps/frontend-repo.env.local.example apps/frontend-repo.env

npm install --legacy-peer-deps
```

### Build

To build all apps and packages, run the following command:

```
npm run build
```

### Develop

To develop all apps and packages, run the following command:

```
npm run dev
```

## Cloud Firestore API Enable
```
https://console.developers.google.com/apis/api/firestore.googleapis.com/overview?project=<project_id>
```

## Manual configuration firebase
```
(new FirebaseConfig({
    projectId: 'ebuddy-test',
    clientEmail: 'ebuddy-test@gserviceaccount.com',
    privateKey: '=== PRIVATE KEY ===',
})).init();
```

## JSON configuration firebase
* Generate new private key
* Rename file with serviceAccountKey.json
* Upload to config/serviceAccountKey.json

## Firestore Database
```
https://console.firebase.google.com/v1/r/project/<project_id>/firestore/indexes
```
