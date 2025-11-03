import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import ChatInterface from './components/ChatInterface'

export default function App(){
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-white to-slate-50">
      <div className="w-full max-w-3xl">
        <ChatInterface />
      </div>
    </div>
  )
}
