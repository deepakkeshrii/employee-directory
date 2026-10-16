"use client";

import { useState, type FormEvent } from "react";
import type { Employee } from "../../lib/types";

interface EmployeeFormProps {
  onAdd: (employee: Omit<Employee, "_id">) => Promise<void>;
}

export default function EmployeeForm({ onAdd }: EmployeeFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await onAdd({
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
      });
      setName("");
      setEmail("");
      setRole("");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to save employee");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="employee-form" onSubmit={handleSubmit}>
      <h2 className="h5 mb-1">Add Employee</h2>
      <p className="small mb-4">Enter the employee details below.</p>
      {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

      <div className="mb-3">
        <label className="form-label" htmlFor="name">Full Name</label>
        <input
          className="form-control"
          id="name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Enter full name"
          maxLength={100}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="email">Email Address</label>
        <input
          className="form-control"
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="name@example.com"
          maxLength={254}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label" htmlFor="role">Job Role</label>
        <input
          className="form-control"
          id="role"
          value={role}
          onChange={(event) => setRole(event.target.value)}
          placeholder="e.g. Frontend Developer"
          maxLength={100}
          required
        />
      </div>

      <button className="btn btn-success w-100" type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Add Employee"}
      </button>
    </form>
  );
}