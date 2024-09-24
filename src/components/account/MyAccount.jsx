import React, { useEffect, useState } from "react";
import { setLoginState } from "../../redux/accountSlice";
import { useDispatch } from "react-redux";
import Button from "../genericComponents/Button";
import Input from "../genericComponents/Input";
import Label from "../genericComponents/Label";
import { formValidation, userDetailsResetSchema } from "../../utils/Joi";
import axios from "axios";
import { getFromLocal, clearLocal } from "../../storage";
import { url } from "../../config";
import { useNavigate } from "react-router-dom";
import "../account/myAccount.scss";
import { DownArrow } from "../../utils/svgs";

const MyAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [display, setDisplay] = useState("");
  const [errors, setErrors] = useState("");
  const [userInput, setUserInput] = useState();
  const [userDetails, setUserDetails] = useState();
  const [userEmail, setUserEmail] = useState();
  const [userUsername, setUserUsername] = useState();
  const [userPassword, setUserPassword] = useState();
  const [userPasswordConfirmation, setUserPasswordConfirmation] = useState();

  useEffect(() => {
    const getUser = async () => {
      const { data } = await axios.get(`${url}/users/getUser`, {
        headers: { token: getFromLocal("token") },
      });
      if (data.code) {
        setUserDetails(data.user);
      }
    };
    getUser();
  }, [display]);

  const onInput = (e) => {
    const userInput = { [e.target.name]: e.target.value };
    formValidation(userInput, userDetailsResetSchema, setErrors);
    console.log(e.target);
    switch (e.target.name) {
      case "email":
        // formValidation(userInput, userDetailsResetSchema, setErrors);
        setUserEmail(e.target.value);
        break;
      case "username":
        setUserUsername(e.target.value);
        break;
      case "password":
        setUserPassword(e.target.value);
        break;
      case "passwordConfirmation":
        setUserPasswordConfirmation(e.target.value);
        break;
      default:
        null;
        break;
    }

    // const updatedState = { ...userInput, [e.target.name]: e.target.value };
    // formValidation(updatedState, userDetailsResetSchema, setErrors);
    // setUserInput(updatedState);
  };
  // console.log(userEmail);
  // console.log(userUsername);
  // console.log(userPassword);
  console.log(errors);
  console.log(userPasswordConfirmation);

  const updateUserDetails = async (e) => {
    e.preventDefault();
    // spread userInput so as only to send newState to database
    // const { passwordConfirmation, currentPassword, ...newState } = userInput;
    // const { data } = await axios.patch(`${url}/users/update`, newState, {
    //   headers: { token: getFromLocal("token") },
    // });

    const { data } = await axios.patch(
      `${url}/users/update`,
      { email: userEmail, username: userUsername, password: userPassword },
      {
        headers: { token: getFromLocal("token") },
      }
    );

    // if action is successful, reset display to start
    if (data.code) {
      setDisplay(null);
    }
    // if action fails, display error message and set user input to null so that correct message is displayed
    if (!data.code) {
      setUserInput(null);
      setErrors(data.message);
      console.log(data.message);
    }
  };

  const deleteAccount = async () => {
    const { data } = await axios.delete(`${url}/users/delete`, {
      headers: { token: getFromLocal("token") },
    });
    if (data.code) {
      dispatch(setLoginState(false));
      navigate("/homepage");
      clearLocal();
    }
  };

  if (!userDetails) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  // destructure user details
  const { email, username, password } = userDetails;

  return (
    <div className="main-container">
      <h3 className="">My Account Details</h3>

      <form
        className="form-signin"
        onInput={onInput}
        onSubmit={updateUserDetails}
      >
        <div className="details-container">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="flex">
            <DownArrow className="arrow rotated-right" />
            <p>{email}</p>
          </div>
          {display != "email" && (
            <Button
              className={["btn-primary", "account"]}
              onClick={() => {
                setUserUsername("");
                setUserPassword("");
                setDisplay("email");
                setErrors("");
              }}
              text="Change Email"
            />
          )}
          {display === "email" && (
            <div className="hidden-input">
              <Input
                type="email"
                name="email"
                className="form-control"
                placeholder="New email address"
              />
              {userEmail && display === "email" && errors.email ? (
                <p className="form-text">{errors.email}</p>
              ) : (
                <p className="form-text">
                  {typeof errors === "object" ? JSON.stringify(errors) : errors}
                </p>
              )}
              <Button
                className={["btn-primary"]}
                type="submit"
                text="Save"
                disabled={!userEmail || errors ? true : false}
              />
            </div>
          )}
        </div>

        <div className="details-container">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <div className="flex">
            <DownArrow className="arrow rotated-right" />
            <p>{username}</p>
          </div>
          {display != "username" && (
            <Button
              className={["btn-primary", "account"]}
              onClick={() => {
                setUserEmail("");
                setUserPassword("");
                setDisplay("username");
                setErrors("");
              }}
              text="Change username"
            />
          )}
          {display === "username" && (
            <div className="hidden-input">
              <Input
                type="text"
                name="username"
                placeholder="New username"
                className="form-control"
              />
              {username && display === "username" && errors.username ? (
                <p className="form-text">{errors.username}</p>
              ) : (
                <p className="form-text">
                  {typeof errors === "object" ? JSON.stringify(errors) : errors}
                </p>
              )}
              <Button
                className={["btn-primary"]}
                type="submit"
                text="Save"
                disabled={!userUsername || errors ? true : false}
              />
            </div>
          )}
        </div>

        <div className="details-container password">
          <label htmlFor="password" className="form-label">
            Password Reset
          </label>
          {display != "password" && (
            <Button
              className={["btn-primary", "account"]}
              onClick={() => {
                setUserEmail("");
                setUserUsername("");
                setDisplay("password");
                setErrors("");
              }}
              text="Reset password"
            />
          )}
          {display === "password" && (
            <div className="hidden-input">
              <Label
                htmlFor="password"
                className="sub-form-label"
                text="Current password:"
              />
              <Input
                type="password"
                name="currentPassword"
                placeholder="Current password"
                className="form-control mb-3"
              />

              <Label
                htmlFor="newPassword"
                className="sub-form-label"
                text="New password:"
              />
              <Input
                type="password"
                name="password"
                placeholder="New password"
                className="form-control mb-3"
              />
              {password && display === "password" && errors.password ? (
                <p className="form-text">{errors.password}</p>
              ) : undefined}

              <Label
                htmlFor="passwordConfirmation"
                text="Confirm new password:"
                className="sub-form-label"
              />
              <Input
                type="password"
                name="passwordConfirmation"
                placeholder="Confirm new password"
                className="form-control mb-3"
              />
              {userPassword && userPasswordConfirmation != userPassword && (
                <p className="form-text">Passwords do not match</p>
              )}
              <Button
                className={["btn-primary"]}
                type="submit"
                text="Save"
                disabled={
                  !userPassword ||
                  errors ||
                  userPasswordConfirmation != userPassword
                    ? true
                    : false
                }
              />
            </div>
          )}
        </div>
      </form>

      {/* <form
        className="form-signin"
        onInput={onInput}
        onSubmit={updateUserDetails}
      >
        <div className="details-container">
          <label htmlFor="email" className="form-label">
            Email
          </label>
          <div className="flex">
            <DownArrow className="arrow rotated-right" />
            <p>{email}</p>
          </div>
          {display != "email" && (
            <Button
              className={["btn-primary", "account"]}
              onClick={() => {
                setDisplay("email");
                setErrors("");
              }}
              text="Change Email"
            />
          )}
          {display === "email" && (
            <div className="hidden-input">
              <Input
                type="email"
                name="email"
                placeholder="New email address"
                className="form-control"
              />
              {email && display === "email" && errors.email ? (
                <p className="form-text">{errors.email}</p>
              ) : (
                <p className="form-text">{errors}</p>
              )}
              <Button
                className={["btn-primary"]}
                type="submit"
                text="Save"
                disabled={!userInput || errors ? true : false}
              />
            </div>
          )}
        </div>

        <div className="details-container">
          <label htmlFor="username" className="form-label">
            Username
          </label>
          <div className="flex">
            <DownArrow className="arrow rotated-right" />
            <p>{username}</p>
          </div>
          {display != "username" && (
            <Button
              className={["btn-primary", "account"]}
              onClick={() => {
                setDisplay("username");
                setErrors("");
              }}
              text="Change username"
            />
          )}
          {display === "username" && (
            <div className="hidden-input">
              <Input
                type="text"
                name="username"
                placeholder="New username"
                className="form-control"
              />
              {username && display === "username" && errors.username ? (
                <p className="form-text">{errors.username}</p>
              ) : (
                <p className="form-text">
                  {typeof errors === "object" ? JSON.stringify(errors) : errors}
                </p>
              )}
              <Button
                className={["btn-primary"]}
                type="submit"
                text="Save"
                disabled={!userInput || errors ? true : false}
              />
            </div>
          )}
        </div>

        <div className="details-container password">
          <label htmlFor="password" className="form-label">
            Password Reset
          </label>
          {display != "password" && (
            <Button
              className={["btn-primary", "account"]}
              onClick={() => {
                setDisplay("password");
                setErrors("");
              }}
              text="Reset password"
            />
          )}
          {display === "password" && (
            <div className="hidden-input">
              <Label
                htmlFor="password"
                className="sub-form-label"
                text="Current password:"
              />
              <Input
                type="password"
                name="currentPassword"
                placeholder="Current password"
                className="form-control mb-3"
              />

              <Label
                htmlFor="newPassword"
                className="sub-form-label"
                text="New password:"
              />
              <Input
                type="password"
                name="password"
                placeholder="New password"
                className="form-control mb-3"
              />
              {password && display === "password" && errors.password ? (
                <p className="form-text">{errors.password}</p>
              ) : errors ? (
                <p className="form-text">{errors}</p>
              ) : undefined}

              <Label
                htmlFor="passwordConfirmation"
                text="Confirm new password:"
                className="sub-form-label"
              />
              <Input
                type="password"
                name="passwordConfirmation"
                placeholder="Confirm new password"
                className="form-control mb-3"
              />
              {userInput &&
                userInput.passwordConfirmation != userInput.password && (
                  <p className="form-text">Passwords do not match</p>
                )}
              <Button
                className={["btn-primary"]}
                type="submit"
                text="Save"
                disabled={
                  !userInput ||
                  errors ||
                  userInput.passwordConfirmation != userInput.password
                    ? true
                    : false
                }
              />
            </div>
          )}
        </div>
      </form> */}
      <div className="p-3">
        <Button
          className={["btn-danger"]}
          type="button"
          text="Delete Account"
          onClick={deleteAccount}
        />
      </div>
    </div>
  );
};

export default MyAccount;
