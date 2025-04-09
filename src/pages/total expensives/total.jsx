import React, { useEffect, useState } from "react";
import styles from "./total.module.css";
import axios from "axios";

const TotalExpensives = () => {
    const id = localStorage.getItem("UserId");
  const [totals, setTotals] = useState({
    totalAmount: 0,
    payAmount: 0,
    remainingAmount: 0,
    userId:id
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://construction-management-app-backend-qqvu.vercel.app/api/total",
        { params: { userId: id } }
      );

      const { totalAmount, payAmount, remainingAmount } = response.data;

      setTotals({
        totalAmount: totalAmount || 0,
        payAmount: payAmount || 0,
        remainingAmount: remainingAmount || 0,
      });
    } catch (error) {
      console.error("Error fetching totals:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const cardData = [
    {
      title: "Total Amount",
      count: totals.totalAmount,
      bgClass: styles.cherry,
    },
    {
      title: "Paid Amount",
      count: totals.payAmount,
      bgClass: styles.blueDark,
    },
    {
      title: "Remaining Amount",
      count: totals.remainingAmount,
      bgClass: styles.greenDark,
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        {cardData.map((item, index) => (
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
            {item.title}: ({item.count})
          </h1>
        </div>
      </div>
    </div>
  );
};

export default TotalExpensives;
