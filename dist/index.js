"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var dotenv_1 = __importDefault(require("dotenv"));
var morgan_1 = __importDefault(require("morgan"));
var cors_1 = __importDefault(require("cors"));
var helmet_1 = __importDefault(require("helmet"));
var index_routes_1 = __importDefault(require("./routes/index_routes"));
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = parseInt(process.env.PORT || '3000', 10);
// Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
// Routes
(0, index_routes_1.default)(app);
// Default route
app.get('/', function (req, res) {
    res.send({ message: 'Welcome to Blog APIs' });
});
// 404 Error Handling
app.use(function (req, res) {
    res.status(404).json({ message: 'Not found' });
});
// General Error Handling
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' });
});
// Start Server
app.listen(port, function () {
    console.log("Server listening on port ".concat(port));
});
//# sourceMappingURL=index.js.map