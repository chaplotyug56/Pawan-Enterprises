import { useEffect, useState } from "react";

function ProductForm({
  form,
  handleChange,
  handleSubmit,
  isEditing,
  setForm,
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

        {/* OPTIONS SECTION */}
        <div className="options-section" style={{ borderTop: "1px solid #eee", paddingTop: "20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "15px" }}>
          <h3 style={{ marginBottom: "5px" }}>Product Options</h3>
          
          {/* COLORS */}
          <div className="option-group" style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold" }}>
              <input type="checkbox" checked={form.hasColors || false} onChange={() => setForm(f => ({...f, hasColors: !f.hasColors}))} />
              Enable Colors
            </label>
            {form.hasColors && (
              <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {form.colors?.map((color, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <input type="text" placeholder="Color Name (e.g. Red)" value={color.name} onChange={(e) => {
                      const newColors = [...form.colors];
                      newColors[idx].name = e.target.value;
                      setForm(f => ({...f, colors: newColors}));
                    }} required />
                    <input type="file" accept="image/*" onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        const newColors = [...form.colors];
                        newColors[idx].image = e.target.files[0];
                        setForm(f => ({...f, colors: newColors}));
                      }
                    }} />
                    {typeof color.image === "string" && color.image && (
                      <img src={color.image.startsWith("http") ? color.image : `//${window.location.host}/api/images/${color.image}`} alt="Color" style={{ width: 30, height: 30, objectFit: "cover", borderRadius: "5px" }} />
                    )}
                    <button type="button" onClick={() => setForm(f => ({...f, colors: f.colors.filter((_, i) => i !== idx)}))} style={{ padding: "8px 12px", background: "#ff4d4f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => setForm(f => ({...f, colors: [...(f.colors || []), { name: "", image: "" }]}))} style={{ alignSelf: "flex-start", padding: "8px 15px", background: "#e6f7ff", color: "#1890ff", border: "1px solid #91d5ff", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>+ Add Color</button>
              </div>
            )}
          </div>

          {/* SIZES */}
          <div className="option-group" style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold" }}>
              <input type="checkbox" checked={form.hasSizes || false} onChange={() => setForm(f => ({...f, hasSizes: !f.hasSizes}))} />
              Enable Sizes
            </label>
            {form.hasSizes && (
              <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {form.sizes?.map((size, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "10px" }}>
                    <input type="text" placeholder="Size (e.g. Small, 100ml)" value={size} onChange={(e) => {
                      const newSizes = [...form.sizes];
                      newSizes[idx] = e.target.value;
                      setForm(f => ({...f, sizes: newSizes}));
                    }} required />
                    <button type="button" onClick={() => setForm(f => ({...f, sizes: f.sizes.filter((_, i) => i !== idx)}))} style={{ padding: "8px 12px", background: "#ff4d4f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => setForm(f => ({...f, sizes: [...(f.sizes || []), ""]}))} style={{ alignSelf: "flex-start", padding: "8px 15px", background: "#f6ffed", color: "#52c41a", border: "1px solid #b7eb8f", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>+ Add Size</button>
              </div>
            )}
          </div>

          {/* RATES */}
          <div className="option-group" style={{ background: "#f9f9f9", padding: "15px", borderRadius: "8px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", fontWeight: "bold" }}>
              <input type="checkbox" checked={form.hasRates || false} onChange={() => setForm(f => ({...f, hasRates: !f.hasRates}))} />
              Enable Rates
            </label>
            {form.hasRates && (
              <div style={{ marginTop: "15px", display: "flex", flexDirection: "column", gap: "10px" }}>
                {form.rates?.map((rate, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "10px" }}>
                    <input type="number" placeholder="Rate (₹)" value={rate} onChange={(e) => {
                      const newRates = [...form.rates];
                      newRates[idx] = Number(e.target.value);
                      setForm(f => ({...f, rates: newRates}));
                    }} required />
                    <button type="button" onClick={() => setForm(f => ({...f, rates: f.rates.filter((_, i) => i !== idx)}))} style={{ padding: "8px 12px", background: "#ff4d4f", color: "white", border: "none", borderRadius: "4px", cursor: "pointer" }}>✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => setForm(f => ({...f, rates: [...(f.rates || []), ""]}))} style={{ alignSelf: "flex-start", padding: "8px 15px", background: "#fffb8f", color: "#faad14", border: "1px solid #ffe58f", borderRadius: "4px", cursor: "pointer", fontWeight: "bold" }}>+ Add Rate</button>
              </div>
            )}
          </div>
        </div>
        
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