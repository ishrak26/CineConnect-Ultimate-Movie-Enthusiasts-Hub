import React, { useState } from 'react';
import Layout from "./layout";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();

    const submit = async (e) => {
        e.preventDefault();

        // const hashedPassword = bcrypt.hashSync(password, 10); // Salt rounds = 10

        const response = await fetch('http://localhost:4000/v1/auth/login', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify({
                username,
                password
            })
        }).then(response => response.json());

        // print the response to the console
        console.log(response);

        // decode the token
        const token = localStorage.getItem('token');
        const decoded = jwt_decode(token);
        console.log(decoded);

        await router.push('/');
    }

    return (
        <Layout>
            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
                <input type="username" className="form-control" placeholder="Username" required
                       onChange={e => setUsername(e.target.value)}
                />

                <input type="password" className="form-control" placeholder="Password" required
                       onChange={e => setPassword(e.target.value)}
                />

                <button className="w-100 btn-lg btn-primary" type="submit">Sign in</button>
            </form>
        </Layout>
    );
};

export default Login;
