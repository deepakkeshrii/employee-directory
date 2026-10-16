"use client";

import { useState, type FormEvent } from "react";
import type { Employee } from "../../lib/types";

interface EmployeeListProps {
  employees: Employee[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, employee: Omit<Employee, "_id">) => Promise<void>;
}

interface EmployeeRowProps {
  employee: Employee;
  onDelete: (id: string) => void;
  onUpdate: EmployeeListProps["onUpdate"];
}

function EmployeeRow({ employee, onDelete, onUpdate }: EmployeeRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(employee.name);
  const [email, setEmail] = useState(employee.email);
  const [role, setRole] = useState(employee.role);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function startEditing() {
    setName(employee.name);
    setEmail(employee.email);
    setRole(employee.role);
    setError("");
    setIsEditing(true);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      await onUpdate(employee._id, {
        name: name.trim(),
        email: email.trim(),
        role: role.trim(),
      });
      setIsEditing(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unable to update employee");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <>
      <tr>
        <td>
          {isEditing ? (
            <input
              className="form-control form-control-sm row-edit-input"
              aria-label={`Name for ${employee.name}`}
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
            />
          ) : (
            employee.name
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              className="form-control form-control-sm row-edit-input"
              aria-label={`Email for ${employee.name}`}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              maxLength={254}
              required
            />
          ) : (
            employee.email
          )}
        </td>
        <td>
          {isEditing ? (
            <input
              className="form-control form-control-sm row-edit-input"
              aria-label={`Role for ${employee.name}`}
              value={role}
              onChange={(event) => setRole(event.target.value)}
              maxLength={100}
              required
            />
          ) : (
            <span className="badge role-badge">{employee.role}</span>
          )}
        </td>
        <td>
          {isEditing ? (
            <form className="row-actions d-flex flex-wrap gap-1" onSubmit={handleSubmit}>
              <button className="btn btn-sm btn-success" type="submit" disabled={isSaving}>
                {isSaving ? "Saving..." : "Save"}
              </button>
              <button
                className="btn btn-sm btn-outline-secondary"
                type="button"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Cancel
              </button>
            </form>
          ) : (
            <div className="row-actions d-flex flex-wrap gap-1">
              <button
                type="button"
                className="btn btn-sm btn-outline-success"
                onClick={startEditing}
              >
                Update
              </button>
              <button
                type="button"
                className="btn btn-sm btn-outline-danger"
                onClick={() => onDelete(employee._id)}
              >
                Delete
              </button>
            </div>
          )}
        </td>
      </tr>
      {error && (
        <tr>
          <td colSpan={4}>
            <p className="alert alert-danger py-2 row-error" role="alert">{error}</p>
          </td>
        </tr>
      )}
    </>
  );
}

export default function EmployeeList({
  employees,
  onDelete,
  onUpdate,
}: EmployeeListProps) {
  if (employees.length === 0) {
    return (
      <div className="empty-state">
        <h3>No employees found</h3>
        <p>Add an employee to see them here.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive table-wrapper">
      <table className="table table-hover align-middle employee-table mb-0">
        <thead>
          <tr>
            <th scope="col">Name</th>
            <th scope="col">Email</th>
            <th scope="col">Job Role</th>
            <th scope="col">Action</th>
          </tr>
        </thead>

        <tbody>
          {employees.map((employee) => (
            <EmployeeRow
              key={employee._id}
              employee={employee}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}