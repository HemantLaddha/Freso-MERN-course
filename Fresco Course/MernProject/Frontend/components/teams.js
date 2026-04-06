import React from "react";

export function Teams(props) {
    return (
        <>
            {props.data.map((d) => {
                return (
                    <table>
                        <thead>
                            <tr>
                                <td>
                                    {d[0].technology_name}
                                </td>
                            </tr>
                        </thead>

                        <tbody>
                            {d.map((f, i) => {

                                if (props.edit && props.empId === f.employee_id) {
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>
                                                <input 
                                                    type="text" 
                                                    value={props.empId} 
                                                    onChange={props.handleChange} 
                                                />
                                            </td>

                                            <td>
                                                <input 
                                                    type="text" 
                                                    value={props.empName} 
                                                    onChange={props.handleChange} 
                                                />
                                            </td>

                                            <td>
                                                <input 
                                                    type="text" 
                                                    value={props.experience} 
                                                    onChange={props.handleChange} 
                                                />
                                            </td>

                                            <td>
                                                <button 
                                                    onClick={() => props.handleDone(f.employee_id)}
                                                >
                                                    Done
                                                </button>
                                            </td>

                                            <td>
                                                <button 
                                                    onClick={() => props.handleCancel(f.employee_id)}
                                                >
                                                    Cancel
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                } else {
                                    return (
                                        <tr key={i}>
                                            <td>{i + 1}</td>
                                            <td>{f.employee_id}</td>
                                            <td>{f.employee_name}</td>
                                            <td>{f.experience}</td>

                                            <td>
                                                <button 
                                                    onClick={() => props.handleEdit(f.employee_id)}
                                                >
                                                    Edit
                                                </button>
                                            </td>

                                            <td>
                                                <button 
                                                    onClick={() => props.handleDelete(f.employee_id)}
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                );
            })}
        </>
    );
}

export default Teams;
``