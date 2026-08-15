import { useEffect, useState } from "react";
import api from "../services/api";
import "../styles/Profile.css";
function Profile() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get("/users/profile");
      setUser(res.data.user);
    } catch (err) {
      console.log(err);
    }
  };

  const updateProfile = async (e) => {
    e.preventDefault();

    try {
      await api.put("/users/profile", {
        name: user.name,
        phone: user.phone,
      });

      alert("Profile Updated Successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  const changePassword = async (e) => {
    e.preventDefault();

    try {
      await api.put("/users/change-password", passwordData);

      alert("Password Changed Successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
      });
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className="container"
      style={{ maxWidth: "700px", margin: "40px auto" }}
    >
      <h2>My Profile</h2>

      <form onSubmit={updateProfile}>
        <label>Name</label>

        <input
          type="text"
          value={user.name}
          onChange={(e) => setUser({ ...user, name: e.target.value })}
        />

        <label>Email</label>

        <input type="email" value={user.email} disabled />

        <label>Phone</label>

        <input
          type="text"
          value={user.phone}
          onChange={(e) => setUser({ ...user, phone: e.target.value })}
        />

        <button type="submit">Update Profile</button>
      </form>

      <hr style={{ margin: "40px 0" }} />

      <h2>Change Password</h2>

      <form onSubmit={changePassword}>
        <input
          type="password"
          placeholder="Current Password"
          value={passwordData.currentPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              currentPassword: e.target.value,
            })
          }
        />

        <input
          type="password"
          placeholder="New Password"
          value={passwordData.newPassword}
          onChange={(e) =>
            setPasswordData({
              ...passwordData,
              newPassword: e.target.value,
            })
          }
        />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}

export default Profile;
