async function testApi() {
    try {
        const response = await fetch("http://localhost:3000/api/ingest", {
            method: "POST",
        });
        const text = await response.text();
        console.log("Status:", response.status);
        console.log("Response Body:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

testApi();
