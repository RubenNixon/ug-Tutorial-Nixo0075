import { useState } from 'react';

function UserForm() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: ""
  });

  const handleChange = (evt) => {
    setFormData({
      ...formData,
      [evt.target.name]: evt.target.value
    });
  };

  return (
    <div className="form-container">
      <h2>Player Registration</h2>
      <form>
        <input
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
        />
        <input
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
        />
      </form>
      <h3>{formData.firstName} {formData.lastName}</h3>
    </div>
  );
}

export default UserForm;