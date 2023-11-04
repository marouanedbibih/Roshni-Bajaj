import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axiosClient from "../../api/axios.js";
import { useStateContext } from "../../contexts/ContextProvider.jsx";

export default function UserForm() {
  const navigate = useNavigate();
  let { id } = useParams();
  const [user, setUser] = useState({
    last_name: "",
    first_name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: null,
    image: null,
    image_url: null,
  });
  const [errors, setErrors] = useState(null);
  const { setNotification } = useStateContext();
  const [loading, setLoading] = useState(false);

  if (id) {
    useEffect(() => {
      setLoading(true);
      axiosClient
        .get(`/users/${id}`)
        .then(({ data }) => {
          setLoading(false);
          setUser(data.data);
        })
        .catch(() => {
          setLoading(false);
        });
    }, []);
  }

  const onSubmit = (ev) => {
    ev.preventDefault();
    const payload = { ...user };
    if (id) {
      axiosClient
        .put(`/users/${id}`, payload)
        .then(() => {
          setNotification("User was successfully updated");
          navigate("/users");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    } else {
      console.log("Payload:", payload);
      axiosClient
        .post("/users", payload)
        .then((response) => {
          setNotification("User was successfully created");
          navigate("/users");
        })
        .catch((err) => {
          const response = err.response;
          if (response && response.status === 422) {
            setErrors(response.data.errors);
          }
        });
    }
  };

  return (
    <>
      {errors && (
        <div className="alert">
          {Object.keys(errors).map((key) => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      )}
      <div className="w-full h-20  justify-between items-center inline-flex">
        <div className="text-black text-5xl font-bold font-['Roboto'] leading-[62.40px]">
          {user.id && (
            <h1>
              Update User: {user.last_name} {user.first_name}{" "}
            </h1>
          )}
          {!user.id && <h1>New User</h1>}
        </div>
      </div>
      <div className="card animated fadeInDown">
        {loading && <div className="text-center">Loading...</div>}

        {!loading && (
          <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4 ">
            <div className="grid grid-colms-1 gab-8 ">
              <input
                value={user.last_name}
                onChange={(ev) =>
                  setUser({ ...user, last_name: ev.target.value })
                }
                placeholder="Last Name"
                className="mb-4"
              />
              <input
                value={user.first_name}
                onChange={(ev) =>
                  setUser({ ...user, first_name: ev.target.value })
                }
                placeholder="First Name"
                className="mb-4"
              />
              <input
                value={user.email}
                onChange={(ev) => setUser({ ...user, email: ev.target.value })}
                placeholder="Email"
                className="mb-4"
              />
              <select
                value={user.role}
                onChange={(ev) => setUser({ ...user, role: ev.target.value })}
                className="mb-4"
              >
                <option value="">Select Role</option>
                <option value="1">Admin</option>
                <option value="0">Resume</option>
                <option value="2">Customer</option>
              </select>

              <input
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password: ev.target.value })
                }
                placeholder="Password"
                className="mb-4"
              />
              <input
                type="password"
                onChange={(ev) =>
                  setUser({ ...user, password_confirmation: ev.target.value })
                }
                placeholder="Password Confirmation"
                className="mb-4"
              />
            </div>
            <div className="grid grid-cols-1 w-1/12">
              <button className="btn">Save</button>
            </div>
          </form>
        )}
      </div>
    </>
  );
}
