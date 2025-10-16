"use client";
import { withAuth } from "@/components/WithAuth";
import { useState, useEffect, useCallback, useRef, FormEvent, Fragment } from "react";
import { useChatSocket } from "@/hooks/useChatSocket";
import { useAuth } from "@/context/AuthContext";
import api from "@/utils/api";
import toast from "react-hot-toast";
import { FaCheck, FaChevronDown, FaEnvelopeOpenText, FaPaperPlane, FaSignOutAlt } from "react-icons/fa";
import { BiPlus, BiSend } from "react-icons/bi";
import { Listbox, Transition } from "@headlessui/react";

type User = {
  id: string;
  name: string;
};

type Room = {
  id: string;
  name?: string;
};

type Message = {
  id?: string;
  text: string;
  sender: User;
  room: Room;
  createdAt?: string;
};

function ChatPage() {
  const { user, loading, logout } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch rooms on load
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await api.get<Room[]>("/room/mine");
        setRooms(res.data);
        if (res.data.length > 0) setSelectedRoom(res.data[0]); // default first room
      } catch (err) {
        console.error("Failed to fetch rooms:", err);
      }
    };
    fetchRooms();
  }, []);

  // Handle incoming messages
  const handleIncomingMessage = useCallback((msg: Message) => {
    setMessages(prev => {
      const exists = prev.some(m => m.id === msg.id);
      if (exists) return prev;
      return [...prev, msg];
    });
  }, []);

  // Chat socket
  const { sendMessage } = useChatSocket(user?.id || "", selectedRoom?.id || "", handleIncomingMessage);

  // Fetch messages whenever selected room changes
  useEffect(() => {
    if (!selectedRoom) return;

    const fetchMessages = async () => {
      try {
        const res = await api.get<Message[]>(`/message/${selectedRoom.id}`);
        const sorted = (res.data || []).sort(
          (a, b) =>
            new Date(a.createdAt ?? "").getTime() - new Date(b.createdAt ?? "").getTime()
        );
        setMessages(sorted);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };
    fetchMessages();
  }, [selectedRoom]);

  // Send message
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedRoom || !user) return;

    const newMessage: Message = {
      text: input,
      sender: { id: user.id, name: user.name },
      room: { id: selectedRoom.id, name: selectedRoom.name },
    };

    sendMessage({ senderId: user.id, text: input });
    setInput("");
  };

  // Invite user
const handleInvite = async () => {
  if (!inviteEmail.trim() || !selectedRoom) {
    toast.error("Please enter a valid email and select a room.");
    return;
  }

  try {
    await api.post(`/room/${selectedRoom.id}/invite`, { email: inviteEmail });
    setInviteEmail("");
    setInviteModalOpen(false);
    toast.success("Invitation sent successfully!");
  } catch (err) {
    console.error("Failed to invite user", err);
    toast.error("Failed to send invitation. Please try again.");
  }
};

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please log in to see the chat</div>;

  return (
<div className="flex flex-col h-screen max-h-screen bg-white rounded-xl shadow-xl max-w-3xl mx-auto p-6">
  {/* Header with Rooms, Invite & Logout */}
  <div className="flex justify-between items-center pb-4 border-b border-gray-200 flex-shrink-0">
    {rooms.length > 1 ? (
      <Listbox value={selectedRoom} onChange={setSelectedRoom}>
  <div className="relative">
    <Listbox.Button className="btn btn-primary border-none">
      {selectedRoom?.name || "Select room"}
      <FaChevronDown className="text-gray-500 ml-2" />
    </Listbox.Button>

    <Transition
      as={Fragment}
      leave="transition ease-in duration-100"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg border border-gray-200 z-50">
        {rooms.map((room) => (
          <Listbox.Option
            key={room.id}
            value={room}
            className={({ active }) =>
              `cursor-pointer select-none px-4 py-2 ${
                active ? "bg-amber-100" : ""
              }`
            }
          >
            {({ selected }) => (
              <div className="flex justify-between items-center">
                <span className={selected ? "font-semibold" : ""}>
                  {room.name}
                </span>
                {selected && <FaCheck className="text-amber-500" />}
              </div>
            )}
          </Listbox.Option>
        ))}
      </Listbox.Options>
    </Transition>
  </div>
</Listbox>
    ) : (
      <h1 className="font-medium text-2xl">{selectedRoom?.name}</h1>
    )}

    <div className="flex gap-2">
      <button
        onClick={() => setInviteModalOpen(true)}
        className="btn btn-outline flex items-center gap-2"
      >
        <BiPlus className="text-lg" /> Invite
      </button>
      <button
        onClick={logout}
        className="btn btn-secondary flex items-center gap-2"
      >
        <FaSignOutAlt className="text-lg" /> Logout
      </button>
    </div>
  </div>

  {/* Messages */}
  <div className="flex-1 overflow-y-auto py-4 space-y-3">
    {messages.map((msg, i) => (
      <div
        key={i}
        className={`flex ${
          msg.sender.id === user.id ? "justify-end" : "justify-start"
        }`}
      >
        <div
          className={`px-4 py-2 rounded-lg max-w-[70%] text-gray-800 ${
            msg.sender.id === user.id
              ? "bg-amber-300 text-white"
              : "bg-gray-100"
          }`}
        >
          <span className="font-semibold">{msg.sender.name}: </span>
          {msg.text}
        </div>
      </div>
    ))}
    <div ref={messagesEndRef} />
  </div>

  {/* Send message form */}
  <form
    onSubmit={handleSend}
    className="flex gap-2 pt-4 border-t border-gray-200 flex-shrink-0"
  >
    <input
      type="text"
      className="flex-1 border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-amber-400"
      placeholder="Type your message..."
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
    <button
      type="submit"
      className="btn btn-primary flex items-center gap-2"
    >
      <FaPaperPlane className="text-sm" /> Send
    </button>
  </form>

  {/* Invite modal */}
  {inviteModalOpen && (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h2 className="text-lg font-bold mb-4">Invite User</h2>
        <input
          type="email"
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-green-400"
          placeholder="Enter user email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setInviteModalOpen(false)}
            className="btn btn-outline flex-1"
          >
            Cancel
          </button>
          <button
            onClick={handleInvite}
            className="btn btn-primary flex-1"
          >
            <BiSend className="text-sm" /> Send Invite
          </button>
        </div>
      </div>
    </div>
  )}
</div>

  );
}

export default withAuth(ChatPage, true);
