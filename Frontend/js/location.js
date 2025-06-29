document.getElementById("fetchDataBtn").addEventListener("click", async () => {
  try {
    const res = await fetch("http://localhost:5000/api/data", {
      credentials: "include"
    });
    const data = await res.json();
    console.log("Backend response:", data);
    alert(`Backend response:\n${JSON.stringify(data)}`);
  } catch (err) {
    console.error(err);
    alert("Error fetching backend data.");
  }
});
