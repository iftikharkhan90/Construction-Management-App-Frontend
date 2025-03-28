import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Building = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemPrice: "",
    totalItems: "",
    payAmount: "",
    type: "Building",
  });


  const handlePrev = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  // ✅ Fetch Data from API
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3002/api/getmaterials",
        {
          params: { type: "Building" },
        }
      );
      if (Array.isArray(response.data.DATA)) {
        setData(response.data.DATA);
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ✅ Capitalize First Letter
  const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  // ✅ Handle Input Change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]: name === "itemName" ? capitalizeFirstLetter(value) : value,
    }));
  };

  // ✅ Show Toast Messages
  const showToast = (message, type) => {
    toast(message, { type, position: "top-center", autoClose: 2000 });
  };

  // ✅ Open Add Modal
  const handleAddClick = () => {
    setIsEditMode(false);
    setNewItem({
      itemName: "",
      itemPrice: "",
      totalItems: "",
      payAmount: "",
      type: "Building",
    });
    setShowModal(true);
  };

  // ✅ Open Edit Modal
  const handleEditClick = (item) => {
    setIsEditMode(true);
    setSelectedItem(item);
    setNewItem({
      itemName: capitalizeFirstLetter(item.itemName),
      itemPrice: item.itemPrice,
      totalItems: item.totalItems,
      payAmount: item.payAmount,
      type: item.type,
    });
    setShowModal(true);
  };

  // ✅ Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // ✅ Add New Item (POST)
  const handleAddItem = async () => {
    if (
      !newItem.itemName ||
      !newItem.itemPrice ||
      !newItem.totalItems ||
      !newItem.payAmount
    ) {
      showToast("Please fill all fields!", "warning");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3002/api/material",
        newItem
      );
      if (response.data && response.data.DATA) {
        setData((prev) => [...prev, response.data.DATA]);
        showToast("Item added successfully!", "success");
        fetchData(); // ✅ Refresh data immediately
        handleCloseModal();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showToast("Item already exists!", "error"); // ⚠️ Show proper error
      } else {
        showToast("Error adding item", "error");
        console.error(error.message);
      }
    }
  };

  // ✅ Update Existing Item (PUT)
  const handleEditItem = async () => {
    if (
      !newItem.itemName ||
      !newItem.itemPrice ||
      !newItem.totalItems ||
      !newItem.payAmount
    ) {
      showToast("Please fill all fields!", "warning");
      return;
    }

    try {
      await axios.put(
        `http://localhost:3002/api/update/${selectedItem._id}`,
        newItem
      );
      setData((prev) =>
        prev.map((item) =>
          item._id === selectedItem._id ? { ...item, ...newItem } : item
        )
      );
      showToast("Item updated successfully!", "success");
      fetchData(); // ✅ Refresh data immediately
      handleCloseModal();
    } catch (error) {
      showToast("Error updating item", "error");
      console.error(error.message);
    }
  };

  // ✅ Delete Item (DELETE)
  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(`http://localhost:3002/api/del/${id}`);
      alert("Are You Sure ?")
      setData((prev) => prev.filter((item) => item._id !== id));
      showToast("Item deleted successfully!", "success");
      fetchData(); // ✅ Refresh data immediately
    } catch (error) {
      showToast("Error deleting item", "error");
      console.error(error.message);
    }
  };

  return (
    <div className="container mt-4">
      <div
        className="panel p-4 rounded shadow-lg"
        style={{ background: "#2c3e50", borderRadius: "15px" }}
      >
        <div className="panel-heading d-flex justify-content-between align-items-center">
          <h4 className="text-white">Materials List</h4>
          <button className="btn btn-success px-4" onClick={handleAddClick}>
            Add Items <i className="fa-solid fa-plus ps-2"></i>
          </button>
        </div>

        {/* ✅ Table to Show Data */}
        <div className="panel-body table-responsive mt-3">
          <table className="table table-bordered text-white">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Item Price</th>
                <th>No. of Items</th>
                <th>Total Amount</th>
                <th>Pay Amount</th>
                <th>Remaining Amount</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    <td>{item.itemName}</td>
                    <td>{item.itemPrice}</td>
                    <td>{item.totalItems}</td>
                    <td>{item.totalAmount}</td>
                    <td>{item.payAmount}</td>
                    <td>{item.remainingAmount}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditClick(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteItem(item._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal fade show d-block popUp">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Material" : "Add New Material"}
                </h5>
                <button className="btn-close" onClick={handleCloseModal}>
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {Object.keys(newItem).map(
                  (key) =>
                    key !== "type" && (
                      <div key={key} className="form-floating mb-3">
                        <input
                          id={`floatingInput-${key}`}
                          type="text"
                          name={key}
                          value={newItem[key]}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder={key}
                        />
                        <label htmlFor={`floatingInput-${key}`}>{key}</label>
                      </div>
                    )
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={isEditMode ? handleEditItem : handleAddItem}
                >
                  {isEditMode ? "Update" : "Add"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer />
    </div>
  );
};

export default Building;
