import { useEffect, useRef, useState } from "react";
import Vapi from "@vapi-ai/web";

const PUBLIC_KEY = import.meta.env.VITE_VAPI_PUBLIC_KEY;
const ASSISTANT_ID = import.meta.env.VITE_VAPI_ASSISTANT_ID;

export default function App() {
  const vapiRef = useRef(null);

  const [active, setActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [status, setStatus] = useState("Ready");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!PUBLIC_KEY) {
      setStatus("Configuration required");
      setError("The Vapi public key is missing.");
      return;
    }

    const vapi = new Vapi(PUBLIC_KEY);
    vapiRef.current = vapi;

    vapi.on("call-start", () => {
      setConnecting(false);
      setActive(true);
      setStatus("Connected — you can speak");
      setError("");
    });

    vapi.on("call-end", () => {
      setConnecting(false);
      setActive(false);
      setStatus("Ready");
    });

    vapi.on("speech-start", () => {
      setStatus("Saasify AI is speaking");
    });

    vapi.on("speech-end", () => {
      setStatus("Listening");
    });

    vapi.on("error", (event) => {
      console.error("Vapi error:", event);
      setConnecting(false);
      setActive(false);
      setStatus("Connection failed");
      setError(
        event?.message ||
          "The call could not connect. Please try again."
      );
    });
