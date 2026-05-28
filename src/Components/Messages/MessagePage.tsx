import { Container, Row, Col } from "react-bootstrap";
import ConversationList from "./ConversationList";
import ConversationPanel from "./ConversationPanel";
import NewConversationModal from "./NewConversationModal";
import { useAppSelector } from "../../store/hooks";
import "../../css/Messages.css"

const MessagesPage = () => {
  const selectedConversationId = useAppSelector(
    (s) => s.message.selectedConversationId,
  );
  return (
    <Container fluid className="message-page">
      <Row
        className={`messages-layout ${
          selectedConversationId ? "messages-layout--chat-open" : ""
        }`}
        //style={{ height: "calc(100vh - 90px)" }}
      >
        <Col md={3} className="messages-sidebar">
          <ConversationList />
        </Col>
        <Col md={9} className="messages-panel">
          <ConversationPanel />
        </Col>
      </Row>
      <NewConversationModal />
    </Container>
  );
};

export default MessagesPage;
