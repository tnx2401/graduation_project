import { db } from "./firebase";
import {
    doc, setDoc, getDoc, updateDoc, arrayUnion, serverTimestamp,
    getDocs,
    collection,
} from "firebase/firestore";
import axios from "axios";

const getChatId = (user1, user2) => {
    return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
};

const initializeChat = async (senderInfo, receiverInfo) => {
    const chatId = getChatId(senderInfo.uid, receiverInfo.uid);
    const chatRef = doc(db, "chats", chatId);

    try {
        const chatDoc = await getDoc(chatRef);
        if (!chatDoc.exists()) {
            await setDoc(chatRef, {
                users: [senderInfo, receiverInfo],
                createdAt: serverTimestamp(),
                messages: [],
            });
        }
    } catch (error) {
        console.error("Error initializing chat:", error);
    }
};

const getConversation = async (senderId, receiverId) => {
    const chatId = getChatId(senderId, receiverId);
    const chatRef = doc(db, "chats", chatId);

    try {
        const chatDoc = await getDoc(chatRef);
        if (chatDoc.exists()) {
            const chatData = chatDoc.data();
            return { messages: chatData.messages || [], chatId };
        }
        return { messages: [], chatId };
    } catch (error) {
        console.error("Error fetching conversation:", error);
        return { messages: [], chatId };
    }
};

const sendMessage = async (chatId, senderId, receiverId, message) => {
    const chatRef = doc(db, "chats", chatId);

    const newMessage = {
        id: Date.now().toString(),
        message,
        sentBy: senderId,
        isRead: false,
        createdAt: new Date().toISOString(),
    };

    await updateDoc(chatRef, {
        messages: arrayUnion(newMessage),
        lastUpdated: serverTimestamp()
    });
    axios.post(`/api/admin/users/sendNotification`, {
        uid: receiverId,
        content: "Bạn có tin nhắn mới"
    }).then(() => {

    }).catch((error) => {
        console.log(error);
    })
};

const getUserChats = async (uid) => {
    try {
        const chatRef = collection(db, "chats");
        const querySnapshot = await getDocs(chatRef);

        const userChats = [];

        for (const chatDoc of querySnapshot.docs) {
            const [senderId, receiverId] = chatDoc.id.split('_');
            if (senderId === uid || receiverId === uid) {
                const chatData = chatDoc.data();

                userChats.push({
                    id: chatDoc.id,
                    ...chatData, // includes users
                    messages: chatData.messages || [], // include messages
                });
            }
        }

        return userChats;
    } catch (error) {
        console.error("Error getting user chats:", error);
        return [];
    }
};

const handleSeen = async (chatId, uid, updateChatInState) => {
    const chatRef = doc(db, "chats", chatId);
    const chatSnapshot = await getDoc(chatRef);
    const chatData = chatSnapshot.data();

    if (!chatData) return;

    const lastMessage = chatData.messages[chatData.messages.length - 1];

    if (lastMessage && lastMessage.sentBy !== uid && !lastMessage.isRead) {
        const updatedMessages = chatData.messages.map((msg) =>
            msg === lastMessage ? { ...msg, isRead: true } : msg
        );

        await updateDoc(chatRef, { messages: updatedMessages });

        // 🔁 Call the state update function passed in
        updateChatInState(chatId, updatedMessages);
    }
};

export { initializeChat, getConversation, sendMessage, getUserChats, handleSeen };
