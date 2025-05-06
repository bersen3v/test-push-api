"use client";

import { useEffect, useState } from "react";

// "publicKey": "BG74cAxa1vl8aCucpnLPff6_0UEJU5gGX4Oy-b_6i2wZusGPbVGCxxPSnu7iWvHQMs8zaV58FcG4M0qSY7ZwSJQ",
// "privateKey": "ovMD3XospN6Pjm_s9aFbD0XxWkfSuDxas_HYk6c7Zts"

export default function Home() {
  const [endpoint, setEndPoint] = useState("");
  const [p256h, setP256h] = useState("");
  const [auth, setAuth] = useState("");

  const permissiomRequest = async () => {
    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
      }
    }
  };

  function base64FromArray(uint8array: number[]) {
    const encoded = String.fromCharCode.apply(null, uint8array);
    return btoa(encoded);
  }

  useEffect(() => {
    permissiomRequest().then(() => {
      console.log("спросил разрешения");
    });

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("sw.js").then(
        function (registration) {
          console.log(
            "Service Worker registration successful with scope: ",
            registration.scope
          );
        },
        function (err) {
          console.log("Service Worker registration failed: ", err);
        }
      );
    }

    navigator.serviceWorker.ready.then(async function (registration) {
      if (Notification.permission === "granted") {
        const pushServerPublicKey =
        "BG74cAxa1vl8aCucpnLPff6_0UEJU5gGX4Oy-b_6i2wZusGPbVGCxxPSnu7iWvHQMs8zaV58FcG4M0qSY7ZwSJQ";

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: pushServerPublicKey,
      });

      const p256dh = subscription.getKey("p256dh");
      const auth = subscription.getKey("auth");

      console.log(p256dh);
      // const key = p256dh ? btoa(String.fromCharCode.apply(null, new Uint8Array(p256dh))) : '';
      const key256 = p256dh ? Array.from(new Uint8Array(p256dh)) : [];
      const keyAuth = auth ? Array.from(new Uint8Array(auth)) : [];

      console.log(base64FromArray(key256));
      console.log(base64FromArray(keyAuth));

      setEndPoint(subscription.endpoint);
      setAuth(base64FromArray(keyAuth));
      setP256h(base64FromArray(key256));

      // здесь я передаю на бэкенд юзера и его pushSubscription
      console.log(subscription);
      }
      
    });
  }, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 100,
        padding: 50,
      }}
    >
      <div onClick={async () => {
         const permission = await Notification.requestPermission();
         console.log(permission)
      }}>
        ПОЛУЧИТЬ РАЗРЕШЕНИЕ
      </div>
      <p>p256h: {p256h}</p>
      <p>auth: {auth}</p>
      <p>endpoint: {endpoint}</p>
    </div>
  );
}
