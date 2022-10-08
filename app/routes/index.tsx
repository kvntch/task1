import { useForm, SubmitHandler } from "react-hook-form";
import {  
  ActionFunction,
  LoaderFunction,
  MetaFunction, 
  json, 
  redirect 
} from "@remix-run/node";
import { getUserWithSession, safeRedirect, validateEmail } from "~/utils";
import { Form, useActionData, useSearchParams } from "@remix-run/react";

type Inputs = {
  email: string,
  password: string,
};

interface ActionData {
  errors: {
    email?: string;
    password?: string;
  };
}

export const loader: LoaderFunction = async ({ request }) => {
  const user = await getUserWithSession(request);

  if (user) return redirect("/");

  return json({});
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = safeRedirect(formData.get("redirectTo"), "/main");

  if (!validateEmail(email)) {
    return json<ActionData>(
      { errors: { email: "Email is invalid" } },
      { status: 400 }
    );
  }

  if (typeof password !== "string") {
    return json<ActionData>(
      { errors: { password: "Password is required" } },
      { status: 400 }
    );
  }

  if (password.length < 8) {
    return json<ActionData>(
      { errors: { password: "Password is too short" } },
      { status: 400 }
    );
  }

  return redirect(redirectTo);
}

export const meta: MetaFunction = () => {
  return {
    title: "Sign Up",
  };
};

export default function Index() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<Inputs>();
  const onSubmit: SubmitHandler<Inputs> = data => console.log(data);
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? undefined;
  const actionData = useActionData() as ActionData;
  console.log(actionData);

  return (
    <div className="flex justify-center flex-col py-10">
      <div className="flex justify-center">
        <h1 className="text-4xl font-bold">Sample Task</h1>
      </div>
      <div className="flex justify-center mt-10">
      <div className="flex justify-center border border-green-500 w-[500px]">
        <Form method="post" className="flex-col flex py-10">
          <input defaultValue="" {...register("email", { required: true })} type="text" name="email" placeholder="Email" className="p-2 border"/>
          {errors.email && <span>This field is required</span>}
          {actionData?.errors?.email && <span>{actionData.errors.email}</span>}

          <input {...register("password", { required: true })} type="text" name="password" placeholder="Password" className="p-2 mt-5 border"/>
          {errors.password && <span>This field is required</span>}
          {actionData?.errors?.password && <span>{actionData.errors.password}</span>}
          
          <button type="submit" className="p-2 mt-5 bg-green-500 text-white hover:bg-green-600">Login</button>
        </Form>
      </div>
      </div>
    </div>
  );
}
