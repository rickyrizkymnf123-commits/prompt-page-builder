import { useState, useEffect, useRef } from 'react';

interface Props {
  text: string;
  speed?: number; // chars per tick
  interval?: number; // ms per tick
}

export function TypewriterText({ text, speed = 8, interval = 16 }: Props) {
  const [displayed, setDisplayed] = useState('');
  const idxRef = useRef(0);
  const doneRef = useRef(false);

  useEffect(() => {
    idxRef.current = 0;
    doneRef.current = false;
    setDisplayed('');

    const timer = setInterval(() => {
      if (idxRef.current >= text.length) {
        doneRef.current = true;
        clearInterval(timer);
        return;
      }
      const next = Math.min(idxRef.current + speed, text.length);
      setDisplayed(text.slice(0, next));
      idxRef.current = next;
    }, interval);

    return () => clearInterval(timer);
  }, [text, speed, interval]);

  return (
    <>
      {displayed}
      {!doneRef.current && <span className="inline-block w-0.5 h-4 bg-primary animate-pulse ml-0.5 align-text-bottom" />}
    </>
  );
}
