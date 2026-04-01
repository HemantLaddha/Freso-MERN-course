import React, { Component } from "react";
import Header from "../Components/Header";
import Teams from "../Components/Teams";
import { mockData1, mockTeam, mockData2 } from "../Tests/mockData";

class Home extends Component {
    didload = false;

    state = {
        data: [],               // hold the members data categorised based on teams
        initialData: [],        // holds the members data got from backend
        team: [],               // holds the teams data got from backend
        edit: false,            // handle edit mode for particular member
        editId: undefined,      // holds id of member in edit mode
        empId: "",
        empName: "",
        experience: "",
        experienceFilter: "",
        checked: "Experience",
        teamName: "",
    };

    getLocalStorage = () => {
        return localStorage.getItem("token");
    };

    handleGetMembers = async (url = "/api/tracker/members/display") => {
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.getLocalStorage()}`,
            },
        });
        return await response.json();
    };

    handleGetTech = async () => {
        const response = await fetch("/api/tracker/technologies/get", {
            headers: {
                Authorization: `Bearer ${this.getLocalStorage()}`,
            },
        });
        return await response.json();
    };

    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleDeleteMembers = async (id) => {
        const response = await fetch(`/api/tracker/members/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${this.getLocalStorage()}`,
            },
            method: "Delete",
        });
        return await response.json();
    };

    handleDelete = async (e, id) => {
        e.preventDefault();
        return await this.handleDeleteMembers(id);
    };

    handleEdit = (id) => {
        const item = this.state.initialData.find((x) => x._id === id);
        this.setState({
            edit: true,
            editId: id,
            empId: item.employee_id,
            empName: item.employee_name,
            experience: item.experience,
        });
    };

    handleChecked = (value) => {
        this.setState({ checked: value });
    };

    handleClear = async () => {
        this.setState({
            experienceFilter: "",
            checked: "Experience",
            teamName: "",
        });
    };

    handleGo = async () => {
        const { checked, teamName, experienceFilter } = this.state;
        let url = "/api/tracker/members/display";

        if (checked === "Experience" && experienceFilter) {
            url += `?experience=${experienceFilter}`;
        } else if (checked === "Team" && teamName) {
            url += `?tech=${teamName}`;
        } else if (checked === "Both" && teamName && experienceFilter) {
            url += `?experience=${experienceFilter}&tech=${teamName}`;
        }

        const r = await this.handleGetMembers(url);
        this.setState({ team: r });
    };

    handleCancel = () => {
        this.setState({
            edit: false,
            editId: undefined,
            empId: "",
            empName: "",
            experience: "",
        });
    };

    handleEditRequest = async () => {
        const { editId, empId, empName, experience } = this.state;
        const body = JSON.stringify({
            employee_id: empId,
            employee_name: empName,
            experience: experience,
        });

        const response = await fetch(`/api/tracker/members/update/${editId}`, {
            headers: {
                Authorization: `Bearer ${this.getLocalStorage()}`,
                "Content-type": "application/json; charset=UTF-8",
            },
            method: "PATCH",
            body,
        });
        return await response.json();
    };

    handleDone = async (e) => {
        await this.handleEditRequest();
    };

    load_data = async () => {
        await this.handleGetMembers("/api/tracker/members/display");
        await this.handleGetTech();
    };

    async componentDidMount() {
        const token = this.getLocalStorage();
        if (!token) {
            this.props.history.push("/login");
        }

        this.setState({
            initialData: mockData1,
            team: mockTeam,
            data: mockData2,
        });

        if (this.didload && process.env.NODE_ENV === "test") {
            this.didload = true;
            return;
        }

        await this.load_data();
    }

    render() {
        return (
            <>
                <Header />

                <section>
                    <label>Filter By:</label>

                    <input
                        type="radio"
                        name="checked"
                        checked={this.state.checked === "Experience"}
                        onChange={() => this.handleChecked("Experience")}
                    />
                    <label>Experience</label>

                    <input
                        type="radio"
                        name="checked"
                        checked={this.state.checked === "Team"}
                        onChange={() => this.handleChecked("Team")}
                    />
                    <label>Team</label>

                    <input
                        type="radio"
                        name="checked"
                        checked={this.state.checked === "Both"}
                        onChange={() => this.handleChecked("Both")}
                    />

                    <input
                        type="number"
                        name="experienceFilter"
                        value={this.state.experienceFilter}
                        onChange={this.handleChange}
                        disabled={this.state.checked === "Team"}
                    />

                    <select
                        name="teamName"
                        value={this.state.teamName}
                        onChange={this.handleChange}
                        disabled={this.state.checked === "Experience"}
                    >
                        <option value="">--select option--</option>
                        {this.state.team.length &&
                            this.state.team.map((t) => (
                                <option key={t.name} value={t.name}>
                                    {t.name}
                                </option>
                            ))}
                    </select>

                    <button
                        onClick={this.handleGo}
                        disabled={
                            (this.state.checked === "Experience" &&
                                !this.state.experienceFilter) ||
                            (this.state.checked === "Team" &&
                                !this.state.teamName) ||
                            (this.state.checked === "Both" &&
                                (!this.state.teamName ||
                                    !this.state.experienceFilter))
                        }
                    >
                        Go
                    </button>

                    <button onClick={this.handleClear}>Clear</button>
                </section>

                {/* display teams */}
                {this.state.initialData.length ? (
                    <Teams data={this.state.data} />
                ) : (
                    <div className="noTeam">No Teams Found</div>
                )}
            </>
        );
    }
}

export default Home;
