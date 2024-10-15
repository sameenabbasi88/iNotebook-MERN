import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate instead of useHistory

const Login = ({ showAlert }) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const navigate = useNavigate(); // Use useNavigate instead of useHistory(us page pai navigate kr jai usenavigate sai)

    const handleSubmit = async (e) => {
        e.preventDefault(); //jbh bhi form submit krain to page reload na ho
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: credentials.email, password: credentials.password })
        });
        const json = await response.json();
        console.log(json);
        if (json.success) {
            // Save the auth token and redirect
            localStorage.setItem('token', json.authtoken);
            showAlert("Logged in Successfully!", "success");
            navigate("/"); // Use navigate function instead of history.push

        }
        else {
            showAlert("Invalid Details!", "danger");

        }
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value }); //... spread operator, jo pehlai ki credentials wo ajain
    }

    return (
        <div className='mt-2'>
            <h2>Login to Continue to iNotebook</h2>
            <form onSubmit={handleSubmit}> 
             {/* takai enter marnai sai button click hojai */}
                <div className="my-3">
                    {/* jbh tk onchange na bnai tbh tk hm input field mai type ni kr sktai */}
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" value={credentials.email} onChange={onChange} id="email" name="email" aria-describedby="emailHelp" />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" value={credentials.password} onChange={onChange} name="password" id="password" />
                </div>

                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    )
}

export default Login;
