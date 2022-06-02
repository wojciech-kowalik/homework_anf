import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import contacts from "../contacts.json";
import { ContactForm } from "../functional/ContactForm";

describe("ContactForm Component", () => {
  it("should be stateless component (no setState, only props)", () => {
    render(<ContactForm contact={{}} />);
    expect(screen.getByTestId("form-name").value).toBe("");
    expect(screen.getByTestId("form-details").value).toBe("");
  });

  it("should match snapshot", () => {
    const { container } = render(<ContactForm contact={{}} />);
    expect(container).toMatchSnapshot();
  });

  it("should display name and details form input fields after a contact is selected", () => {
    const contact = contacts[1];
    render(<ContactForm contact={contact} />);
    expect(screen.getByTestId("form-name").value).toEqual(contact.name);
    expect(screen.getByTestId("form-details").value).toEqual(contact.details);
  });

  it("should call onChange with changed form values", async () => {
    const onChange = jest.fn();
    const contact = { name: "", details: "" };
    render(<ContactForm contact={contact} onChange={onChange} />);

    fireEvent.change(screen.getByTestId("form-name"), {
      target: { value: "test" },
    });
    //await userEvent.type(input, 'test'); // with userEvent calls 4 times
    expect(onChange).toBeCalledTimes(1);
    expect(onChange).toBeCalledWith({ name: "test", details: "" });

    fireEvent.change(screen.getByTestId("form-details"), {
      target: { value: "test" },
    });
    expect(onChange).toBeCalledTimes(2);
    expect(onChange).toBeCalledWith({ name: "", details: "test" });
  });

  it("should call onSubmit with changed contact after the form is submitted", async () => {
    const onSubmit = jest.fn();
    const contact = { name: "", details: "" };
    render(<ContactForm contact={contact} onSubmit={onSubmit} />);

    await userEvent.click(screen.getByTestId("form-button-submit"));
    expect(onSubmit).toBeCalledTimes(1);
    expect(onSubmit).toBeCalledWith(contact);
  });
});
