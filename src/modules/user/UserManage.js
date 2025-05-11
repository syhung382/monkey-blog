import { collection, deleteDoc, doc, onSnapshot } from "firebase/firestore";
import { ActionDelete, ActionEdit } from "../../components/action";
import LabelStatus from "../../components/label/LabelStatus";
import Table from "../../components/table/Table";
import DashboardHeading from "../dashboard/DashboardHeading";
import { useEffect, useState } from "react";
import { db } from "../../firebase-app/firebase-config";
import { userRole, userStatus } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { deleteUser } from "firebase/auth";
import Button from "../../components/button/Button";

const UserManage = () => {
  const [userList, setUserList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const colRef = collection(db, "users");
    onSnapshot(colRef, (snapshot) => {
      const results = [];
      snapshot.forEach((doc) => {
        results.push({
          id: doc.id,
          ...doc.data(),
        });
      });
      setUserList(results);
    });
  }, []);

  const renderLabelStatus = (status) => {
    switch (status) {
      case userStatus.ACTIVE:
        return <LabelStatus type="success">Active</LabelStatus>;
      case userStatus.PENDING:
        return <LabelStatus type="warning">Pending</LabelStatus>;
      case userStatus.BAN:
        return <LabelStatus type="danger">Ban</LabelStatus>;
      default:
    }
  };

  const renderLabelRole = (roles) => {
    switch (roles) {
      case userRole.ADMIN:
        return "Admin";
      case userRole.MOD:
        return "Moderator";
      case userRole.USER:
        return "User";
      default:
        return "--";
    }
  };

  const handleDeleteUser = async (user) => {
    const colRef = doc(db, "users", user.id);

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await deleteUser(user);
        await deleteDoc(colRef);
        toast.success(`Delete user ${user.email} successfully!`);
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success",
        });
      }
    });
  };

  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
      <div className="flex justify-end mb-10">
        <Button kind="ghost" to="/manage/add-user">
          Add new user
        </Button>
      </div>
      <Table>
        <thead>
          <tr>
            <th>Id</th>
            <th>Info</th>
            <th>Username</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {userList.length > 0 &&
            userList.map((user) => (
              <tr key={user.id}>
                <td title={user.id}>{user?.id.slice(0, 5)}...</td>
                <td className="whitespace-nowrap">
                  <div className="flex items-center gap-x-3">
                    <img
                      src="https://plus.unsplash.com/premium_photo-1742170137554-b7280b5424c8?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                      alt="avatar"
                      className="flex-shrink-0 object-cover w-10 h-10 rounded-md"
                    />
                    <div className="flex-1">
                      <h3>{user.fullname}</h3>
                      <time className="text-sm text-gray-400" datetime="">
                        {new Date(
                          user?.createdAt?.seconds * 1000
                        ).toLocaleDateString("vi-VI")}
                      </time>
                    </div>
                  </div>
                </td>
                <td>{user?.username}</td>
                <td>{user?.email}</td>
                <td>{renderLabelStatus(Number(user.status))}</td>
                <td className="mx-auto text-center">
                  {renderLabelRole(Number(user.role))}
                </td>
                <td>
                  <div className="flex item-center gap-x-3">
                    {/* <ActionView></ActionView> */}
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-user?id=${user.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                      onClick={() => handleDeleteUser(user)}
                    ></ActionDelete>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    </div>
  );
};

export default UserManage;
