import { useParams } from "react-router-dom";
import { useGetPostByIdQuery } from "../../api/postApi";
import { Spinner, Alert, Container, Row, Col } from "react-bootstrap";
import PostCard from "./PostCard";
import { useAppSelector } from "../../store/hooks";

const PostDetailPage = () => {
  const { id } = useParams();
  const me = useAppSelector((s) => s.auth.user);

  const { data, isLoading, error } = useGetPostByIdQuery(
    { postId: id! },
    { skip: !id }
  );

  const canEdit = !!me && !!data && me.id === data.author.id;

  return (
    <Container className="mt-4">
      <Row className="justify-content-center">
        <Col xs={12} md={10} lg={8} xl={6}>
          {isLoading && <Spinner />}
          {error || !data ? (
            <Alert variant="danger">Post not found</Alert>
          ) : (
            <PostCard post={data} canEdit={canEdit} />
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PostDetailPage;
