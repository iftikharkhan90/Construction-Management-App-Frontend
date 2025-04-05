import React from "react";
import styles from "./card.module.css"; 

const data = [
  {
    title: "Total Amount",
    count: "",
    bgClass: styles.cherry,
  },
  {
    title: "Paid Amount",
    count: "",
    bgClass: styles.blueDark,
  },
  {
    title: "Remaining Amount",
    count: "",
    bgClass: styles.greenDark,
  },
];

const Cards = () => {
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
            <i className={item.icon}></i>
          </div>
          <h1 className={styles.cardTitle}>
            {item.title} - {item.count} ({item.percent}{" "}
            <i className="fa fa-arrow-up"></i>)
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Cards;
