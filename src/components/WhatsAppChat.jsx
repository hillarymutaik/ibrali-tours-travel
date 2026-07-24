import React from 'react'
import { MessageCircle } from 'lucide-react'

/** Floating "chat with us" button — opens a pre-filled WhatsApp conversation. */
export default function WhatsAppChat() {
  return (
    <a
      href="https://wa.me/254786000100?text=Hi%20Ibrali%20Tours%20%26%20Travel%2C%20I%27d%20like%20to%20ask%20about..."
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-transform duration-300 hover:-translate-y-0.5"
      style={{
        background: '#25D366',
        color: '#fff',
        boxShadow: '0 10px 28px -8px rgba(37, 211, 102, 0.65)',
      }}
    >
      <MessageCircle size={26} strokeWidth={1.8} fill="#fff" stroke="#25D366" />
    </a>
  )
}
