import { useState, useEffect } from "react";

const RegistrationForm = () => {

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");

    const [conferences, setConferences] = useState([]);
    const [selectedConference, setSelectedConference] = useState("");

    const [qr, setQr] = useState(null);

    const [errors, setErrors] = useState({
        name: "",
        lastName: "",
        email: "",
        phone: ""
    });

    const [submitSuccess, setSubmitSuccess] = useState(false);

    useEffect(() => {
        fetch("https://gestor-conferencias-backend.onrender.com/api/conferencias")
            .then(res => res.json())
            .then(data => setConferences(data))
            .catch(err => console.error(err));
    }, []);

    const validateField = (field, value) => {
        let message = "";

        switch (field) {

            case "name":
                if (!value.trim()) message = "Name is required.";
                break;

            case "lastName":
                if (!value.trim()) message = "Last name is required.";
                break;

            case "email":
                const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                if (!emailRegex.test(value)) message = "Proporcione una dirección email válida.";
                break;

            case "phone":
                if (value) {
                    const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;
                    if (!phoneRegex.test(value)) message = "Proporcione un teléfono válido (use +)";
                }
                break;

            default:
                break;
        }

        setErrors(prev => ({ ...prev, [field]: message }));
    };

    const isFormValid =
        Object.values(errors).every(error => error === "") &&
        name.trim() !== "" &&
        lastName.trim() !== "" &&
        email.trim() !== "" &&
        selectedConference !== "";

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!isFormValid) return;

        try {

            const formData = {
                nombre: name,
                apellido: lastName,
                email: email,
                phone: phone,
                idConferencia: selectedConference
            };

            const response = await fetch(
                "https://gestor-conferencias-backend.onrender.com/api/registro",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(formData)
                }
            );

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const data = await response.json();

            setQr(data.qr);
            setSubmitSuccess(true);

        } catch (error) {
            console.error(error.message);
        }
    };

    const handleReset = () => {
        setName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setGender(null);
        setSelectedConference("");
        setSubmitSuccess(false);
        setQr(null);
    };

    return (
        <>
            <form onSubmit={handleSubmit}>

                <div style={{ display: "flex", gap: "20px", padding: "20px" }}>

                    <label>Nombre</label>
                    <input
                        value={name}
                        onChange={(e) => {
                            setName(e.target.value);
                            validateField("name", e.target.value);
                        }}
                    />
                    {errors.name && <p style={{ color: "red" }}>{errors.name}</p>}

                    <label>Apellido</label>
                    <input
                        value={lastName}
                        onChange={(e) => {
                            setLastName(e.target.value);
                            validateField("lastName", e.target.value);
                        }}
                    />
                    {errors.lastName && <p style={{ color: "red" }}>{errors.lastName}</p>}

                </div>

                <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
                    <label>Email</label>
                    <input
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            validateField("email", e.target.value);
                        }}
                    />
                    {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
                </div>

                <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
                    <label>Teléfono</label>
                    <input
                        value={phone}
                        onChange={(e) => {
                            setPhone(e.target.value);
                            validateField("phone", e.target.value);
                        }}
                    />
                    {errors.phone && <p style={{ color: "red" }}>{errors.phone}</p>}
                </div>

                <div style={{ padding: "24px" }}>

                    <p>Seleccione su conferencia de interés</p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>

                        {conferences.map(conf => (

                            <label key={conf.IdConferencia}>

                                <input
                                    type="radio"
                                    name="conference"
                                    value={conf.IdConferencia}
                                    checked={selectedConference == conf.IdConferencia}
                                    onChange={(e) => setSelectedConference(e.target.value)}
                                />

                                {conf.Name}

                            </label>

                        ))}

                    </div>

                </div>

                <div style={{ display: "flex", gap: "20px", padding: "20px" }}>

                    <button
                        type="submit"
                        disabled={!isFormValid}
                    >
                        Submit
                    </button>

                    <button
                        type="button"
                        onClick={handleReset}
                    >
                        Reset
                    </button>

                </div>

            </form>

            {qr && (
                <div style={{ marginTop: "20px" }}>
                    <h3>QR de registro</h3>
                    <img src={qr} alt="QR code" />
                </div>
            )}
        </>
    );
};

export default RegistrationForm;