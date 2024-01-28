import React, { useState } from 'react';
import bcrypt from 'bcryptjs';
import Layout from "./layout";
import { useRouter } from "next/router";

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const router = useRouter();

    const submit = async (e) => {
        e.preventDefault();

        // Hash the password
        // const hashedPassword = bcrypt.hashSync(password, 10); // 10 is the number of salt rounds

        await fetch('http://localhost:4000/v1/auth/register', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                password, // Send the hashed password
                full_name: name
            })
        });

        await router.push('/login');
    }

    return (
        <Layout>
            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Please register</h1>

                <input className="form-control" placeholder="Name" required
                    onChange={e => setName(e.target.value)}
                />

                <input type="email" className="form-control" placeholder="Email" required
                    onChange={e => setEmail(e.target.value)}
                /> 

                <input type="username" className="form-control" placeholder="username" required
                    onChange={e => setUsername(e.target.value)}
                />

                <input type="password" className="form-control" placeholder="Password" required
                    onChange={e => setPassword(e.target.value)}
                />

                <button className="w-100 btn-lg btn-primary" type="submit">Submit</button>
            </form>
        </Layout>
    );
};

export default Register;
