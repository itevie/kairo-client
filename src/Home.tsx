import Page from "./dawn-ui/components/Page";
import Navbar from "./dawn-ui/components/Navbar";
import Row from "./dawn-ui/components/Row";
import Container from "./dawn-ui/components/Container";
import Button from "./dawn-ui/components/Button";
import KairoNavbar from "./KairoNavbar";
import { useEffect, useState } from "react";
import { axiosClient } from "./App/api";
import Kairo from "./App/Kairo";
import Fullscreen from "./dawn-ui/components/Fullscreen";

export default function App() {
  const [result, setResult] = useState<"loading" | "logged-in" | "not">(
    "loading",
  );

  useEffect(() => {
    axiosClient
      .get("/api/user_data")
      .then((x) => {
        if (x.status === 200) setResult("logged-in");
        else setResult("not");
      })
      .catch((e) => {
        setResult("not");
      });
  }, []);
  return result === "not" ? (
    <Fullscreen>
      <Container title="Kairo">
        Kairo is your personal journel featuring a mood tracker and highly
        functional to-dos.
        <Row>
          <Button big onClick={() => (window.location.href = "/login")}>
            Login
          </Button>
        </Row>
      </Container>
    </Fullscreen>
  ) : result === "logged-in" ? (
    <Kairo />
  ) : (
    <Fullscreen>Loading...</Fullscreen>
  );
}
