import { useEffect, useState } from "react";

function ProductForm({
  form,
  handleChange,
  handleSubmit,
  isEditing,
}) {
  const [previews, setPreviews] = useState([]);
  const [discountPercent, setDiscountPercent] = useState("");

  const handleDiscountChange = (e) => {
    const discount = e.target.value;
    setDiscountPercent(discount);

    if (form.mrp && discount) {
      const calculatedPrice = form.mrp - (form.mrp * (discount / 100));
      handleChange({
        target: {
          name: "price",
          value: Math.round(calculatedPrice),
        }
      });
    }
  };

  useEffect(() => {
    const newPreviews = [];
    if (form.images && form.images.length > 0) {
      form.images.forEach((img) => {
        if (img instanceof File) {
          newPreviews.push(URL.createObjectURL(img));
        } else if (typeof img === "string" && img !== "") {
          if (img.startsWith("http") || img.startsWith("data:")) {
            newPreviews.push(img);
          } else {
            newPreviews.push(`http://localhost:8000/api/images/${img}`);
          }
        }
      });
    } else if (form.image) {
      if (typeof form.image === "string" && form.image !== "") {
        if (form.image.startsWith("http") || form.image.startsWith("data:")) {
          newPreviews.push(form.image);
        } else {
          newPreviews.push(`http://localhost:8000/api/images/${form.image}`);
        }
      }
    }
    setPreviews(newPreviews);
  }, [form.images, form.image]);

  const handlePaste = (e) => {
    if (e.clipboardData.files && e.clipboardData.files.length > 0) {
      const file = e.clipboardData.files[0];
      if (file.type.startsWith("image/")) {
        e.preventDefault(); 
        
        const fileInput = document.querySelector('input[name="images"]');
        if (fileInput) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            fileInput.files = dataTransfer.files;
        }
        
        handleChange({
          target: {
            name: "images",
            files: [file]
          }
        });
      }
    }
  };

  return (
    <div className="admin-card">
      <h2>
        {isEditing ? "Update Product" : "Add Product"}
      </h2>
      <form
        className="product-form"
        onSubmit={handleSubmit}
        onPaste={handlePaste}
      >
        <div className="form-grid">
          <input
            type="text"
            name="name"
            placeholder="Product Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Paints">Paints</option>
            <option value="Cosmetics">Cosmetics</option>
            <option value="Stationery">Stationery</option>
            <option value="Grocery">Grocery</option>
            <option value="Household">Household</option>
            <option value="Gift Items">Gift Items</option>
          </select>
          <input
            type="number"
            name="mrp"
            placeholder="MRP"
            value={form.mrp}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            placeholder="Discount % (Optional)"
            value={discountPercent}
            onChange={handleDiscountChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Our Price"
            value={form.price}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="stock"
            placeholder="Stock"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>
        <textarea
          name="description"
          rows="5"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        />
        
        <div className="file-input-wrapper" style={{display: 'flex', flexDirection: 'column', gap: '5px'}}>
          <label>Product Images (Max 5)</label>
          <input
            type="file"
            name="images"
            accept="image/*"
            multiple
            onChange={handleChange}
          />
          <small style={{color: '#666'}}>💡 Tip: You can also paste an image directly anywhere in this form (Ctrl+V / Cmd+V)</small>
        </div>

        {previews.length > 0 && (
          <div className="preview-box" style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {previews.map((preview, index) => (
              <img
                key={index}
                src={preview}
                alt={`Preview ${index}`}
                style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '5px' }}
              />
            ))}
          </div>
        )}

        <button
          className="save-btn"
          type="submit"
        >
          {isEditing ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;