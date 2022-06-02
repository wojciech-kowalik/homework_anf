import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import contacts from "../contacts.json";
import { ContactList } from "../functional/ContactList";

describe("ContactList Component", () => {
  it("should be null with empty content", async () => {
    const { container } = render(<ContactList contacts={[]} />);
    await waitFor(() => {
      expect(container.childElementCount).toEqual(0);
    });
  });

  it("should match snapshot (empty)", () => {
    const { container } = render(<ContactList contacts={[]} />);
    expect(container).toMatchSnapshot();
  });

  it("should match snapshot (content)", () => {
    const { container } = render(<ContactList contacts={contacts} />);
    expect(container).toMatchSnapshot();
  });

  it("should show list of contacts", async () => {
    render(<ContactList contacts={contacts} />);
    const buttons = await screen.findAllByTestId("button-", { exact: false });
    expect(buttons).toHaveLength(contacts.length);
  });

  it("should call onSelect function after a contact was clicked", async () => {
    const onSelect = jest.fn();
    render(<ContactList contacts={contacts} onSelect={onSelect} />);
    const button = await screen.findByTestId(`button-${contacts[0].id}`);
    await userEvent.click(button);
    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith(contacts[0]);
  });

  it("should add `active` class to a contact after it was selected", async () => {
    const contact = contacts[0];
    render(<ContactList contacts={contacts} selected={contact} />);

    const button = await screen.findByTestId(`button-${contacts[0].id}`);
    expect(button).toHaveClass("active");
  });
});
