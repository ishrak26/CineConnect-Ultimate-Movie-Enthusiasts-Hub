// Import necessary libraries
import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import React from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useRouter } from 'next/router'
import styles from '@styles/Form.module.css'
import Navbar from '@components/navbar'
import BaseLayout from '@components/BaseLayout'
import Head from 'next/head'
// import '../../../styles/editProfile.css';
// import { supabase } from '../utils/supabaseClient';

// Validation schema
const createSchema = (currentUsername) => {
  // console.log('Inside yup object schema: ', currentUsername)
  return yup
    .object({
      full_name: yup.string().required('Full name is required'),
      image_url: yup.string().url('Must be a valid URL'),
      gender: yup
        .string()
        .oneOf(['male', 'female', 'other'], 'Invalid gender')
        .required('Gender is required'),
      date_of_birth: yup
        .date()
        .max(new Date(), 'Date of birth cannot be in the future')
        .required('Date of birth is required'),
      new_password: yup.string().test(
        'password',
        'Password must be at least 8 characters long and contain at least one lowercase letter, one uppercase letter, one number, and one special character',
        value => !value || /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(value)
      ),
        
      // confirm_password: yup.string().when('password', {
      //   is: val => val && val.length > 0, // only when the password has a positive length
      //   then: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match').required('Confirm password is required'),
      //   otherwise: yup.string().notRequired(),
      // }),
      confirm_password: yup.string().test(
        'confirm-password',
        'Confirm Password must match the New Password',
        function(value) {
          // Only apply validation if confirm_password is not empty
          return !value || value === this.parent.new_password;
        }
      ),
      
      username: yup
        .string()
        .test('is-unique', 'Username is already taken', async (username) => {
          // Check username availability. Adjust the URL as needed.
          try {
            // Skip validation if the username hasn't changed
            if (username === currentUsername) {
              return true
            }
            const response = await fetch(
              `http://localhost:4000/v1/username/check?newUsername=${encodeURIComponent(
                username
              )}`,
              {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
              }
            )
            const data = await response.json()
            console.log(
              '1. Response from the username check inside schema: ',
              data
            )
            return data.message === 'Username is available'
          } catch (error) {
            console.error('Error checking username availability:', error)
            // Return false or throw a validation error if you cannot verify the username's uniqueness
            return false
          }
        }),
    })
    .required()
}

