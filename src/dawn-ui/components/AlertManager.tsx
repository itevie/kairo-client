import { ReactNode, useEffect, useState } from "react";
import Button, { ButtonType } from "./Button";
import Container from "./Container";
import Row from "./Row";
import Loader from "react-spinners/PulseLoader";
import Column from "./Column";

interface Model {
  id?: string;
  title?: string;
  body: ReactNode;
  buttons?: ModelButton[];
  allowOutsideClose?: boolean;
}

interface ModelButton {
  text: string;
  id: string;
  type?: ButtonType;
  click: (close: () => void) => void;
  enterKey?: boolean;
}

export let alertStack: Model[] = [];
export let addAlert: (data: Model) => void = () => {};
export let closeAlert: (id?: string) => void = () => {};
export let updateAlert: (id: string, newElement: ReactNode) => void = () => {};

export default function AlertManager() {
  const [current, setCurrent] = useState<Model | null>(null);

  useEffect(() => {
    addAlert = (model) => {
      alertStack.push(model);
      reload();
    };

    closeAlert = (id) => {
      if (id) {
        const index = alertStack.findIndex((x) => x.id === id);
        if (index < 0) return;
        alertStack.splice(index, 1);
        reload();
      } else {
        alertStack.pop();
        reload();
      }
    };

    updateAlert = (id, el) => {
      const index = alertStack.findIndex((x) => x.id === id);
      if (index < 0) return;
      alertStack[index] = {
        ...alertStack[index],
        body: el,
      };
      reload();
    };
  }, []);

  function reload() {
    setCurrent(alertStack[alertStack.length - 1]);
  }

  function close() {
    alertStack.pop();
    reload();
  }

  return (
    current && (
      <div
        className="dawn-fullscreen"
        style={{ top: `${window.scrollY}px` }}
        onClick={() => current.allowOutsideClose && close()}
      >
        <div className="dawn-page-center">
          <Container className="dawn-alert">
            {current.title && (
              <label className="dawn-text-alert-title">{current.title}</label>
            )}
            <div className="dawn-alert-content">{current.body}</div>
            <Row>
              {current.buttons?.map((button) => (
                <Button key={button.id} big onClick={() => button.click(close)}>
                  {button.text}
                </Button>
              ))}
            </Row>
          </Container>
        </div>
      </div>
    )
  );
}

export function showErrorAlert(message: string) {
  return new Promise<void>((resolve) => {
    addAlert({
      title: "Error!",
      body: <label>{message}</label>,
      allowOutsideClose: true,
      buttons: [
        {
          id: "ok",
          text: "OK!",
          enterKey: true,
          click: (close) => {
            close();
            resolve();
          },
        },
      ],
    });
  });
}

export function showInfoAlert(message: string) {
  return new Promise<void>((resolve) => {
    addAlert({
      title: "Information",
      allowOutsideClose: true,
      body: <label>{message}</label>,
      buttons: [
        {
          id: "ok",
          text: "OK!",
          enterKey: true,
          click: (close) => {
            close();
            resolve();
          },
        },
      ],
    });
  });
}

export function showLoadingAlert(): {
  stop: () => void;
  progress: (amount: number) => void;
} {
  const id = Math.random().toString();

  addAlert({
    id,
    body: <Loader color="white" />,
  });

  return {
    stop: () => closeAlert(id),
    progress: (amount) => {
      updateAlert(
        id,

        <Column util={["align-center", "justify-center"]}>
          <Loader color="white" />
          <div>
            <progress max={100} value={(amount * 100).toFixed(0)}></progress>
            <label>{(amount * 100).toFixed(2)}%</label>
          </div>
        </Column>
      );
    },
  };
}

export function showConfirmModel(title: string, yesCb: () => void): void {
  addAlert({
    title: "Confirm",
    body: <label>{title}</label>,
    buttons: [
      {
        id: "no",
        text: "No",
        click: (c) => c(),
      },
      {
        id: "yes",
        text: "Yes",
        enterKey: true,
        click: (c) => {
          c();
          yesCb();
        },
      },
    ],
  });
}

export function showInputAlert(title: string): Promise<string | null> {
  return new Promise<string | null>((resolve) => {
    let current: string | null = null;

    addAlert({
      title,
      body: (
        <input
          autoFocus
          className="dawn-big"
          onChange={(e) => (current = e.currentTarget.value)}
        />
      ),
      buttons: [
        {
          id: "close",
          click: (close) => {
            close();
            resolve(null);
          },
          text: "Cancel",
        },
        {
          id: "ok",
          enterKey: true,
          click: (close) => {
            close();
            resolve(current);
          },
          text: "OK!",
        },
      ],
    });
  });
}
