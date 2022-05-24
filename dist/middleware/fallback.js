"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (req, res) => {
    res.status(404);
    // if (req.accepts('html')) {
    // 	res.sendFile(path.join(__dirname, 'views', '404.html'))
    // } else if (req.accepts('json')) {
    if (req.accepts('json')) {
        res.json({
            status: 404,
            message: '404 - Page Not Found'
        });
    }
    else {
        res.type('txt').send('404 - Page Not Found');
    }
};
//# sourceMappingURL=fallback.js.map