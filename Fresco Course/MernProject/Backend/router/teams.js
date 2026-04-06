const express = require("express");
const Admin = require("../mongoose/models/admin");
const { helpers } = require("../src/helper");
const Members = require("../mongoose/models/members");
const Teams = require("../mongoose/models/teams");
const jwt = require("jsonwebtoken");
const authenticate = require("../middlewares/auth");

// setting up router for teams
const membersRouter = new express.Router();

// code goes here for endpoints

membersRouter.post("/admin/login", async (req, res) => {
    const user = await Admin.findOne(req.body);

    if (!user) {
        return res.status(400).send({ error: "Username or password is wrong" });
    }

    const token = jwt.sign({ id: user._id }, helpers.secret_token);
    user.tokens.push(token);
    user.save();

    return res.status(200).send({ token: token });
});

membersRouter.post("/tracker/members/add", authenticate, async (req, res) => {
    const { employee_id, employee_name, technology_name, experience } = req.body;

    const member = await Members.findOne({
        employee_name,
        technology_name
    });

    if (member) {
        return res.status(400).send({ error: "Member with same team already exists" });
    } else if (
        !employee_id ||
        !employee_name ||
        !technology_name ||
        !experience ||
        employee_id < 100000 ||
        employee_id > 3000000 ||
        employee_name.length < 3 ||
        employee_name.includes("0") ||
        employee_name.includes("@") ||
        experience < 0
    ) {
        return res.status(400).send({});
    }

    await new Members(req.body).save();

    const team = await Teams.findOne({ name: technology_name });
    if (!team) {
        await new Teams({ name: technology_name }).save();
    }

    return res.status(201).send({});
});

membersRouter.get("/tracker/technologies/get", authenticate, async (req, res) => {
    const t = await Teams.find();
    return res.status(200).send(t);
});

membersRouter.post("/tracker/technologies/add", authenticate, async (req, res) => {
    const { technology_name } = req.body;
    const t = await Teams.findOne({ name: technology_name });

    if (!t) {
        await new Teams({ name: technology_name }).save();
        return res.status(201).send({});
    }

    return res.status(400).send({});
});

membersRouter.delete(
    "/tracker/technologies/remove/:name",
    authenticate,
    async (req, res) => {
        const technology_name = req.params.name;
        const t = await Teams.findOne({ name: technology_name });

        if (!t) {
            return res.status(400).send({});
        }

        await Teams.deleteOne({ name: technology_name });
        await Members.deleteMany({ technology_name });

        return res.status(200).send({});
    }
);

membersRouter.patch(
    "/tracker/members/update/:id",
    authenticate,
    async (req, res) => {
        const id = req.params.id;
        const { employee_id, employee_name, experience } = req.body;

        if (
            (employee_id &&
                (employee_id < 100000 || employee_id > 3000000)) ||
            (employee_name &&
                (employee_name.length < 3 ||
                    employee_name.includes("@") ||
                    employee_name.includes("0"))) ||
            (experience && experience < 0)
        ) {
            return res.status(400).send({});
        }

        const member = await Members.findById(id);
        if (!member) {
            return res.status(400).send({});
        }

        await Members.findByIdAndUpdate(id, req.body);
        return res.status(200).send({});
    }
);

membersRouter.get(
    "/tracker/members/display",
    authenticate,
    async (req, res) => {
        const { tech, experience } = req.query;
        const query = {};

        if (tech) {
            query["technology_name"] = tech;
        }

        if (experience) {
            query["experience"] = { $gte: experience };
        }

        const member = await Members.find(query);
        return res.status(200).send(member);
    }
);

membersRouter.delete(
    "/tracker/members/delete/:id",
    authenticate,
    async (req, res) => {
        const id = req.params.id;
        const member = await Members.findById(id);

        if (!member) {
            return res.status(400).send({});
        }

        await Members.findByIdAndDelete(id);
        return res.status(200).send({});
    }
);

module.exports = membersRouter;