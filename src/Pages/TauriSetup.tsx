import Container from "../dawn-ui/components/Container";
import Page from "../dawn-ui/components/Page";
import KairoNavbar from "../KairoNavbar";

export default function TauriSetup() {
  return (
    <>
      <KairoNavbar />
      <Page>
        <Container title="Welcome to Kairo Desktop"></Container>
      </Page>
    </>
  );
}
