import { useState, useEffect } from "react";
import client, {
  databases,
  DB_ID,
  COLLECTION_ID_MESSAGES,
} from "../appwriteConfig";
import { ID, Permission, Query, Role } from "appwrite";
import { Trash2 } from "react-feather";
import Header from "../components/Header";
import { userAuth } from "../utils/AuthContext";

const Rooms = () => {
  const [messageBody, setMessageBody] = useState("");
  const [messages, setMessages] = useState([]);
  const { user } = userAuth();

  useEffect(() => {
    getMessages();
    const unsubscribe = client.subscribe(
      `databases.${DB_ID}.collections.${COLLECTION_ID_MESSAGES}.documents`,

      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A MESSAGE WAS CREATED");
          setMessages((prevState) => [response.payload, ...prevState]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A MESSAGE WAS DELETED!!!");
          setMessages((prevState) =>
            prevState.filter((message) => message.$id !== response.payload.$id)
          );
        }
      }
    );

    console.log("unsubscribe:", unsubscribe);

    return () => {
      unsubscribe();
    };
  }, []);

  const getMessages = async () => {
    const response = await databases.listDocuments(
      DB_ID,
      COLLECTION_ID_MESSAGES,
      [Query.orderDesc("$createdAt"), Query.limit(100)]
    );
    console.log("response documents", response.documents);
    setMessages(response.documents);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("MESSAGE:", messageBody);

    const permissions = [Permission.write(Role.user(user.$id))];

    const payload = {
      user_id: user.$id,
      username: user.name,
      body: messageBody,
    };

    const response = await databases.createDocument(
      DB_ID,
      COLLECTION_ID_MESSAGES,
      ID.unique(),
      payload,
      permissions
    );

    console.log("RESPONSE:", response);

    setMessageBody("");
  };

  const deleteMessage = async (id) => {
    await databases.deleteDocument(DB_ID, COLLECTION_ID_MESSAGES, id);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  return (
    <main className="container">
      <Header />
      <div className="room--container">
        <form id="message--form" onSubmit={handleSubmit}>
          <div>
            <textarea
              required
              maxLength="250"
              placeholder="Say something..."
              onChange={(e) => {
                setMessageBody(e.target.value);
              }}
              onKeyPress={handleKeyPress}
              value={messageBody}
            ></textarea>
          </div>

          <div className="send-btn--wrapper">
            <input className="btn btn--secondary" type="submit" value="send" />
          </div>
        </form>

        <div>
          {messages.map((message) => (
            <div key={message.$id} className={"message--wrapper"}>
              <div className="message--header">
                <p>
                  {message?.username ? (
                    <span> {message?.username}</span>
                  ) : (
                    "Anonymous user"
                  )}

                  <small className="message-timestamp">
                    {new Date(message.$createdAt).toLocaleString()}
                  </small>
                </p>

                {message.$permissions.includes(
                  `delete("user:${user.$id}")`
                ) && (
                  <Trash2
                    className="delete--btn"
                    onClick={() => {
                      deleteMessage(message.$id);
                    }}
                  />
                )}
              </div>

              <div
                className={
                  "message--body" +
                  (message.user_id === user.$id ? " message--body--owner" : "")
                }
              >
                <span>{message.body}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default Rooms;
