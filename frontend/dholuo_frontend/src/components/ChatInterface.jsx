import { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { motion } from 'framer-motion'

const initialGreeting = [
  "Oyawore! Nango! Waneno kaka in e Dholuo AI.",
  "Nango! Ber ahinya — ang'o ma inyalo bedo?",
  "Oyawore, abiro konyi e Dholuo bot!"
]

export default function ChatInterface(){
  const [messages, setMessages] = useState(() => {
    try{
      const s = localStorage.getItem('dholuo_chat')
      return s ? JSON.parse(s) : [{sender:'bot', text: initialGreeting[Math.floor(Math.random()*initialGreeting.length)]}]
    }catch(e){
      return [{sender:'bot', text: initialGreeting[0]}]
    }
  })
  const [input, setInput] = useState('')
  const listRef = useRef(null)
  useEffect(()=>{ localStorage.setItem('dholuo_chat', JSON.stringify(messages)); scrollToBottom() }, [messages])

  function scrollToBottom(){
    try{ listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' }) }catch(e){}
  }

  async function sendMessage(){
    const text = input.trim()
    if(!text) return
    const userMsg = { sender:'user', text }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    try{
      const res = await axios.post('http://127.0.0.1:8000/ai', { text }, { timeout: 10000 })
      const reply = res?.data?.response || res?.data?.reply || 'Aheri — server ok odonjo gi wang'u.'
      setMessages(prev => [...prev, { sender:'bot', text: reply }])
    }catch(err){
      setMessages(prev => [...prev, { sender:'bot', text: 'Timbene! Server ok oduogo.' }])
    }
  }

  function handleKey(e){
    if(e.key === 'Enter') sendMessage()
  }

  function clearChat(){
    localStorage.removeItem('dholuo_chat')
    setMessages([{sender:'bot', text: initialGreeting[Math.floor(Math.random()*initialGreeting.length)]}])
  }

  return (
    <div className="bg-white shadow-2xl rounded-2xl overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Remb Luo — Dholuo AI</h2>
          <p className="text-sm text-gray-500">Friendly Dholuo assistant</p>
        </div>
        <div>
          <button onClick={clearChat} className="text-sm px-3 py-1 bg-gray-100 rounded-md">Clear</button>
        </div>
      </div>

      <div ref={listRef} className="p-4 h-[60vh] overflow-y-auto space-y-3 bg-gradient-to-b from-slate-50 to-white">
        {messages.map((m,i)=>(
          <motion.div key={i} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} className={`max-w-[80%] ${m.sender==='user' ? 'ml-auto text-right' : ''}`}>
            <div className={`inline-block px-4 py-2 rounded-2xl ${m.sender==='user' ? 'bg-[#1C6758] text-white' : 'bg-[#E6F6F0] text-gray-800'}`}>
              {m.text}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex p-4 border-t items-center gap-3">
        <input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={handleKey} placeholder="Wach ang'o..." className="flex-1 px-4 py-3 rounded-full border outline-none"/>
        <button onClick={sendMessage} className="px-4 py-3 bg-[#1C6758] text-white rounded-full">Wuocha</button>
      </div>
    </div>
  )
}
