import { createFileRoute } from "@tanstack/react-router";
import { PomodoroApp } from "../components/pomodoro/PomodoroApp";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pomodoro Timer — Focus, Break, Repeat" },
      {
        name: "description",
        content:
          "A calm, polished Pomodoro timer with configurable focus and break sessions, daily history, and smooth visual feedback.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <PomodoroApp />;
}
