# Sales Activity Reporting

The [back-end][1] provides a REST API to retrieve the sales activity data. It is where the data aggregation (grouping, filtering, counting, etc.) takes place.  
The [front-end][2] provides a single-page application to visualize the sales activity data.

## Requirements

- [Node.js][3]
- [npm][4]

## Setup

### 1. back-end setup

#### 1.1 Switch into the back-end directory

```sh
cd back-end
```

#### 1.2 Install NPM packages

```sh
npm install
```

#### 1.3 Create your `.env` file

See file [.env.example][5] for an example

#### 1.4 Compiles and hot-reloads for development

```sh
npm run start
```

### 2. front-end setup

#### 2.1 Switch into the front-end directory

```sh
cd front-end
```

#### 2.2 Install NPM packages

```sh
npm install
```

#### 2.3 Create your `.env` file

See file [.env.example][6] for an example.

#### 2.4 Compiles and hot-reloads for development

```sh
npm run serve
```

<!-- MARKDOWN LINKS -->

[1]: ./back-end
[2]: ./front-end
[3]: https://nodejs.org/en/download/current/
[4]: https://nodejs.org/en/download/current/
[5]: ./back-end/.env.example
[6]: ./front-end/.env.example
