"use client";

import { TranscriptProvider } from "@/app/contexts/TranscriptContext";
import { EventProvider } from "@/app/contexts/EventContext";

export default function VoiceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TranscriptProvider>
      <EventProvider>
        {children}
      </EventProvider>
    </TranscriptProvider>
  );
}
