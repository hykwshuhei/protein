import Head from 'next/head';
import style from '../styles/index.module.css';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import HeaderLogin from './layout/headerLogin';
import { isGeneratorFunction } from 'util/types';

export default function UserLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);
  const [user, setUser] = useState('');

  const data = {
    email: email,
    password: password,
  };

  useEffect(() => {
    if (document.cookie !== '') {
      setUser("exist")
    } else {
      setUser("")
    }
  }, []);

  const handler = (event: any) => {
    event.preventDefault();
    console.log(event);
    fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        console.log(response);
        response.json();
        if (response.status !== 200) {
          setVisible(true);
        } else if (response.status === 200) {
          router.push('/items');
        }
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <>
      {(() => {
        if (user !== '') {
          <div>
            <HeaderLogin />
            <div className={style.all}>
              <Head>
                <title>ログイン</title>
                <meta
                  name="description"
                  content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
              </Head>

              <main className={style.main}>
                <hgroup className={style.hgroup}>
                  <h1 className={style.h1}>ログイン</h1>
                  <Link href="/users/new">
                    <h3 className={style.h3}>新規ユーザー登録はこちら</h3>
                  </Link>
                  <h3
                    className={style.login}
                    style={{ display: visible ? 'block' : 'none' }}
                  >
                    ユーザーが見つかりません。もう一度入力してください。
                  </h3>
                </hgroup>
                <form className={style.form} onSubmit={handler}>
                  <div className={style.group}>
                    <input
                      type="email"
                      name="email"
                      placeholder="メールアドレス"
                      className={style.input}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setVisible(false);
                      }}
                      required
                    />
                    <span className={style.highlight}></span>
                    <span className={style.bar}></span>
                    <label className={style.label}></label>
                  </div>
                  <div className={style.group}>
                    <input
                      type="password"
                      name="password"
                      id="password_validation"
                      placeholder="パスワード&nbsp;(8文字以上16文字以下)"
                      className={style.input}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setVisible(false);
                      }}
                      required
                      pattern=".{8,16}"
                      title="8文字以上16文字以下"
                    />
                    <span className={style.highlight}></span>
                    <span className={style.bar}></span>
                    <label className={style.label}></label>
                  </div>
                  <button
                    type="submit"
                    className={`${style.button} ${style.buttonBlue}`}
                  >
                    ログイン
                    <div
                      className={`${style.ripples} ${style.buttonRipples}`}
                    >
                      <span className={style.ripplesCircle}></span>
                    </div>
                  </button>
                </form>
              </main>
            </div>
          </div>
        } else {
          <Link href="/items/">
          </Link>
        }
      })()}
    </>
  );
}
