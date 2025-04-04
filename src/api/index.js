import react , {useEffect } from "react";
import axios from "axios";

export const response = await axios.post(
    `${process.env.MANAGEMENT_APP_URL}api/login`,
    formData,
    {
        headers: {
            "Content-Type": "application/json",
        },
    }
);
