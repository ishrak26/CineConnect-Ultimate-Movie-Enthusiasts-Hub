import { useRef, useState, useEffect } from "react";
import Layout from "./layout";
import { useRouter } from "next/router";
import Head from 'next/head'
import styles from '../styles/Form.module.css';
import { faCheck, faTimes, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from 'next/link';
import toast, { Toaster } from 'react-hot-toast';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;


export default function Register() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const userRef = useRef();
    const errRef = useRef();

    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);


    const router = useRouter();

    useEffect(() => {
        setValidName(USER_REGEX.test(username));
    }, [username]);

    useEffect(() => {
        setValidPwd(PWD_REGEX.test(password));
        setValidMatch(password === matchPwd);
    }, [password, matchPwd]);

    useEffect(() => {
        setErrMsg('');
    }, [username, password, matchPwd])

    const submit = async (e) => {
        e.preventDefault();

        const v1 = USER_REGEX.test(username);
        const v2 = PWD_REGEX.test(password);
        if (!v1 || !v2) {
            setErrMsg("Invalid Entry");
            return;
        }

        const response = await fetch('http://localhost:4000/v1/auth/register', {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                password,
                full_name: name
            })
        });

        if (!response.ok) {
            console.error(
                'Error with request:',
                response.status,
                response.statusText
              )
        }

        await router.push('/login');
    }



    return (
        <Layout>
            <Head>
                <title>Register</title>
            </Head>
            <div className="container mx-auto">

                <Toaster position='top-center' reverseOrder={false}></Toaster>

                <div className='flex justify-center items-center h-screen'>
                    <div className={styles.glass} style={{ width: "100%", paddingTop: '3em' }}>

                        <div className="title flex flex-col items-center">
                            <h4 className='text-5xl font-bold'>Register</h4>
                            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>

                            </span>
                        </div>
                        <p ref={errRef} className={errMsg ? "errmsg" : "offscreen"} aria-live="assertive">{errMsg}</p>
                        <form className='py-1' onSubmit={submit}>

                            <div className="textbox flex flex-col items-center gap-6">

                                <input className={styles.textbox} type="text" placeholder='Full Name' required
                                    onChange={e => setName(e.target.value)} />
                                <input className={styles.textbox} type="text" placeholder='Email' required
                                    onChange={e => setEmail(e.target.value)}
                                />
                                <input className={styles.textbox} type="text" placeholder='Username' required
                        
                                id="username"
                                ref={userRef}
                                autoComplete="off"
                                onChange={e => setUsername(e.target.value)}
                                value={username}
                                aria-invalid={validName ? "false" : "true"}
                                aria-describedby="uidnote"
                                onFocus={() => setUserFocus(true)}
                                onBlur={() => setUserFocus(false)}
                                    
                                />
                                <input className={styles.textbox} type="text" placeholder='Password' required
                                    onChange={e => setPassword(e.target.value)}
                                />
                                <button className={styles.btn} type='submit'>Register</button>

                            </div>

                            <div className="text-1xl text-center py-16">
                                <span className='text-gray-500'>Already Registered? <Link href="/login" className='text-red-500'>Login Now</Link></span>
                            </div>

                        </form>

                    </div>
                </div>

            </div>


        </Layout >
    );
};

