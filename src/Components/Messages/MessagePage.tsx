import { Container, Row, Col } from "react-bootstrap";
import ConversationList from "./ConversationList";
import ConversationPanel from "./ConversationPanel";
import NewConversationModal from "./NewConversationModal";

const MessagesPage = () => {
  return (
    <>
      <Container fluid className="py-3">
        <Row
          className="messages-layout"
          style={{ height: "calc(100vh - 90px)" }}
        >
          <Col md={4} lg={3} className="h-100 messages-sidebar">
            <ConversationList />
          </Col>
          <Col md={8} lg={9} className="h-100">
            <ConversationPanel />
          </Col>
        </Row>
      </Container>

      <NewConversationModal />
    </>
  );
};

export default MessagesPage;
