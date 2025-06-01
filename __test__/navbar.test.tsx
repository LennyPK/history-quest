import { cleanup, render } from "@testing-library/react"
import { afterEach } from "node:test"
import { expect, test } from "vitest"
import Navbar from "../components/navbar"

afterEach(() => {
  cleanup()
})

const routes = ["Home", "Events", "Leaderboard", "History Guesser"]

test("renders all navigation routes", () => {
  const { getByText } = render(<Navbar />)
  for (const route of routes) {
    expect(getByText(route)).not.toBeNull()
  }
})

test("renders name", async () => {
  const { getAllByText } = render(<Navbar />)
  const spans = getAllByText("HistoryQuest").filter((el) => el.tagName.toLowerCase() === "span")
  expect(spans.length).toBeGreaterThan(0)
})
