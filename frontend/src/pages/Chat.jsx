import React, { useEffect, useState, useContext } from "react";
import io from "socket.io-client";
import axios from "axios"; 
import { AuthContext } from "../context/AuthContext";
import { Search, Plus, Hash, MessageSquare, Trash2 } from 'lucide-react';

const socket = io.connect("http://localhost:5000");

function Chat() {
  const { user } = useContext(AuthContext);
  
  const [currentRoom, setCurrentRoom] = useState("General"); 
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [myChannels, setMyChannels] = useState([]); 

  useEffect(() => {
    if (user && user.id) {
        axios.get(`${import.meta.env.VITE_API_URL}/chat/rooms/${user.id}`)
            .then(res => {
                setMyChannels(res.data);
                if (res.data.length > 0) {
                    setCurrentRoom(res.data[0].id);
                }
            })
            .catch(err => console.error("Failed to load user rooms:", err));
    }
  }, [user]);

  useEffect(() => {
    if (!currentRoom) return;

    socket.emit("join_room", currentRoom);
    
    axios.get(`${import.meta.env.VITE_API_URL}/chat/history/${currentRoom}`)
        .then(res => {
            setMessageList(res.data);
        })
        .catch(err => console.error("Failed to load chat history:", err));

  }, [currentRoom]);

  useEffect(() => {
    const receiveMessage = (data) => {
      setMessageList((list) => [...list, data]);
    };
    socket.on("receive_message", receiveMessage);
    
    return () => socket.off("receive_message", receiveMessage);
  }, [socket]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData = {
        room: currentRoom,
        author: user ? user.name : "Guest",
        message: currentMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      await socket.emit("send_message", messageData);
      
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const exists = myChannels.find(c => c.id.toLowerCase() === searchQuery.toLowerCase());
    
    if (exists) {
        setSearchResult({ status: "joined", name: exists.name });
    } else {
        setSearchResult({ 
            status: "new", 
            id: searchQuery.trim(), 
            name: `☄️ ${searchQuery.trim()} Research` 
        });
    }
  };

  const joinCommunity = async () => {
    if (searchResult && searchResult.status === "new") {
        const newChannel = { id: searchResult.id, name: searchResult.name };
        
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/chat/join`, {
                userId: user.id,
                room: newChannel
            });
            
            setMyChannels([...myChannels, newChannel]);
            setCurrentRoom(newChannel.id);
            setSearchQuery("");
            setSearchResult(null);
        } catch (err) {
            console.error(err);
            alert("Failed to join community. Please try again.");
        }
    }
  };

  const leaveCommunity = async (id, e) => {
    e.stopPropagation(); 
    if (id === "General") return; 
    
    try {
        await axios.post(`${import.meta.env.VITE_API_URL}/chat/leave`, {
            userId: user.id,
            roomId: id
        });

        const updated = myChannels.filter(c => c.id !== id);
        setMyChannels(updated);
        
        if (currentRoom === id) setCurrentRoom("General");
    } catch (err) {
        console.error(err);
        alert("Failed to leave community.");
    }
  };

  return (
    <div className="flex h-screen bg-black pt-16">
      
      <div className="w-80 bg-gray-900 border-r border-gray-800 flex flex-col">
        
        <div className="p-4 bg-gray-900 border-b border-gray-800">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <MessageSquare className="text-blue-500" /> Mission Comm
          </h2>
        </div>

        <div className="p-4">
            <form onSubmit={handleSearch} className="relative">
                <input 
                    type="text" 
                    placeholder="Find Asteroid ID..." 
                    className="w-full bg-black border border-gray-700 rounded-lg py-2 pl-3 pr-10 text-white focus:border-blue-500 outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="absolute right-2 top-2 text-gray-500 hover:text-white">
                    <Search size={18} />
                </button>
            </form>

            {searchResult && (
                <div className="mt-2 p-3 bg-gray-800 rounded border border-gray-700 animate-fade-in">
                    {searchResult.status === "joined" ? (
                        <p className="text-green-400 text-xs">✅ You are already in this channel.</p>
                    ) : (
                        <div className="flex justify-between items-center">
                            <span className="text-white text-sm font-bold truncate w-32">{searchResult.name}</span>
                            <button 
                                onClick={joinCommunity}
                                className="bg-blue-600 hover:bg-blue-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                            >
                                <Plus size={12}/> Join
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          <div className="text-xs font-bold text-gray-500 uppercase px-2 mb-2">My Frequencies</div>
          {myChannels.map((channel) => (
            <div
              key={channel.id}
              onClick={() => setCurrentRoom(channel.id)}
              className={`group flex justify-between items-center w-full text-left p-3 rounded-lg cursor-pointer transition-all ${
                currentRoom === channel.id ? "bg-blue-900/40 text-blue-300 border border-blue-800" : "hover:bg-gray-800 text-gray-400 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Hash size={16} className={currentRoom === channel.id ? "text-blue-400" : "text-gray-600"}/>
                <span className="truncate">{channel.name}</span>
              </div>
              
              {channel.id !== "General" && (
                  <button 
                    onClick={(e) => leaveCommunity(channel.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-gray-600 hover:text-red-400 transition"
                    title="Leave Channel"
                  >
                      <Trash2 size={14}/>
                  </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-black relative">
        
        <div className="bg-gray-900 p-4 border-b border-gray-800 flex justify-between items-center shadow-md z-10">
          <div>
              <h3 className="text-white font-bold text-xl flex items-center gap-2">
                 {myChannels.find(c => c.id === currentRoom)?.name || `Radio: ${currentRoom}`}
              </h3>
              <span className="text-gray-500 text-xs flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div> Live Signal
              </span>
          </div>
          <div className="text-gray-500 font-mono text-sm border border-gray-700 px-2 py-1 rounded bg-black">
              FREQ: {currentRoom.toUpperCase()}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messageList.map((messageContent, index) => {
            const isMe = messageContent.author === (user ? user.name : "Guest");
            
            return (
              <div key={index} className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}>
                <div className="flex items-end gap-2">
                    {!isMe && <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold text-gray-400">{messageContent.author[0]}</div>}
                    
                    <div className={`max-w-md px-5 py-3 rounded-2xl text-white shadow-lg ${
                        isMe ? "bg-blue-600 rounded-tr-none" : "bg-gray-800 rounded-tl-none border border-gray-700"
                    }`}>
                        <p className="text-sm">{messageContent.message}</p>
                    </div>
                </div>
                <div className={`text-[10px] text-gray-600 mt-1 flex gap-2 ${isMe ? "mr-1" : "ml-10"}`}>
                  <span className="font-bold">{messageContent.author}</span>
                  <span>{messageContent.time}</span>
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-gray-900 border-t border-gray-800">
            <div className="flex gap-2 bg-black p-2 rounded-xl border border-gray-700 focus-within:border-blue-500 transition-colors">
                <input
                    type="text"
                    value={currentMessage}
                    placeholder={`Transmitting to ${currentRoom}...`}
                    className="flex-1 bg-transparent text-white px-2 outline-none"
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <button 
                    onClick={sendMessage}
                    className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition shadow-lg"
                >
                    <MessageSquare size={18} />
                </button>
            </div>
        </div>

      </div>
    </div>
  );
}

export default Chat;