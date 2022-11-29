import useSWR from 'swr';
import styles from 'styles/items_index.module.css';
import { useState, useEffect, ChangeEvent } from 'react';
import { setTokenSourceMapRange } from 'typescript';

const fetcher = (resource: any, init: any) =>
  fetch(resource, init).then((res) => res.json());

export default function CategoryTypeSearch({
  category,
  categoryHandler,
}: {
  category: any;
  categoryHandler: any;
}) {
  // useStateで取得データを表示する

  return (
    <div className={styles.cp_ipselect}>
      <label className={styles.category1_selectlabel}>種類</label>
      <select
        className={styles.category1}
        onChange={categoryHandler}
        value={category}
        required
      >
        <option value="" hidden disabled selected></option>
        <option value="whey">ホエイプロテイン</option>
        <option value="casein">カゼインプロテイン</option>
      </select>
      <span className={styles.category1_highlight}></span>
      <span className={styles.category1_selectbar}></span>
    </div>
  );
}