import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { gql, useQuery } from '@apollo/client';

const GET_USERS = gql`
  query GetUsers {
    usersm {
      name
      email
      id
    }
  }
`;

const Home: NextPage = () => {
  const { data, loading, error } = useQuery(GET_USERS);

  if (loading) return <p>ローディング中です</p>;
  if (error) return <p>エラーが発生しています</p>;

  const { usersm } = data;

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        <p>ユーザ情報 </p>
        {usersm.map((user: { id: number; name: string; email: string }) => (
          <div key={user.id}>Name: {user.name}</div>
        ))}
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}

export default Home
