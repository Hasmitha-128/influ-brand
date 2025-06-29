const verifyBtn = document.getElementById("verifyBtn");
const resendLink = document.getElementById("resendLink");
const inputs = document.querySelectorAll(".code-inputs input");
const messageEl = document.getElementById("message");

// Autofocus next input
inputs.forEach((input, idx) => {
  input.addEventListener("input", () => {
    if (input.value && idx < inputs.length - 1) {
      inputs[idx + 1].focus();
    }
  });
});

// Verify OTP
verifyBtn.addEventListener("click", async () => {
  const otp = Array.from(inputs).map(i => i.value).join("").trim();
  const email = prompt("Please enter your email to verify:");

  if (otp.length !== 6 || !email) {
    messageEl.textContent = "Enter a valid 6-digit code and email.";
    return;
  }

  messageEl.textContent = "Verifying...";

  try {
    const res = await fetch("http://localhost:5000/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, otp }),
    });
    const data = await res.json();

    if (data.success) {
      messageEl.style.color = "green";
      messageEl.textContent = "Email verified successfully!";
      setTimeout(() => window.location.href = "influencer_login.html", 1500);
    } else {
      messageEl.textContent = data.message || "Invalid code.";
    }
  } catch (err) {
    console.error(err);
    messageEl.textContent = "Server error. Try again.";
  }
});

// Resend OTP
resendLink.addEventListener("click", async () => {
  const email = prompt("Enter your email to resend OTP:");
  if (!email) return;

  messageEl.textContent = "Resending OTP...";
  try {
    const res = await fetch("http://localhost:5000/api/auth/send-verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    messageEl.style.color = data.success ? "green" : "#d9534f";
    messageEl.textContent = data.message;
  } catch (err) {
    console.error(err);
    messageEl.textContent = "Error sending OTP.";
  }
});
