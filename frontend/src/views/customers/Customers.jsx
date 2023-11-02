import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axios";
import {
  TbPlayerTrackNextFilled,
  TbPlayerTrackPrevFilled,
} from "react-icons/tb";
import { useStateContext } from "../../contexts/ContextProvider";

function Customers() {
  const { setNotification } = useStateContext();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const carouselPages = 5; // Define the number of pages to display in
  const [selectedCustomers, setSelectedCustomers] = useState({
    [currentPage]: [],
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm === "") {
      getCustomers(currentPage);
    } else {
      loadSearchResults(1, searchTerm);
    }
  }, [currentPage, searchTerm]);
  const getCustomers = (page) => {
    setLoading(true);
    axiosClient
      .get(`/getCustomerForMenu?page=${page}`)
      .then(({ data }) => {
        setLoading(false);
        setCustomers(data.data);
        setTotalPages(data.meta.last_page);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const loadSearchResults = (page, term) => {
    setLoading(true);
    axiosClient
      .get(`/search-customers?page=${page}&searchTerm=${term}`)
      .then(({ data }) => {
        setLoading(false);
        setCustomers(data.data);
        setTotalPages(data.meta.last_page);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  const onSearchClick = () => {
    setCurrentPage(1); // Reset the current page to 1 when searching
    loadSearchResults(1, searchTerm); // Load search results for the first page
  };

  const onDeleteClick = (id) => {
    if (!window.confirm("Are you sure you want to delete this customer")) {
      return;
    }
    axiosClient
      .delete(`/customer/${id}`)
      .then(() => {
        setNotification("Customer was successfully deleted");
        getCustomers(currentPage);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const onChangePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const onPreviousPage = () => {
    if (currentPage > 1) {
      onChangePage(currentPage - 1);
    }
  };

  const onNextPage = () => {
    if (currentPage < totalPages) {
      onChangePage(currentPage + 1);
    }
  };

  const toggleSelectAllOnPage = () => {
    if (
      selectedCustomers[currentPage] &&
      selectedCustomers[currentPage].length === customers.length
    ) {
      setSelectedCustomers((prevSelected) => ({
        ...prevSelected,
        [currentPage]: [],
      }));
    } else {
      const customerIdsOnPage = customers.map((customer) => customer.id);
      setSelectedCustomers((prevSelected) => ({
        ...prevSelected,
        [currentPage]: customerIdsOnPage,
      }));
    }
  };

  const toggleSelectCustomer = (page, customerId) => {
    if (selectedCustomers[page].includes(customerId)) {
      setSelectedCustomers((prevSelected) => ({
        ...prevSelected,
        [page]: prevSelected[page].filter((id) => id !== customerId),
      }));
    } else {
      setSelectedCustomers((prevSelected) => ({
        ...prevSelected,
        [page]: [...prevSelected[page], customerId],
      }));
    }
  };

  const transformObjectToArray = (obj) => {
    return Object.values(obj).flatMap((ids) => ids);
  };

  const deleteSelectedCustomers = () => {
    if (selectedCustomers.length === 0) {
      return;
    }
    if (
      !window.confirm("Are you sure you want to delete the selected customers?")
    ) {
      return;
    }

    axiosClient
      .delete("/customers/delete-selected", {
        data: {
          selectedCustomerIds: transformObjectToArray(selectedCustomers),
        },
      })
      .then(() => {
        setNotification("Selected customers were successfully deleted");
        getCustomers(currentPage);
        setSelectedCustomers([]); // Clear selected customers after deletion
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const exportCustomers = () => {
    // Send an API request to export customers
    axiosClient
      .post(
        "/customers/export",
        {
          selectedCustomerIds: transformObjectToArray(selectedCustomers),
        },
        {
          responseType: "arraybuffer", // Set responseType to 'arraybuffer'
        }
      )
      .then((response) => {
        const blob = new Blob([response.data], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        // Check if the Blob constructor is available
        if (window.navigator.msSaveBlob) {
          // For Internet Explorer
          window.navigator.msSaveBlob(blob, "customers-export.xlsx");
        } else {
          const url = window.URL.createObjectURL(blob);

          // Create a temporary <a> element
          const a = document.createElement("a");
          a.href = url;
          a.target = "_blank"; // Open in a new tab or window
          a.download = "customers-export.xlsx";

          // Trigger a click event to open the file
          a.click();

          // Clean up
          window.URL.revokeObjectURL(url);
        }
      })
      .catch((error) => {
        console.error(error);
        setNotification("Error exporting customers");
      });
  };

  return (
    <div>
      {/* Customers Header */}
      <div className="w-full h-20  justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-['Roboto'] leading-[62.40px]">
          Customers
        </div>
        <div className="flex justify-center items-center">
          <Link
            to="create"
            className="w-[81px] px-3.5 py-2 bg-emerald-600 rounded-lg shadow justify-center items-center gap-2 flex mr-4"
          >
            <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
              Add new
            </div>
          </Link>
          {/* <button
            className="w-auto px-3.5 py-2 bg-orange-500 rounded-lg shadow justify-center items-center gap-2 flex mr-4"
            onClick={() => toggleSelectAllOnPage(currentPage)}
          >
            <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
              Select Page
            </div>
          </button> */}
          <button
            onClick={deleteSelectedCustomers}
            className="w-auto px-3.5 py-2 bg-red-500 rounded-lg shadow justify-center items-center gap-2 flex mr-4"
          >
            <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
              Delete Selected
            </div>
          </button>
          <button
            onClick={exportCustomers}
            className="w-auto px-3.5 py-2 bg-sky-900 rounded-lg shadow justify-center items-center gap-2 flex"
          >
            <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
              Export
            </div>
          </button>
        </div>
      </div>
      {/* Customers Bar */}
      <form action="" className="flex justify-center items-center">
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          type="text"
          className="outline-none bg-white  mr-4 w-2/5 border-2 border-gray-300  px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus-border-purple-600"
          placeholder="search"
        />{" "}
        <div></div>
      </form>

      {/* Customers List */}

      <div
        className="grid grid-cols-1 justify-items-center mb-8"
        id="user-list"
      >
        {/* Customers Table */}
        <div className="card bg-white rounded shadow p-6 mb-6 mt-3 animated fadeInDown">
          <table className="w-full">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-4 py-2 flex items-center">
                  <input
                    type="checkbox"
                    key={currentPage}
                    className="w-[18px] h-[18px] mb-0 mr-4  bg-white rounded border border-gray-300"
                    checked={
                      selectedCustomers[currentPage] &&
                      selectedCustomers[currentPage].length ===
                        customers.length &&
                      customers.length > 0
                    }
                    onChange={() => toggleSelectAllOnPage(currentPage)}
                  />
                  Customer
                </th>
                <th className="px-4 py-2">Country</th>
                <th className="px-4 py-2">Birth</th>
                <th className="px-4 py-2">Contact</th>
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
                  customers.map((c) => (
                    <tr key={c.id} className="">
                      <td className="px-4 py-2">
                        <div className=" flex items-center justify-start">
                          <input
                            type="checkbox"
                            className="w-[18px] h-[18px] mb-0 mr-4  bg-white rounded border border-gray-300"
                            key={c.id}
                            checked={
                              selectedCustomers[currentPage] &&
                              selectedCustomers[currentPage].includes(c.id)
                            }
                            onChange={() =>
                              toggleSelectCustomer(currentPage, c.id)
                            }
                          />
                          <img
                            className="w-10 h-10 rounded-[24px] mr-3"
                            src={`${import.meta.env.VITE_API_BASE_URL}/${
                              c.image
                            }`}
                            alt={``}
                          />
                          <div className="">
                            <p>{c.name}</p>
                            <p className="text-zinc-400 text-[12px] font-bold font-['Roboto'] leading-[14px]">
                              {c.created_at}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <p>{c.country}</p>
                      </td>
                      <td className="flex items-center">
                        <p className="mr-4">{c.birth_day}</p>
                        <p>{c.birth_place}</p>
                      </td>

                      <td className="">
                        <p className="">{c.email}</p>
                        <p>{c.phone}</p>
                      </td>

                      <td className="flex items-center">
                        <Link
                          to={"/customers/" + c.id}
                          className="w-auto px-3.5 py-2 mr-2 bg-purple rounded-lg shadow justify-center items-center gap-2 flex"
                        >
                          <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
                            View
                          </div>
                        </Link>

                        <Link
                          to={"/customers/update/" + c.id}
                          className="w-auto px-3.5 py-2 mr-2 bg-emerald-600 rounded-lg shadow justify-center items-center gap-2 flex"
                        >
                          <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
                            Edit
                          </div>
                        </Link>

                        <button
                          onClick={(ev) => onDeleteClick(c.id)}
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
        {/* Customers Paginations */}
        <div className="w-64 h-10 flex justify-center items-center space-x-4">
          <button
            className={`w-[90px] h-10 px-4 py-2.5  rounded-lg justify-center items-center gap-2 inline-flex text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]  ${
              currentPage === 1 ? "bg-violet-800" : "bg-emerald-600"
            }`}
            onClick={onPreviousPage}
          >
            <TbPlayerTrackPrevFilled />
          </button>

          {Array.from({ length: totalPages }, (_, index) => {
            // Calculate the start and end pages for the carousel
            let startPage = currentPage - Math.floor(carouselPages / 2);
            let endPage = startPage + carouselPages - 1;

            // Ensure pages stay within bounds
            if (startPage < 1) {
              startPage = 1;
              endPage = startPage + carouselPages - 1;
            }
            if (endPage > totalPages) {
              endPage = totalPages;
              startPage = endPage - carouselPages + 1;
            }

            // Display buttons within the carousel range
            if (index + 1 >= startPage && index + 1 <= endPage) {
              return (
                <button
                  key={index}
                  className={`w-[39px] h-10 px-4 py-2.5  rounded-lg justify-center items-center gap-2 inline-flex text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]  ${
                    currentPage === index + 1
                      ? "bg-emerald-600"
                      : "bg-violet-800"
                  }`}
                  onClick={() => onChangePage(index + 1)}
                >
                  {index + 1}
                </button>
              );
            }
            return null; // Return null for buttons outside the carousel range
          })}
          <button
            className={`w-[90px] h-10 px-4 py-2.5  rounded-lg justify-center items-center gap-2 inline-flex text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]  ${
              currentPage === totalPages ? "bg-violet-800" : "bg-emerald-600"
            }`}
            onClick={onNextPage}
          >
            <TbPlayerTrackNextFilled />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Customers;
