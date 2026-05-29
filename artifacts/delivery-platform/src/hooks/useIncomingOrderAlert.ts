import { useEffect, useRef, useState } from "react";

function playNewOrderBeep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const freqs = [880, 1100, 880, 1320];
    freqs.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
      gain.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.1);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.1);
    });
    setTimeout(() => ctx.close(), 1000);
  } catch (_) {}
}

function showNewOrderNotif(deliveryAddress: string) {
  try {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification("🚚 Nouvelle commande TELIMA !", {
        body: `Livraison vers : ${deliveryAddress}\nAcceptez dans 30 secondes`,
        icon: "/favicon.ico",
        tag: "telima-new-order",
        requireInteraction: true,
      });
    }
  } catch (_) {}
}

export type IncomingOrder = {
  id: number;
  pickupAddress?: string | null;
  deliveryAddress: string;
  driverAmount?: number | null;
  orderType?: string | null;
  createdAt: string;
};

const TIMEOUT_SECONDS = 30;

export function useIncomingOrderAlert(pendingOrder: IncomingOrder | undefined) {
  const lastOrderIdRef = useRef<number | null>(null);
  const [countdown, setCountdown] = useState<number>(TIMEOUT_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!pendingOrder) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      lastOrderIdRef.current = null;
      setCountdown(TIMEOUT_SECONDS);
      return;
    }

    if (pendingOrder.id !== lastOrderIdRef.current) {
      lastOrderIdRef.current = pendingOrder.id;
      setCountdown(TIMEOUT_SECONDS);

      playNewOrderBeep();
      showNewOrderNotif(pendingOrder.deliveryAddress);

      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            timerRef.current = null;
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [pendingOrder?.id]);

  return countdown;
}
