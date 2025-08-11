


import React, { useEffect, useRef, useState } from 'react';
import socket, { URL } from '../constant/utils';
import axios from 'axios';
import { FaDownload, FaMicrophone, FaPaperclip, FaPaperPlane, FaRegCopy, FaSmile } from 'react-icons/fa';
import EmojiPicker from 'emoji-picker-react';
import ChatHeader from './ChatHeader';
import { format, isToday, isYesterday } from "date-fns";

const Chatgroup = ({ groupId }) => {
  const senderId = localStorage.getItem('Cuserid');
  const inputRef = useRef(null);
  const bottomRef = useRef(null);
console.log(groupId,"hello");

  const [messages, setMessages] = useState([]);
  console.log(messages,"come from bak");
  
  const [inputText, setInputText] = useState('');
  const [file, setFile] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [recording, setRecording] = useState(false);
  const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  

  // Fetch messages + join group socket room
 
useEffect(() => {
  if (!groupId) return;

  // 1. Join the correct group room
  socket.emit('joinGroup', groupId);

  // 2. Fetch existing messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${URL}/api/groups/messages/${groupId}`);
      setMessages(res.data);
    } catch (err) {
      console.error('Failed to load group messages:', err);
    }
  };

  fetchMessages();

  // 3. Handle incoming messages
  const handleReceiveMessage = (msg) => {
    console.log('Received group message:', msg);
    // Handle the message if it's for this group and not from the current user
    if (msg.groupId === groupId && msg.sender._id !== senderId) {
      console.log('Adding message to state:', msg);
      setMessages((prev) => [...prev, msg]);
    }
  };

  socket.on('receiveGroupMessage', handleReceiveMessage);

  // 4. Clean up
  return () => {
    socket.off('receiveGroupMessage', handleReceiveMessage);
  };
}, [groupId]);



  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleEmojiClick = (emojiData) => {
    setInputText(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleAttachFile = (event) => {
    const selected = event.target.files[0];
    if (selected) {
      setFile(selected);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  const toggleRecording = async () => {
    if (!recording) {
      const userStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(userStream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setVoiceBlob(blob);
        setStream(null);
      };

      recorder.start();
      setMediaRecorder(recorder);
      setStream(userStream);
      setRecording(true);
    } else {
      mediaRecorder.stop();
      stream.getTracks().forEach(track => track.stop());
      setRecording(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() && !file && !voiceBlob) return;

    const formData = new FormData();
    formData.append('groupId', groupId);
    formData.append('sender', senderId);
    formData.append('text', inputText);
    if (file) formData.append('file', file);
    if (voiceBlob) formData.append('voice', voiceBlob);

    try {
      // Send to server
      const res = await axios.post(`${URL}/api/groups/message`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

     
      const messageData = {
        ...res.data,
        groupId: groupId   
      };

      // Emit the socket event with the complete data
      socket.emit('sendGroupMessage', messageData);
      
      // Update local state
      setMessages((prev) => [...prev, res.data]);
      setInputText('');
      setFile(null);
      setVoiceBlob(null);

    } catch (err) {
      console.error('Group message send failed:', err);
    }
  };
 

 const formatDateHeader = (date) => {
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMMM d, yyyy');  
};

let lastDate = null;


const handleCopy = async (value) => {
  try {
    await navigator.clipboard.writeText(value);
    alert('Copied!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};



  return (
    <div className="flex flex-col h-full">
      <ChatHeader groupId={groupId} isGroupChat={true} />
       
      <div className="flex-1 overflow-y-auto p-4">
    {messages.map((m, i) => {
      const messageDate = new Date(m.createdAt);
      const isNewDay =
        !lastDate || format(messageDate, 'yyyy-MM-dd') !== format(lastDate, 'yyyy-MM-dd');
      lastDate = messageDate;

      return (
        <div key={i}>
          {/* Date Header */}
          {isNewDay && (
            <div className="flex justify-center my-4">
              <span className="bg-gray-300 text-gray-800 px-3 py-1 rounded-full text-sm shadow">
                {formatDateHeader(messageDate)}
              </span>
            </div>
          )}

          {/* Message */}
          <div className={`mb-3 ${m.sender._id === senderId ? 'text-right' : 'text-left'}`}>
            <div className="text-xs text-gray-500 font-medium mb-1">{m.sender?.name}</div>
            <div
              className={`inline-block px-3 py-2 rounded-lg max-w-sm break-words ${
                m.sender._id === senderId
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-black'
              }`}
            >
              {/* {m.text && <p>{m.text}</p>} */}

              {m.text && (
                <div className="flex items-center space-x-1">
                  <span>{m.text}</span>
                  <button
                    onClick={() => handleCopy(m.text)}
                    className="ml-1 text-white text-xs hover:text-yellow-300"
                    title="Copy text"
                  >
                    <FaRegCopy />
                  </button>
                </div>
              )}

              {/* {m.fileUrl && (
                <img
                  src={m.fileUrl}
                  alt="attachment"
                  className="rounded mt-2 max-w-[300px]"
                />
              )} */}
              {m.fileUrl && m.fileUrl.match(/\.(jpe?g|png|gif|bmp|svg)$/i) && (
  <div className="mt-2 relative group">
    <img src={m.fileUrl} alt="sent media" className="rounded-md max-w-[200px]" />

    {/* Download button */}
    <a
      href={m.fileUrl}
      download
      className="absolute bottom-1 left-1 bg-white rounded-full p-1 shadow-md group-hover:block"
      title="Download image"
    >
      <FaDownload />
    </a>

 
  </div>
)}


{m.fileUrl && !m.fileUrl.endsWith('.webm') && !m.fileUrl.match(/\.(jpe?g|png|gif|bmp|svg)$/i) && (
  <div className="mt-2">
    <a
      href={m.fileUrl}
      // target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline text-sm"
    >
      <FaDownload /> Download {m.fileUrl.split('/').pop()}
    </a>
  </div>
)}

              {m.voiceUrl && (
                <div className="mt-2">
                  <audio controls>
                    <source src={m.voiceUrl} type="audio/webm" />
                  </audio>
                </div>
              )}

              {/* Time under message */}
              <div className="text-[10px] text-black mt-1 text-right">
                {format(messageDate, 'hh:mm a')}
              </div>
            </div>
          </div>
        </div>
      );
    })}
    <div ref={bottomRef} />
  </div>

      {/* Input */}
      <div className="flex items-center p-3 border-t border-gray-200 bg-white relative ">
        <input type="file" id="group-file" className="hidden" onChange={handleAttachFile} />

        <div className="flex items-center space-x-3 mr-2">
          <button onClick={() => setShowEmojiPicker(val => !val)} className="text-gray-500 hover:text-blue-500">
            <FaSmile size={22} />
          </button>
          <label htmlFor="group-file" className="text-gray-500 hover:text-blue-500 cursor-pointer">
            <FaPaperclip size={22} />
          </label>
        </div>

        

        <div className="relative flex-1 mx-2 ">
  {/* File preview */}
  {file && (
    <div className="absolute -top-14 -left-5 z-10 bg-white bg-opacity-90 p-1 rounded shadow flex items-center  max-w-[80%]">
      {file.type.startsWith("image/") ? (
        <img
          src={window.URL.createObjectURL(file)}
          alt="preview"
          className="w-14 h-14 object-cover rounded"
        />
      ) : (
        <div className="text-sm text-gray-700 truncate max-w-[120px]">{file.name}</div>
      )}
      <button
        onClick={() => setFile(null)}
        className="text-red-500 -mt-10 -ml-2 hover:text-red-700 text-sm cursor-pointer"
        title="Remove file"
      >
        ✖
      </button>
    </div>
  )}

  {/* Textarea */}
  <textarea
    ref={inputRef}
    value={inputText}
    placeholder="Type a message..."
    rows={2}
    className="w-full border px-4 py-1.5 focus:outline-none border-gray-300 rounded-2xl resize-none"
    onChange={(e) => setInputText(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    }}
  />

  {/* Emoji Picker */}
  {showEmojiPicker && (
    <div className="absolute bottom-14 left-0 z-20">
      <EmojiPicker onEmojiClick={handleEmojiClick} />
    </div>
  )}
</div>


        {voiceBlob && (
          <div className="flex items-center space-x-2 mx-2">
            <audio controls>
              <source src={window.URL.createObjectURL(voiceBlob)} type="audio/webm" />
            </audio>
            <button onClick={() => setVoiceBlob(null)} className="text-red-500 hover:text-red-700">✖</button>
          </div>
        )}

        <button
          onClick={toggleRecording}
          className={`text-white p-2 rounded-full ${recording ? 'bg-red-500' : 'bg-gray-500 hover:bg-blue-500'}`}
        >
          <FaMicrophone size={22} />
        </button>

        <button
          onClick={handleSend}
          className="bg-blue-500 text-white p-3 rounded-full ml-2"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chatgroup;

