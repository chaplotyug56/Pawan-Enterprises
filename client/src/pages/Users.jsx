import { useEffect, useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

import "../styles/Users.css";

function Users() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {

            const res = await api.get("/users");

            setUsers(res.data.data || []);

        } catch (err) {

            toast.error("Unable to load users");

        } finally {

            setLoading(false);

        }
    }

    async function changeRole(id, role) {

        try {

            await api.put(`/users/${id}`, { role });

            toast.success("Role updated");

            fetchUsers();

        } catch {

            toast.error("Unable to update role");

        }
    }

    async function deleteUser(id) {

        if (!window.confirm("Delete this user?")) return;

        try {

            await api.delete(`/users/${id}`);

            toast.success("User deleted");

            fetchUsers();

        } catch {

            toast.error("Delete failed");

        }
    }

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="users-page">

            <h1>Users</h1>

            <table className="users-table">

                <thead>

                    <tr>

                        <th>Name</th>

                        <th>Email</th>

                        <th>Role</th>

                        <th>Action</th>

                    </tr>

                </thead>

                <tbody>

                    {users.map(user => (

                        <tr key={user._id}>

                            <td>{user.name}</td>

                            <td>{user.email}</td>

                            <td>

                                <select
                                    value={user.role}
                                    onChange={(e) =>
                                        changeRole(user._id, e.target.value)
                                    }
                                >

                                    <option value="user">User</option>

                                    <option value="admin">Admin</option>

                                </select>

                            </td>

                            <td>

                                <button
                                    className="delete-user-btn"
                                    onClick={() => deleteUser(user._id)}
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

export default Users;