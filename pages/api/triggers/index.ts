export const updateTrigger = async (collection: string, body: any) => {
  const options = {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body)
  };

  await fetch(process.env.HTTP_ENDPOINT_URL + collection + "?secret=" + process.env.HTTP_ENDPOINT_SECRET, options)
    .then(async (res: any) => {
      if (!res.ok) {
        return Promise.reject(res)
      }
      else {
      }
    })
    .catch((error) => {
    });
}