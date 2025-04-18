import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Ceiling = ({ totalAmounts }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
    const [linkedItemsMap, setLinkedItemsMap] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  // Pgination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);

  const id = localStorage.getItem("UserId");
  const [newItem, setNewItem] = useState({
    itemName: "",
    itemPrice: "",
    totalItems: "",
    payAmount: "",
    type: "Ceiling",
    date: "",
    isLinked: false,
    userId: id,
  });
  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://construction-management-app-backend-qqvu.vercel.app/api/getmaterials",
        { params: { type: "Ceiling", userId: id } }
      );

      if (Array.isArray(response.data.DATA)) {
        setData(response.data.DATA);
      } else {
        setData([]);
      }
      if (totalAmounts && response.data) {
        totalAmounts({
          totalAmount: response.data.totalAmount || 0,
          payAmount: response.data.payAmount || 0,
          remainingAmount: response.data.remainingAmount || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const capitalizeFirstLetter = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
  };

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const showToast = (message, type) => {
    toast(message, { type, position: "top-center", autoClose: 2000 });
  };

  function formatDate(isoString) {
    const date = new Date(isoString);
    return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(
      date.getDate()
    ).padStart(2, "0")}/${date.getFullYear()}`;
  }
  const handleAddClick = () => {
    setIsEditMode(false);
    setNewItem({
      itemName: "",
      itemPrice: "",
      totalItems: "",
      payAmount: "",
      type: "Ceiling",
      date: "",
      isLinked: false,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const handleEditClick = (item) => {
    setIsEditMode(true);
    setSelectedItem(item);
    setNewItem({
      itemName: capitalizeFirstLetter(item.itemName),
      itemPrice: item.itemPrice,
      totalItems: item.totalItems,
      payAmount: item.payAmount,
      type: item.type,
      date: item.date,
      isLinked: item.isLinked || false,
    });
    setShowModal(true);
  };

  const handleCheckBox = (e) => {
    const { name, value } = e.target;
    setNewItem((prev) => ({
      ...prev,
      [name]:
        name === "itemName"
          ? capitalizeFirstLetter(value)
          : name === "date"
          ? value
          : value,
    }));
  };

  const handleLinkedCheckbox = (checked) => {
    setNewItem((prev) => {
      if (prev.isLinked === checked) {
        fetchisLinkedItems();
      }

      return {
        ...prev,
        isLinked: checked,
        payAmount: "",
        date: "",
        selectedItem: "",
      };
    });
  };

  const [isLinkedItems, setisLinkedItems] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState("");
  console.log("isLinkedItems", isLinkedItems);
  console.log("ID", selectedItemId);

  // Fetch isLinked items from API
  useEffect(() => {
    if (newItem.isLinked) {
      axios
        .get(
          "https://construction-management-app-backend-qqvu.vercel.app/api/getselected",
          {
            params: {
              type: "Ceiling",
              userId: id,
            },
          }
        )
        .then((res) => {
          setisLinkedItems(res.data.message);
          console.log("this", res.data);
        })
        .catch((err) => console.error("Error fetching isLinked items", err));
    }
  }, [newItem.isLinked]);

  const handleSubmitisLinked = async () => {
    if (!newItem.payAmount || !newItem.date) {
      alert("Please fill all fields.");
      return;
    }

    const payload = {
      selectedItem: selectedItemId,
      payAmount: newItem.payAmount,
      date: newItem.date ? newItem.date.split("-").reverse().join("-") : "",
      userId: id,
      type: "Ceiling",
      isLinked: true,
    };
    console.log("Pay Load", payload);
    try {
      await axios.post(
        "https://construction-management-app-backend-qqvu.vercel.app/api/linked",
        payload
      );
             showToast("Linked item added successfully!", "success");
             fetchData();
             handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 400) {
        showToast(error.response.data?.message, "error");
      } else {
        showToast("Error adding item", "error");
        console.error(error.message);
      }
    }
  };
  //   setShowModal(false);
  //   setSelectedItem(null);
  // };

  const handleAddItem = async () => {
    if (
      !newItem.itemName ||
      !newItem.itemPrice ||
      !newItem.totalItems ||
      !newItem.payAmount ||
      !newItem.date
    ) {
      showToast("Please fill all fields!", "warning");
      return;
    }

    const formattedDate = new Date(newItem.date).toLocaleDateString("en-GB");
    try {
      const response = await axios.post(
        "https://construction-management-app-backend-qqvu.vercel.app/api/material",
        { ...newItem, date: formattedDate, userId: id }
      );
      if (response.data && response.data.DATA) {
        setData((prev) => [...prev, response.data.DATA]);
        showToast("Item added successfully!", "success");
        fetchData();
        handleCloseModal();
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        showToast(error.response.data?.message, "error");
      } else {
        showToast("Error adding item", "error");
        console.error(error.message);
      }
    }
  };

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
        `https://construction-management-app-backend-qqvu.vercel.app/api/update/${selectedItem._id}`,
        newItem
      );
      setData((prev) =>
        prev.map((item) =>
          item._id === selectedItem._id ? { ...item, ...newItem } : item
        )
      );
      showToast("Item updated successfully!", "success");
      fetchData();
      handleCloseModal();
    } catch (error) {
      showToast("Error updating item", "error");
      console.error(error.message);
    }
  };

  const handleDeleteItem = async (id) => {
    try {
      await axios.delete(
        `https://construction-management-app-backend-qqvu.vercel.app/api/del/${id}`
      );
      setData((prev) => prev.filter((item) => item._id !== id));
      showToast("Item deleted successfully!", "success");
      fetchData();
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

        <div className="panel-body table-responsive mt-3">
          <table className="table table-bordered text-white">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Name</th>
                <th>Linked Item</th>
                <th>Item Price</th>
                <th>No. of Items</th>
                <th>Total Amount</th>
                <th>Pay Amount</th>
                <th>Remaining Amount</th>
                <th>Linked Amount</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            {/* <tbody>
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
                    <td>{formatDate(item.date)}</td>
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
                  <td colSpan="9" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody> */}
            <tbody>
              {currentItems.length > 0 ? (
                currentItems.map((item, index) => (
                  <React.Fragment key={item._id}>
                    <tr>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{item.itemName}</td>
                      <td className="bg-info text-dark">{item.name}</td>
                      <td>{!item.name ? item.itemPrice : ""}</td>
                      <td>{item.totalItems}</td>
                      <td>{item.totalAmount}</td>
                      <td>{item.payAmount}</td>
                      <td>{item.remainingAmount}</td>
                      <td className="bg-info text-dark">{item.linkedAmount}</td>
                      <td>{formatDate(item.date)}</td>
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

                    {/* Conditionally render linked items under each row */}
                    {linkedItemsMap[item._id] &&
                      linkedItemsMap[item._id].length > 0 && (
                        <tr>
                          <td colSpan="9">
                            <strong>Linked Items:</strong>
                            <select className="form-select mt-2">
                              {linkedItemsMap[item._id].map((linked, idx) => (
                                <option key={idx}>
                                  {linked.itemName} - Linked Amount:{" "}
                                  {linked.payAmount}
                                </option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center">
                    No Data Available
                  </td>
                </tr>
              )}
            </tbody>

            {/* Pagination Footer */}
            {data.length > itemsPerPage && (
              <tfoot>
                <tr>
                  <td colSpan="11">
                    <div className="d-flex justify-content-center mt-4">
                      <nav>
                        <ul className="pagination">
                          {Array.from({
                            length: Math.ceil(data.length / itemsPerPage),
                          }).map((_, index) => (
                            <li
                              key={index}
                              className={`page-item ${
                                currentPage === index + 1 ? "active" : ""
                              }`}
                            >
                              <button
                                className="page-link"
                                onClick={() => setCurrentPage(index + 1)}
                              >
                                {index + 1}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </nav>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
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
                <button
                  className="btn-close"
                  onClick={handleCloseModal}
                ></button>
              </div>
              <div className="modal-body">
                {/* Checkbox always on top */}
                <div className="form-check mb-4">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isLinked"
                    checked={newItem.isLinked}
                    onChange={(e) =>
                      setNewItem((prev) => ({
                        ...prev,
                        isLinked: e.target.checked,
                      }))
                    }
                    id="checkbox-isLinked"
                  />
                  <label
                    className="form-check-label"
                    htmlFor="checkbox-isLinked"
                  >
                    isLinked Item
                  </label>
                </div>

                {/* Conditional rendering */}
                {newItem.isLinked ? (
                  <>
                    {/* Dropdown for isLinked items */}
                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        onChange={(e) => setSelectedItemId(e.target.value)}
                        value={selectedItemId}
                      >
                        <option value="" disabled>
                          Select an item
                        </option>
                        {isLinkedItems.map((item) => (
                          <option key={item._id} value={item._id}>
                            {item.itemName} (Remaining: {item.remainingAmount})
                          </option>
                        ))}
                      </select>
                      {/* <label>Select Item</label> */}
                    </div>

                    {/* Pay Amount */}
                    <div className="form-floating mb-3">
                      <input
                        type="number"
                        name="payAmount"
                        value={newItem.payAmount || ""}
                        onChange={handleCheckBox}
                        className="form-control"
                        placeholder="Pay Amount"
                      />
                      <label>Pay Amount</label>
                    </div>

                    {/* Date */}
                    <div className="form-floating mb-3">
                      <input
                        type="date"
                        name="date"
                        value={newItem.date || ""}
                        onChange={handleCheckBox}
                        className="form-control"
                      />
                      <label>Date</label>
                    </div>
                  </>
                ) : (
                  Object.keys(newItem).map((key) => {
                    if (key === "type" || key === "isLinked") return null;
                    return (
                      <div key={key} className="form-floating mb-3">
                        <input
                          id={`floatingInput-${key}`}
                          type={
                            key === "itemName" || key === "name"
                              ? "text"
                              : key === "date"
                              ? "date"
                              : "number"
                          }
                          name={key}
                          value={newItem[key]}
                          onChange={handleCheckBox}
                          className="form-control"
                          placeholder={formatLabel(key)}
                        />
                        <label htmlFor={`floatingInput-${key}`}>
                          {formatLabel(key)}
                        </label>
                      </div>
                    );
                  })
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={
                    newItem.isLinked
                      ? handleSubmitisLinked
                      : isEditMode
                      ? handleEditItem
                      : handleAddItem
                  }
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

export default Ceiling;
