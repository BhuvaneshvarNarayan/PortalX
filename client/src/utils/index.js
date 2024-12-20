import axios from "axios";
const API_URL = "http://localhost:8800/api-v1";

export const API = axios.create({
  baseURL: API_URL,
  responseType: "json",
});

export const apiRequest = async ({ url, token, data, method }) => {
  try {
    const result = await API(url, {
      method: method || "GET",
      data: data,
      headers: {
        "content-type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    });

    return result?.data;
  } catch (error) {
    const err = error.response.data;
    console.log(err);
    return { status: err.success, message: err.message };
  }
};

export const handleFileUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "portalX");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dr4mgnqfa/image/upload/`,
      formData
    );
    return response.data.secure_url;
  } catch (error) {
    console.log(error);
  }
};

export const handleResumeUpload = async (uploadFile) => {

  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "portalX");

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dr4mgnqfa/raw/upload/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Log the full response to inspect the data
    console.log("Full RESPONSE", response.data);

    // Check if secure_url exists before returning
    if (response.data.secure_url) {
      return response.data.secure_url;
    } else {
      throw new Error("secure_url not found in the response.");
    }
  } catch (error) {
    console.error("Upload error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const handleDocumentUpload = async (uploadFile) => {
  const formData = new FormData();
  formData.append("file", uploadFile);
  formData.append("upload_preset", "portalX"); // Ensure this preset is configured in Cloudinary

  try {
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/dr4mgnqfa/raw/upload/`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Log the full response to inspect the data
    console.log("Full RESPONSE", response.data);

    // Check if secure_url exists before returning
    if (response.data.secure_url) {
      return response.data.secure_url;
    } else {
      throw new Error("secure_url not found in the response.");
    }
  } catch (error) {
    console.error("Upload error:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateURL = ({
  pageNum,
  query,
  cmpLoc,
  sort,
  navigate,
  location,
  jType,
  exp,
}) => {
  const params = new URLSearchParams();

  if (pageNum && pageNum > 1) {
    params.set("page", pageNum);
  }

  if (query) {
    params.set("search", query);
  }

  if (cmpLoc) {
    params.set("location", cmpLoc);
  }

  if (sort) {
    params.set("sort", sort);
  }

  if (jType) {
    params.set("jtype", jType);
  }

  if (exp) {
    params.set("exp", exp);
  }

  const newURL = `${location.pathname}?${params.toString()}`;
  navigate(newURL, { replace: true });

  return newURL;
};
