exports.default = function createUser(req, res) {
    try {
        User.push({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
    }
    catch (error) {
    }
};
//# sourceMappingURL=newFile.js.map