import { screen } from "@testing-library/dom"
import { cleanup, render } from "@testing-library/react"
import { afterEach } from "node:test"
import { describe, expect, it } from "vitest"
import Home from "../app/page"

afterEach(() => {
  cleanup()
})

describe("Home Page", () => {
  it("renders the main heading", () => {
    const { getByText } = render(<Home />)
    expect(getByText("Welcome to HistoryQuest!")).not.toBeNull()
  })

  it("renders both event cards", () => {
    const { getAllByText } = render(<Home />)
    expect(getAllByText("World War II")).not.toBeNull()
    expect(getAllByText("French Revolution")).not.toBeNull()
  })

  it("loads all images correctly", () => {
    render(<Home />)

    // Test WW2 image
    const ww2Image = screen.getAllByAltText("World War II")
    expect(ww2Image).not.toBeNull()

    // Test French Revolution image
    const frImage = screen.getAllByAltText("French Revolution")
    expect(frImage).not.toBeNull()
  })

  it("displays all feature sections", () => {
    render(<Home />)

    expect(screen.getAllByText("Interactive Timelines")[0]).not.toBeNull()
    expect(screen.getAllByText("Dynamic Maps")[0]).not.toBeNull()
    expect(screen.getAllByText("Knowledge Checks")[0]).not.toBeNull()
  })

  it("has working navigation links", async () => {
    expect(screen.getAllByTestId("browse-link")[0].getAttribute("href")).toBe("/events")
    expect(screen.getAllByTestId("try-link")[0].getAttribute("href")).toBe("/history-guesser")
  })
})
