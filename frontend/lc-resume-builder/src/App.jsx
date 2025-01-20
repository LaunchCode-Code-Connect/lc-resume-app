// Import necessary dependencies
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './App.css';

const App = () => {
    const [formData, setFormData] = useState({
        name: '',
        roles: [],
        education: []
    });

    const addRole = () => {
        setFormData({
            ...formData,
            roles: [...formData.roles, {
                role: '',
                startDate: null,
                endDate: null,
                isCurrent: false,
                experiences: ['']
            }]
        });
    };

    const addEducation = () => {
        setFormData({
            ...formData,
            education: [...formData.education, {
                details: ['']
            }]
        });
    };

    const saveData = async () => {
        const response = await fetch('http://localhost:5000/save', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            alert('Data saved successfully!');
        } else {
            alert('Error saving data.');
        }
    };

    return (
        <div className="App">
            <h1>Job Application</h1>

            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
            </div>

            <div>
                <h2>Roles</h2>
                {formData.roles.map((role, index) => (
                    <div key={index} className="role-section">
                        <input
                            type="text"
                            placeholder="Role"
                            value={role.role}
                            onChange={(e) => {
                                const newRoles = [...formData.roles];
                                newRoles[index].role = e.target.value;
                                setFormData({ ...formData, roles: newRoles });
                            }}
                        />
                        <DatePicker
                            selected={role.startDate}
                            onChange={(date) => {
                                const newRoles = [...formData.roles];
                                newRoles[index].startDate = date;
                                setFormData({ ...formData, roles: newRoles });
                            }}
                            placeholderText="Start Date"
                        />
                        <DatePicker
                            selected={role.endDate}
                            onChange={(date) => {
                                const newRoles = [...formData.roles];
                                newRoles[index].endDate = date;
                                setFormData({ ...formData, roles: newRoles });
                            }}
                            placeholderText="End Date"
                        />
                        <label>
                            Current Role:
                            <input
                                type="checkbox"
                                checked={role.isCurrent}
                                onChange={(e) => {
                                    const newRoles = [...formData.roles];
                                    newRoles[index].isCurrent = e.target.checked;
                                    setFormData({ ...formData, roles: newRoles });
                                }}
                            />
                        </label>
                        <h4>Experience</h4>
                        {role.experiences.map((experience, expIndex) => (
                            <input
                                key={expIndex}
                                type="text"
                                placeholder="Experience"
                                value={experience}
                                onChange={(e) => {
                                    const newRoles = [...formData.roles];
                                    newRoles[index].experiences[expIndex] = e.target.value;
                                    setFormData({ ...formData, roles: newRoles });
                                }}
                            />
                        ))}
                        {role.experiences.length < 4 && (
                            <button onClick={() => {
                                const newRoles = [...formData.roles];
                                newRoles[index].experiences.push('');
                                setFormData({ ...formData, roles: newRoles });
                            }}>Add Experience</button>
                        )}
                    </div>
                ))}
                {formData.roles.length < 4 && <button onClick={addRole}>Add Role</button>}
            </div>

            <div>
                <h2>Education</h2>
                {formData.education.map((edu, index) => (
                    <div key={index} className="education-section">
                        {edu.details.map((detail, detailIndex) => (
                            <input
                                key={detailIndex}
                                type="text"
                                placeholder="Education Detail"
                                value={detail}
                                onChange={(e) => {
                                    const newEducation = [...formData.education];
                                    newEducation[index].details[detailIndex] = e.target.value;
                                    setFormData({ ...formData, education: newEducation });
                                }}
                            />
                        ))}
                        {edu.details.length < 5 && (
                            <button onClick={() => {
                                const newEducation = [...formData.education];
                                newEducation[index].details.push('');
                                setFormData({ ...formData, education: newEducation });
                            }}>Add Detail</button>
                        )}
                    </div>
                ))}
                {formData.education.length < 5 && <button onClick={addEducation}>Add Education</button>}
            </div>

            <button onClick={saveData}>Save</button>
        </div>
    );
};

export default App;
