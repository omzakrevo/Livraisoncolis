import { useEffect, useRef } from "react";
import { useListNotifications, getListNotificationsQueryKey } from "@workspace/api-client-react";

function playBeep() {
  try {
    const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new Ctx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(900, ctx.currentTime);
    osc.frequency.setValueAtTime(1100, ctx.currentTime + 0.08);
    gain.gain.setValueAtTime(0.35, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.35);
    setTimeout(() => ctx.close(), 800);
  } catch (_) {
    // AudioContext not supported or blocked
  }
}

function showBrowserNotif(message: string) {
  try {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted") {
      new Notification("Livrelo", { body: message, icon: "/favicon.ico", tag: "livrelo-notif" });
    }
  } catch (_) {
    // Silently ignore if notifications are blocked or unsupported
  }
}

export function requestNotifPermission() {
  try {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission().catch(() => {});
    }
  } catch (_) {
    // Blocked in iframes or non-secure contexts — silently ignore
  }
}

export function useNotificationAlert() {
  const prevCountRef = useRef<number | null>(null);
  const initialized = useRef(false);

  const { data } = useListNotifications(
    { unreadOnly: true },
    { query: { queryKey: getListNotificationsQueryKey({ unreadOnly: true }), refetchInterval: 8000 } },
  );

  const list = Array.isArray(data) ? data : [];
  const count = list.length;
  const latestMessage = list[0]?.message ?? "Vous avez une nouvelle notification";

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      prevCountRef.current = count;
      return;
    }
    if (prevCountRef.current !== null && count > prevCountRef.current) {
      playBeep();
      showBrowserNotif(latestMessage);
    }
    prevCountRef.current = count;
  }, [count, latestMessage]);

  useEffect(() => {
    requestNotifPermission();
  }, []);

  return count;
}
