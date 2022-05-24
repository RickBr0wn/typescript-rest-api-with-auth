"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const logger_1 = require("./middleware/logger");
const healthRoutes_1 = require("./routes/healthRoutes");
const mongoose = require("mongoose");
const config_1 = require("./config");
const authRoutes_1 = require("./routes/authRoutes");
const errorHandler_1 = require("./middleware/errorHandler");
const fallback_1 = require("./middleware/fallback");
const privateRoutes_1 = require("./routes/privateRoutes");
const cookieParser = require("cookie-parser");
const refreshTokenRoutes_1 = require("./routes/refreshTokenRoutes");
const allowedOrigins_1 = require("./allowedOrigins");
const handleCorsCredentials_1 = require("./middleware/handleCorsCredentials");
const port = process.env.PORT || 5000;
const app = express();
let connections = [];
if (!config_1.default.mongo.url) {
    throw new Error('Please define the MONGODB_URL in the config file.');
}
let cached = global.mongoose;
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}
function dbConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        if (cached.conn) {
            return cached.conn;
        }
        if (!cached.promise) {
            cached.promise = mongoose
                .connect(config_1.default.mongo.url, config_1.default.mongo.options)
                .then(mongoose => mongoose);
        }
        cached.conn = yield cached.promise;
        return cached.conn;
    });
}
dbConnect()
    .then(() => console.log(`Connected to database ${config_1.default.mongo.url}`))
    .catch(error => console.log(`There was an error connecting to the database ${config_1.default.mongo.url}: ${error}`));
app.use(handleCorsCredentials_1.default);
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins_1.default.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS.'), null);
        }
    },
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
/** parse the request */
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(logger_1.logger);
app.use('/auth/', authRoutes_1.default);
app.use('/health-check', healthRoutes_1.default);
app.use('/api/private', privateRoutes_1.default);
app.use('/api/refresh', refreshTokenRoutes_1.default);
/** fallback handler */
app.all('*', fallback_1.default);
/** error handler */
app.use(errorHandler_1.default);
const server = app.listen(port, () => {
    console.log(`Server is listening on port ${port}.`);
});
server.on('connection', connection => {
    connections.push(connection);
    connection.on('close', () => (connections = connections.filter(curr => curr !== connection)));
});
process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);
function shutDown() {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });
    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
    connections.forEach(curr => curr.end());
    setTimeout(() => connections.forEach(curr => curr.destroy()), 5000);
}
//# sourceMappingURL=server.js.map