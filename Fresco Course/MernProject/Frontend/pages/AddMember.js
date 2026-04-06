import React,{ Component } from "react";
import Header from "../Components/Header";
import remove from "../icon/close.png";
import mockTeam from "../Tests/mockData";

class AddMember extends Component {
    constructor(props){
        super(props)
        this.state = {
            empId: "",
            empName: "",
            teamName: "",
            experience: "",
            newTeam: "",
            createTeam: false,
            deleteTeam: false,
            teams: [],
            errorStmtEmpId: "",
            errorStmtEmpName: "",
            errorStmtExperience: "",
        };
    }

    componentDidMount(){
        this.setState({teams: mockTeam})
    }

    getLocalStorage = () => {
        //code goes here to get token value from local storage
        return localStorage.getItem("token");
    };

    handleGetTeam = async () => {
        //code goes here to return the response of technologies get api
        const response = await fetch("/api/tracker/technologies/get", {
            headers: {
                Authorization: `Bearer ${this.getLocalStorage()}`,
            },
        });
        return response.json();
    };

    handleChange = (e) => {
        //code goes here to handle onChange event
        this.setState({[e.target.name] : e.target.value})

        if(this.state.empId===""){
            this.setState({errorStmtEmpId : "*Please enter a value"})
        } else if(Number(this.state.empId)>=3000000 || Number(this.state.empId)<=100000){
            this.setState({errorStmtEmpId : "*Employee ID is expected between 100000 and 3000000"})
        } else{
            this.setState({errorStmtEmpId : ""})
        }

        if(this.state.empName===""){
            this.setState({errorStmtEmpName : "*Please enter a value"})
        } else if(this.state.empName.includes("0")){
            this.setState({errorStmtEmpName : "Employee name can have only alphabets and spaces"})
        } else if(this.state.empName.length<3){
            this.setState({errorStmtEmpName : "Employee Name should have atleast 3 letters"})
        } else{
            this.setState({errorStmtEmpName : ""})
        }

        if(this.state.experience===""){
            this.setState({errorStmtExperience : "*Please enter a value"})
        } else {
            this.setState({errorStmtExperience : ""})
        }
    };

    handleAddMember = async (e) => {
        //code goes here to handle add member button using the return value of AddRequest
        e.preventDefault();
        const res = await this.AddRequest()
        return res;
    };

    AddRequest = async () => {
        //code goes here to return the response status of add member api
        const response = await fetch("/api/tracker/members/add", {
            body: JSON.stringify({
                employee_id : this.state.empId,
                employee_name : this.state.empName,
                technology_name : this.state.teamName,
                experience : this.state.experience
            }),
            headers: {
                Authorization: `Bearer ${this.getLocalStorage()}`,
                "Content-type": "application/json; charset=UTF-8",
            },
            method: "post",
        });
        return response.json()
    };

    handleClear = () => {
        //code goes here to handle clear button
        this.setState({
            empId: "",
            empName: "",
            teamName: "",
            experience: "",
            newTeam: "",
            createTeam: false,
            deleteTeam: false,
            teams: [],
            errorStmtEmpId: "",
            errorStmtEmpName: "",
            errorStmtExperience: "",
        });
    };

    handleAddorDeleteTeam = (e, action) => {
        // code goes here to switch between add or delete team
        e.preventDefault();
        if(action.type==="Add"){
            this.setState({createTeam: true , deleteTeam : false})
        } else if(action.type==="Remove"){
            this.setState({createTeam: false , deleteTeam : true})
        }
    }

    handleCancel = (e, action) => {
        //code goes here to handle cancel button
        e.preventDefault()
        this.setState({createTeam: false , deleteTeam : false})
    }

    handleSave = async (e) => {
        //code goes here to handle save button
        const res = await this.saveTeam()
        this.setState({createTeam: false , deleteTeam : false})
        return res
    }

    saveTeam = async () => {
        //code goes here to return the status of /technologies/add api
        const response = await fetch(`/api/tracker/technologies/add`, {
            body: JSON.stringify({technology_name : this.state.newTeam}),
            headers: {
                Authorization: `Bearer ${this.getLocalStorage()}`,
                "Content-type": "application/json; charset=UTF-8",
            },
            method: "post",
        });
        return response.json()
    };

    handleRemoveTeam = async (e, tech) => {
        //code goes here to handle remove team using the value returned from removeTeamRequest function
        e.preventDefault()
        const res = await this.removeTeamRequest(tech)
        return res
    };

    removeTeamRequest = async (id) => {
        //code goes here to return response status of remove technologies api
        const response = await fetch(`/api/tracker/technologies/remove/${id}`, {
            headers : {
                Authorization: `Bearer ${this.getLocalStorage()}`,
            },
            method: "Delete",
        });
        return response.json()
    };

    render() {
        return (
            <>
                <Header />
                <form>
                    <h1>Add Team Member</h1>

                    {/*code goes here to display the input fields, Plus and Delete button*/}
                    <input type="text" name="empId" value={this.state.empId} onChange={this.handleChange}/>
                    <span>{this.state.errorStmtEmpId}</span>

                    <input type="text" name="empName" value={this.state.empName} onChange={this.handleChange}/>
                    <span>{this.state.errorStmtEmpName}</span>

                    <select name="teamName" value={this.state.teamName} onChange={this.handleChange} >
                        <option value="">--select option--</option>
                        {this.state.teams.length && this.state.teams.map((team)=>(
                            <option key={team._id} value={team.name}>{team.name}</option>
                        ))}
                    </select>

                    <button onClick={(e)=> this.handleAddorDeleteTeam(e,{type:"Add"})}>+</button>
                    <button onClick={(e)=> this.handleAddorDeleteTeam(e,{type:"Remove"})}>Delete</button>

                    {this.state.createTeam &&
                    (<div className="addList">
                        <p>Create New Label</p>
                        <input type="text" name="newTeam" value={this.state.newTeam} onChange={this.handleChange}/>
                        <button onClick={(e)=> this.handleSave(e)}>Save</button>
                        <button onClick={(e)=> this.handleCancel(e,{type : "Add"})}>Cancel</button>
                    </div>)}

                    {this.state.deleteTeam &&
                    (<div className="addList">
                        <p>Delete Team</p>
                        {this.state.teams.length && (<table>{this.state.teams.map((team)=>(
                            <tr key={team.name}><td>{team.name}</td><td><img alt="" src={remove} onClick={(e)=> this.handleRemoveTeam(e, team.name)} /></td></tr>))}</table>)}
                        <tbody><tr><td><button onClick={(e)=> this.handleCancel(e, {type : "Remove"})}>Cancel</button></td></tr></tbody>
                    </div>)
                    }

                    <div>
                        <input type="text" name="experience" value={this.state.experience} onChange={this.handleChange}/>
                        <span>{this.state.errorStmtExperience}</span>
                    </div>

                    <div>
                        <button className="button" onClick={(e)=>this.handleAddMember(e)} disabled={this.state.empId==="" || this.state.empName==="" || this.state.experience==="" || this.state.errorStmtEmpId!=="" || this.state.errorStmtEmpName!=="" || this.state.errorStmtExperience!=="" } >
                            Add
                        </button>
                        <button className="button" onClick={()=>this.handleClear()} >
                            Clear
                        </button>
                    </div>
                </form>
            </>
        );
    }
}

export default AddMember;