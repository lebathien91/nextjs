const baseUrl = process.env.NEXT_PUBLIC_API_URL;

export const getData = async (path: string, token?: string) => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    method: "GET",
    headers: {
      "content-Type": "application/json",
      Authorization: token || `Bearer ${token}`,
    },
  });

  const data = await res.json();
  return data;
};

export const postData = async (path: string, post?: object, token?: string) => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    method: "POST",
    headers: {
      "content-Type": "application/json",
      Authorization: token || `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });

  const data = await res.json();
  return data;
};

export const putData = async (path: string, post?: object, token?: string) => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    method: "PUT",
    headers: {
      "content-Type": "application/json",
      Authorization: token || `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });

  const data = await res.json();
  return data;
};

export const patchData = async (
  path: string,
  post?: object,
  token?: string
) => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    method: "PATCH",
    headers: {
      "content-Type": "application/json",
      Authorization: token || `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });

  const data = await res.json();
  return data;
};

export const deleteData = async (
  path: string,
  post?: object,
  token?: string
) => {
  const res = await fetch(`${baseUrl}/api/${path}`, {
    method: "DELETE",
    headers: {
      "content-Type": "application/json",
      Authorization: token || `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  });

  const data = await res.json();
  return data;
};
