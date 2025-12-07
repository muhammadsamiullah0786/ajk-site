// pages/index.js

import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>AJK Insurance - Online Application</title>
      </Head>

      <div style={{ padding: "40px", maxWidth: "700px", margin: "auto", fontFamily: "Arial" }}>
        <h2>Online Application</h2>
        <p>Fill this short form and our advisor will contact you within 24 hours.</p>

        <form id="leadForm" style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
          
          <label>
            Full Name:
            <input type="text" id="fullName" required />
          </label>

          <label>
            Email:
            <input type="email" id="email" required />
          </label>

          <label>
            Phone Number:
            <input type="tel" id="phone" required />
          </label>

          <label>
            Date of Birth:
            <input type="date" id="dob" required />
          </label>

          <label>
            Insurance Type:
            <input type="text" id="insuranceType" />
          </label>

          <label>
            City:
            <input type="text" id="city" />
          </label>

          <label>
            Country:
            <input type="text" id="country" />
          </label>

          <label>
            Message:
            <textarea id="message"></textarea>
          </label>

          <button type="submit" style={{ padding: "10px", background: "#0070f3", color: "white", border: "none" }}>
            Submit Application
          </button>
        </form>
      </div>

      {/* FORM SCRIPT */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            document.getElementById('leadForm').addEventListener('submit', async (e) => {
              e.preventDefault();

              const formData = {
                fullName: document.getElementById('fullName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                dob: document.getElementById('dob').value,
                insuranceType: document.getElementById('insuranceType').value,
                city: document.getElementById('city').value,
                country: document.getElementById('country').value,
                message: document.getElementById('message').value
              };

              try {
                const res = await fetch('/api/contact', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(formData)
                });

                const data = await res.json();
                if (data.ok) {
                  alert('Form submitted successfully!');
                  e.target.reset();
                } else {
                  alert('Failed: ' + data.error);
                }
              } catch(err) {
                alert('Error submitting form: ' + err);
              }
            });
          `,
        }}
      />
    </>
  );
}
