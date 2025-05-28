import { addAlert } from "../dawn-ui/components/AlertManager";

const tips: string[] = [
  "Right click, or hold down on a group to change it's color.",
  "Check out what shortcuts are available in settings to speed up your expierence.",
  "Kairo has a mood tracker, check out the settings to enable it.",
  "You can put tasks into groups to be nice and organised.",
  "Change which emotions you can pick on the mood logger in settings.",
];

export function showTip() {
  addAlert({
    title: "Daily Tip",
    body: <label>{tips[Math.floor(Math.random() * tips.length)]}</label>,
    buttons: [
      {
        id: "disable",
        text: "Disable Tips",
        click(close) {
          localStorage.setItem("kairo-enable-tips", "false");
          close();
        },
      },
      {
        id: "ok",
        text: "OK!",
        click(close) {
          close();
        },
      },
    ],
  });
}

export default tips;
