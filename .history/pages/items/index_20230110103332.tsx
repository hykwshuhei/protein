// 商品一覧画面
// 表示の方でswrを書いて、PULLDOWNするとURLが変化するようにする。

import Link from 'next/link';
import { NextPage } from 'next';
import styles from '../../styles/items_index.module.css';
import ItemDisplayNew from '../../components/itemDisplayNew';
import Head from 'next/head';
import Header from '../layout/header';
import CategoryTypeSearch from '../../components/categoryTypeSearch';
import useSWR from 'swr';
import { ChangeEvent, useState, useRef, useEffect } from 'react';
import CategoryFlavorSearch from '../../components/categoryFlavorSearch';
import Image from 'next/image';
import Searching from '../../components/Searching';
import { Users, Users2, Users3, User, Item } from '../../types/type';
import TooltipButton from '../../components/tooltipButton';
import Footer from '../layout/footer';
import { supabase } from "../../utils/supabase";
import React from 'react';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const ItemDisplay: NextPage = () => {
  // async function data2(){
  //     let a =await supabase.from("items").select("*")
  //     console.log(a.data!)
  // }

  const [resource, setResource] = useState('api/supabase');
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState('');
  const [flavor, setFlavor] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showchatbot, setShowChatbot] = useState(false);
  const [itemData,setItemData] = useState([])


  //検索、絞り込み、商品詳細のクリック以外の何もしない時間が5秒あればチャットボット出現させる
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowChatbot(true);
    }, 5000);

    return () => clearTimeout(timeout);
  }, [resource, category, flavor, searchQuery, count]);

  const inputref = useRef<HTMLInputElement>();

  //ポストする
  useEffect(() => {
    if (category) {async () => {
      let {data}:any = await supabase.from('items').select("*").eq("category",category)
      setItemData(data)
    }
      // setResource(
      //   `${process.env.NEXT_PUBLIC_PROTEIN}/api/items?flavor_like=${flavor}&category=${category}`
      // );

    } else if (flavor) {
      setResource(
        `${process.env.NEXT_PUBLIC_PROTEIN}/api/items?flavor_like=${flavor}`
      );
    } else {
      setResource(
        'api/supabase'
        // `${process.env.NEXT_PUBLIC_PROTEIN}/api/items`
        );
    }
  }, [flavor, category]);
  

  const { data, error } = useSWR(resource, fetcher);
  if (error) return <div>Failed to Load</div>;
  if (!data) return <div>Loading...</div>;

  console.log(data);
  if(data){() => console.log(`data:${data});setItemData(data)};


  // 種類検索イベント
  const categoryHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setCategory(e.target.value);
  };

  // フレーバー検索イベント
  const flavorHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setFlavor(e.target.value);
  };

  const searchData = itemData.filter((item: Item) => {
    return (
      searchQuery.length === 0 || item.name.match(searchQuery)
      // 検索BOXに値がない場合のmap、searchQueryに入っている値とdb.jsonのnameと合致する商品のみ表示するmap
    );
  });
  const totalCount = searchData.length;
  const pageSize = 12;
  let startIndex = (count - 1) * pageSize;
  let value;
  if (flavor || (category && count >= 2)) {
    value = searchData.slice(0, pageSize);
  } else {
    value = searchData.slice(startIndex, startIndex + pageSize);
  }

  const range = (start: number, end: number) =>
    [...Array(end - start + 1)].map((_, i) => start + i);

  // 検索BOXイベント
  const handleSearch = () => {
    // フィルタリング機能、この小文字の中にcurrent.valueが含まれている商品情報だけ残す
    // stateに現在入力されている値をいれていく
    setSearchQuery(inputref.current!.value);
  };

  return (
    <>
      <Head>
        <title>RAKUTEIN</title>
      </Head>
      <Header />
      <div className={styles.all}>
        <section className={styles.searchList}>
          <div className={styles.searchflex}>
            {/* 種類検索コンポーネント */}
            <CategoryTypeSearch
              category={category}
              categoryHandler={categoryHandler}
            />
            &nbsp;&nbsp;&nbsp;
            {/* フレーバー検索コンポーネント */}
            <CategoryFlavorSearch
              flavor={flavor}
              flavorHandler={flavorHandler}
            />
          </div>
          &nbsp;&nbsp;&nbsp;
          {/* 検索BOXコンポーネント */}
          <Searching
            handleSearch={handleSearch}
            inputref={inputref}
          />
        </section>
        <section>
          <Image
            priority
            className={styles.img}
            width={900}
            height={700}
            src="/images/sports.jpg"
            alt="画像"
          />
        </section>

        {/* Chatbotコンポーネント */}
        <div>{showchatbot && <TooltipButton />}</div>

        <div className={styles.background}>
          <p className={styles.titlesCenter}>
            <span className={styles.titleCenter}>ITEMS</span>
          </p>
          <div className={styles.displayCenter}>
            {/* 商品一覧表示コンポーネント */}
            <ItemDisplayNew data={value} searchQuery={searchQuery} />
          </div>
          {/* ページングのボタン */}
          <div className={styles.page}>
            {range(1, Math.ceil(totalCount / pageSize)).map(
              (number, index) => (
                <Link
                  className={styles.paging}
                  key={index}
                  onClick={() => setCount(number)}
                  href=""
                >
                  {number}
                </Link>
              )
            )}
          </div>
        </div>

        <div className={styles.form}>
          <h2 className={styles.h2}>
            <span className={styles.border}>ホエイプロテイン</span>と
            <span className={styles.border}>カゼインプロテイン</span>
            の違いとは？
          </h2>
          <br />
          <Image
            priority
            src="/images/powder.jpg"
            alt="powder"
            width={700}
            height={900}
            className={styles.imgCenter}
          />
          <h2>原材料の違い</h2>
          <hr></hr>
          <p>
            生乳を原料として生成される動物性タンパク質のひとつです。ホエイとはヨーグルトの上澄みに浮いている液体「乳清」のことで、溶けやすい物質。豊富なタンパク質の他ビタミンやミネラルを含んでいます。一方でカゼインプロテインはヨーグルトでいう固体の部分で、生乳に含まれる不溶性の成分。生乳が含むタンパク質のうち約80%がカゼインで,
            残りの20%がホエイです。
          </p>
          <br />
          <br />
          <h2>飲むタイミング</h2>
          <hr></hr>
          <p>
            カゼインはゆっくりと消化されるため、筋トレ後に飲むにはあまり適していません。このタイミングで飲むのであればホエイプロテインです。ホエイは人体に必要な必須アミノ酸を含みさらに、運動によって失われやすいBCAAも豊富に含んでいるため、カラダづくりの速度はホエイのほうが高くなっています。そして、寝る前の夜食や間食のとしてはカゼインプロテインを摂取するのがおすすめです。
          </p>
          <br />
          <br />
          <h2>プロテインを摂取するメリット</h2>
          <hr></hr>
          <br />
          <h3>摂取カロリーをコントロール</h3>
          <p>
            満腹感を感じることで摂取カロリーをコントロールすることができます。ダイエット中の人もバルクアップしたい人のどちらにもおすすめ。カゼインは1日の終わりの方で摂取することで最大限そのメリットを活かすことができます。脂肪を落としつつ、できるだけ筋肉量や代謝をキープするためにも、プロテインによるタンパク質の摂取は有効です。
          </p>
          <br />
          <h3>カラダの成長サポート</h3>
          <p>
            カラダを成長させるためには、分解と合成作用のバランスを保つ必要があります。鍛えたいのであれば、カラダの合成を増加させることと、分解を防ぐことの両方が同時に必要になってきます。
            カゼインは血中にゆっくりと着実に吸収されるプロテインです。カゼインはどちらかというと、後者の分解を防ぎたい場合に役立ちます。結果的に、カゼインを適切に摂ることで、マイナスを回避してプラス・マイナスでプラスにさせることができます。
          </p>
          <h2></h2>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ItemDisplay;
