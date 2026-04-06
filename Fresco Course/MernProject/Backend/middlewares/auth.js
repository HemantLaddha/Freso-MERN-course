const jwt = require("jsonwebtoken");
const Admin = require("../mongoose/models/admin");
const { helpers } = require("../src/helper");

const authenticate = async (req, res, next) => {
    if (!req.header("Authorization")) {
        return res.status("401").send({ error: "Token is missing" });
    }

    const token = req.header("Authorization").replace("Bearer ", "");

    try {
        const id = jwt.verify(token, helpers.secret_token);
        const user = await Admin.findById(id);
        req.user = user;
        next();
    } catch (err) {
        return res.status("401").send({ error: "Invalid Token" });
    }
};

module.exports = authenticate