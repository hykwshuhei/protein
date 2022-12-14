import styles from '../../styles/purchase.module.css';
import Head from 'next/head';
import Link from 'next/link';
import Header from '../layout/header';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

export const getServerSideProps: GetServerSideProps = async (
  context
) => {
  const cookies = context.req.cookies;
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_PROTEIN_DATA}/subscriptionCart?userId=${cookies.id}`
  );
  const subscriptionCart = await res.json();

  const subscriptionCart2 = subscriptionCart.slice(-1)[0];
  //購入時間
  subscriptionCart.forEach((cart: any) => {
    cart.date = new Date().toLocaleString('ja-JP');
  });
  const subscription = {
    userId: cookies.id,
    id: subscriptionCart2.id,
    items: subscriptionCart2,
  };
  await fetch(`${process.env.NEXT_PUBLIC_PROTEIN_DATA}/subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription),
  })
 
  return {
    props: { subscriptionCart2 },
  };
};

export default function PurchaseCompletion() {
  return (
    <>
      <Header />
      <hr className={styles.hr}></hr>
      <Head>
        <title>購入完了</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.box1}>
          <h1 className={styles.purchased_title}>ご注文完了</h1>

          <div className={styles.purchased_h2}>
            <span className={styles.purchased_h2font}>
              ご注文ありがとうございました
            </span>
          </div>
          <p className={styles.purchased_p}>
            詳細はユーザー情報のご購入履歴をご確認ください。
          </p>

          <div className={styles.purchasedBottonsDisplay}>
            <div className={styles.purchased_buttons}>
              <div className={styles.bottonC}>
                <Link href="/users">
                  <button className={styles.purchased_button}>
                    ご購入履歴を確認する
                  </button>
                </Link>
              </div>
              <div className={styles.bottonC}>
                <Link href="/items">
                  <button className={styles.purchased_button}>
                    買い物を続ける
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <h1>RAKUTEIN</h1>
      </footer>
    </>
  );
}