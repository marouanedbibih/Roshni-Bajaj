import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axios";
import { useStateContext } from "../../contexts/ContextProvider";

function CustomerShow() {
  let { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [customer, setCustomer] = useState({});
  const [infos, setInfos] = useState({});
  const [emails, setEmails] = useState([]);
  const [phones, setPhones] = useState([]);
  const [adresses, setAdresses] = useState([]);
  const { setNotification } = useStateContext();

  useEffect(() => {
    getCustomer(id);
  }, []);



  const getCustomer = (id) => {
    setLoading(true);
    axiosClient
      .get(`/customer/${id}`)
      .then(({ data }) => {
        setLoading(false);
        setCustomer(data.infos);
        setEmails(data.emails);
        setPhones(data.phones);
        setAdresses(data.adresses);
        console.log("Data :", data);
        // console.log("infos :" , infos);
        // console.log("emails :" , emails);
        // console.log("phones :" , phones);
        // console.log("adresses :" , adresses);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const onDeleteClick = (id) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }
    axiosClient
      .delete(`/customer/${id}`)
      .then((response) => {
        navigate("/customers");
        setNotification("Customer was successfully deleted");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="grid grid-cols-1 justify-items-start">
      {/* Customers Header */}
      <div className="w-full h-20 mb-8 justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-['Roboto'] leading-[62.40px]">
          Customer :
        </div>
      </div>
      {/* Customer View */}
      <div className="w-3/4 h-auto p-6 bg-white rounded-2xl shadow flex-col justify-center items-center gap-4 inline-flex">
        <div className="w-full justify-between items-center inline-flex">
          <img
            className="w-40 h-40 relative rounded-[100px]"
            src={`${import.meta.env.VITE_API_BASE_URL}/${customer.image}`}
            alt={``}
          />
          <div className="h-9 justify-end items-center gap-4 flex">
            <div className="w-[73px] px-3.5 py-2 bg-emerald-600 rounded-lg shadow justify-center items-center gap-2 flex">
              <Link
                to={"/customers/update/" + id}
                className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]"
              >
                Edit
              </Link>
            </div>
            <div className="w-[71px] px-3.5 py-2 bg-red-700 rounded-lg shadow justify-center items-center gap-2 flex">
              <button
                onClick={(ev) => onDeleteClick(id)}
                className="text-white text-xs font-bold font-['Roboto'] uppercase leading-[18px]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
        <div className="w-full justify-between items-start inline-flex">
          <div className="flex-col justify-start items-start gap-4 inline-flex">
            <div className="text-black text-[28px] font-bold font-['Roboto'] leading-9">
              {customer.name}
            </div>
            <div className="h-[158px] py-2 border-b border-zinc-400 flex-col justify-start items-start gap-2 flex">
              <div className="text-black text-xl font-bold font-['Roboto'] leading-relaxed">
                Location:
              </div>
              <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                Country: {customer.country}
              </div>
              <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                State: {customer.state}
              </div>
              <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                City: {customer.city}
              </div>
              <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                Code Postal: {customer.code_postal}
              </div>
            </div>
            <div className="h-[100px] py-2 border-b border-zinc-400 flex-col justify-start items-start gap-2 flex">
              <div className="text-black text-xl font-bold font-['Roboto'] leading-relaxed">
                Profissionel
              </div>
              <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                Company : {customer.company}
              </div>
              <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                Job: {customer.job}
              </div>
            </div>
            <div className="h-[121px] py-2 flex-col justify-start items-start gap-2 flex">
              <div className="text-black text-xl font-bold font-['Roboto'] leading-relaxed">
                Birth
              </div>
              <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                Day: {customer.birth_day}
              </div>
              <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                Place: {customer.birth_place}
              </div>
            </div>
          </div>
          <div className="w-[505px] flex-col justify-start items-start gap-8 inline-flex">
            <div className="h-[332px] flex-col justify-start items-start gap-4 flex">
              <div className="h-auto py-2 border-b border-zinc-400 flex-col justify-start items-start gap-2 flex">
                <div className="text-black text-xl font-bold font-['Roboto'] leading-relaxed">
                  Emails
                </div>
                {emails.map((e) => (
                  <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                    {e.key}: {e.value}
                  </div>
                ))}
              </div>
              <div className="h-auto py-2 border-b border-zinc-400 flex-col justify-start items-start gap-2 flex">
                <div className="text-black text-xl font-bold font-['Roboto'] leading-relaxed">
                  Phone
                </div>
                {phones.map((p) => (
                  <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                    {p.key}: {p.value}
                  </div>
                ))}
              </div>
              <div className="h-auto py-2 border-b border-zinc-400 flex-col justify-start items-start gap-2 flex">
                <div className="text-black text-xl font-bold font-['Roboto'] leading-relaxed">
                  Adresse
                </div>
                {adresses.map((a) => (
                  <div className="text-zinc-400 text-base font-bold font-['Roboto'] leading-tight">
                    {a.key}: {a.value}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CustomerShow;
