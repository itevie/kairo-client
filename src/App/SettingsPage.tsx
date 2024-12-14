import { setTheme, themeSetBackground } from "../dawn-ui";
import Column from "../dawn-ui/components/Column";
import Container from "../dawn-ui/components/Container";
import Row from "../dawn-ui/components/Row";
import { ShortcutList } from "../dawn-ui/components/ShortcutManager";
import Words from "../dawn-ui/components/Words";
import useMainHook from "./hooks/useMainHook";
import { moodColorMap, moodList, moodMap } from "./MoodLogger";
import GoogleMatieralIcon from "../dawn-ui/components/GoogleMaterialIcon";
import { combineStyles } from "../dawn-ui/util";
import { spawnConfetti } from "../dawn-ui/confetti";
import useSettings from "./hooks/useSettings";

export default function SettingsPage({
  hook,
}: {
  hook: ReturnType<typeof useMainHook>;
}) {
  const { settings, setSetting } = useSettings();

  function toggle(type: string) {
    let old = settings.userMoods;

    if (old.includes(type)) {
      old.splice(old.indexOf(type), 1);
    } else {
      old.push(type);
    }

    setSetting("userMoods", [...old]);
  }

  return (
    <Column util={["no-gap"]}>
      <Words type="page-title">Settings</Words>
      <Container>
        <Words type="heading">Appearance</Words>
        <table style={{ borderSpacing: "10px" }}>
          <tbody>
            <tr>
              <td>
                <label>Starting Page</label>
              </td>
              <td>
                <select
                  defaultValue={settings.defaultPage}
                  onChange={(e) => {
                    setSetting("defaultPage", e.currentTarget.value);
                  }}
                >
                  <option value="due">Due</option>
                  <option value="all">All</option>
                  <option value="repeating">Repeating</option>
                  <option value="finished">Finished</option>
                  <option disabled style={{ textAlign: "center" }}>
                    Groups
                  </option>
                  {hook.groups.map((x) => (
                    <option value={`group-${x.id}`}>{x.name}</option>
                  ))}
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Theme</label>
              </td>
              <td>
                <select
                  defaultValue={localStorage.getItem("kairo-theme") || "dark"}
                  onChange={(e) => {
                    localStorage.setItem("kairo-theme", e.currentTarget.value);
                    setTheme(e.currentTarget.value as any);
                  }}
                >
                  <option value="light">Light</option>
                  <option value="light-transparent">Light Transparent</option>
                  <option value="dark">Dark</option>
                  <option value="dark-transparent">Dark Transparent</option>
                </select>
              </td>
            </tr>
            <tr>
              <td>
                <label>Background URL</label>
              </td>
              <td>
                <input
                  defaultValue={
                    localStorage.getItem("kairo-background-url") || ""
                  }
                  onChange={(e) => {
                    localStorage.setItem(
                      "kairo-background-url",
                      e.currentTarget.value
                    );
                    themeSetBackground(e.currentTarget.value);
                  }}
                />
              </td>
            </tr>
            <tr>
              <td>
                <label>Confetti</label>
              </td>
              <tr>
                <input
                  type="checkbox"
                  defaultChecked={settings.showConfetti}
                  onClick={(e) => {
                    spawnConfetti(e.pageX, e.pageY);
                  }}
                  onChange={(e) => {
                    console.log(settings.showConfetti);
                    setSetting("showConfetti", e.currentTarget.checked);
                  }}
                />
              </tr>
            </tr>
          </tbody>
        </table>
        <Words type="heading">Tips</Words>
        <Row style={{ margin: "10px" }}>
          <input
            type="checkbox"
            defaultChecked={settings.enableTips}
            onChange={(e) => {
              setSetting("enableTips", e.currentTarget.checked);
            }}
          />
          <label>Show a random tip everyday</label>
        </Row>
        <Words type="heading">Mood Tracker</Words>
        <Row style={{ margin: "10px" }}>
          <input
            type="checkbox"
            defaultChecked={settings.showMood}
            onChange={(e) => {
              setSetting("showMood", e.currentTarget.checked);
            }}
          />
          <label>Show mood tracking section</label>
        </Row>
        <Row style={{ margin: "10px" }}>
          <input
            type="checkbox"
            defaultChecked={settings.promptMood}
            onChange={(e) => {
              setSetting("promptMood", e.currentTarget.checked);
            }}
          />
          <label>Prompt to log mood every day</label>
        </Row>
        <Row style={{ margin: "10px" }}>
          <input
            type="checkbox"
            defaultChecked={settings.useMoodColors}
            onChange={(e) => {
              setSetting("useMoodColors", e.currentTarget.checked);
            }}
          />
          <label>Show mood colors</label>
        </Row>
        <label>Select moods to show on prompt:</label>
        <br />
        {moodList.map((x) => (
          <GoogleMatieralIcon
            util={[
              "clickable",
              "lift-up",
              "round",
              settings.userMoods.includes(x) ? "selected" : "giraffe",
            ]}
            size="48px"
            outline={true}
            style={combineStyles(
              {
                padding: "5px",
              },
              settings.useMoodColors ? { color: moodColorMap[moodMap[x]] } : {}
            )}
            name={`sentiment_${x}`}
            onClick={() => toggle(x)}
          />
        ))}
        <Words type="heading" style={{ display: "block" }}>
          Shortcuts
        </Words>
        <ShortcutList />
      </Container>
    </Column>
  );
}
