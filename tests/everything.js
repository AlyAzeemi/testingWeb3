fetch("http://localhost:5000/api/createAccount", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(""),
})
  .then((res) => console.log(res.body.JSON()))
  .catch((e) => console.error);
