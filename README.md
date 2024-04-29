<p align="center">
<img src="./src/client/public/dat_topprofe.png" alt="DAT Top Profe" width="80%"/>
<p/>
<br />

Sometimes, students need to assess which professor fits their needs best.
That's why we have created (actually revamped) Top Profe.

The goal of this tool is to help fellow students get additional insights
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
        "port": "<the database's port, 3306 by default>",
        "user": "<the database's user>",
        "password": "<the password for that user>",
        "dbName": "<the name of the database to use>"
    },
    "server": {
        "url": "<https://topprofes.public.url>",
        "port": "<port for the server to listen>",
        "usingProxy": true,
        "sessionSecret": "<some secure random secret>"
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
  Set `server.usingProxy` to `true` if you are serving Top Profe behind a
  reverse proxy. In affirmative case, it is required to set the
  "X-Forwarded-Proto" header accordingly (it should always be HTTPS).

  You can keep track of any errors in the backend (besides the logs) via
  [Sentry](https://sentry.io). If you want to use this feature, set
  `sentry.enabled` to `true` and specify your DSN's URL.

4. Create the SQL tables for the application to work. You must have created a
   database for Top Profe beforehand.

```sh
$ mysql -u <db_username> -p <db_name> < dbsetup.sql
```

5. Run it!

```sh
$ yarn start
```

---

&copy; 2022 Delegación de Alumnos de Telecomunicación
