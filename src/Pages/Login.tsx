import Page from "../dawn-ui/components/Page";
import Navbar from "../dawn-ui/components/Navbar";
import Container from "../dawn-ui/components/Container";
import Button from "../dawn-ui/components/Button";
import Link from "../dawn-ui/components/Link";
import Row from "../dawn-ui/components/Row";

// export const apiUrl = "http://localhost:3005";
export const apiUrl = "https://kairo.dawn.rest";

export default function Login() {
  return (
    <>
      <Navbar title="Kairo" breadcrumb>
        <Row></Row>
      </Navbar>
      <Page>
        <Container title="Login to Kairo">
          <label>Please login with dawn.rest to continue.</label>
          <Link href={`https://auth.dawn.rest/oauth?cb=${apiUrl}/auth/dawn`}>
            <Button big>Login with dawn.rest</Button>
          </Link>
        </Container>
      </Page>
    </>
  );
}
