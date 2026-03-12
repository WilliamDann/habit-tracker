import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Avatar } from "@/components/avatar";

describe("Avatar", () => {
  it("renders image when url is provided", () => {
    render(<Avatar url="/test.jpg" name="John Doe" />);
    const img = screen.getByAltText("John Doe");
    expect(img).toBeInTheDocument();
  });

  it("renders initials when no url", () => {
    render(<Avatar url={null} name="John Doe" />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("renders single initial for single-word name", () => {
    render(<Avatar url={null} name="Alice" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders ? for null name", () => {
    render(<Avatar url={null} name={null} />);
    expect(screen.getByText("?")).toBeInTheDocument();
  });
});
