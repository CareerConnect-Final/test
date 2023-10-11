import { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/auth/authContext";
import './loginPage.scss'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
  useMediaQuery,
  MenuItem,
  useTheme,
  Input,
  InputLabel,
  TextareaAutosize,
  FormControl,
  Paper,
  IconButton,
} from "@mui/material";
import ErrorAlert from "../../components/ErrorAlert/index";
import { Formik, Field } from "formik";
import { loginSchema, registerSchema } from "../../utils/Schemas";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";

import cookie from "react-cookies";
/////////////////////////////////////firebase//
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { storage } from "../../firebase";
import { v4 } from "uuid";

function LoginPage(props) {
  const user=cookie.load("user")
  const [profilePhotoUrl, setProfilePhotoUrl] = useState("");
  const [coverPhotoUrl, setCoverPhotoUrl] = useState("");

  const handleAddProfilePhoto = (e) => {
    const imageRef = ref(storage, `profile/${e.name + v4()}`);
    uploadBytes(imageRef, e).then((snapshot) => {
    getDownloadURL(snapshot.ref).then( (url) => {
      setProfilePhotoUrl(url)
    })
  })
  }
  const handleAddCoverPhoto = (e) => {
    const imageRef = ref(storage, `cover/${e.name + v4()}`);
    uploadBytes(imageRef, e).then((snapshot) => {
    getDownloadURL(snapshot.ref).then( (url) => {
      setCoverPhotoUrl(url)
    })
  })
  }

  const initialValuesRegister = {
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    country: "",
    city: "",
    phoneNumber: "",
    address: "",
    gender: "",
    profilePicture: null,
    imageForCover: null,
    career: "",
    bio: "",
    username: "",
    password: "",
    role: "user", // Default role
  };

  const initialValuesLogin = {
    username: "",
    password: "",
  };

  const location = useLocation().pathname.slice(1);
  const [pageType, setPageType] = useState(location); //To turn '/register' to 'register'
  let isLogin = pageType === "login";
  let isRegister = pageType === "register";
  const [loading, setLoading] = useState(false);
  const [globalError, setGlobalError] = useState([]);
 
  const { login, signup } = useContext(AuthContext); // or   const authContext = useContext(AuthContext); and to access the shared states ==> authContext.somthing

  const { palette } = useTheme();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:1000px)");
  const registerHandler = async (values, onSubmitProps) => {
    setLoading(true);
    try {
      const {
        username,
        password,
        email,
        role,
        firstName,
        lastName,
        dateOfBirth,
        country,
        city,
        phoneNumber,
        address,
        gender,
        profilePicture= profilePhotoUrl,
        imageForCover= coverPhotoUrl,
        career,
        bio,
        companyName,
      } = values;

      const signUpResponse = await signup(
        username,
        password,
        role,
        email,
        firstName,
        lastName,
        dateOfBirth,
        country,
        city,
        phoneNumber,
        address,
        gender,
        profilePicture,
        imageForCover,
        career,
        bio,
        companyName
      );
      onSubmitProps.resetForm();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  // const loginHandler = async (values, onSubmitProps) => {
  //   setLoading(true);
  //   try {
  //     const { username, password } = values;
  //     const loggedInResponse = await login(username, password);
  //     onSubmitProps.resetForm();
  //     window.location.reload();

  //   } catch (err) {
  //     console.error(err);
  //   }
  //   setLoading(false);
  // };


  
    const loginHandler = async (values, onSubmitProps) => {
      setLoading(true);
      try {
        const { username, password } = values;
        await login(username, password);
        onSubmitProps.resetForm();
        
        // Navigate to the home page and reload
        navigate("/");
        window.location.reload();
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isRegister) await registerHandler(values, onSubmitProps);
    if (isLogin) await loginHandler(values, onSubmitProps);
  };
  /* */
  return (
    <>
      <div className="center-containerr">
  <div className="form-containerr">
    <div className="custom-containerr">
      <Container maxWidth="sm">
        {" "}
        <Typography
          fontWeight="bold"
          textAlign="center"
          paddingTop="1rem"
          fontSize="clamp(1.5rem, 2.5rem, 3rem)"
          className="hover-effectt"
          color="teal"
          onClick={() => navigate("/")}
          sx={{
            "&:hover": {
              color: palette.primary.light,
              cursor: "pointer",
            },
          }}
        >
          WELCOME!
        </Typography>
        {globalError.length ? (
          <ErrorAlert errors={globalError}></ErrorAlert>
        ) : null}
        <Formik
          initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
          validationSchema={isLogin ? loginSchema : registerSchema}
          onSubmit={handleFormSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleBlur,
            handleChange,
            handleSubmit,
            resetForm,
            setFieldValue,
          }) => (
            <form onSubmit={handleSubmit} className="custom-formm">
              <Box
                display="grid"
                gap="30px"
                padding="1.5rem"
                gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                className="grid-boxx"
                sx={{
                  "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                }}
              >
                <TextField
                  label="Username"
                  onBlur={handleBlur}
                  onChange={(e) => {
                    setGlobalError([]);
                    handleChange(e);
                  }}
                  value={values.username}
                  name="username"
                  error={Boolean(touched.username) && Boolean(errors.username)}
                  helperText={touched.username && errors.username}
                  className="custom-text-fieldd"
                  sx={{ gridColumn: "span 4", fontWeight:"500px"}}
                />
                <TextField
                  label="Password"
                  type="password"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.password}
                  name="password"
                  error={Boolean(touched.password) && Boolean(errors.password)}
                  helperText={touched.password && errors.password}
                  sx={{ gridColumn: "span 4" }}
                />
                {isRegister && (
                  <>
                    <TextField
                      label="Email"
                      onBlur={handleBlur}
                      onChange={(e) => {
                        setGlobalError([]);
                        handleChange(e);
                      }}
                      value={values.email}
                      name="email"
                      error={Boolean(touched.email) && Boolean(errors.email)}
                      helperText={touched.email && errors.email}
                      sx={{ gridColumn: "span 4" }}
                    />
                    <Field
                      as={TextField}
                      label="Role"
                      select
                      name="role"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.role}
                      error={Boolean(touched.role) && Boolean(errors.role)}
                      helperText={touched.role && errors.role}
                      sx={{ gridColumn: "span 4" }}
                      required
                    >
                      <MenuItem key={"user"} value={"user"}>
                        {"user"}
                      </MenuItem>
                      <MenuItem key={"company"} value={"company"}>
                        {"company"}
                      </MenuItem>
                    </Field>

                    <>
                      {values.role === "user" ? (
                        <>
                          <TextField
                            label="First Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.firstName}
                            name="firstName"
                            error={
                              touched.firstName && Boolean(errors.firstName)
                            }
                            helperText={touched.firstName && errors.firstName}
                            fullWidth
                            sx={{ gridColumn: "span 2" }}
                          />
                          <TextField
                            label="Last Name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.lastName}
                            name="lastName"
                            error={touched.lastName && Boolean(errors.lastName)}
                            helperText={touched.lastName && errors.lastName}
                            fullWidth
                            sx={{ gridColumn: "span 2" }}
                          />
                        </>
                      ) : (
                        <TextField
                          label="Company Name"
                          onBlur={handleBlur}
                          onChange={handleChange}
                          value={values.companyName}
                          name="companyName"
                          error={
                            touched.companyName && Boolean(errors.companyName)
                          }
                          helperText={touched.companyName && errors.companyName}
                          fullWidth
                          sx={{ gridColumn: "span 4" }}
                        />
                      )}
                    </>

                    <TextField
                      label="Country"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.country}
                      name="country"
                      error={touched.country && Boolean(errors.country)}
                      helperText={touched.country && errors.country}
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="City"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.city}
                      name="city"
                      error={touched.city && Boolean(errors.city)}
                      helperText={touched.city && errors.city}
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Address"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.address}
                      name="address"
                      error={touched.address && Boolean(errors.address)}
                      helperText={touched.address && errors.address}
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                    />
                    <TextField
                      label="Phone Number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.phoneNumber}
                      name="phoneNumber"
                      error={touched.phoneNumber && Boolean(errors.phoneNumber)}
                      helperText={touched.phoneNumber && errors.phoneNumber}
                      fullWidth
                      sx={{ gridColumn: "span 2" }}
                    />
                    <>
                      <TextField
                        placeholder="Bio" // Adjust the placeholder text as needed
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.bio}
                        name="bio"
                        maxLength={255} // Limit the input to 255 characters
                        multiline // Enable multiline input
                        rowsMax={10} // Set a maximum number of rows to control the height
                        error={touched.bio && Boolean(errors.bio)}
                        helperText={touched.bio && errors.bio}
                        sx={{
                          gridColumn: "span 4", // Adjust the grid column based on the role
                          width: "100%", // Set the width to 100% to take up the entire grid column
                          height: "auto", // Allow the height to adjust automatically
                        }}
                      />
                    </>
                    <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                      
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <input
                          type="file"
                          id="profilePicture"
                          name="profilePicture"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(event) => {
                            // setProfileImageUpload(event.currentTarget.files[0]);
                            handleAddProfilePhoto(event.currentTarget.files[0]);
                          }}
                        />
                        <Paper
                          component="div"
                          variant="outlined"
                          sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            document.getElementById("profilePicture").click(); 
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{ flex: 1, overflow: "hidden" }}
                          >
                            {values.profilePicture
                              ? values.profilePicture.name
                              : "Upload a profile picture"}
                          </Typography>
                          <IconButton
                            component="span"
                            color="primary"
                            aria-label="upload picture"
                            sx={{ ml: 2 }}
                          >
                            <PhotoCameraIcon />
                          </IconButton>
                        </Paper>
                      </Box>
                    </FormControl>
                    {/* Cover Image */}
                    <FormControl fullWidth sx={{ gridColumn: "span 2" }}>
                      <Box
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <input
                          type="file"
                          id="imageForCover"
                          name="imageForCover"
                          accept="image/*"
                          style={{ display: "none" }}
                          onChange={(event) => {
                            handleAddCoverPhoto(event.currentTarget.files[0]);
                          }}
                          onBlur={handleBlur}
                        />
                        <Paper
                          component="div"
                          variant="outlined"
                          sx={{
                            p: 2,
                            display: "flex",
                            alignItems: "center",
                            cursor: "pointer",
                          }}
                          onClick={() => {
                            document.getElementById("imageForCover").click();
                          }}
                        >
                          <Typography
                            variant="body1"
                            component="span"
                            sx={{ flex: 1, overflow: "hidden" }}
                          >
                            {values.imageForCover
                              ? values.imageForCover.name
                              : "Upload a cover image"}
                          </Typography>
                          <IconButton
                            component="span"
                            color="primary"
                            aria-label="upload picture"
                            sx={{ ml: 2 }}
                          >
                            <PhotoCameraIcon />
                          </IconButton>
                        </Paper>
                      </Box>
                    </FormControl>
                  </>
                )}
              </Box>

              {/* BUTTONS */}
              <Box padding="0 1.5rem 1.5rem 1.5rem" className="button-boxx">
                <Button
                  fullWidth
                  type="submit"
                  disabled={loading}
                  className="custom-buttonn"
                  sx={{
                    m: "2rem 0",
                    p: "0.8rem",
                    backgroundColor: palette.primary.main,
                    color: "white",
                    "&:hover": { color: palette.primary.main },
                  }}
                >
                  {loading ? (
                    <CircularProgress  size={22} />
                  ) : isLogin ? (
                    "LOGIN"
                  ) : (
                    "REGISTER"
                  )}
                </Button>
                <Typography
                  onClick={() => {
                    setGlobalError([]);
                    setPageType(isLogin ? "register" : "login");
                    navigate(isLogin ? "/register" : "/login");
                    resetForm();
                  }}
                  className="custom-linkk"
                  sx={{
                    textDecoration: "underline",
                    color: palette.primary.main,
                    "&:hover": {
                      cursor: "pointer",
                    },
                  }}
                >
                  {isLogin
                    ? "Don't have an account? Sign Up here."
                    : "Already have an account? Login here."}
                </Typography>
              </Box>
            </form>
          )}
        </Formik>
      </Container>
      </div>
  </div>
</div>
    </>
  );
}
export default LoginPage;
