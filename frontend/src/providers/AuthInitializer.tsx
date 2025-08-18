"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/slices/auth.slice";

export default function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const user = JSON.parse(localStorage.getItem("authUser") || "null");

    if (token && user) {
      dispatch(setCredentials({ token, user }));
    }
  }, [dispatch]);

  return null;
}
