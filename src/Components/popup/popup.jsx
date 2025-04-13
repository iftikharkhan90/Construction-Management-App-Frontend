import React from 'react'

export default function Popup() {

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
      type: "Aluminium",
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
              type: "Building",
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
      type: "Building",
      isLinked: true,
    };
    console.log("Pay Load", payload);
    try {
      await axios.post(
        "https://construction-management-app-backend-qqvu.vercel.app/api/linked",
        payload
      );
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


  return (
    <>
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
    </>
  );
}
