import { StreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";

export default function useStreamClient({ apiKey, user, token }) {
  const [videoClient, setVideoClient] = useState(null);
  const [chatClient, setChatClient] = useState(null);

  useEffect(() => {
    // 1. Exit early if missing credentials
    if (!user || !token || !apiKey) return;

    // 2. Properly declare isMounted to prevent memory leaks on unmount
    let isMounted = true;
    
    // 3. Keep local references for the cleanup function to use
    let myVideoClient = null;
    let myChatClient = null;

    const initClients = async () => {
      try {
        // Use getOrCreateInstance to avoid duplicate client warning
        myVideoClient = new StreamVideoClient({
          apiKey,
          user,
          token,
        });

        // Initialize chat client
        myChatClient = StreamChat.getInstance(apiKey);
        
        // Wait for the chat client to connect
        await myChatClient.connectUser(user, token);

        // Only update state if the component is still on the screen
        if (isMounted) {
          setVideoClient(myVideoClient);
          setChatClient(myChatClient);
        }
      } catch (error) {
        console.error("Error initializing Stream clients:", error);
      }
    };

    // 4. Actually call the function
    initClients();

    // 5. Cleanup function
    return () => {
      isMounted = false;
      
      // Disconnect using the local references, NOT the state variables
      if (myVideoClient) {
        myVideoClient.disconnectUser().catch(console.error);
      }
      if (myChatClient) {
        myChatClient.disconnectUser().catch(console.error);
      }
    };
  }, [apiKey, user, token]);

  return { videoClient, chatClient };
}