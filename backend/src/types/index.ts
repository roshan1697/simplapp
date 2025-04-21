import z from 'zod'

export const SigninSchema = z.object(
    {
        username:z.string().email(),
        password:z.string()
    }
)

export const SignupSchema = z.object(
    {
        username:z.string().email(),
        password:z.string(),
        firstname:z.string(),
        lastname:z.string()
    }
)

