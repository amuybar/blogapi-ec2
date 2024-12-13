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
var rateLimit = require("express-rate-limit");
dotenv_1.default.config();
var app = (0, express_1.default)();
var port = parseInt(process.env.PORT || '3000', 10);
// General Rate Limiter
var generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // limit each IP to 50 requests per windowMs
    message: "Too many requests from this IP, please try again after some time."
});
// Routes that don't require rate limiting
var exemptRoutes = ['/api/blogs', '/api/login', '/api/register'];
// Middleware Setup
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: ['https://nairobidossier.co.ke', 'https://www.nairobidossier.co.ke'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));
app.use((0, morgan_1.default)('dev'));
app.use(body_parser_1.default.json());
// Apply rate limiting to routes that aren't exempt
app.use(function (req, res, next) {
    if (!exemptRoutes.includes(req.path)) {
        generalLimiter(req, res, next);
    }
    else {
        next();
    }
});
// Custom Blocked Requests Middleware
app.use(function (req, res, next) {
    var blockedPattern = '/LabTech/agent.aspx';
    if (req.url.includes(blockedPattern)) {
        res.status(403).end(); // Block specific requests
    }
    else {
        next();
    }
});
// Routes
(0, index_routes_1.default)(app);
// Default Route
app.get('/', function (req, res) {
    res.send({ message: 'Welcome to Blog APIs' });
});
// 404 Error Handling
app.use(function (req, res) {
    res.status(404).json({ message: 'Not found' });
});
// Log Middleware
app.use(function (req, res, next) {
    console.log("Received ".concat(req.method, " request to ").concat(req.path));
    next();
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