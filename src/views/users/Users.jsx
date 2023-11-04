// UserList.js
import React, { useEffect, useState } from "react";
import UserHeader from "../../components/Header/UserHeader";
import { useStateContext } from "../../contexts/ContextProvider";
import axiosClient from "../../api/axios";
import { Link } from "react-router-dom";
import UserTable from "../../components/Table/UserTable";
import UserPagination from "../../components/Pagination/UserPagination";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    getUsers(currentPage);
  }, [currentPage]);

  const getUsers = (page) => {
    setLoading(true);
    axiosClient
      .get(`/users?page=${page}`)
      .then(({ data }) => {
        setLoading(false);
        setUsers(data.data);
        setTotalPages(data.meta.last_page);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onChangePage = (newPage) => {
    setCurrentPage(newPage);
  };

  const onDeleteClick = (user) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    axiosClient
      .delete(`/users/${user.id}`)
      .then(() => {
        // displayNotification("User was successfully deleted");
        getUsers(currentPage);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <div className="w-full h-20  justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-['Roboto'] leading-[62.40px]">
          Users
        </div>
        <Link 
        to="create"
        className="w-[81px] px-3.5 py-2 bg-emerald-600 rounded-lg shadow justify-center items-center gap-2 flex">
          <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
            Add new
          </div>
        </Link>
      </div>
      <div
        className="grid grid-cols-1 justify-items-center mb-8"
        id="user-list"
      >
        {/* Table of Users */}
        <div className="card bg-white rounded shadow p-6 mb-6 mt-3 animated fadeInDown">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Name</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Create Date</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            {loading && (
              <tbody>
                <tr>
                  <td colSpan="5" className="text-center">
                    Loading...
                  </td>
                </tr>
              </tbody>
            )}
            {!loading && (
              <tbody>
                {!loading &&
                  users.map((u) => (
                    <tr key={u.id} className="">
                      <td>
                        {u.id}
                      </td>
                      <td>
                        {u.last_name} {u.first_name}
                      </td>
                      <td>{u.email}</td>
                      <td>{u.created_at}</td>
                      <td className="flex items-center">


                        <Link
                          to={"/users/update/" + u.id}
                          className="w-auto px-3.5 py-2 mr-2 bg-purple rounded-lg shadow justify-center items-center gap-2 flex"
                        >
                          <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
                            Edit
                          </div>
                        </Link>
                        <button
                          onClick={(ev) => onDeleteClick(u)}
                          className="w-auto px-3.5 py-2 bg-red-500 rounded-lg shadow justify-center items-center gap-2 flex"
                        >
                          <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
                            Delete
                          </div>
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            )}
          </table>
        </div>
        {/* Paginations */}
        <div className="w-64 h-10 flex justify-center items-center space-x-4">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`w-[39px] h-10 px-4 py-2.5  rounded-lg justify-center items-center gap-2 inline-flex text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]  ${
                currentPage === index + 1 ? "bg-emerald-600" : "bg-violet-800"
              }`}
              onClick={() => onChangePage(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Users;
