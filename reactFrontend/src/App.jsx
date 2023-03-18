import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import Modal from "@mui/material/Modal";
import "@aws-amplify/ui-react/styles.css";

import { Amplify } from "aws-amplify";
import awsExports from "./aws-exports";
Amplify.configure(awsExports);
import { Authenticator } from "@aws-amplify/ui-react";

import sent from "./assets/done-ring-round-svgrepo-com.svg";
const App = () => {
    const [open, setOpen] = React.useState(false);
    const [receivedResult, setReceivedResult] = React.useState("");
    const [sendingResponse, setSendingResponse] = React.useState(false);
    const [responseSentSucc, setResponseSentSucc] = React.useState(false);

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        setOpen(false);
        setReceivedResult("");
        setSendingResponse(false);
        setResponseSentSucc(false);
        formik.resetForm({ values: "" });
    };

    const sendresponse = (e) => {
        setSendingResponse(true);
        const sendResponseToApplicant = async () => {
            const data = {
                responseType: e.target.name,
                email: formik.values.email,
            };
            const response = await fetch(
                "https://sfmd4hbbpb.execute-api.us-east-1.amazonaws.com/dev",
                {
                    method: "POST",
                    mode: "cors",
                    cache: "no-cache",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    redirect: "follow",
                    referrerPolicy: "no-referrer",
                    body: JSON.stringify(data),
                }
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data == "Done") {
                        setResponseSentSucc(true);
                    }
                });
        };
        sendResponseToApplicant();
    };

    const formik = useFormik({
        initialValues: {
            name: "",
            email: "",
            accountNo: "",
            moody: "",
            vehicleValue: "",
            financedAmount: "",
            paymentAmount: "",
            downPayment: "",
            charge: "",
            ficoScore: "",
        },

        validationSchema: Yup.object({
            name: Yup.string()
                .max(20, "Name must be 20 characters or less.")
                .required("Name is required"),
            email: Yup.string()
                .email("Invalid email address")
                .required("Email is required"),
            accountNo: Yup.number().required("Account Number is required"),
            moody: Yup.string().required("Moody is required"),
            vehicleValue: Yup.string().required("Vehicle Value is required"),
            financedAmount: Yup.string().required(
                "Financed Amount is required"
            ),
            paymentAmount: Yup.string().required("Payment Amount is required"),
            downPayment: Yup.string().required("Down Payment is required"),
            charge: Yup.string().required("Charge is required"),
            ficoScore: Yup.string().required("FICO Score is required"),
        }),

        onSubmit: (values, { setSubmitting, resetForm }) => {
            console.log("form submitted");
            console.log(values);
            const fetchData = async () => {
                const data = {
                    data: [
                        [
                            values.moody,
                            values.vehicleValue,
                            values.financedAmount,
                            values.paymentAmount,
                            values.downPayment,
                            values.charge,
                            values.ficoScore,
                        ],
                    ],
                };
                console.log(data);
                const response = await fetch(
                    "https://sfmd4hbbpb.execute-api.us-east-1.amazonaws.com/dev",
                    {
                        method: "POST",
                        mode: "cors",
                        cache: "no-cache",
                        credentials: "same-origin",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        redirect: "follow",
                        referrerPolicy: "no-referrer",
                        body: JSON.stringify(data),
                    }
                )
                    .then((response) => response.json())
                    .then((data) => {
                        console.log(data);
                        setReceivedResult(data);
                    });
                // console.log(response.json());
            };
            fetchData();
            handleOpen();
            // resetForm({ values: "" });
        },
    });

    return (
        <Authenticator className=" mt-16 ">
            {({ signOut, user }) => (
                <main className="  h-screen items-center flex justify-center">
                    <form
                        onSubmit={formik.handleSubmit}
                        className="bg-white flex rounded-lg w-1/2 font-latoRegular"
                    >
                        <div className="flex-1 text-gray-700  p-20">
                            <h1 className="text-3xl pb-2 font-latoBold">
                                Loan Default Prediction Model
                            </h1>
                            <p className="text-lg  text-gray-500">
                                Please enter the applicant details correctly
                            </p>
                            <div className="mt-6 ">
                                <p className="">Personal information</p>
                                <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-200"></hr>
                                <div className="flex gap-4 mb-3">
                                    {/* Name input field */}
                                    <div className="pb-4 flex-1">
                                        <label
                                            htmlFor="name"
                                            className={`block text-sm pb-2 ${
                                                formik.touched.name &&
                                                formik.errors.name
                                                    ? "text-red-400"
                                                    : ""
                                            } `}
                                        >
                                            {formik.touched.name &&
                                            formik.errors.name
                                                ? formik.errors.name
                                                : "Name"}
                                        </label>
                                        <input
                                            className="border-2 border-gray-400 p-2 w-full rounded-md focus:border-teal-500 focus:ring ring-teal-500 "
                                            type="text"
                                            name="name"
                                            placeholder="Enter applicant name"
                                            onChange={formik.handleChange}
                                            value={formik.values.name}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
                                    {/* Email input field */}
                                    <div className="pb-4 flex-1">
                                        <label
                                            htmlFor="email"
                                            className={`block text-sm pb-2 ${
                                                formik.touched.email &&
                                                formik.errors.email
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.email &&
                                            formik.errors.email
                                                ? formik.errors.email
                                                : "Email"}
                                        </label>
                                        <input
                                            className="border-2 border-gray-400 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                                            type="email"
                                            name="email"
                                            placeholder="Enter applicant email address"
                                            onChange={formik.handleChange}
                                            value={formik.values.email}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
                                </div>

                                <p className="">Financial information</p>
                                <hr className="h-px my-3 bg-gray-200 border-0 dark:bg-gray-200"></hr>

                                <div className="gap-4 flex mb-3">
                                    {/* Account No input field */}
                                    <div className="pb-4 flex-1">
                                        <label
                                            htmlFor="accountNo"
                                            className={`block text-sm pb-2 ${
                                                formik.touched.accountNo &&
                                                formik.errors.accountNo
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.accountNo &&
                                            formik.errors.accountNo
                                                ? formik.errors.accountNo
                                                : "Account Number"}
                                        </label>
                                        <input
                                            className="border-2 border-gray-400 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                                            type="number"
                                            name="accountNo"
                                            placeholder="Enter applicant account no"
                                            onChange={formik.handleChange}
                                            value={formik.values.accountNo}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>

                                    {/* Moody input field */}
                                    <div className="pb-4 flex-1">
                                        <label
                                            htmlFor="moody"
                                            className={`block text-sm pb-2 ${
                                                formik.touched.moody &&
                                                formik.errors.moody
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.moody &&
                                            formik.errors.moody
                                                ? formik.errors.moody
                                                : "Moody"}
                                        </label>
                                        <input
                                            className="border-2 border-gray-400 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                                            type="number"
                                            name="moody"
                                            placeholder="Enter moody value"
                                            onChange={formik.handleChange}
                                            value={formik.values.moody}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
                                </div>

                                <div className="gap-4 flex mb-3">
                                    {/* vehicle Value input field */}
                                    <div className="pb-4 flex-1">
                                        <label
                                            htmlFor="vehicleValue"
                                            className={`block text-sm pb-2 ${
                                                formik.touched.vehicleValue &&
                                                formik.errors.vehicleValue
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.vehicleValue &&
                                            formik.errors.vehicleValue
                                                ? formik.errors.vehicleValue
                                                : "Vehicle Value"}
                                        </label>
                                        <input
                                            className="border-2 border-gray-400 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                                            type="number"
                                            name="vehicleValue"
                                            placeholder="Enter vehicle value"
                                            onChange={formik.handleChange}
                                            value={formik.values.vehicleValue}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>

                                    {/* FinancedAmount input field */}
                                    <div className="pb-4 flex-1">
                                        <label
                                            htmlFor="financedAmount"
                                            className={`block text-sm pb-2 ${
                                                formik.touched.financedAmount &&
                                                formik.errors.financedAmount
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.financedAmount &&
                                            formik.errors.financedAmount
                                                ? formik.errors.financedAmount
                                                : "Financed Amount"}
                                        </label>
                                        <input
                                            className="border-2 border-gray-400 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                                            type="number"
                                            name="financedAmount"
                                            placeholder="Enter financed amount"
                                            onChange={formik.handleChange}
                                            value={formik.values.financedAmount}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
                                </div>

                                <div className="gap-4 flex mb-3">
                                    {/* Payment Amount input field */}
                                    <div className="pb-4 flex-1">
                                        <label
                                            htmlFor="paymentAmount"
                                            className={`block text-sm pb-2 ${
                                                formik.touched.paymentAmount &&
                                                formik.errors.paymentAmount
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.paymentAmount &&
                                            formik.errors.paymentAmount
                                                ? formik.errors.paymentAmount
                                                : "Payment Amount"}
                                        </label>
                                        <input
                                            className="border-2 border-gray-400 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                                            type="number"
                                            name="paymentAmount"
                                            placeholder="Enter payment amount"
                                            onChange={formik.handleChange}
                                            value={formik.values.paymentAmount}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>

                                    {/* Down Payment input field */}
                                    <div className="pb-4 flex-1">
                                        <label
                                            htmlFor="downPayment"
                                            className={`block text-sm pb-2 ${
                                                formik.touched.downPayment &&
                                                formik.errors.downPayment
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.downPayment &&
                                            formik.errors.downPayment
                                                ? formik.errors.downPayment
                                                : "Down Payment"}
                                        </label>
                                        <input
                                            className="border-2 border-gray-400 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                                            type="number"
                                            name="downPayment"
                                            placeholder="Enter down payment value"
                                            onChange={formik.handleChange}
                                            value={formik.values.downPayment}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
                                </div>

                                <div className="gap-4 flex mb-3">
                                    {/* charge Value input field */}
                                    <div className="pb-4 flex-1">
                                        <label
                                            htmlFor="charge"
                                            className={`block text-sm pb-2 ${
                                                formik.touched.charge &&
                                                formik.errors.charge
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.charge &&
                                            formik.errors.charge
                                                ? formik.errors.charge
                                                : "Charge Value"}
                                        </label>
                                        <input
                                            className="border-2 border-gray-400 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                                            type="number"
                                            name="charge"
                                            placeholder="Enter charge value"
                                            onChange={formik.handleChange}
                                            value={formik.values.charge}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>

                                    {/* fico Score input field */}
                                    <div className="pb-4 flex-1">
                                        <label
                                            htmlFor="ficoScore"
                                            className={`block text-sm pb-2 ${
                                                formik.touched.ficoScore &&
                                                formik.errors.ficoScore
                                                    ? "text-red-400"
                                                    : ""
                                            }`}
                                        >
                                            {formik.touched.ficoScore &&
                                            formik.errors.ficoScore
                                                ? formik.errors.ficoScore
                                                : "FICO Score"}
                                        </label>
                                        <input
                                            className="border-2 border-gray-400 p-2 rounded-md w-full focus:border-teal-500 focus:ring-teal-500"
                                            type="number"
                                            name="ficoScore"
                                            placeholder="Enter FICO score"
                                            onChange={formik.handleChange}
                                            value={formik.values.ficoScore}
                                            onBlur={formik.handleBlur}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="bg-teal-500 font-latoBold text-sm text-white py-3 mt-6 rounded-lg w-full"
                                >
                                    Check Prediction!
                                </button>
                                <Modal open={open} onClose={handleClose}>
                                    <div className="bg-white p-4 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg w-1/3 font-latoRegular">
                                        {receivedResult ? (
                                            <div className="flex flex-col p-4 items-center justify-center">
                                                <h2 className="flex p-4 mb-6 text-lg">
                                                    {`Loan default probability: ${
                                                        100 -
                                                        (
                                                            receivedResult * 100
                                                        ).toFixed(2)
                                                    } %`}
                                                </h2>
                                                {sendingResponse ? (
                                                    responseSentSucc ? (
                                                        <span className="animate-bounce">
                                                            <img
                                                                className="w-8 h-8"
                                                                src={sent}
                                                                alt="Email Sent"
                                                            />
                                                        </span>
                                                    ) : (
                                                        <span className="loader"></span>
                                                    )
                                                ) : (
                                                    <div className="flex w-3/4 gap-4">
                                                        <p className="flex flex-2 items-center">
                                                            Send Response to
                                                            Applicant:
                                                        </p>
                                                        <button
                                                            name="positive"
                                                            onClick={
                                                                sendresponse
                                                            }
                                                            className="flex-1 bg-teal-500 text-white py-3 rounded-lg"
                                                        >
                                                            Approve
                                                        </button>
                                                        <button
                                                            name="negative"
                                                            onClick={
                                                                sendresponse
                                                            }
                                                            className="flex-1 bg-rose-400 text-white py-3 rounded-lg"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}

                                                <button
                                                    onClick={handleClose}
                                                    className="bg-teal-500 w-2/3 font-latoBold text-sm text-white py-3 mt-6 rounded-lg"
                                                >
                                                    Check Another Application
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center">
                                                <span className="loader"></span>
                                            </div>
                                        )}
                                    </div>
                                </Modal>
                            </div>
                        </div>
                    </form>
                    <button
                        className="absolute top-4 right-4 bg-white text-teal-500 p-3 rounded-xl"
                        onClick={signOut}
                    >
                        Sign out
                    </button>
                </main>
            )}
        </Authenticator>
    );
};

export default App;
