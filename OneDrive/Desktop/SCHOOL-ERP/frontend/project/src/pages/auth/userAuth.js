// ================= GET USER =================
export const getUser = () => {
  try {
    const data = localStorage.getItem("user");
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("User parse error:", err);
    return null;
  }
};

// ================= GET USER ID =================
export const getUserId = () => {
  return getUser()?.id || null;
};

// ================= GET USER ROLE =================
export const getUserRole = () => {
  return getUser()?.role || null;
};

// ================= CHECK LOGIN =================
export const isLoggedIn = () => {
  return !!getUser();
};

// ================= SAVE USER (LOGIN FIXED) =================
export const saveUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// ================= LOGOUT =================
export const logoutUser = () => {
  localStorage.removeItem("user");

  // cleanup old keys (IMPORTANT)
  localStorage.removeItem("studentData");
  localStorage.removeItem("professorData");
  localStorage.removeItem("hodData");
  localStorage.removeItem("studentId");
  localStorage.removeItem("professorId");
  localStorage.removeItem("hodId");
  localStorage.removeItem("userRole");
};