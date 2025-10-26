'use client';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

export function useChatSocket(
  userId: string,
  roomId: string,
  onMessage: (msg: any) => void
) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SERVER_API_URL;
    const socket = io(url, {
      transports: ['websocket'],
      withCredentials: true, // enable only if you need cookies on WS
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 500,
    });

    socketRef.current = socket;

    const onConnect = () => {
      console.log('socket connected:', socket.id);
      socket.emit('joinRoom', { userId, roomId });
    };

    const onConnectError = (err: any) => {
      console.error('Socket connection error:', err?.message || err);
    };

    const onJoinedRoom = (payload: any) => {
      console.log('joinedRoom:', payload);
    };

    const onReceiveMessage = (msg: any) => {
      onMessage(msg);
    };

    const onMessageSent = (msg: any) => {
      console.log('messageSent:', msg);
    };

    const onDisconnect = (reason: string) => {
      console.log('socket disconnect:', reason);
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onConnectError);
    socket.on('joinedRoom', onJoinedRoom);
    socket.on('receiveMessage', onReceiveMessage);
    socket.on('messageSent', onMessageSent);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onConnectError);
      socket.off('joinedRoom', onJoinedRoom);
      socket.off('receiveMessage', onReceiveMessage);
      socket.off('messageSent', onMessageSent);
      socket.off('disconnect', onDisconnect);
      socket.disconnect();
    };
  }, [userId, roomId, onMessage]);

  const sendMessage = (data: { senderId: string; text: string }) => {
    console.log('Sending message:', data);
    socketRef.current?.emit('sendMessage', { ...data, roomId });
  };

  return { sendMessage };
}