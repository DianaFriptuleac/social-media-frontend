import { useState } from "react";
import { useApplyToJobMutation } from "../../api/jobApi";
import { Alert, Button, Form, Modal, Spinner } from "react-bootstrap";

interface ApplyJobModaProps {
  show: boolean;
  onHide: () => void;
  jobId: string;
  jobTitle: string;
}

const ApplyJobModal = ({
  show,
  onHide,
  jobId,
  jobTitle,
}: ApplyJobModaProps) => {
  const [applyToJob, { isLoading }] = useApplyToJobMutation();

  const [cv, setCv] = useState<File | null>(null);

  const [coverLetterText, setCoverLetterText] = useState("");
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // reset form
  const resetForm = () => {
    setCv(null);
    setCoverLetterText("");
    setCoverLetterFile(null);
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    resetForm();
    onHide();
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError(null);
    setSuccess(false);

    if (!cv) {
      setError("Please upload your CV.");
      return;
    }
    try {
      await applyToJob({
        jobId,
        cv,
        coverLetterText: coverLetterText.trim() || undefined,
        coverLetterFile: coverLetterFile || undefined,
      }).unwrap();
      setSuccess(true);

      setCv(null);
      setCoverLetterText("");
      setCoverLetterFile(null);
    } catch (err: any) {
      console.error("Application error:", err);

      // Se il backend restituisce un messaggio
      if (err?.data?.message) {
        setError(err.data.message);
      } else {
        setError("Unable to submit your application.");
      }
    }
  };
  return(
      <Modal
      show={show}
      onHide={handleClose}
      centered
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Apply for {jobTitle}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger"> {error}
            </Alert>
          )}
          {success && (
            <Alert variant="success">
              Your application has been submitted successfully.
            </Alert>
          )}
          {!success && (
            <>
              <Form.Group className="mb-4">
                <Form.Label>
                  CV *
                </Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const input =
                      e.target as HTMLInputElement;
                    const file =
                      input.files?.[0];
                    if (file) {
                      setCv(file);
                    }
                  }}
                  required
                />
                <Form.Text className="text-muted">
                  Upload your CV in PDF format.
                </Form.Text>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  Cover letter
                </Form.Label>
                <Form.Control
                  className="rounded-3"
                  as="textarea"
                  rows={6}
                  placeholder="Write your cover letter..."
                  value={coverLetterText}
                  onChange={(e) =>
                    setCoverLetterText(
                      e.target.value
                    )
                  }
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>
                  Cover letter file
                </Form.Label>
                <Form.Control
                  type="file"
                  accept=".pdf"
                  onChange={(e) => {
                    const input =
                      e.target as HTMLInputElement;
                    const file =
                      input.files?.[0];
                    if (file) {
                      setCoverLetterFile(file);
                    }
                  }}
                />
                <Form.Text className="text-muted">
                  Optional PDF file.
                </Form.Text>
              </Form.Group>
            </>
          )}

        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            {success
              ? "Close"
              : "Cancel"}
          </Button>
          {!success && (
            <Button
              type="submit"
              disabled={
                isLoading ||
                !cv
              }
            >
              {isLoading ? (
                <>
                  <Spinner
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Applying...
                </>
              ) : (
                "Submit application"
              )}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default ApplyJobModal;
