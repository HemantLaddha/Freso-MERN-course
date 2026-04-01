import React, { Component } from "react";
import Header from "../Components/Header";

class MoveMember extends Component {
    constructor(props) {
        super(props);
        const { history, location, match } = props;
        this.history = history;

        this.state = {
            teams: [],
            data: [],
            empId: "",
            errorStmtEmpId: "",
            from: "",
            to: "",
        };
    }

    componentDidMount() {
        if (!this.getLocalStorage() || this.getLocalStorage() === null || this.getLocalStorage() === "") {
            this.history.push("/login");
        }

        this.setState({
            teams: this.handleGetTeam(),
            data: this.handleGetMembers("/api/tracker/members/display")
        });
    }

    getLocalStorage = () => {
        // code goes here to get and return token value from local storage
        return localStorage.getItem("token");
    };

    handleGetTeam = async () => {
        // code goes here to return the response of technologies get api
        const response = await fetch("/api/tracker/technologies/get", {
            headers: {
                Authorization: `Bearer ${this.getLocalStorage()}`,
            },
        });
        const res = await response.json();
        return res;
    };

    handleGetMembers = async (url) => {
        // code goes here to return the response of api that is used to getMember
        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${this.getLocalStorage()}`,
            },
        });
        const res = await response.json();
        return res;
    };

    handleChange = (e) => {
        // code goes here to handle onChange for select and input fields
        this.setState({ [e.target.name]: e.target.value });

        if (this.state.empId === "") {
            this.setState({ errorStmtEmpId: "*Please enter a value" });
        } else if (Number(this.state.empId) >= 3000000 || Number(this.state.empId) <= 1000000) {
            this.setState({ errorStmtEmpId: "*Employee ID is expected between 1000000 and 3000000" });
        } else {
            this.setState({ errorStmtEmpId: "" });
        }
    };

    handleClear = () => {
        // code goes here to handle clear button
        this.setState({
            empId: "",
            errorStmtEmpId: "",
            from: "",
            to: "",
        });
    };

    MoveRequest = async (id) => {
        // code goes here to return the response status code of api that is used to move members from one team to another
        const response = await fetch(`/api/tracker/members/update/${id}`, {
            body: JSON.stringify({ technology_name: this.state.to }),
            headers: {
                Authorization: `Bearer ${this.getLocalStorage()}`,
                "Content-type": "application/json; charset=UTF-8",
            },
            method: "PATCH",
        });
        const res = await response.json();
        return res;
    };

    handleMove = async (e) => {
        // code goes here to handle move button
        e.preventDefault();

        const doc = this.state.data.filter((fg) => {
            return fg.employee_id === Number(this.state.empId);
        });

        const res = await this.MoveRequest(doc[0]._id);
        return res;
    };

    render() {
        return (
            <>
                <Header />

                <form className="MoveMember">
                    <h1>Move Team Member</h1>

                    {/* code goes here for the input field */}
                    <input
                        type="text"
                        value={this.state.empId}
                        onChange={this.handleChange}
                        name="empId"
                    />
                    <span>{this.state.errorStmtEmpId}</span>
                    {/* use span to display error msg */}

                    <div className="fromTo">
                        {/* code goes here for from and to labels and input fields */}
                        From :
                        <select name="from" value={this.state.from} onChange={this.handleChange}>
                            <option value="">--select option--</option>
                            {this.state.teams.length &&
                                this.state.teams.map((team) => (
                                    <option key={team._id} value={team.name}>
                                        {team.name}
                                    </option>
                                ))}
                        </select>

                        To :
                        <select name="to" value={this.state.to} onChange={this.handleChange}>
                            <option value="">--select option--</option>
                            {this.state.teams.length &&
                                this.state.teams.map((team) => (
                                    <option key={team._id} value={team.name}>
                                        {team.name}
                                    </option>
                                ))}
                        </select>
                    </div>

                    <div className="row3">
                        <button
                            className="add"
                            disabled={
                                this.state.empId === "" ||
                                this.state.from === "" ||
                                this.state.to === "" ||
                                this.state.errorStmtEmpId !== ""
                            }
                            onClick={this.handleMove}
                        >
                            Move
                        </button>

                        <button className="add" onClick={this.handleClear}>
                            Clear
                        </button>
                    </div>
                </form>
            </>
        );
    }
}

export default MoveMember;