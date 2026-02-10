import { Carousel } from "react-bootstrap";
import "../../css/Posts.css";
import type { PostMediaDTO } from "../../types/post";

/* --------- MEDIA ITEM --------- */
function MediaItem({ media }: { media: PostMediaDTO }) {
  switch (media.type) {
    case "IMAGE":
      return <img src={media.url} alt="post media" className="post-media" />;

    case "VIDEO":
      return (
        <video className="post-media" controls>
          <source src={media.url} />
        </video>
      );

    case "FILE":
      return (
        <div className="post-file">
          <a href={media.url} target="_blank" rel="noreferrer">
            Open file
          </a>
        </div>
      );

    default:
      return null;
  }
}

const PostMediaCarousel = ({ media }: { media: PostMediaDTO[] }) => {
  if (!media || media.length === 0) return null;

  //un solo media - no carousel
  if (media.length === 1) {
    <div className="post-media-wrap">
      <MediaItem media={media[0]} />
    </div>;
  }

  // piu media - carousel
  return (
    <div className="post-media-wrap">
      <Carousel interval={null} indicators={media.length > 1}>
        {media.map((m) => (
          <Carousel.Item key={m.id}>
            <MediaItem media={m} />
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};
export default PostMediaCarousel;
