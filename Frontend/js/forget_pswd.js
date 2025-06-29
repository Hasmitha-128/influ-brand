const resetBtn = document.getElementById("resetBtn");
const emailInput = document.getElementById("email");
const messageEl = document.getElementById("message");

resetBtn.addEventListener("click", async () => {
  const email = emailInput.value.trim();
  if (!email) {
    messageEl.textContent = "Please enter your email.";
    return;
  }

  messageEl.textContent = "Sending reset OTP...";

  try {
    const res = await fetch("http://localhost:5000/api/auth/send-reset-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email })
    });
    const data = await res.json();

    if (data.success) {
      messageEl.style.color = "green";
      messageEl.textContent = "OTP sent to your email.";
      // Optionally redirect to email verification page:
      setTimeout(() => {
        window.location.href = "email_registration.html";
      }, 1500);
    } else {
      messageEl.style.color = "red";
      messageEl.textContent = data.message || "Failed to send OTP.";
    }
  } catch (err) {
    console.error(err);
    messageEl.style.color = "red";
    messageEl.textContent = "Server error.";
  }
});
