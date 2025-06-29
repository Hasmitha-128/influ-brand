const loginForm = document.getElementById("loginForm");
const messageEl = document.getElementById("message");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  messageEl.textContent = "Logging in...";

  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include", // Important to keep session
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      messageEl.textContent = "Login successful!";

      // ✅ Fetch user data right after login
      const userRes = await fetch("http://localhost:5000/api/user/data", {
        method: "GET",
        credentials: "include",
      });

      const userData = await userRes.json();
      console.log("User Data:", userData);

      // ✅ Redirect
      window.location.href = "influencers_card.html";
    } else {
      messageEl.textContent = data.message || "Login failed.";
    }
  } catch (err) {
    console.error("Login error:", err);
    messageEl.textContent = "An error occurred. Try again.";
  }
});
