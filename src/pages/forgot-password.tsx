import { Button } from "@chakra-ui/button";
import { Box } from "@chakra-ui/layout";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { InputField } from "../components/InputField";
import { Wrapper } from "../components/Wrapper";
import { useForgotPasswordMutation } from "../generated/graphql";
import { createUrqlClient } from "../utils/createUrqlClient";
import { toErrorMap } from "../utils/toErrorMap";

interface forgotPasswordProps {}
export const ForgotPassword: React.FC<forgotPasswordProps> = ({}) => {
  const router = useRouter();
  const [, forgotPassword] = useForgotPasswordMutation();
  const [emailError, setEmailError] = useState("");
  return (
    <Wrapper>
      <Formik
        initialValues={{ email: "" }}
        onSubmit={async (values, { setErrors }) => {
          const response = await forgotPassword(values);

          if (
            !response.data?.forgotPassword.emailSent &&
            response.data?.forgotPassword.errors
          ) {
            const errorMap = toErrorMap(response.data.forgotPassword.errors);
            if ("email" in errorMap) {
              setEmailError(errorMap.email);
            }
            setErrors(errorMap);
          }

          if (response.data?.forgotPassword.emailSent) {
            router.push("/");
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="email" placeholder="email" label="Email" />
            {emailError ? (
              <Box>
                <Box color="red.300">{emailError}</Box>
                <Box color="gray.500">Please Try Again</Box>
              </Box>
            ) : null}

            <Button
              mt={4}
              type="submit"
              colorScheme="teal"
              isLoading={isSubmitting}
            >
              Send Email
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default withUrqlClient(createUrqlClient)(ForgotPassword);
