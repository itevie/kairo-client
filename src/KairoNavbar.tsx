import Button from "./dawn-ui/components/Button";
import Navbar from "./dawn-ui/components/Navbar";
import Row from "./dawn-ui/components/Row";

export default function KairoNavbar() {
  return (
    <Navbar title="Kairo" breadcrumb>
      <Row>
        <Button onClick={() => (window.location.href = "/app")}>
          Open App
        </Button>
      </Row>
    </Navbar>
  );
}
