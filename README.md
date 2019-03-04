Top Profe
=========

Sometimes, students need to assess which professor fits their needs. That's
why we have created (actually revamped) Top Profe.

The goal of this tool is helping fellow students get additional insights
about the people teaching in a certain educational institution, as well as
letting professors know when they're doing great and when they have room to
improve.

The user-facing strings and routes are in Spanish and they hardcoded (i.e.
not i18n-ready out of the box), but it shouldn't be too hard to translate them.

# Requirements

Top Profe needs the following software to work properly:

  * Node.js v10+
  * Yarn 1.13+
  * A MySQL database.

# Setup

1. Download or clone this repository:

```sh
$ git clone https://github.com/dat-etsit/top-profe
$ cd top-profe
```

2. Install the required dependencies:

```sh
$ yarn install
```

3. Create the configuration file for the backend, `src/server/config.json`.
   It must have the following structure:

```json
{
    "database": {
        "host": "<your.mysql.database.host>",
        "user": "<the database's user>",
        "password": "<the password for that user>",
        "dbName": "<the name of the database to use>"
    },
    "server": {
        "url": "<https://topprofes.public.url>",
        "sessionSecret": "<some secure random secret>",
        "https": {
            "keyPath": "</path/to/your/privkey.pem>",
            "certPath": "</path/to/your/cert.pem>"
        }
    },
    "cas": {
        "ssoUrl": "<https://your.cas.sso.login.url>"
    },
    "sentry": {
        "enabled": true,
        "dsn": "https://<token>@sentry.io/<id>"
    }
}
```

  If the `server.https` key is not present, the content will be served via
  plain HTTP. Even though this might be useful for development, it is strongly
  recommended to serve this (and virtually any) application over HTTPS.

  You can keep track of any errors in the backend (besides the logs) via
  [Sentry](https://sentry.io). If you want to use this feature, set
  `sentry.enabled` to `true` and specify your DSN's URL.

4. Create the SQL tables for the application to work.

```sh
$ mysql -u <db_username> -p <db_name> < dbsetup.sql
```

5. Run it!

```sh
$ yarn start
```

---

&copy; 2019 Delegación de Alumnos de Telecomunicación