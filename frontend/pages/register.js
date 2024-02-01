import React, { useState } from 'react';
import Layout from "./layout";
import { useRouter } from "next/router";
import Head from 'next/head'
import styles from '../styles/Form.module.css';
import { registerValidate } from '../lib/validate'

import { Link } from 'next/link';
import toast, { Toaster } from 'react-hot-toast';
import { useFormik } from 'formik';
import convertToBase64 from '../lib/convert';
import { registerUser } from '../lib/helper'

const Register = () => {

    const router = useRouter();
    const [file, setFile] = useState()

    const [show, setShow] = useState({ password: false, cpassword: false })
    const formik = useFormik({
        initialValues: {
            name: '',
            username: '',
            email: '',
            password: '',
            cpassword: ''
        },
        validate: registerValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit
    })

    async function onSubmit(values) {
        const options = {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username,
                email,
                password,
                full_name: name
            })
        }

        await fetch('http://localhost:4000/v1/auth/register', options)
            .then(res => res.json())
            .then((data) => {
                if (data) router.push('/login')
            })
    }

    /** formik doensn't support file upload so we need to create this handler */
    const onUpload = async e => {
        const base64 = await convertToBase64(e.target.files[0]);
        setFile(base64);
    }


    return (
        <Layout>
            <Head>
                <title>Register</title>
            </Head>
            <div className="container mx-auto">

                <Toaster position='top-center' reverseOrder={false}></Toaster>

                <div className='flex justify-center items-center h-screen'>
                    <div className={styles.glass} style={{ width: "65%", paddingTop: '3em' }}>

                        <div className="title flex flex-col items-center">
                            <h4 className='text-5xl font-bold'>Register</h4>
                            <span className='py-4 text-xl w-2/3 text-center text-gray-500'>

                            </span>
                        </div>

                        <form className='py-1' onSubmit={formik.handleSubmit}>

                            <div className="textbox flex flex-col items-center gap-6">
                                <input {...formik.getFieldProps('name')} className={styles.textbox} type="text" placeholder='Full Name*' />
                                <input {...formik.getFieldProps('email')} className={styles.textbox} type="text" placeholder='Email*' />
                                <input {...formik.getFieldProps('username')} className={styles.textbox} type="text" placeholder='Username*' />
                                <input {...formik.getFieldProps('password')} className={styles.textbox} type="text" placeholder='Password*' />
                                <button className={styles.btn} type='submit'>Register</button>
                                <Link href='/login'
                                    className='text-xl text-gray-500'>Already have an account? Login</Link>

                            </div>

                        </form>

                    </div>
                </div>
                
            </div>

            
        </Layout>
    );
};

export default Register;
