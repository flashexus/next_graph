import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

// import { gql, useQuery } from '@apollo/client';
import {useState,useEffect} from 'react'
import { stringify } from 'querystring'

const Posts: NextPage = () => {
  const [users,setUsers] = useState<string[]>([])
  useEffect(() =>{
    const fetchUsers = async() =>{
      const response = await fetch('/api/users')
      const data = await response.json()
      setUsers(data.users)
    }
    fetchUsers()
  },[])
  const list = () => {
    type User = typeof users;
    return(
      users.map( user<User> => {
        <li key={user.id}>{user.name}</li>
    }))
  }

  return (
    <div>
      <ul>
        {list}
      </ul>
    </div>
  )
}


export default Posts