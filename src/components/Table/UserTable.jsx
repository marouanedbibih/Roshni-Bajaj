import React, { useEffect, useState } from "react";
import axiosClient from "../../api/axios";
import { Link } from "react-router-dom";

function UserTable() {
  return (
    <div className="card bg-white rounded shadow p-6 mb-6 mt-3 animated fadeInDown">
      <table className="w-full">
        <thead className="bg-gray-300">
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">Create Date</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td colSpan="5" className="text-center">
                Loading...
              </td>
            </tr>
          )}
          {!loading &&
            users.map((u) => (
              <tr key={u.id}>
                <td>
                  <img
                    className="w-10 h-10 rounded-[24px]"
                    src={`${import.meta.env.VITE_API_BASE_URL}${u.image}`}
                    alt={`${u.last_name} ${u.first_name}`}
                  />
                </td>
                <td>
                  {u.last_name} {u.first_name}
                </td>
                <td>{u.email}</td>
                <td>{u.created_at}</td>
                <td>
                  <Link
                    to={"/users/" + u.id}
                    className="btn btn-edit mr-2 bg-blue-500"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={(ev) => onDeleteClick(u)}
                    className="btn btn-delete bg-red-500"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
