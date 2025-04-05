import React from "react";
import styles from "./total.module.css";

const data = [
  {
    title: "Total Amount ",
    count: "0",
    bgClass: styles.cherry,
  },
  {
    title: "Paid Amount",
    count: "0",
    bgClass: styles.blueDark,
  },
  {
    title: "Remaining Amount",
    count: "0",
    bgClass: styles.greenDark,
  },
  {
    title: "Remaining Amount",
    count: "0",
    bgClass: styles.orangeDark,
  },
];

const TotalExpensives = () => {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {data.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div>
    </div>
  );
};

const Card = ({ item }) => {
  return (
    <div className={styles.col}>
      <div className={`${styles.card} ${item.bgClass} mt-5`}>
        <div className={styles.cardStatistic}>
          <div className={styles.cardIcon}>
            <i className="fas fa-wallet"></i>
          </div>
          <h1 className={styles.cardTitle}>
            {item.title} : ({item.count})
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TotalExpensives;
