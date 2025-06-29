const registerForm = document.getElementById("registerForm");
const messageEl = document.getElementById("message");

registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const name = document.getElementById("name").value.trim();
  const password = document.getElementById("password").value;

  messageEl.textContent = "Creating account...";

  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, name, password }),
    });

    const data = await res.json();

    if (data.success) {
      messageEl.textContent = "Account created successfully!";

      // ✅ Fetch user data
      const userRes = await fetch("http://localhost:5000/api/user/data", {
        method: "GET",
        credentials: "include",
      });

      const userData = await userRes.json();
      console.log("User Data:", userData);

      // ✅ Redirect
      window.location.href = "influencers_card.html";
    } else {
      messageEl.textContent = data.message || "Registration failed.";
    }
  } catch (err) {
    console.error("Registration error:", err);
    messageEl.textContent = "An error occurred. Try again.";
  }
});
