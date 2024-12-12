import { useEffect, useState } from "react";
import useUsers from "./useUsers";

const App = () => {
  const [message, setMessage] = useState("");
  const [isPrimaryTab, setIsPrimaryTab] = useState(false);
  const channelName = "test123";
  const [jun711Channel, setJun711Channel] = useState(null);
  const [tabId, setTabId] = useState(null);

  // React Query ile veri çekme işlemi
  const { data, isLoading, error } = useUsers(
    message !== "Bu sekme kullanılamaz."
  ); // enabled durumu burada kontrol ediliyor

  useEffect(() => {
    const channel = new BroadcastChannel(channelName);
    setJun711Channel(channel);

    const currentTabId =
      sessionStorage.getItem("tabId") || Date.now().toString();
    sessionStorage.setItem("tabId", currentTabId);
    setTabId(currentTabId);

    const updateTabStatus = () => {
      channel.postMessage({ action: "checkTabs", tabId: currentTabId });
    };

    channel.onmessage = (e) => {
      if (e.data.action === "checkTabs") {
        if (e.data.tabId !== currentTabId) {
          setMessage("Bu sekme kullanılamaz.");
        } else {
          setIsPrimaryTab(true);
        }
      }

      if (
        e.data.action === "makeInactiveTab" &&
        e.data.tabId !== currentTabId
      ) {
        setMessage("Bu sekme kullanılamaz.");
      }

      if (e.data.action === "makeActiveTab" && e.data.tabId === currentTabId) {
        setIsPrimaryTab(true);
        setMessage("Bu sekme artık aktif.");
      }
    };

    updateTabStatus();

    return () => {
      channel.close();
    };
  }, [channelName, tabId]);

  const makeTabActive = () => {
    if (jun711Channel && tabId) {
      jun711Channel.postMessage({ action: "makeInactiveTab", tabId });
      jun711Channel.postMessage({ action: "makeActiveTab", tabId });
      setIsPrimaryTab(true);
      setMessage("Bu sekme artık aktif.");
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div style={styles.container}>
      {message === "Bu sekme kullanılamaz." ? (
        <div style={styles.messageBox}>
          <p style={{ color: "white" }}>Bu sekme şu an kullanılamaz.</p>
          <button style={styles.button} onClick={makeTabActive}>
            Burada Kullanmaya Devam Et
          </button>
        </div>
      ) : (
        <div>
          <h1>Users</h1>
          <ul>
            {data.map((user) => (
              <li key={user.id}>{user.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f5f5f5",
  },
  messageBox: {
    backgroundColor: "#219ebc",
    position: "absolute",
    width: "100%",
    padding: "20px",
    borderRadius: "8px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#ffb703",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default App;
