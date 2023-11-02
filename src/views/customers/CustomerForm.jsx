import React, { useEffect, useState } from "react";
import image from "../../../public/img/default-profile.png";
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
      code_postal: "",
      company: "",
      job: "",
      image: null,
      image_url: null,
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
    adresses: [
      {
        id: null,
        key: "home",
        value: "",
      },
    ],
  });
  const [profileImage, setProfileImage] = useState(null);

  // React Functions
  const onImageChoose = (ev) => {
    const file = ev.target.files[0];

    const reader = new FileReader();
    reader.onload = () => {
      setCustomer((customer) => ({
        ...customer,
        infos: {
          ...customer.infos,
          image: file,
          image_url: reader.result,
        },
      }));

      ev.target.value = "";
    };
    reader.readAsDataURL(file);
  };
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
  const addNewAdresse = () => addNewData("adresses");

  // API Functions
  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/customer/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setCustomer(data);
          // console.log("Customer ", customer);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = { ...customer };
    if (payload.infos.image) {
      payload.infos.image = payload.infos.image_url;
    }
    delete payload.infos.image_url;
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
          }
        });
    } else {
      // console.log("Payload:", payload);
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
          <div className="mb-8" id="personnel-profile">
            <label htmlFor="profile-image" className="file-input-label">
              <div className="file-customer">
                <img
                  src={
                    customer.infos.image_url ||
                    (id
                      ? `${import.meta.env.VITE_API_BASE_URL}/${
                          customer.infos.image
                        }`
                      : image)
                  }
                  alt="Profile Image"
                  className=""
                />

                <input
                  type="file"
                  id="profile-image"
                  className="hidden"
                  accept="image/*"
                  onChange={onImageChoose}
                />
                {/* {user.image && (
                  <button
                    onClick={() => setUser({ ...user, image: "" })}
                    className="delete-button"
                  >
                    <i className="fa fa-trash" aria-hidden="true"></i>
                  </button>
                )} */}
              </div>
            </label>
          </div>
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
                value={customer.infos.code_postal}
                onChange={(ev) =>
                  setCustomer({
                    ...customer,
                    infos: { ...customer.infos, code_postal: ev.target.value },
                  })
                }
                type="text"
                className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus:border-purple-600"
                placeholder="Code Postal"
              />
              <input
                value={customer.infos.company}
                onChange={(ev) =>
                  setCustomer({
                    ...customer,
                    infos: { ...customer.infos, company: ev.target.value },
                  })
                }
                type="text"
                className="outline-none bg-white w-full border-2 border-gray-300 mb-15 px-15 py-15 box-border text-14 transition duration-300 rounded-16 focus:border-purple-600"
                placeholder="Company"
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

            {/* Customer Adresses */}
            <div className="w-full h-auto p-4 flex-col justify-start items-start gap-4 inline-flex">
              <div className="text-black text-[32px] font-bold font-['Roboto'] leading-[41.60px]">
                Adresses
              </div>
              {customer.adresses.map((adresse, index) => (
                <KeyValueInputForm
                  data={adresse}
                  updateDataKey={(newAdresseKey) =>
                    updateDataKey(index, newAdresseKey, "adresses")
                  }
                  updateDataValue={(newAdresseValue) =>
                    updateDataValue(index, newAdresseValue, "adresses")
                  }
                  removeData={() => removeData(index, "adresses")}
                  keyLabel="Adresse Key"
                  valueLabel="Adresse Value"
                  index={index}
                />
              ))}

              <button
                type="button"
                onClick={addNewAdresse}
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
