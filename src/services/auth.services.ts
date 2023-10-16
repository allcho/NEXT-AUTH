import { notFound } from "next/navigation";

class AuthService {
    static async login(
      email: string,
      password: string
    ) {
        const res = await fetch(`${process.env.BASE_URL}/auth/login`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
            // credentials: 'include'
          });

          if (res.status === 404) {
            notFound();
          } else if (!res.ok) {
            throw new Error("Failed to fetch data");
          }
      
          return res.json();
    }

    static async refresh(
      refreshToken: string
    ) {
        const res = await fetch(`${process.env.BASE_URL}/auth/refresh`, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refreshToken}),
            // credentials: 'include'
          });
          if (res.status === 404) {
            notFound();
          } else if (!res.ok) {
            throw new Error("Failed to fetch data");
          }
      
          return res.json();
    }

}  

export default AuthService;
