import React from "react";
import { Contact } from "../contacts.service";

interface ContactFormProps {
  contact: Contact;
  onChange: (contact: Contact) => void;
  onSubmit: (contact: Contact) => void;
  onCancel: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = (props): JSX.Element => {
  const { contact, onChange, onSubmit, onCancel } = props;

  const _onChange = (
    e: React.ChangeEvent<HTMLInputElement & HTMLTextAreaElement>
  ) => {
    const target = e.target;
    const name = target.name;
    const value = target.type === "checkbox" ? target.checked : target.value;

    onChange({
      ...contact,
      [name]: value,
    });
  };

  const _onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(contact);
  };

  return (
    <form onSubmit={_onSubmit}>
      <div className="form-group">
        <label className="d-block w-100">
          Name:
          <input
            className="form-control"
            name="name"
            data-testid="form-name"
            value={contact.name}
            onChange={_onChange}
          />
        </label>
      </div>
      <div className="form-group">
        <label className="d-block w-100">
          Contact details:
          <textarea
            className="form-control"
            name="details"
            data-testid="form-details"
            value={contact.details}
            onChange={_onChange}
          />
        </label>
      </div>
      <div className="form-group">
        <input
          type="button"
          id="cancel-contact"
          data-testid="form-button-cancel"
          className="btn btn-default"
          value="Cancel"
          onClick={onCancel}
        />
        <input
          type="submit"
          id="save-contact"
          data-testid="form-button-submit"
          className="btn btn-primary ml-2"
          value="Save"
        />
      </div>
    </form>
  );
};
