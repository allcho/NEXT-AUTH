"use client";

import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { FormEventHandler } from "react";
import classes from './loginForm.module.scss';
import { SubmitHandler, useForm } from "react-hook-form";

type Inputs = {
    email: string
    password: string
  }

export const LoginForm = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
      } = useForm<Inputs>()
    const router = useRouter();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        const res = await signIn("login", {
            email: data.email,
            password: data.password,
            callbackUrl: '/dashboard'
        });

        // if (res && !res.error) {
        // router.push("/dashboard");
        // } else {
        // // console.log(res);
        // }
    };

    return (
        <div className={classes.wrapper}>
            <div>
                <div>
                    <span>Авторизация</span>
                    <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                        <span>Email</span>
                        <div>
                            <input {...register('email', { 
                                required: {
                                    value: true,
                                    message: "Заполните поле email"
                                    },
                                    pattern: {
                                    value:  /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
                                    message: "Введите email адресс"
                                    }
                            })} />
                            {errors.email && <p role="alert">{errors.email.message}</p>}
                        </div>
                        <span>Пароль</span>
                        <div>
                            <input 
                                type="password" 
                                {...register('password', { 
                                required: {
                                    value: true,
                                    message: "Заполните поле Пароль"
                                    }
                            })} />
                            {errors.password && <p role="alert">{errors.password.message}</p>}
                        </div>
                        <div>
                            <button type="submit">Войти</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};