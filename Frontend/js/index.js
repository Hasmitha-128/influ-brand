document.getElementById("loginBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:5000/api/data", {
      credentials: "include"
    });
    const data = await res.json();
    console.log("Login Test:", data);
    alert(`Login Test:\n${JSON.stringify(data)}`);
  } catch (err) {
    console.error(err);
    alert("Error testing login endpoint");
  }
});

document.getElementById("signupBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:5000/api/data", {
      credentials: "include"
    });
    const data = await res.json();
    console.log("Signup Test:", data);
    alert(`Signup Test:\n${JSON.stringify(data)}`);
  } catch (err) {
    console.error(err);
    alert("Error testing signup endpoint");
  }
});
