export default function Signup({handleProceed,formData,setFormData,emaiLoading}){

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
    return(
        <>
           <form onSubmit={handleProceed}>
            <input
              className="input-field"
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

             <input
              className="input-field"
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              className="input-field"
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              pattern="[0-9]{10}"
              required
            />

            <input
              className="input-field"
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
  
            <input
              className="input-field"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            
            <p className="terms">
              Already have an account ? <a href="/login">Login</a>
              <br />
              {/* <a href="#">Terms & Conditions</a> */}
            </p>
            <button type="submit" className="submit-button">
              {emaiLoading ? 'Proceeding...':'Proceed'}
            </button>
          </form>
        </>
    )
}