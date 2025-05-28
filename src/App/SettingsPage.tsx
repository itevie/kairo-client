import { setTheme, themeSetBackground } from "../dawn-ui";
import Column from "../dawn-ui/components/Column";
import Container from "../dawn-ui/components/Container";
import Row from "../dawn-ui/components/Row";
import Words, { TextType } from "../dawn-ui/components/Words";
import useMainHook from "./hooks/useMainHook";
import { moodColorMap, moodList, moodMap } from "./MoodLogger";
import GoogleMatieralIcon from "../dawn-ui/components/GoogleMaterialIcon";
import { combineStyles } from "../dawn-ui/util";
import { spawnConfetti } from "../dawn-ui/confetti";
import useSettings from "./hooks/useSettings";
import Button from "../dawn-ui/components/Button";
import api from "./api";
import { addAlert } from "../dawn-ui/components/AlertManager";
import { ShortcutList } from "../dawn-ui/components/ShortcutManager";

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
      <Words type={TextType.PageTitle}>Settings</Words>
      <Container>
        {/* Appearance Settings */}
        <Row>
          <Words type={TextType.Heading}>Appearance</Words>
          <Row util={["align-center", "small-gap"]}>
            <input
              type="checkbox"
              defaultChecked={settings.syncAppearance}
              checked={settings.syncAppearance}
              onChange={(e) => {
                console.log(settings.syncAppearance);
                setSetting("syncAppearance", e.currentTarget.checked);
              }}
            />
            <label>Sync?</label>
          </Row>
        </Row>
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
                  defaultValue={settings.theme}
                  onChange={(e) => {
                    setSetting("theme", e.currentTarget.value);
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
                  defaultValue={settings.backgroundImage}
                  onChange={(e) => {
                    setSetting("backgroundImage", e.currentTarget.value);
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
                  checked={settings.showConfetti}
                  onClick={(e) => {
                    spawnConfetti(e.pageX, e.pageY);
                  }}
                  onChange={(e) => {
                    setSetting("showConfetti", e.currentTarget.checked);
                  }}
                />
              </tr>
            </tr>
          </tbody>
        </table>
        {/* Mood Logger Settings */}
        <Row>
          <Words style={{ flexShrink: "0" }} type={TextType.Heading}>
            Mood Tracker
          </Words>
          <Row util={["align-center", "small-gap"]}>
            <input
              type="checkbox"
              defaultChecked={settings.syncMoodLogger}
              checked={settings.syncMoodLogger}
              onChange={(e) => {
                setSetting("syncMoodLogger", e.currentTarget.checked);
              }}
            />
            <label>Sync?</label>
          </Row>
        </Row>
        <Row style={{ margin: "10px" }}>
          <input
            type="checkbox"
            defaultChecked={settings.showMood}
            checked={settings.showMood}
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
            checked={settings.promptMood}
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
            checked={settings.useMoodColors}
            onChange={(e) => {
              setSetting("useMoodColors", e.currentTarget.checked);
            }}
          />
          <label>Show mood colors</label>
        </Row>
        <label>Select moods to show on prompt:</label>
        <br />
        <Row util={["small-gap", "flex-wrap"]} style={{ padding: "5px" }}>
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
                settings.useMoodColors
                  ? { color: moodColorMap[moodMap[x]] }
                  : {},
              )}
              name={`sentiment_${x}`}
              onClick={() => toggle(x)}
            />
          ))}
        </Row>
        <Words type={TextType.Heading}>Miscellaneous</Words>
        <Row style={{ margin: "10px" }}>
          <input
            type="checkbox"
            defaultChecked={settings.enableTips}
            checked={settings.enableTips}
            onChange={(e) => {
              setSetting("enableTips", e.currentTarget.checked);
            }}
          />
          <label>Show a random tip everyday</label>
        </Row>
        <Words type={TextType.Heading}>Actions</Words>
        <Row>
          <Button onClick={exportData}>Export Data</Button>
          <Button>Import Data</Button>
        </Row>
        <Words type={TextType.Heading}>Shortcuts</Words>
        <ShortcutList />
      </Container>
    </Column>
  );
}

async function exportData() {
  const data = await api.fetchAllData();
  addAlert({
    title: "Your Data",
    body: <textarea>{JSON.stringify(data)}</textarea>,
    buttons: [
      {
        id: "ok",
        text: "ok",
        click(close) {
          close();
        },
      },
    ],
  });
}
