import Button from "../dawn-ui/components/Button";
import Column from "../dawn-ui/components/Column";
import Container from "../dawn-ui/components/Container";
import GoogleMatieralIcon from "../dawn-ui/components/GoogleMaterialIcon";
import Row from "../dawn-ui/components/Row";
import Words from "../dawn-ui/components/Words";
import { DawnTime } from "../dawn-ui/time";
import { Streak } from "./types";

export default function StreakPage() {
  const streak: Streak = {
    id: 0,
    user: 0,
    title: "Test",
    note: "test 2",
    start: new Date(1732046581184).toISOString(),
    last_entry: new Date(1732046581184).toISOString(),
    type: "add",
  };

  const days =
    new DawnTime(new Date(streak.last_entry).getTime()).units.day -
    new DawnTime(new Date(streak.start).getTime()).units.day;

  return (
    <Column>
      <Words type="page-title">Your Streaks</Words>
      <Container util={["no-min"]}>
        <Row util={["align-center"]}>
          <Column util={["align-center", "small-gap"]}>
            <GoogleMatieralIcon name="local_fire_department" />
            <label>{days} days</label>
          </Column>
          <Words util={["flex-grow"]} type="heading">
            {streak.title}
          </Words>
          <Button className="dawn-button-circle">
            {streak.type === "add" ? "+" : "-"}
          </Button>
        </Row>
      </Container>
    </Column>
  );
}
