import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import KeyValueInputForm from "../../components/Input/KeyValueInputForm";
import axiosClient from "../../api/axios.js";
import { useStateContext } from "../../contexts/ContextProvider";

function CustomerForm() {
  // Variables
  let { id } = useParams();
  const navigate = useNavigate();
  const { setNotification } = useStateContext();
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState();
  const [customer, setCustomer] = useState({
    infos: {
      name: "",
      birth_day: "",
      birth_place: "",
      country: "",
      state: "",
      city: "",
      job: "",
    },
    emails: [
      {
        id: null,
        key: "home",
        value: "",
      },
    ],
    phones: [
      {
        id: null,
        key: "home",
        value: "",
      },
    ],
    descriptions: [
      {
        id: null,
        key: "home",
        value: "",
      },
    ],
  });

  // React Functions
  const clearErrors = () => {
    setErrors(null);
  };

  const updateDataKey = (index, newDataKey, dataName) => {
    setCustomer((prevState) => {
      const updatedData = [...prevState[dataName]];
      updatedData[index].key = newDataKey;
      return { ...prevState, [dataName]: updatedData };
    });
  };

  const updateDataValue = (index, newDataValue, dataName) => {
    setCustomer((prevState) => {
      const updatedData = [...prevState[dataName]];
      updatedData[index].value = newDataValue;
      return { ...prevState, [dataName]: updatedData };
    });
  };

  const addNewData = (dataName) => {
    const updatedData = [...customer[dataName]];
    updatedData.push({ id: null, key: "", value: "" });
    setCustomer((prevState) => ({
      ...prevState,
      [dataName]: updatedData,
    }));
  };

  const removeData = (index, dataName) => {
    const updatedData = [...customer[dataName]];
    if (updatedData[index].id !== null) {
      console.log(dataName, updatedData[index].id);
      if (
        !window.confirm(`Are you sure you want to delete this ${dataName}?`)
      ) {
        event.preventDefault(); // Prevent navigation
        return;
      } else {
        // Make an API call to delete the email (or phone or address) from the database
        axiosClient
          .delete(`/${dataName}/${updatedData[index].id}`)
          .then((response) => {
            console.log(response);
            setNotification(`${dataName} was successfully deleted`);
          })
          .catch((error) => {
            console.error(error);
          });
      }
    }
    // Remove the data from the UI
    updatedData.splice(index, 1);
    setCustomer((prevState) => ({
      ...prevState,
      [dataName]: updatedData,
    }));
  };

  const addNewEmail = () => addNewData("emails");
  const addNewPhone = () => addNewData("phones");
  const addNewDescription = () => addNewData("descriptions");

  // API Functions
  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/customer/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setCustomer(data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = { ...customer };
    if (id) {
      console.log("Update Customer : ", payload);
      axiosClient
        .put(`/customer/${id}`, payload)
        .then(() => {
          setNotification("Customer was successfully updated");
          navigate("/customers");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
            setTimeout(clearErrors, 5000);

          }
        });
    } else {
      console.log(payload)
      axiosClient
        .post("/customer", payload)
        .then((response) => {
          setNotification("Customer was successfully created");
          navigate("/customers");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
            setTimeout(clearErrors, 5000);
          }
        });
    }
  };



  // React View
  return (
    <form onSubmit={onSubmit}>
      {errors && (
        <div className="alert">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}
      {/* Customers Form Header */}
      <div className="w-full h-20  justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-['Roboto'] leading-[62.40px]">
          Customers
        </div>
        <button
          type="submit"
          className="w-[81px] px-3.5 py-2 bg-emerald-600 rounded-lg shadow justify-center items-center gap-2 flex"
        >
          <div className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]">
            Save
          </div>
        </button>
      </div>
      
      {/* Customer Personnel information */}
      <div className="w-full h-auto p-4 mb-16 bg-white rounded-lg shadow border-b border-zinc-400 flex-col justify-start items-start gap-4 inline-flex">
        <div className="text-black text-[32px] font-bold font-['Roboto'] leading-[41.60px]">
          Informations
        </div>
        <div
          id="personnel-section"
          className="w-full flex flex-col justify-center items-center"
        >
          <div
            className="w-full ml-4 grid grid-cols-1 justify-items-center content-center"
            id="personnel-inputs "
          >
            {/* Customer Personnel information */}
            <div className="w-full grid grid-cols-2 gap-8" id="row-inputs-1">
              <input
                value={customer.infos.name}
                onChange={(ev) =>
                  setCustomer({
                    ...customer,
                    infos: { ...customer.infos, name: ev.target.value },
                  })
                }
                type="text"
                className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus:border-purple-600"
                placeholder="Full Name"
              />
              <input
                value={customer.infos.birth_day}
                onChange={(ev) =>
                  setCustomer({
                    ...customer,
                    infos: { ...customer.infos, birth_day: ev.target.value },
                  })
                }
                type="date"
                className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus:border-purple-600"
                placeholder="Birth Day"
              />
              <input
                value={customer.infos.birth_place}
                onChange={(ev) =>
                  setCustomer({
                    ...customer,
                    infos: { ...customer.infos, birth_place: ev.target.value },
                  })
                }
                type="text"
                className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus:border-purple-600"
                placeholder="Birth Place"
              />
              <input
                value={customer.infos.country}
                onChange={(ev) =>
                  setCustomer({
                    ...customer,
                    infos: { ...customer.infos, country: ev.target.value },
                  })
                }
                type="text"
                className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus:border-purple-600"
                placeholder="Country"
              />
              <input
                value={customer.infos.state}
                onChange={(ev) =>
                  setCustomer({
                    ...customer,
                    infos: { ...customer.infos, state: ev.target.value },
                  })
                }
                type="text"
                className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus:border-purple-600"
                placeholder="State"
              />
              <input
                value={customer.infos.city}
                onChange={(ev) =>
                  setCustomer({
                    ...customer,
                    infos: { ...customer.infos, city: ev.target.value },
                  })
                }
                type="text"
                className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus:border-purple-600"
                placeholder="City"
              />
              <input
                value={customer.infos.job}
                onChange={(ev) =>
                  setCustomer({
                    ...customer,
                    infos: { ...customer.infos, job: ev.target.value },
                  })
                }
                type="text"
                className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus:border-purple-600"
                placeholder="job"
              />
            </div>

            {/* Customer Emails */}
            <div className="w-full h-auto p-4 flex-col justify-start items-start gap-4 inline-flex">
              <div className="text-black text-[32px] font-bold font-['Roboto'] leading-[41.60px]">
                Emails
              </div>
              {customer.emails.map((email, index) => (
                <KeyValueInputForm
                  data={email}
                  updateDataKey={(newEmailKey) =>
                    updateDataKey(index, newEmailKey, "emails")
                  }
                  updateDataValue={(newEmailValue) =>
                    updateDataValue(index, newEmailValue, "emails")
                  }
                  removeData={() => removeData(index, "emails")}
                  keyLabel="Email Key"
                  valueLabel="Email Value"
                  index={index}
                  type={"email"}
                />
              ))}

              <button
                type="button"
                onClick={addNewEmail}
                className="w-9 h-9 px-3.5 py-2 bg-violet-800 rounded-[100px] shadow justify-center items-center gap-2 inline-flex"
              >
                <AiOutlinePlus color="white" size={32} />
              </button>
            </div>
            {/* Customer Phones */}
            <div className="w-full h-auto p-4 flex-col justify-start items-start gap-4 inline-flex">
              <div className="text-black text-[32px] font-bold font-['Roboto'] leading-[41.60px]">
                Phones
              </div>
              {customer.phones.map((phone, index) => (
                <KeyValueInputForm
                  data={phone}
                  updateDataKey={(newPhoneKey) =>
                    updateDataKey(index, newPhoneKey, "phones")
                  }
                  updateDataValue={(newPhoneValue) =>
                    updateDataValue(index, newPhoneValue, "phones")
                  }
                  removeData={() => removeData(index, "phones")}
                  keyLabel="Phone Key"
                  valueLabel="Phone Value"
                  index={index}
                  type={"text"}
                />
              ))}

              <button
                type="button"
                onClick={addNewPhone}
                className="w-9 h-9 px-3.5 py-2 bg-violet-800 rounded-[100px] shadow justify-center items-center gap-2 inline-flex"
              >
                <AiOutlinePlus color="white" size={32} />
              </button>
            </div>

            {/* Customer Descriptions */}
            <div className="w-full h-auto p-4 flex-col justify-start items-start gap-4 inline-flex">
              <div className="text-black text-[32px] font-bold font-['Roboto'] leading-[41.60px]">
                Description
              </div>
              {customer.descriptions.map((description, index) => (
                <KeyValueInputForm
                  data={description}
                  updateDataKey={(newDescriptionKey) =>
                    updateDataKey(index, newDescriptionKey, "descriptions")
                  }
                  updateDataValue={(newDescriptionValue) =>
                    updateDataValue(index, newDescriptionValue, "descriptions")
                  }
                  removeData={() => removeData(index, "descriptions")}
                  keyLabel="Title"
                  valueLabel="Description"
                  index={index}
                  textarea={true} 
                />
              ))}

              <button
                type="button"
                onClick={addNewDescription}
                className="w-9 h-9 px-3.5 py-2 bg-violet-800 rounded-[100px] shadow justify-center items-center gap-2 inline-flex"
              >
                <AiOutlinePlus color="white" size={32} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CustomerForm;
