import React from "react";
import Pagination from "./Pagination";
import Table from "./Table";
import Search from "./Search";
import axios from "axios";
import { useState, useEffect } from "react";
import "./admin.css";

const AdminUI = () => {
  const [users, setUsers] = useState([]);
  const [filterUsers, setFilterUsers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [rowSelected, setRowSelected] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [pagUsers, setPagUsers] = useState([]);

  const getUserData = async () => {
    try {
      const response = await axios.get(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      setUsers(response.data);
      setFilterUsers(response.data);
    } catch (error) {
      console.error("Error happened while getting user data:", error);
    }
  };
  useEffect(() => {
    getUserData();
    setRowSelected([]);
    setCurrentPage(1);
  }, []);

  useEffect(() => {
    const maxItems = 10;
    const allPagesCount = Math.ceil(filterUsers.length / maxItems);
    const startIdx = (currentPage - 1) * maxItems;
    const endIdx = startIdx + maxItems;
    const pagUsers =
      filterUsers.length > 0
        ? filterUsers.slice(startIdx, endIdx)
        : filterUsers;

    setTotalPages(allPagesCount);
    setPagUsers(pagUsers);
  }, [filterUsers, currentPage]);

  const handleSearch = (event) => {
    const searchText = event.target.value.toLowerCase();
    setSearchText(searchText);

    const filteredUsers = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchText) ||
        user.email.toLowerCase().includes(searchText) ||
        user.role.toLowerCase().includes(searchText)
    );
    setFilterUsers(filteredUsers);
    setCurrentPage(1);
  };

  const handleRowSelect = (event, user) => {
    const selected = event.target.checked;
    if (selected) {
      setRowSelected((prevLine) => [...prevLine, user]);
    } else {
      setRowSelected((prevLine) =>
        prevLine.filter((selectedRow) => selectedRow.id !== user.id)
      );
    }
  };

  const handleSelectAll = (event) => {
    const selected = event.target.checked;
    if (selected) {
      setRowSelected([...pagUsers]);
    } else {
      setRowSelected([]);
    }
  };

  const handleDeleteSelected = () => {
    const leftUsers = filterUsers.filter((user) => !rowSelected.includes(user));
    setUsers(leftUsers);
    setFilterUsers(leftUsers);
    setRowSelected([]);
    if (currentPage > 1 && leftUsers.length <= (currentPage - 1) * 10) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleEditUser = (editedUser) => {
    const updatedUsers = users.map((user) =>
      user.id === editedUser.id ? editedUser : user
    );
    setUsers(updatedUsers);
    setFilterUsers(updatedUsers);
  };

  const handleDeleteUser = (user) => {
    const leftUsers = filterUsers.filter((u) => u.id !== user.id);
    setUsers(leftUsers);
    setFilterUsers(leftUsers);
    setRowSelected((prevLine) =>
      prevLine.filter((selectedRow) => selectedRow.id !== user.id)
    );
    if (currentPage > 1 && leftUsers.length <= (currentPage - 1) * 10) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <h1>Admin UI</h1>
      <Search searchText={searchText} handleSearch={handleSearch} />

      <Table
        users={pagUsers}
        rowSelected={rowSelected}
        handleRowSelect={handleRowSelect}
        handleEditUser={handleEditUser}
        handleDeleteUser={handleDeleteUser}
        handleSelectAll={handleSelectAll}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        handleDeleteSelected={handleDeleteSelected}
        setCurrentPage={setCurrentPage}
        rowSelected={rowSelected}
        handleSelectAll={handleSelectAll}
      />
    </div>
  );
};

export default AdminUI;
