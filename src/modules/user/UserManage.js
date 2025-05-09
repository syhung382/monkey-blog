import { collection, onSnapshot } from "firebase/firestore";
import { ActionDelete, ActionEdit, ActionView } from "../../components/action";
import LabelStatus from "../../components/label/LabelStatus";
import Table from "../../components/table/Table";
import DashboardHeading from "../dashboard/DashboardHeading";
import React, { useEffect, useState } from "react";
import { db } from "../../firebase-app/firebase-config";
import { categoryStatus } from "../../utils/constants";
import { useNavigate } from "react-router-dom";

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

  return (
    <div>
      <DashboardHeading
        title="Users"
        desc="Manage your user"
      ></DashboardHeading>
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
                        {new Date().toDateString()}
                      </time>
                    </div>
                  </div>
                </td>
                <td>{user?.username}</td>
                <td>{user?.email}</td>
                <td>
                  <LabelStatus
                    type={
                      Number(user.status) === categoryStatus.APPROVED
                        ? "success"
                        : "warning"
                    }
                  >
                    {Number(user.status) === categoryStatus.APPROVED
                      ? "Approved"
                      : "Unapproved"}
                  </LabelStatus>
                </td>
                <td></td>
                <td>
                  <div className="flex item-center gap-x-3">
                    {/* <ActionView></ActionView> */}
                    <ActionEdit
                      onClick={() =>
                        navigate(`/manage/update-user?id=${user.id}`)
                      }
                    ></ActionEdit>
                    <ActionDelete
                    // onClick={() => handleDeleteUser(user.id)}
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
