import { Alert, Container, Spinner, Row, Col } from "react-bootstrap";
import { useGetPostsQuery } from "../../api/postApi";
import { useAppSelector } from "../../store/hooks";
import PostCard from "./PostCard";

const AllPosts = () => {
  const me = useAppSelector((s) => s.auth.user);
  const { data, isLoading, error } = useGetPostsQuery({
    page: 0,
    size: 8,
    sortBy: "createdAt",
  });

  if (isLoading) return <Spinner />;
  if (error || !data)
    return (
      <Alert variant="danger" className="mb-3">
        Error
      </Alert>
    );

    return (
        <Container>
            <Row>
                <Col>
                {data.content.map((p) => (
                    <PostCard key={p.id} post={p} canEdit={me?.id === p.author.id} />
                ))}
                </Col>
            </Row>
        </Container>
    )
};
export default AllPosts;
