"use client";

import { useEffect, useState } from "react";
import EmployeeForm from "../components/employees/EmployeeForm";
import EmployeeList from "../components/employees/EmployeeList";
import type { Employee } from "../lib/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const PAGE_SIZE = 8;

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const controller = new AbortController();

    async function loadEmployees() {
      try {
        const response = await fetch(`${API_URL}/employees`, {
          signal: controller.signal,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to load employees");
        }

        setEmployees(data);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
        setLoadError(
          error instanceof Error ? error.message : "Unable to load employees"
        );
      } finally {
        if (!controller.signal.aborted) setIsLoading(false);
      }
    }

    loadEmployees();
    return () => controller.abort();
  }, []);

  async function handleAdd(employee: Omit<Employee, "_id">) {
    const response = await fetch(`${API_URL}/employees`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to save employee");
    }

    setEmployees((previous) => [data.employee, ...previous]);
    setCurrentPage(1);
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this employee?"
    );

    if (!confirmed) return;

    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const data = await response.json();
      setLoadError(data.message || "Unable to delete employee");
      return;
    }

    setLoadError("");
    setEmployees((previous) =>
      previous.filter((employee) => employee._id !== id)
    );
  }

  async function handleUpdate(
    id: string,
    employee: Omit<Employee, "_id">
  ) {
    const response = await fetch(`${API_URL}/employees/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(employee),
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to update employee");
    }

    setEmployees((previous) =>
      previous.map((existing) => (existing._id === id ? data : existing))
    );
  }

  const filteredEmployees = employees.filter((employee) =>
    employee.name.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );
  const totalPages = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  const page = Math.min(currentPage, totalPages);
  const visibleEmployees = filteredEmployees.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  return (
    <main className="container-xxl page-container py-4 py-lg-5">
      <header className="page-header d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <p className="eyebrow">EMPLOYEE MANAGEMENT</p>
          <h1>Employee Directory</h1>
          <p>Manage your team members in one place.</p>
        </div>

        <div className="employee-count p-3">
          <span>Total Employees</span>
          <strong>{employees.length}</strong>
        </div>
      </header>

      <div className="row g-4 align-items-start">
        <aside className="col-12 col-lg-4 col-xl-3">
          <div className="form-panel h-100 p-3 p-lg-4">
            <EmployeeForm onAdd={handleAdd} />
          </div>
        </aside>

        <section className="col-12 col-lg-8 col-xl-9" aria-labelledby="team-heading">
          <div className="directory-panel p-3 p-lg-4">
          <div className="section-heading">
            <h2 id="team-heading">Team Members</h2>
            <span>{filteredEmployees.length} employees</span>
          </div>

          <div className="directory-tools d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
            <label className="search-field">
              <span className="visually-hidden">Search employees by name</span>
              <input
                className="form-control"
                type="search"
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by name"
              />
            </label>
            <span className="results-count">
              {filteredEmployees.length} of {employees.length}
            </span>
          </div>

          {loadError && <p role="alert">{loadError}</p>}
          {isLoading ? (
            <p>Loading employees...</p>
          ) : filteredEmployees.length === 0 ? (
            <div className="empty-state">
              <h3>
                {searchTerm.trim() ? "No matching employees" : "No employees yet"}
              </h3>
              <p>
                {searchTerm.trim()
                  ? "Try another name."
                  : "Add an employee to see them here."}
              </p>
            </div>
          ) : (
            <>
              <EmployeeList
                employees={visibleEmployees}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
              />
              {totalPages > 1 && (
                <nav className="employee-pagination d-flex justify-content-between align-items-center gap-3 mt-3" aria-label="Employee list pages">
                  <span className="pagination-status" aria-live="polite">
                    Page {page} of {totalPages}
                  </span>
                  <ul className="pagination pagination-sm mb-0">
                    <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        type="button"
                        onClick={() => setCurrentPage(page - 1)}
                        disabled={page === 1}
                        aria-label="Previous page"
                      >
                        Previous
                      </button>
                    </li>
                    <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link"
                        type="button"
                        onClick={() => setCurrentPage(page + 1)}
                        disabled={page === totalPages}
                        aria-label="Next page"
                      >
                        Next
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </>
          )}
          </div>
        </section>
      </div>
    </main>
  );
}