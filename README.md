<p align="center">
<img src="./src/client/public/dat_topprofe.png" alt="DAT Top Profe" width="80%"/>
<p/>
<br />

Sometimes, students need to assess which professor fits their needs best.
That's why we have created (actually revamped) Top Profe.

The goal of this tool is to help fellow students get additional insights about the people teaching in a certain educational institution, as well as letting professors know when they're doing great and when they have room to improve.

The user-facing strings are in Spanish and they hardcoded (i.e. not i18n-ready out of the box), but it shouldn't be too hard to translate them.

# Requirements

Top Profe needs the following software to work properly:

  * Node.js v20.12+
  * Yarn 1.22.22+
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
        "host": "<your mysql database host>",
        "port": "<the database's port, 3306 by default>",
        "user": "<the database's user>",
        "password": "<the password for that user>",
        "dbName": "<the name of the database to use>",
        "dialect": "<the dialect used by your db, mariadb by defalt>"
    },
    "server": {
        "url": "<https://topprofes.public.url>",
        "path": "<path where the app will be served, / by default>",
        "port": "<port for the server to listen>",
        "usingProxy": false,
        "sessionSecret": "<some secure random secret>",
        "schoolCode": "<id of the school in XX format>",
        "currentAcademicYear": "<the current academic year in 20XX-YY format>",
        "disableVotes": "<boolean flag to disable voting capabilities>"
    },
    "email": {
        "host": "<your smtp server host>",
        "port": "<your smtp server port>",
        "ssl": "<use SSL for smtp connection, true for both SSL and STARTTLS>",
        "user": "<your smtp server user>",
        "password": "<your smtp server pass>"
    },
    "sso": {
        "realm": "<your SSO realm>",
        "client": "<your SSO client>",
        "secret": "<your SSO secret>",
        "scope": "<your SSO scope, 'openid email profile' by default>",
        "wellKnownEndpoint": "<your SSO .well-known endpoint>",
        "redirectUris": ["<your login callback URL(s)>"]
    },
    "api": {
        "baseURL": "<base URL from where the subjects will be fetched>",
        "subjects": "<subjects API endpoint>",
        "subjectGuides": "<subjects guides API endpoint>"
    }
}
```
  Set `server.usingProxy` to `true` if you are serving Top Profe behind a
  reverse proxy. In affirmative case, it is required to set the
  "X-Forwarded-Proto" header accordingly (it should always be HTTPS).

4. Create all the database tables and constraints with Sequelize:

```bash
$ yarn run db:migrate
```

5. Run it!

```sh
$ yarn start
```

---

&copy; 2024 Delegación de Alumnos de Telecomunicación
