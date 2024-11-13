import { Box, Button, Container, HStack, VStack } from "@chakra-ui/react";
import Message from "./Components/Message";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { app } from "./firebase";
import { useState } from "react";
import { useEffect } from "react";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { useRef } from "react";
const auth = getAuth(app);
const db = getFirestore(app);
const loginhandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logouthandler = () => {
  signOut(auth);
};

function App() {
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divForScroll = useRef(null);

  const submithandler = async (e) => {
    e.preventDefault();           // this is stop the page to reload again and again as messages are stored and state is changed
    try {
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
        // url:user.url
      });
      setMessage("");
      divForScroll.current.scrollIntoView({ behavior: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });
    const unsubscribeformsg = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          return { id, ...item.data() };
        })
      );
    });
    return () => {
      unsubscribe();
      unsubscribeformsg();
    };
  }, []);

  return (
    <Box bg={"red.50"}>
      {user ? (
        <Container h={"100vh"} bg={"white"}>
          <VStack h={"full"} paddingY={"4"}>
            <Button onClick={logouthandler} colorScheme={"red"} w={"full"}>
              LogOut
            </Button>
            <VStack
              h="full"
              w="full"
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar}": {
                  display: "none",
                },
              }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                />
              ))}
              <div ref={divForScroll}></div>
            </VStack>
            <form onSubmit={submithandler} style={{ width: "100%" }}>
              <HStack>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter a message..."
                />
                <Button colorScheme={"purple"} type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack h="100vh" justifyContent={"center"} bg={"white"}>
          <Button onClick={loginhandler} colorScheme={"purple"}>
            Sign in with google
          </Button>
        </VStack>
      )}
    </Box>
  );
}

export default App;
