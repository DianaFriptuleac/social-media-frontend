import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetGlobalSearchQuery } from "../api/searchApi";
import { Alert, Button, Card, Container, Form, Spinner } from "react-bootstrap";
import { BsSearch } from "react-icons/bs";
import "../css/Search.css"

const SearchPage = () => {
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState("");
  const [query, setQuery] = useState("");

  const { data, isLoading, isFetching, isError } = useGetGlobalSearchQuery(
    {
      query,
      page: 0,
      size: 10,
    },
    {
      // non chiama il BE finche non ci sono almeno 2 caratteri
      skip: query.length < 2,
    },
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedQuery = searchText.trim();

    if (normalizedQuery.length < 2) {
      return;
    }
    setQuery(normalizedQuery);
  };

  const totalResults =
    (data?.users.totalElements ?? 0) +
    (data?.departments.totalElements ?? 0) +
    (data?.events.totalElements ?? 0) +
    (data?.jobs.totalElements ?? 0);

  return (
    <Container className="search-page">
      <div className="search-header">
        <h1 className="search-title">Search</h1>
        <p className="search-subtitle">
          Search people, departments, jobs and events.
        </p>
      </div>

      <Form className="search-form" onSubmit={handleSearch}>
        <div className="search-input-wrap">
          <BsSearch className="search-input-icon" />

          <Form.Control
            type="search"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />

          <Button
            type="submit"
            className="search-submit-btn"
            disabled={searchText.trim().length < 2}
          >
            Search
          </Button>
        </div>
      </Form>

      {(isLoading || isFetching) && (
        <div className="text-center py-5">
          <Spinner animation="border" />
        </div>
      )}

      {isError && (
        <Alert variant="danger">Error while loading search results.</Alert>
      )}

      {query.length >= 2 && !isLoading && !isFetching && !isError && data && (
        <>
          <div className="search-results-summary">
            {totalResults} results for <strong>"{query}"</strong>
          </div>

          {totalResults === 0 && (
            <div className="search-empty">No results found.</div>
          )}

          {data.users.content.length > 0 && (
            <section className="search-section">
              <h2 className="search-section-title">
                People
                <span>{data.users.totalElements}</span>
              </h2>

              <div className="search-grid">
                {data.users.content.map((user) => (
                  <Card
                    key={user.id}
                    className="search-result-card"
                    onClick={() => navigate(`/users/${user.id}`)}
                  >
                    <Card.Body>
                      <div className="search-user-row">
                        <img
                          src={user.avatar ?? "/images/default-avatar.jpg"}
                          alt={`${user.name} ${user.surname}`}
                          className="search-avatar"
                        />

                        <div>
                          <div className="search-result-title">
                            {user.name} {user.surname}
                          </div>

                          <div className="search-result-subtitle">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {data.departments.content.length > 0 && (
            <section className="search-section">
              <h2 className="search-section-title">
                Departments
                <span>{data.departments.totalElements}</span>
              </h2>

              <div className="search-grid">
                {data.departments.content.map((department) => (
                  <Card
                    key={department.id}
                    className="search-result-card"
                    onClick={() => navigate(`/departments/${department.id}`)}
                  >
                    <Card.Body>
                      <div className="search-result-title">
                        {department.name}
                      </div>

                      {department.description && (
                        <div className="search-result-subtitle">
                          {department.description}
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {data.jobs.content.length > 0 && (
            <section className="search-section">
              <h2 className="search-section-title">
                Jobs
                <span>{data.jobs.totalElements}</span>
              </h2>

              <div className="search-grid">
                {data.jobs.content.map((job) => (
                  <Card
                    key={job.id}
                    className="search-result-card"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    <Card.Body>
                      <div className="search-result-title">{job.title}</div>

                      {job.departmentName && (
                        <div className="search-result-subtitle">
                          {job.departmentName}
                        </div>
                      )}

                      {job.location && (
                        <div className="search-result-meta">{job.location}</div>
                      )}
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {data.events.content.length > 0 && (
            <section className="search-section">
              <h2 className="search-section-title">
                Events
                <span>{data.events.totalElements}</span>
              </h2>

              <div className="search-grid">
                {data.events.content.map((event) => (
                  <Card
                    key={event.id}
                    className="search-result-card"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    <Card.Body>
                      <div className="search-result-title">{event.name}</div>

                      {event.location && (
                        <div className="search-result-subtitle">
                          {event.location}
                        </div>
                      )}

                      <div className="search-result-meta">
                        {new Date(event.startAt).toLocaleString()}
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </Container>
  );
};

export default SearchPage;