const EditProfile = ({ username, oldProfileData, cookie }) => {
  const schema = createSchema(username)
  // console.log('Inside Edit Profile, client side, validation schema: ', schema)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [startDate, setStartDate] = useState(new Date())
  const router = useRouter()

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(schema),
  })

  // console.log('oldProfileData inside the client side: ', oldProfileData);

  useEffect(() => {
    if (oldProfileData) {
      setValue('full_name', oldProfileData.full_name)
      setValue('image_url', oldProfileData.image_url || '')
      setValue('gender', oldProfileData.gender || '')
      // console.log('oldProfileData.date_of_birth', oldProfileData.date_of_birth);
      if (
        oldProfileData.date_of_birth !== null &&
        oldProfileData.date_of_birth !== undefined
      )
        setValue('date_of_birth', oldProfileData.date_of_birth.split('T')[0])
      // Don't set password and username by default for security reasons
    }
  }, [setValue, oldProfileData])

  const onSubmit = async (data) => {
    console.log('Inside onSubmit, Data submitted: ', data)
    const dob = new Date(data.date_of_birth) // Example date
    dob.setMinutes(dob.getMinutes() - dob.getTimezoneOffset()) // Adjust for timezone
    // const formattedDate1 = dob.getDate().toString().padStart(2, '0') + '/' +
    //                   (dob.getMonth() + 1).toString().padStart(2, '0') + '/' +
    //                   dob.getFullYear().toString();
    const formattedDate = dob.toISOString().split('T')[0] // Convert to YYYY-MM-DD format
    setLoading(true)
    try {
      console.log('Data submitted: ', data)

      const response = await fetch(
        `http://localhost:4000/v1/profile/${username}/update-profile`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            full_name: data.full_name,
            image_url: data.image_url,
            gender: data.gender,
            date_of_birth: formattedDate,
            password: data.new_password,
            newUsername: data.username || username,
          }),
        }
      )
      console.log('Profile update requested successfully')
      console.log('New profile username: ', data.username)
      if (
        data.username === '' ||
        data.username === undefined ||
        data.username === null
      ) {
        router.push(`/profile/${username}`) // Redirect to the profile page after successful update
      } else {
        router.push(`/profile/${data.username}`) // Redirect to the profile page after successful update
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      setError('Failed to update profile.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Head>
        <title>Edit Profile &mdash; CineConnect</title>
        <meta
          name="description"
          content="Millions of movies, TV shows and people to discover. Explore now."
        />
        <meta
          name="keywords"
          content="where can i watch, movie, movies, tv, tv shows, cinema, movielister, movie list, list"
        />

        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
      </Head>

      <Navbar />
      <BaseLayout>
        <h1 className="text-2xl font-bold mb-6">Edit Profile</h1>
        {error && <p>{error}</p>}
        <div className="max-w-xl mx-auto my-10">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <label>
              Full Name
              <input
                {...register('full_name')}
                placeholder="Full Name"
                className="input"
              />
              <p style={{ color: 'red' }}>{errors.full_name?.message}</p>
            </label>
            <label>
              Image URL
              <input
                {...register('image_url')}
                placeholder="Image URL"
                className="input"
              />
              <p style={{ color: 'red' }}>{errors.image_url?.message}</p>
            </label>
            <label>
              {' '}
              Gender
              <select {...register('gender')} className="input">
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <p style={{ color: 'red' }}>{errors.gender?.message}</p>
            </label>
            <label style={{ display: 'flex', flexDirection: 'column' }}>
              Date of Birth
              <Controller
                name="date_of_birth"
                control={control}
                defaultValue={new Date()}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    selected={field.value}
                    onChange={(date) => field.onChange(date)}
                    dateFormat="dd/MM/yyyy"
                    className="input"
                    wrapperClassName="datePicker"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                )}
              />
              <p style={{ color: 'red' }}>{errors.date_of_birth?.message}</p>
            </label>
            <label>
              New Password
              <input
                type="password"
                {...register('new_password')}
                placeholder="New Password"
                className="input"
              />
              <p style={{ color: 'red' }}>{errors.password?.message}</p>
            </label>
            <label>
              Confirm Password
              <input
                type="password"
                {...register('confirm_password')}
                placeholder="Confirm Password"
                className="input"
              />
              <p style={{ color: 'red' }}>{errors.confirm_password?.message}</p>
            </label>
            <label>
              Username
              <input
                {...register('username')}
                placeholder="Username"
                className="input"
              />
              <p style={{ color: 'red' }}>{errors.username?.message}</p>
            </label>
            <button
              className={`${styles.btn}`}
              type="submit"
              disabled={loading}
            >
              Update Profile
            </button>
          </form>
        </div>
      </BaseLayout>
    </div>
  )
}

export async function getServerSideProps(context) {
  const username = context.params.username
  const cookie = context.req.headers.cookie
  // console.log("Current sesisons user id: ", context.req)

  // Helper function to fetch data
  async function fetchData(url, params) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(cookie ? { Cookie: cookie } : {}),
        },
        credentials: 'include',
        ...params,
      })
      return await response.json()
    } catch (error) {
      if (error.response && error.response.status === 404) {
        return { notFound: true }
      }
      return { error: error.message }
    }
  }

  // Use Promise.all to fetch data for different categories concurrently

  try {
    const [oldProfileData] = await Promise.all([
      fetchData(`http://localhost:4000/v1/profile/${username}/edit-profile`),
    ])
    // console.log('oldProfileData', oldProfileData);

    // Check if any of the responses indicate 'not found'
    if (oldProfileData.notFound) {
      return { notFound: true }
    }

    return {
      props: {
        username,
        oldProfileData,
        cookie,
        // Add other props as needed
      },
    }
  } catch (error) {
    console.error('Error during data fetching:', error)
    return {
      props: {
        error: error.message,
      },
    }
  }
}

export default EditProfile
